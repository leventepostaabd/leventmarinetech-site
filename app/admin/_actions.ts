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
