'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabase, createServiceSupabase } from '@/lib/supabase/server';

const RFQ_STATUSES = [
  'new',
  'reviewing',
  'supplier_checking',
  'quoted',
  'waiting_approval',
  'ordered',
  'delivered',
  'closed',
  'cancelled'
] as const;
type RfqStatus = typeof RFQ_STATUSES[number];

const SERVICE_STATUSES = [
  'new',
  'reviewing',
  'scheduled',
  'on_attendance',
  'reporting',
  'closed',
  'cancelled'
] as const;
type ServiceStatus = typeof SERVICE_STATUSES[number];

/** Gate every action behind admin role (defence in depth — the layout
    already redirects non-admins, but server actions can be called
    directly via fetch, so re-check here). */
async function requireAdmin() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') throw new Error('Not admin');
  return user;
}

export async function updateRfqStatus(id: string, status: string) {
  await requireAdmin();
  if (!RFQ_STATUSES.includes(status as RfqStatus)) {
    throw new Error(`Invalid status: ${status}`);
  }
  const supabase = createServiceSupabase();
  if (!supabase) throw new Error('Supabase service role unavailable');
  const { error } = await supabase
    .from('rfq_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/rfqs/${id}`);
  revalidatePath('/admin/rfqs');
  revalidatePath('/admin');
}

export async function saveRfqAdminFields(
  id: string,
  fields: { internal_notes?: string; draft_quote?: string }
) {
  await requireAdmin();
  const supabase = createServiceSupabase();
  if (!supabase) throw new Error('Supabase service role unavailable');
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof fields.internal_notes === 'string') update.internal_notes = fields.internal_notes;
  if (typeof fields.draft_quote === 'string') update.draft_quote = fields.draft_quote;
  const { error } = await supabase
    .from('rfq_requests')
    .update(update)
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/rfqs/${id}`);
}

export async function updateServiceStatus(id: string, status: string) {
  await requireAdmin();
  if (!SERVICE_STATUSES.includes(status as ServiceStatus)) {
    throw new Error(`Invalid status: ${status}`);
  }
  const supabase = createServiceSupabase();
  if (!supabase) throw new Error('Supabase service role unavailable');
  const { error } = await supabase
    .from('service_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/service/${id}`);
  revalidatePath('/admin/service');
  revalidatePath('/admin');
}

export async function saveServiceAdminFields(
  id: string,
  fields: { internal_notes?: string }
) {
  await requireAdmin();
  const supabase = createServiceSupabase();
  if (!supabase) throw new Error('Supabase service role unavailable');
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof fields.internal_notes === 'string') update.internal_notes = fields.internal_notes;
  const { error } = await supabase
    .from('service_requests')
    .update(update)
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/service/${id}`);
}

/**
 * Mint a short-lived signed URL for a private attachment so the admin
 * can download files customers uploaded (list-rfq Excel/PDF, nameplate
 * photos, etc).
 */
export async function attachmentSignedUrl(path: string, expiresInSec = 3600): Promise<string | null> {
  await requireAdmin();
  const supabase = createServiceSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase.storage
    .from('attachments')
    .createSignedUrl(path, expiresInSec);
  if (error) return null;
  return data?.signedUrl ?? null;
}

// =====================================================================
// CRM — Wave 6 Phase 1 server actions
// =====================================================================

import {
  addLeadNote as crmAddNote,
  createLead as crmCreateLead,
  getLead as crmGetLead,
  recordEvent as crmRecordEvent,
  updateLeadDraft as crmUpdateDraft,
  updateLeadStage as crmUpdateStage,
  upsertCompany,
  upsertVessel,
  type LeadStage,
  type LeadSource,
  type LeadTrack
} from '@/lib/crm';
import { scoreLead, ScoringUnavailableError, type ScoringResult } from '@/lib/scoring';

export async function updateLeadStage(id: string, stage: string) {
  const user = await requireAdmin();
  const valid: LeadStage[] = ['new', 'contacted', 'replied', 'quoting', 'won', 'lost'];
  if (!valid.includes(stage as LeadStage)) {
    throw new Error(`Invalid lead stage: ${stage}`);
  }
  await crmUpdateStage(id, stage as LeadStage, user.email ?? user.id);
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath('/admin/leads');
  revalidatePath('/admin');
}

export async function saveLeadDraft(id: string, draft: string) {
  await requireAdmin();
  await crmUpdateDraft(id, draft);
  revalidatePath(`/admin/leads/${id}`);
}

export async function addLeadNote(leadId: string, body: string) {
  const user = await requireAdmin();
  if (!body.trim()) return;
  await crmAddNote({ lead_id: leadId, body: body.trim(), author: user.email ?? user.id });
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function createManualLead(input: {
  track: string;
  company_name: string;
  vessel_name?: string;
  imo?: string;
  contact_email?: string;
  contact_phone?: string;
  port?: string;
  system?: string;
  brand?: string;
  part_number?: string;
  priority_score?: number;
  draft_message?: string;
  note?: string;
}) {
  const user = await requireAdmin();
  const track = input.track as LeadTrack;
  if (track !== 'service' && track !== 'supply') {
    throw new Error(`Invalid track: ${input.track}`);
  }
  if (!input.company_name?.trim()) throw new Error('Company name required');

  const company = await upsertCompany({ name: input.company_name, contact_email: input.contact_email ?? null, contact_phone: input.contact_phone ?? null });
  const vessel = (input.vessel_name?.trim() || input.imo?.trim())
    ? await upsertVessel({ name: input.vessel_name?.trim() || 'Unknown vessel', imo_no: input.imo?.trim() || null, company_id: company.id })
    : null;

  const context: Record<string, unknown> = {};
  if (input.port) context.port = input.port;
  if (input.system) context.system = input.system;
  if (input.brand) context.brand = input.brand;
  if (input.part_number) context.part_number = input.part_number;
  if (input.contact_email) context.contact_email = input.contact_email;
  if (input.contact_phone) context.contact_phone = input.contact_phone;

  const lead = await crmCreateLead({
    source: 'manual' as LeadSource,
    track,
    company_id: company.id,
    vessel_id: vessel?.id ?? null,
    priority_score: input.priority_score ?? 50,
    priority_reason: { reason: 'manual', actor: user.email ?? user.id },
    draft_message: input.draft_message ?? null,
    context
  });

  if (input.note?.trim()) {
    await crmAddNote({ lead_id: lead.id, body: input.note.trim(), author: user.email ?? user.id });
  }

  revalidatePath('/admin/leads');
  revalidatePath('/admin');
  return { lead_id: lead.id };
}

/**
 * Score a lead with Claude and persist the score + reasoning. Returns the
 * full result (including bilingual drafts) so the client can let the operator
 * choose whether to apply a draft — we never clobber a hand-written draft (D3).
 */
export async function scoreLeadWithAI(
  id: string
): Promise<{ ok: true; result: ScoringResult } | { ok: false; error: string }> {
  const user = await requireAdmin();
  const lead = await crmGetLead(id);
  if (!lead) return { ok: false, error: 'Lead not found.' };

  let result: ScoringResult;
  try {
    result = await scoreLead(lead);
  } catch (e) {
    if (e instanceof ScoringUnavailableError) {
      return { ok: false, error: 'AI scoring is not configured (missing ANTHROPIC_API_KEY).' };
    }
    console.error('[scoring] scoreLeadWithAI failed', e);
    return { ok: false, error: 'Scoring failed — see server logs.' };
  }

  const supabase = createServiceSupabase();
  if (!supabase) return { ok: false, error: 'Supabase service role unavailable' };
  const { error } = await supabase
    .from('leads')
    .update({
      priority_score: result.priority_score,
      priority_reason: {
        reason: 'ai',
        scored_by: user.email ?? user.id,
        scored_at: new Date().toISOString(),
        rationale: result.rationale,
        recommended_action: result.recommended_action,
        factors: result.factors
      },
      updated_at: new Date().toISOString()
    })
    .eq('id', id);
  if (error) return { ok: false, error: error.message };

  await crmRecordEvent(id, 'ai_scored', {
    score: result.priority_score,
    actor: user.email ?? user.id
  });

  revalidatePath(`/admin/leads/${id}`);
  revalidatePath('/admin/leads');
  revalidatePath('/admin');
  return { ok: true, result };
}
