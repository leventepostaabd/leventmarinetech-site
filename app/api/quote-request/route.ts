import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceSupabase } from '@/lib/supabase/server';
import { notifyAdmin } from '@/lib/notify';

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
      meta:            { service: d.service, region: d.region }
    })
    .select('id')
    .single();

  if (error) {
    console.error('rfq_requests insert', error);
    return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 });
  }

  const urgency = (d.urgency ?? 'planned').toUpperCase();
  const portLine = [d.currentPort ?? d.port, d.nextPort ? `→ ${d.nextPort}` : ''].filter(Boolean).join(' ');
  await notifyAdmin({
    subject: `📦 ${kind.toUpperCase()} RFQ · ${urgency} · ${d.brand ?? d.originalBrand ?? '?'} ${d.partNumber ?? d.originalPartNumber ?? ''}`,
    text: [
      `New ${kind} RFQ ${row?.id ?? ''}`,
      `Brand: ${d.brand ?? d.originalBrand ?? '—'}`,
      `Part:  ${d.partNumber ?? d.originalPartNumber ?? '—'}${d.model ? ` (model ${d.model})` : ''}`,
      `Qty:   ${d.quantity ?? 1}`,
      kind === 'equivalent' ? `Equivalent for: ${d.originalPartNumber} · ${d.equipmentType ?? ''}` : '',
      kind === 'unlisted'   ? `Unlisted: ${d.description ?? ''}` : '',
      `Vessel: ${d.vesselName ?? '?'} ${d.imo ? `(IMO ${d.imo})` : ''}`,
      `Port: ${portLine || '—'} ${d.eta ? `ETA ${d.eta}` : ''}`,
      `Urgency: ${urgency}`,
      ``,
      `Contact: ${d.contactName} <${d.contactEmail}> ${d.contactPhone ?? ''} ${d.contactWhatsapp ?? ''}`,
      `Company: ${d.company ?? '—'}`
    ].filter(Boolean).join('\n')
  });

  return NextResponse.json({ ok: true, id: row?.id });
}
