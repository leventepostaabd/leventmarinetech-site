import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceSupabase } from '@/lib/supabase/server';
import { notifyAdminRfq, ackCustomerRfq } from '@/lib/notify';
import { ingestInboundForm } from '@/lib/crm';

const Body = z.object({
  kind: z.enum(['supply', 'equivalent', 'unlisted']).optional(),  // defaults to supply
  // product context
  product:               z.string().optional(),
  brand:                 z.string().optional(),
  partNumber:            z.string().optional(),
  alternativePartNumber: z.string().optional(),
  quantity:              z.coerce.number().min(1).optional(),

  // equivalent finder
  originalBrand:         z.string().optional(),
  originalPartNumber:    z.string().optional(),
  equipmentType:         z.string().optional(),
  voltage:               z.string().optional(),
  current:               z.string().optional(),
  specs:                 z.string().optional(),
  application:           z.string().optional(),
  failureDescription:    z.string().optional(),

  // unlisted
  description:           z.string().optional(),
  model:                 z.string().optional(),
  notes:                 z.string().optional(),
  requiredBy:            z.string().optional(),

  // attachments (paths uploaded to Supabase Storage)
  attachments:           z.array(z.object({
    path:        z.string(),
    name:        z.string(),
    size:        z.number().optional(),
    contentType: z.string().optional()
  })).optional(),

  // vessel
  vesselName:            z.string().optional(),
  imo:                   z.string().optional(),
  vesselType:            z.string().optional(),
  currentPort:           z.string().optional(),
  nextPort:              z.string().optional(),
  port:                  z.string().optional(),
  eta:                   z.string().optional(),
  urgency:               z.enum(['aog', 'urgent', 'planned']).optional(),

  // contact
  contactName:           z.string().min(1),
  contactEmail:          z.string().email(),
  contactWhatsapp:       z.string().optional(),
  contactPhone:          z.string().optional(),
  company:               z.string().optional(),

  // context
  service:               z.string().optional(),
  region:                z.string().optional()
});

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 422 });
  }
  const d = parsed.data;
  const kind = d.kind ?? 'supply';

  const supabase = createServiceSupabase();
  const { data: row, error } = await supabase
    .from('rfq_requests')
    .insert({
      kind,
      brand:           d.brand ?? d.originalBrand,
      part_number:     d.partNumber ?? d.originalPartNumber ?? d.model,
      alternative_for: kind === 'equivalent' ? d.originalPartNumber : null,
      equipment_type:  d.equipmentType,
      description:     d.description ?? d.notes ?? d.failureDescription,
      quantity:        d.quantity ?? 1,
      specifications:  { voltage: d.voltage, current: d.current, specs: d.specs, application: d.application },
      vessel_name:     d.vesselName,
      imo_number:      d.imo,
      vessel_type:     d.vesselType,
      current_port:    d.currentPort ?? d.port,
      next_port:       d.nextPort,
      eta:             d.eta ? new Date(d.eta).toISOString() : null,
      required_by:     d.requiredBy ? new Date(d.requiredBy).toISOString().slice(0, 10) : null,
      urgency:         d.urgency ?? 'planned',
      contact_name:    d.contactName,
      contact_email:   d.contactEmail,
      contact_phone:   d.contactPhone,
      contact_whatsapp: d.contactWhatsapp,
      company:         d.company,
      product_id:      d.product || null,
      attachments:     d.attachments ?? [],
      meta:            { service: d.service, region: d.region }
    })
    .select('id')
    .single();

  if (error) {
    console.error('rfq_requests insert', error);
    return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 });
  }

  // Fire-and-forget notifications (don't block the API response)
  const refId = String(row?.id ?? '').slice(0, 8).toUpperCase();

  // CRM (Wave 6 Phase 1) — also create/attach a lead.
  ingestInboundForm({
    source: 'supply_rfq',
    track: 'supply',
    contact_name: d.contactName,
    contact_email: d.contactEmail,
    contact_phone: d.contactPhone,
    company_name: d.company,
    vessel_name: d.vesselName,
    imo: d.imo,
    port: d.currentPort ?? d.port,
    urgency: d.urgency,
    brand: d.brand ?? d.originalBrand,
    part_number: d.partNumber ?? d.originalPartNumber ?? d.model,
    description: d.description ?? d.notes ?? d.failureDescription,
    raw_payload: { rfq_request_id: row?.id, ref: refId, kind }
  }).catch((e) => console.error('[crm] supply-rfq ingest failed', e));

  Promise.all([
    notifyAdminRfq({
      id: String(row?.id ?? ''),
      kind,
      urgency: d.urgency ?? 'planned',
      brand: d.brand ?? d.originalBrand,
      partNumber: d.partNumber ?? d.originalPartNumber,
      quantity: d.quantity,
      description: d.description ?? d.failureDescription,
      vesselName: d.vesselName,
      imo: d.imo,
      currentPort: d.currentPort ?? d.port,
      nextPort: d.nextPort,
      eta: d.eta,
      contactName: d.contactName,
      contactEmail: d.contactEmail,
      contactPhone: d.contactPhone,
      contactWhatsapp: d.contactWhatsapp,
      company: d.company,
      attachmentsCount: d.attachments?.length ?? 0
    }),
    ackCustomerRfq({
      to: d.contactEmail,
      refId,
      urgency: d.urgency ?? 'planned',
      brand: d.brand ?? d.originalBrand,
      partNumber: d.partNumber ?? d.originalPartNumber,
      vesselName: d.vesselName
    })
  ]).catch((e) => console.error('[notify] fanout error', e));

  return NextResponse.json({ ok: true, id: refId });
}
