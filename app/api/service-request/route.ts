import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceSupabase } from '@/lib/supabase/server';
import { notifyAdminService, ackCustomerService, notifyByWhatsApp } from '@/lib/notify';
import { getService } from '@/lib/content';
import { ingestInboundForm } from '@/lib/crm';

/**
 * POST /api/service-request
 *
 * Wave 1 / Agent B payload (DECISIONS.md S4):
 *
 *   {
 *     system_slug: string,      // one of 19 systems or "other"
 *     system_name?: string,     // localised display name
 *     port:        string,
 *     when:        'now' | '24h' | 'week' | 'planned',
 *     planned_date?: string,    // ISO date if when === 'planned'
 *     contact: {
 *       name: string,
 *       email: string,
 *       phone?: string,
 *       vessel_name?: string,
 *       imo?: string
 *     },
 *     notes?:  string,
 *     locale?: Locale
 *   }
 *
 * Legacy v1 fields (vesselType, problemCategory, …) are still accepted
 * via the V1Body schema for backward compatibility with the old wizard
 * client / external callers.
 *
 * On success: insert into `service_requests`, fan out Email + WhatsApp
 * notifications, and respond with `{ ok: true, id: <reference> }`.
 */

const WhenWindow = z.enum(['now', '24h', 'week', 'planned']);

const V2Body = z.object({
  system_slug:  z.string().min(1),
  system_name:  z.string().optional(),
  port:         z.string().min(1),
  when:         WhenWindow,
  planned_date: z.string().optional(),
  contact: z.object({
    name:        z.string().min(1),
    email:       z.string().email(),
    phone:       z.string().optional(),
    vessel_name: z.string().optional(),
    imo:         z.string().optional()
  }),
  notes:  z.string().optional(),
  locale: z.enum(['en', 'tr']).optional()
});

const V1Body = z.object({
  vesselType:      z.string().optional(),
  port:            z.string().min(1),
  nextPort:        z.string().optional(),
  eta:             z.string().optional(),
  problemCategory: z.string().optional(),
  symptoms:        z.array(z.string()).optional(),
  notes:           z.string().optional(),
  urgency:         z.enum(['aog', 'urgent', 'planned']).optional(),
  contactName:     z.string().min(1),
  contactEmail:    z.string().email(),
  contactPhone:    z.string().optional(),
  contactWhatsapp: z.string().optional(),
  company:         z.string().optional(),
  vesselName:      z.string().optional(),
  imo:             z.string().optional(),
  classSociety:    z.string().optional(),
  service:         z.string().optional(),
  region:          z.string().optional(),
  attachments:     z.array(z.object({
    path:        z.string(),
    name:        z.string(),
    size:        z.number().optional(),
    contentType: z.string().optional()
  })).optional()
});

/** Map the 3-step "when" window → existing service_requests.urgency enum. */
function whenToUrgency(when: z.infer<typeof WhenWindow>): 'aog' | 'urgent' | 'planned' {
  switch (when) {
    case 'now':     return 'aog';
    case '24h':     return 'urgent';
    case 'week':    return 'urgent';
    case 'planned': return 'planned';
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  // Try V2 (new wizard) first, fall back to V1 (legacy) for back-compat.
  const v2 = V2Body.safeParse(body);
  const v1 = v2.success ? null : V1Body.safeParse(body);

  if (!v2.success && !(v1 && v1.success)) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: v2.error.flatten()
      },
      { status: 422 }
    );
  }

  const supabase = createServiceSupabase();

  // ============ V2 PATH — new 3-step flow ============
  if (v2.success) {
    const d = v2.data;
    const service = getService(d.system_slug);
    const urgency = whenToUrgency(d.when);

    // Derive the legacy `problem_category` from the system, so the existing
    // admin table + portal listing keep displaying something useful without
    // any schema/UI changes from other agents.
    const problemCategory = d.system_name
      ?? (d.locale === 'tr' ? service?.name_tr : service?.name_en)
      ?? d.system_slug;

    const { data: row, error } = await supabase
      .from('service_requests')
      .insert({
        problem_category: problemCategory,
        symptoms:         [],
        notes:            d.notes,
        vessel_name:      d.contact.vessel_name,
        imo_number:       d.contact.imo,
        vessel_type:      null,
        class_society:    null,
        port:             d.port,
        eta:              d.planned_date ? new Date(d.planned_date).toISOString() : null,
        urgency,
        contact_name:     d.contact.name,
        contact_email:    d.contact.email,
        contact_phone:    d.contact.phone,
        contact_whatsapp: d.contact.phone, // we collect a single phone, treat as WhatsApp too
        company:          null,
        attachments:      [],
        source:           'service-wizard-v2',
        meta: {
          system_slug:  d.system_slug,
          when_window:  d.when,
          planned_date: d.planned_date ?? null,
          locale:       d.locale ?? 'en'
        }
      })
      .select('id')
      .single();

    if (error) {
      console.error('[service-request v2] insert error', error);
      return NextResponse.json(
        { error: 'Database error', details: error.message },
        { status: 500 }
      );
    }

    const refId = String(row?.id ?? '').slice(0, 8).toUpperCase();

    // CRM (Wave 6 Phase 1) — also create/attach a lead. Non-blocking;
    // the canonical record is still service_requests above.
    ingestInboundForm({
      source: 'service_wizard',
      track: 'service',
      contact_name: d.contact.name,
      contact_email: d.contact.email,
      contact_phone: d.contact.phone,
      vessel_name: d.contact.vessel_name,
      imo: d.contact.imo,
      port: d.port,
      urgency,
      system: problemCategory,
      description: d.notes,
      raw_payload: { service_request_id: row?.id, ref: refId, when: d.when, when_window: d.when }
    }).catch((e) => console.error('[crm] service-wizard ingest failed', e));

    // Fan out: Email (Resend) + WhatsApp (admin link / Business API stub).
    Promise.all([
      notifyAdminService({
        id: String(row?.id ?? ''),
        urgency,
        problemCategory,
        symptoms: [],
        notes: d.notes,
        vesselName: d.contact.vessel_name,
        imo: d.contact.imo,
        port: d.port,
        eta: d.planned_date,
        contactName: d.contact.name,
        contactEmail: d.contact.email,
        contactPhone: d.contact.phone,
        contactWhatsapp: d.contact.phone,
        attachmentsCount: 0
      }),
      ackCustomerService({
        to: d.contact.email,
        refId,
        urgency,
        vesselName: d.contact.vessel_name,
        port: d.port,
        problemCategory
      }),
      notifyByWhatsApp({
        kind: 'service',
        refId,
        urgency,
        when: d.when,
        port: d.port,
        systemName: problemCategory,
        contactName: d.contact.name,
        contactPhone: d.contact.phone,
        vesselName: d.contact.vessel_name,
        imo: d.contact.imo,
        notes: d.notes
      })
    ]).catch((e) => console.error('[notify] v2 fanout error', e));

    return NextResponse.json({ ok: true, id: refId });
  }

  // ============ V1 PATH — legacy 7-step flow (back-compat) ============
  const d = v1!.data!;
  const { data: row, error } = await supabase
    .from('service_requests')
    .insert({
      problem_category: d.problemCategory,
      symptoms:         d.symptoms ?? [],
      notes:            d.notes,
      vessel_name:      d.vesselName,
      imo_number:       d.imo,
      vessel_type:      d.vesselType,
      class_society:    d.classSociety,
      port:             d.port,
      eta:              d.eta ? new Date(d.eta).toISOString() : null,
      urgency:          d.urgency ?? 'planned',
      contact_name:     d.contactName,
      contact_email:    d.contactEmail,
      contact_phone:    d.contactPhone,
      contact_whatsapp: d.contactWhatsapp,
      company:          d.company,
      attachments:      d.attachments ?? [],
      source:           'service-wizard-v1',
      meta: { service: d.service, region: d.region, nextPort: d.nextPort }
    })
    .select('id')
    .single();

  if (error) {
    console.error('[service-request v1] insert error', error);
    return NextResponse.json(
      { error: 'Database error', details: error.message },
      { status: 500 }
    );
  }

  const refId = String(row?.id ?? '').slice(0, 8).toUpperCase();
  Promise.all([
    notifyAdminService({
      id: String(row?.id ?? ''),
      urgency: d.urgency ?? 'planned',
      problemCategory: d.problemCategory,
      symptoms: d.symptoms,
      notes: d.notes,
      vesselName: d.vesselName,
      imo: d.imo,
      vesselType: d.vesselType,
      classSociety: d.classSociety,
      port: d.port,
      nextPort: d.nextPort,
      eta: d.eta,
      contactName: d.contactName,
      contactEmail: d.contactEmail,
      contactPhone: d.contactPhone,
      contactWhatsapp: d.contactWhatsapp,
      company: d.company,
      attachmentsCount: d.attachments?.length ?? 0
    }),
    ackCustomerService({
      to: d.contactEmail,
      refId,
      urgency: d.urgency ?? 'planned',
      vesselName: d.vesselName,
      port: d.port,
      problemCategory: d.problemCategory
    }),
    notifyByWhatsApp({
      kind: 'service',
      refId,
      urgency: d.urgency ?? 'planned',
      when: 'planned',
      port: d.port,
      systemName: d.problemCategory ?? d.service ?? 'service',
      contactName: d.contactName,
      contactPhone: d.contactPhone ?? d.contactWhatsapp,
      vesselName: d.vesselName,
      imo: d.imo,
      notes: d.notes
    })
  ]).catch((e) => console.error('[notify] v1 fanout error', e));

  return NextResponse.json({ ok: true, id: refId });
}
