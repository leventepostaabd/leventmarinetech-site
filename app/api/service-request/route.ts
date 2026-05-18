import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceSupabase } from '@/lib/supabase/server';
import { notifyAdmin } from '@/lib/notify';

const Body = z.object({
  vesselType:       z.string().optional(),
  port:             z.string().min(1),
  nextPort:         z.string().optional(),
  eta:              z.string().optional(),
  problemCategory:  z.string().optional(),
  symptoms:         z.array(z.string()).optional(),
  notes:            z.string().optional(),
  urgency:          z.enum(['aog', 'urgent', 'planned']).optional(),
  contactName:      z.string().min(1),
  contactEmail:     z.string().email(),
  contactPhone:     z.string().optional(),
  contactWhatsapp:  z.string().optional(),
  company:          z.string().optional(),
  vesselName:       z.string().optional(),
  imo:              z.string().optional(),
  classSociety:     z.string().optional(),
  service:          z.string().optional(),
  region:           z.string().optional()
});

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 422 });
  }
  const data = parsed.data;

  const supabase = createServiceSupabase();
  const { data: row, error } = await supabase
    .from('service_requests')
    .insert({
      problem_category: data.problemCategory,
      symptoms:         data.symptoms ?? [],
      notes:            data.notes,
      vessel_name:      data.vesselName,
      imo_number:       data.imo,
      vessel_type:      data.vesselType,
      class_society:    data.classSociety,
      port:             data.port,
      eta:              data.eta ? new Date(data.eta).toISOString() : null,
      urgency:          data.urgency ?? 'planned',
      contact_name:     data.contactName,
      contact_email:    data.contactEmail,
      contact_phone:    data.contactPhone,
      contact_whatsapp: data.contactWhatsapp,
      company:          data.company,
      meta: { service: data.service, region: data.region, nextPort: data.nextPort }
    })
    .select('id')
    .single();

  if (error) {
    console.error('service_request insert', error);
    return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 });
  }

  await notifyAdmin({
    subject: `🔧 Service request · ${data.urgency?.toUpperCase() ?? 'PLANNED'} · ${data.port}`,
    text: [
      `New service request ${row?.id ?? ''}`,
      `Urgency: ${data.urgency ?? 'planned'}`,
      `Vessel: ${data.vesselName ?? '?'} ${data.imo ? `(IMO ${data.imo})` : ''}`,
      `Port: ${data.port}${data.nextPort ? ` → ${data.nextPort}` : ''}`,
      `Category: ${data.problemCategory ?? '?'}`,
      `Symptoms: ${(data.symptoms ?? []).join(', ')}`,
      `Notes: ${data.notes ?? '—'}`,
      ``,
      `Contact: ${data.contactName} <${data.contactEmail}> ${data.contactPhone ?? ''} ${data.contactWhatsapp ?? ''}`,
      `Company: ${data.company ?? '—'}`
    ].join('\n')
  });

  return NextResponse.json({ ok: true, id: row?.id });
}
