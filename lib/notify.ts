/**
 * Send admin notifications via Resend.
 * Silently no-ops when RESEND_API_KEY is unset (dev / preview).
 */
type Mail = {
  subject: string;
  text: string;
  html?: string;
  to?: string;
};

export async function notifyAdmin({ subject, text, html, to }: Mail) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log('[notify] RESEND_API_KEY unset — skipping email\n', subject, '\n', text);
    return { ok: false, skipped: true as const };
  }
  const recipient = to ?? process.env.NOTIFY_TO_EMAIL;
  const from      = process.env.NOTIFY_FROM_EMAIL ?? 'Levent Marine <noreply@leventmarinetech.com>';
  if (!recipient) return { ok: false, error: 'NOTIFY_TO_EMAIL unset' as const };

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [recipient],
      subject,
      text,
      html: html ?? text.replace(/\n/g, '<br>')
    })
  });
  if (!res.ok) {
    const err = await res.text().catch(() => 'unknown');
    return { ok: false, error: err };
  }
  return { ok: true };
}
