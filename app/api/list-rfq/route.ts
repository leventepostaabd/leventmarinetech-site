import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceSupabase } from '@/lib/supabase/server';
import { notifyAdminRfq } from '@/lib/notify';

/**
 * POST /api/list-rfq — "Upload your list" channel.
 *
 * Stores the request in rfq_requests with kind='unlisted' (the
 * batch-list flavour) and fires an admin notification with the
 * uploaded files + pasted list + contact details inline.
 */
const Body = z.object({
  company: z.string().min(1),
  contactName: z.string().min(1),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  vessel: z.string().optional(),
  port: z.string().optional(),
  urgency: z.enum(['aog', 'urgent', 'planned']).optional(),
  notes: z.string().optional(),
  pastedList: z.string().optional(),
  attachments: z.array(z.object({
    path: z.string(),
    name: z.string(),
    size: z.number().optional()
  })).optional()
});

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 });
  }
  const d = parsed.data;
  const reference = 'LM-' + Math.random().toString(36).slice(2, 8).toUpperCase();

  // Persist (best-effort — admin notify fires even if DB is unreachable)
  try {
    const supabase = createServiceSupabase();
    if (supabase) {
      await supabase.from('rfq_requests').insert({
        kind: 'unlisted',
        status: 'new',
        company: d.company,
        contact_name: d.contactName,
        contact_email: d.contactEmail,
        contact_phone: d.contactPhone ?? null,
        vessel_name: d.vessel ?? null,
        current_port: d.port ?? null,
        urgency: d.urgency ?? 'planned',
        description: [
          d.pastedList ? `--- pasted list ---\n${d.pastedList}` : '',
          d.notes ? `--- notes ---\n${d.notes}` : '',
          d.attachments && d.attachments.length
            ? `--- files (${d.attachments.length}) ---\n` + d.attachments.map((a) => `${a.name} (${a.size ?? '?'} B) → ${a.path}`).join('\n')
            : ''
        ].filter(Boolean).join('\n\n'),
        attachments: d.attachments ?? [],
        meta: { reference, channel: 'list-upload' }
      });
    }
  } catch {
    /* swallow — we still notify below */
  }

  // Admin notify — same channel as RFQ (email + WhatsApp click-to-chat)
  try {
    await notifyAdminRfq({
      id: reference,
      kind: 'unlisted',
      urgency: d.urgency ?? 'planned',
      company: d.company,
      contactName: d.contactName,
      contactEmail: d.contactEmail,
      contactPhone: d.contactPhone,
      vesselName: d.vessel,
      currentPort: d.port,
      attachmentsCount: d.attachments?.length ?? 0,
      description: [
        `[Batch list RFQ · ${d.attachments?.length ?? 0} files]`,
        d.pastedList ? `\nPasted list:\n${d.pastedList}` : '',
        d.notes ? `\nNotes:\n${d.notes}` : '',
        d.attachments && d.attachments.length
          ? `\nFiles:\n` + d.attachments.map((a) => `  - ${a.name} → ${a.path}`).join('\n')
          : ''
      ].filter(Boolean).join('\n')
    });
  } catch {
    /* admin notify is best-effort here too */
  }

  return NextResponse.json({ ok: true, reference });
}
