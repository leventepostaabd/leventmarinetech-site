/**
 * Notification layer — Resend API.
 * - notifyAdmin: internal alert (high-context, urgency-coded)
 * - notifyCustomer: customer auto-ack (professional, reference-numbered)
 * Both no-op silently if RESEND_API_KEY is unset (dev / preview).
 */

const RESEND = 'https://api.resend.com/emails';

type SendOpts = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

async function send({ to, subject, text, html, replyTo }: SendOpts) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log('[notify] RESEND_API_KEY unset — skipping send.', '\nTO:', to, '\nSUBJ:', subject);
    return { ok: false, skipped: true as const };
  }
  const from = process.env.NOTIFY_FROM_EMAIL ?? 'Levent Marine <noreply@leventmarinetech.com>';
  const res = await fetch(RESEND, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
      html: html ?? text.replace(/\n/g, '<br>'),
      ...(replyTo && { reply_to: replyTo })
    })
  });
  if (!res.ok) {
    const err = await res.text().catch(() => 'unknown');
    console.error('[notify] resend error', res.status, err);
    return { ok: false, error: err };
  }
  return { ok: true };
}

// ============================================================================
//  ADMIN ALERTS — sent to NOTIFY_TO_EMAIL
// ============================================================================

const URGENCY_BADGE: Record<string, { emoji: string; label: string; color: string }> = {
  aog:     { emoji: '🔴', label: 'AOG · 24h',  color: '#DC2626' },
  urgent:  { emoji: '🟠', label: 'URGENT',     color: '#F5A524' },
  planned: { emoji: '🔵', label: 'PLANNED',    color: '#2A5A94' }
};

function adminFrame(title: string, urgency: string, body: string, ctaUrl?: string, ctaLabel?: string) {
  const u = URGENCY_BADGE[urgency] ?? URGENCY_BADGE.planned;
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#F6F8FB;font-family:Inter,system-ui,sans-serif;color:#0B1729">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F6F8FB;padding:24px 16px">
<tr><td align="center"><table width="100%" style="max-width:560px;background:#FFFFFF;border:1px solid #E6ECF3;border-radius:10px;overflow:hidden">
<tr><td style="background:#0B1F3A;padding:20px 24px;color:#FFFFFF">
<div style="font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.6);margin-bottom:6px">INCOMING · LEVENT MARINE</div>
<div style="font-size:18px;font-weight:700;letter-spacing:-0.01em">${title}</div>
<div style="margin-top:10px"><span style="display:inline-block;background:${u.color};color:#fff;padding:3px 10px;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.1em">${u.emoji} ${u.label}</span></div>
</td></tr>
<tr><td style="padding:20px 24px">${body}</td></tr>
${ctaUrl && ctaLabel ? `<tr><td style="padding:0 24px 24px"><a href="${ctaUrl}" style="display:inline-block;background:#F5A524;color:#0B1F3A;font-weight:700;text-decoration:none;padding:10px 18px;border-radius:6px;font-size:14px">${ctaLabel}</a></td></tr>` : ''}
<tr><td style="background:#F6F8FB;padding:14px 24px;border-top:1px solid #E6ECF3;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.08em;color:#7A8AA3">
LEVENT MARINE LLC · Wyoming + Tuzla · Internal alert
</td></tr></table></td></tr></table></body></html>`;
}

function row(label: string, value: string | undefined | null) {
  if (!value || value === '—' || value === '?') return '';
  return `<div style="display:flex;gap:12px;padding:6px 0;border-top:1px solid #E6ECF3">
<div style="flex:0 0 110px;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.08em;text-transform:uppercase;color:#7A8AA3;padding-top:1px">${label}</div>
<div style="font-size:13.5px;color:#0B1729">${value}</div></div>`;
}

export type AdminRfqAlert = {
  id: string;
  kind: 'supply' | 'equivalent' | 'unlisted';
  urgency: 'aog' | 'urgent' | 'planned';
  brand?: string;
  partNumber?: string;
  quantity?: number;
  description?: string;
  vesselName?: string;
  imo?: string;
  currentPort?: string;
  nextPort?: string;
  eta?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  company?: string;
  attachmentsCount?: number;
};

export async function notifyAdminRfq(a: AdminRfqAlert) {
  const to = process.env.NOTIFY_TO_EMAIL;
  if (!to) return { ok: false as const, error: 'NOTIFY_TO_EMAIL unset' as const };
  const u = URGENCY_BADGE[a.urgency] ?? URGENCY_BADGE.planned;
  const subj = `${u.emoji} ${a.kind.toUpperCase()} RFQ · ${u.label} · ${a.brand ?? '?'} ${a.partNumber ?? ''} · ${a.vesselName ?? '?'}`.trim();
  const body = `
${row('Reference', `<span style="font-family:'JetBrains Mono',monospace">${a.id}</span>`)}
${row('Kind', a.kind.toUpperCase())}
${row('Brand', a.brand)}
${row('Part No', `<span style="font-family:'JetBrains Mono',monospace">${a.partNumber ?? '—'}</span>`)}
${row('Qty', String(a.quantity ?? 1))}
${a.description ? row('Description', a.description) : ''}
${row('Vessel', a.vesselName ? `${a.vesselName} ${a.imo ? `(IMO ${a.imo})` : ''}` : null)}
${row('Port', a.currentPort)}
${row('Next port', a.nextPort)}
${row('ETA', a.eta)}
${row('Photos', a.attachmentsCount ? `${a.attachmentsCount} attached` : null)}
<div style="height:8px"></div>
${row('Contact', `${a.contactName} &lt;<a href="mailto:${a.contactEmail}" style="color:#F5A524">${a.contactEmail}</a>&gt;`)}
${row('Phone', a.contactPhone)}
${row('WhatsApp', a.contactWhatsapp ? `<a href="https://wa.me/${a.contactWhatsapp.replace(/\D/g, '')}" style="color:#F5A524">${a.contactWhatsapp}</a>` : null)}
${row('Company', a.company)}
`;
  const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://leventmarinetech.com'}/admin/rfqs?status=new`;
  const text = `${subj}\n\nRef: ${a.id}\nBrand: ${a.brand ?? '—'}\nPart: ${a.partNumber ?? '—'} (qty ${a.quantity ?? 1})\nVessel: ${a.vesselName ?? '—'} ${a.imo ? `(IMO ${a.imo})` : ''}\nPort: ${a.currentPort ?? '—'}${a.nextPort ? ` → ${a.nextPort}` : ''}\n\nContact: ${a.contactName} <${a.contactEmail}>\n${a.contactPhone ?? ''} ${a.contactWhatsapp ?? ''}\n\nOpen admin: ${adminUrl}`;
  return send({ to, subject: subj, text, html: adminFrame(`${a.kind.toUpperCase()} request`, a.urgency, body, adminUrl, 'Open in admin →'), replyTo: a.contactEmail });
}

export type AdminServiceAlert = {
  id: string;
  urgency: 'aog' | 'urgent' | 'planned';
  problemCategory?: string;
  symptoms?: string[];
  notes?: string;
  vesselName?: string;
  imo?: string;
  vesselType?: string;
  classSociety?: string;
  port?: string;
  nextPort?: string;
  eta?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  company?: string;
  attachmentsCount?: number;
};

export async function notifyAdminService(a: AdminServiceAlert) {
  const to = process.env.NOTIFY_TO_EMAIL;
  if (!to) return { ok: false as const, error: 'NOTIFY_TO_EMAIL unset' as const };
  const u = URGENCY_BADGE[a.urgency] ?? URGENCY_BADGE.planned;
  const subj = `${u.emoji} SERVICE · ${u.label} · ${a.port ?? '?'} · ${a.vesselName ?? '?'} · ${a.problemCategory ?? ''}`.trim();
  const body = `
${row('Reference', `<span style="font-family:'JetBrains Mono',monospace">${a.id}</span>`)}
${row('Category', a.problemCategory)}
${a.symptoms?.length ? row('Symptoms', a.symptoms.join(' · ')) : ''}
${a.notes ? row('Notes', a.notes.replace(/\n/g, '<br>')) : ''}
${row('Vessel', a.vesselName ? `${a.vesselName} ${a.imo ? `(IMO ${a.imo})` : ''}` : null)}
${row('Type', a.vesselType)}
${row('Class', a.classSociety)}
${row('Port', a.port)}
${row('Next port', a.nextPort)}
${row('ETA', a.eta)}
${row('Photos', a.attachmentsCount ? `${a.attachmentsCount} attached` : null)}
<div style="height:8px"></div>
${row('Contact', `${a.contactName} &lt;<a href="mailto:${a.contactEmail}" style="color:#F5A524">${a.contactEmail}</a>&gt;`)}
${row('Phone', a.contactPhone)}
${row('WhatsApp', a.contactWhatsapp ? `<a href="https://wa.me/${a.contactWhatsapp.replace(/\D/g, '')}" style="color:#F5A524">${a.contactWhatsapp}</a>` : null)}
${row('Company', a.company)}
`;
  const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://leventmarinetech.com'}/admin/service?status=new`;
  const text = `${subj}\n\nRef: ${a.id}\nCategory: ${a.problemCategory ?? '—'}\nSymptoms: ${(a.symptoms ?? []).join(', ')}\nVessel: ${a.vesselName ?? '—'} ${a.imo ? `(IMO ${a.imo})` : ''}\nPort: ${a.port ?? '—'}\n\nContact: ${a.contactName} <${a.contactEmail}>\n\nOpen admin: ${adminUrl}`;
  return send({ to, subject: subj, text, html: adminFrame('Service request', a.urgency, body, adminUrl, 'Open in admin →'), replyTo: a.contactEmail });
}

// ============================================================================
//  CUSTOMER AUTO-ACKNOWLEDGEMENT
// ============================================================================

function customerFrame(headline: string, refId: string, body: string) {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#F6F8FB;font-family:Inter,system-ui,sans-serif;color:#0B1729">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F6F8FB;padding:24px 16px">
<tr><td align="center"><table width="100%" style="max-width:560px;background:#FFFFFF;border:1px solid #E6ECF3;border-radius:10px;overflow:hidden">
<tr><td style="background:#0B1F3A;padding:24px;color:#FFFFFF">
<div style="display:inline-flex;align-items:center;gap:10px;margin-bottom:14px">
<span style="display:inline-block;width:28px;height:28px;border-radius:6px;background:#FFFFFF;text-align:center;line-height:28px;font-family:Manrope,sans-serif;font-weight:800;color:#0B1F3A">L</span>
<span style="font-family:Manrope,sans-serif;font-weight:700;font-size:13px;color:#FFFFFF">LEVENT MARINE</span>
</div>
<div style="font-family:Manrope,sans-serif;font-weight:700;font-size:22px;line-height:1.2;color:#FFFFFF">${headline}</div>
<div style="margin-top:14px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.1em;color:rgba(255,255,255,0.7)">REFERENCE</div>
<div style="font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:600;color:#F5A524">${refId}</div>
</td></tr>
<tr><td style="padding:24px;font-size:14.5px;line-height:1.6;color:#4A5A75">${body}</td></tr>
<tr><td style="padding:0 24px 24px">
<div style="display:flex;gap:8px;flex-wrap:wrap">
<a href="https://wa.me/16193840403" style="display:inline-block;background:#25D366;color:#FFFFFF;text-decoration:none;padding:8px 14px;border-radius:6px;font-size:13px;font-weight:600">WhatsApp US</a>
<a href="tel:+16193840403" style="display:inline-block;background:#F5A524;color:#0B1F3A;text-decoration:none;padding:8px 14px;border-radius:6px;font-size:13px;font-weight:600">Call +1 619 384 0403</a>
<a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://leventmarinetech.com'}/portal" style="display:inline-block;background:#FFFFFF;color:#0B1729;text-decoration:none;padding:8px 14px;border-radius:6px;font-size:13px;font-weight:600;border:1px solid #C5D0DD">Customer portal</a>
</div>
</td></tr>
<tr><td style="background:#F6F8FB;padding:16px 24px;border-top:1px solid #E6ECF3;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.08em;color:#7A8AA3;line-height:1.6">
LEVENT MARINE ELECTRO TECHNICAL SERVICES LLC<br>
32 N Gould St · Sheridan WY 82801 · USA<br>
Velibaba Mah. No:1 · Pendik / Istanbul · Türkiye<br>
<a href="mailto:info@leventmarinetech.com" style="color:#7A8AA3">info@leventmarinetech.com</a>
</td></tr></table></td></tr></table></body></html>`;
}

const URGENCY_PROMISE: Record<string, { headline: string; window: string }> = {
  aog: {
    headline: "AOG received — we're already on it.",
    window: 'A response within 2 hours, dispatch confirmed within 4 hours.'
  },
  urgent: {
    headline: 'Urgent request received.',
    window: 'A quote with availability and shipping timeline within the business day.'
  },
  planned: {
    headline: 'Request received.',
    window: 'A quote within 24 business hours.'
  }
};

export async function ackCustomerRfq(opts: {
  to: string;
  refId: string;
  urgency: 'aog' | 'urgent' | 'planned';
  brand?: string;
  partNumber?: string;
  vesselName?: string;
}) {
  if (!opts.to) return { ok: false, error: 'no recipient' };
  const u = URGENCY_PROMISE[opts.urgency] ?? URGENCY_PROMISE.planned;
  const desc = [opts.brand, opts.partNumber].filter(Boolean).join(' ') || 'your item';
  const vessel = opts.vesselName ? ` for <strong>${opts.vesselName}</strong>` : '';
  const body = `
<p>Thanks for the request${vessel}. We've logged it as <strong>${opts.refId}</strong> and our sourcing desk is checking supplier availability, equivalent options, and port delivery feasibility for <strong>${desc}</strong>.</p>
<p style="margin-top:12px"><strong>What happens next:</strong> ${u.window}</p>
<p style="margin-top:12px">If this is genuinely AOG or anything changes on your end (ETA shift, new specifics), reply directly to this email or WhatsApp <strong>+1 619 384 0403</strong> — we monitor both 24/7.</p>
<p style="margin-top:16px;font-size:12px;color:#7A8AA3">You can also see this request anytime by signing into your portal with the same email at <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://leventmarinetech.com'}/portal" style="color:#F5A524">leventmarinetech.com/portal</a>.</p>
`;
  return send({
    to: opts.to,
    subject: `Request received — ${opts.refId} · Levent Marine`,
    text: `Thanks for the RFQ. Reference: ${opts.refId}.\nUrgency: ${opts.urgency.toUpperCase()} — ${u.window}\n\nFor AOG, WhatsApp +1 619 384 0403.\n\nLevent Marine.`,
    html: customerFrame(u.headline, opts.refId, body)
  });
}

export async function ackCustomerService(opts: {
  to: string;
  refId: string;
  urgency: 'aog' | 'urgent' | 'planned';
  vesselName?: string;
  port?: string;
  problemCategory?: string;
}) {
  if (!opts.to) return { ok: false, error: 'no recipient' };
  const u = URGENCY_PROMISE[opts.urgency] ?? URGENCY_PROMISE.planned;
  const where = [opts.vesselName, opts.port].filter(Boolean).join(' · ');
  const body = `
<p>Thanks for the service request${where ? ` (<strong>${where}</strong>)` : ''}. Reference <strong>${opts.refId}</strong> is in our queue, ${opts.problemCategory ? `tagged <em>${opts.problemCategory}</em>, ` : ''}and we're matching it to the right engineer right now.</p>
<p style="margin-top:12px"><strong>What happens next:</strong> ${u.window}</p>
<p style="margin-top:12px">If something changes — vessel ETA shifts, symptoms get worse, you need a wider scope — reply directly here or WhatsApp <strong>+1 619 384 0403</strong>.</p>
<p style="margin-top:16px;font-size:12px;color:#7A8AA3">Track this job in the portal at <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://leventmarinetech.com'}/portal" style="color:#F5A524">leventmarinetech.com/portal</a>.</p>
`;
  return send({
    to: opts.to,
    subject: `Service request received — ${opts.refId} · Levent Marine`,
    text: `Thanks for the service request. Reference: ${opts.refId}.\nUrgency: ${opts.urgency.toUpperCase()} — ${u.window}\n\nFor AOG, WhatsApp +1 619 384 0403.\n\nLevent Marine.`,
    html: customerFrame(u.headline, opts.refId, body)
  });
}

// ============================================================================
//  WHATSAPP — Admin notification (N1 — Email + WhatsApp on every request)
// ============================================================================

/**
 * notifyByWhatsApp — Admin-facing WhatsApp notification.
 *
 * Two transport modes:
 *
 *  1. WhatsApp Business Cloud API — used when WHATSAPP_TOKEN,
 *     WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ADMIN_RECIPIENT are all set.
 *     Sends a plain text message to the admin number.
 *
 *  2. Click-to-chat fallback — when those env vars are missing (dev /
 *     pre-launch), we just log a `https://wa.me/<admin>?text=…` URL so
 *     the admin can paste the link or we can wire it into a webhook
 *     later. This keeps the API path non-blocking and side-effect-safe.
 *
 * Errors are swallowed and logged so the customer's submit response is
 * never blocked by a flaky third-party channel. The Resend email path
 * is the authoritative "we got your request" record.
 */
export type WhatsAppNotice =
  | {
      kind: 'service';
      refId: string;
      urgency: 'aog' | 'urgent' | 'planned';
      when: 'now' | '24h' | 'week' | 'planned';
      port?: string;
      systemName?: string;
      contactName?: string;
      contactPhone?: string;
      vesselName?: string;
      imo?: string;
      notes?: string;
    }
  | {
      kind: 'supply' | 'equivalent' | 'unlisted';
      refId: string;
      urgency: 'aog' | 'urgent' | 'planned';
      brand?: string;
      partNumber?: string;
      quantity?: number;
      contactName?: string;
      contactPhone?: string;
      vesselName?: string;
    };

const WHATSAPP_API = 'https://graph.facebook.com/v19.0';

function buildWhatsAppText(n: WhatsAppNotice): string {
  const u = URGENCY_BADGE[n.urgency] ?? URGENCY_BADGE.planned;
  if (n.kind === 'service') {
    const lines: (string | null)[] = [
      `${u.emoji} LEVENT MARINE — Service`,
      `Ref: ${n.refId}`,
      `Urgency: ${u.label}`,
      n.when ? `When: ${n.when}` : null,
      n.systemName ? `System: ${n.systemName}` : null,
      n.port ? `Port: ${n.port}` : null,
      n.vesselName ? `Vessel: ${n.vesselName}${n.imo ? ` (IMO ${n.imo})` : ''}` : null,
      n.contactName ? `Contact: ${n.contactName}${n.contactPhone ? ` · ${n.contactPhone}` : ''}` : null,
      n.notes ? `Notes: ${n.notes.slice(0, 200)}` : null
    ];
    return lines.filter(Boolean).join('\n');
  }
  const lines: (string | null)[] = [
    `${u.emoji} LEVENT MARINE — ${n.kind.toUpperCase()}`,
    `Ref: ${n.refId}`,
    `Urgency: ${u.label}`,
    n.brand ? `Brand: ${n.brand}` : null,
    n.partNumber ? `Part: ${n.partNumber}${n.quantity ? ` × ${n.quantity}` : ''}` : null,
    n.vesselName ? `Vessel: ${n.vesselName}` : null,
    n.contactName ? `Contact: ${n.contactName}${n.contactPhone ? ` · ${n.contactPhone}` : ''}` : null
  ];
  return lines.filter(Boolean).join('\n');
}

export async function notifyByWhatsApp(
  notice: WhatsAppNotice
): Promise<{ ok: boolean; via: 'api' | 'link' | 'skipped'; error?: string }> {
  const text = buildWhatsAppText(notice);
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const recipient = process.env.WHATSAPP_ADMIN_RECIPIENT || process.env.WHATSAPP_TO;

  // ---- Mode 1: WhatsApp Business Cloud API ----
  if (token && phoneNumberId && recipient) {
    try {
      const res = await fetch(`${WHATSAPP_API}/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: recipient,
          type: 'text',
          text: { preview_url: false, body: text }
        })
      });
      if (!res.ok) {
        const err = await res.text().catch(() => 'unknown');
        console.error('[notify] whatsapp business api error', res.status, err);
        return { ok: false, via: 'api', error: err };
      }
      return { ok: true, via: 'api' };
    } catch (e: any) {
      console.error('[notify] whatsapp business api throw', e?.message ?? e);
      // fall through to link mode so the admin still has a path
    }
  }

  // ---- Mode 2: click-to-chat fallback (dev / pre-launch) ----
  const adminFallback =
    process.env.WHATSAPP_ADMIN_RECIPIENT ?? process.env.WHATSAPP_TO ?? '16193840403';
  const url = `https://wa.me/${adminFallback.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
  console.log('[notify] whatsapp (no API creds) → admin click-to-chat:', url);
  return { ok: true, via: 'link' };
}

// ============================================================================
//  LEGACY (back-compat with existing route imports)
// ============================================================================

export async function notifyAdmin(opts: { subject: string; text: string; html?: string; to?: string }) {
  const to = opts.to ?? process.env.NOTIFY_TO_EMAIL;
  if (!to) return { ok: false as const, error: 'NOTIFY_TO_EMAIL unset' as const };
  return send({ to, subject: opts.subject, text: opts.text, html: opts.html });
}
