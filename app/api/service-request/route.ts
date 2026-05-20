import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceSupabase } from '@/lib/supabase/server';
import { notifyAdminService, ackCustomerService } from '@/lib/notify';

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
  region:           z.string().optional(),
  attachments:      z.array(z.object({
    path:        z.string(),
    name:        z.string(),
    size:        z.number().optional(),
    contentType: z.string().optional()
  })).optional()
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
      attachments:      data.attachments ?? [],
      meta: { service: data.service, region: data.region, nextPort: data.nextPort }
    })
    .select('id')
    .single();

  if (error) {
    console.error('service_request insert', error);
    return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 });
  }

  const refId = String(row?.id ?? '').slice(0, 8).toUpperCase();
  Promise.all([
    notifyAdminService({
      id: String(row?.id ?? ''),
      urgency: data.urgency ?? 'planned',
      problemCategory: data.problemCategory,
      symptoms: data.symptoms,
      notes: data.notes,
      vesselName: data.vesselName,
      imo: data.imo,
      vesselType: data.vesselType,
      classSociety: data.classSociety,
      port: data.port,
      nextPort: data.nextPort,
      eta: data.eta,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      contactWhatsapp: data.contactWhatsapp,
      company: data.company,
      attachmentsCount: data.attachments?.length ?? 0
    }),
    ackCustomerService({
      to: data.contactEmail,
      refId,
      urgency: data.urgency ?? 'planned',
      vesselName: data.vesselName,
      port: data.port,
      problemCategory: data.problemCategory
    })
  ]).catch((e) => console.error('[notify] fanout error', e));

  return NextResponse.json({ ok: true, id: refId });
}
