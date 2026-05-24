/**
 * WhatsApp URL builder with pre-filled message templates.
 *
 * Centralises the wa.me URL so every CTA on the site opens chat with a
 * scaffold the customer can fill in — Vessel / IMO / Port / System /
 * Urgency. Empty chat → 20–40% conversion drop versus pre-filled
 * (industry benchmark).
 */

const PHONE = '16193840403';
const BASE = `https://wa.me/${PHONE}`;

export type WhatsAppCtx = {
  /** UI language for the template. Defaults to English. */
  locale?: 'en' | 'tr';
  /** What the customer is asking for. */
  intent?: 'service' | 'supply' | 'emergency' | 'general' | 'product';
  /** Pre-fill for known context. */
  vessel?: string;
  imo?: string;
  port?: string;
  system?: string;
  brand?: string;
  partNumber?: string;
  qty?: number;
  description?: string;
};

function intro(locale: 'en' | 'tr', intent: WhatsAppCtx['intent']) {
  const tr = {
    service:   'Merhaba Levent Marine,\n\nGemide servis ihtiyacımız var:',
    supply:    'Merhaba Levent Marine,\n\nAşağıdaki parça için teklif rica ediyorum:',
    emergency: 'Merhaba Levent Marine,\n\nACIL — gemide hemen yardım gerek:',
    product:   'Merhaba Levent Marine,\n\nBu parça için teklif alabilir miyim?',
    general:   'Merhaba Levent Marine,\n\nBir konuda bilgi rica ediyorum:'
  } as const;
  const en = {
    service:   'Hi Levent Marine,\n\nWe need an engineer on board:',
    supply:    'Hi Levent Marine,\n\nPlease quote the following part:',
    emergency: 'Hi Levent Marine,\n\nEMERGENCY — immediate help needed on board:',
    product:   'Hi Levent Marine,\n\nCould you quote this part?',
    general:   'Hi Levent Marine,\n\nA quick question:'
  } as const;
  const key = intent ?? 'general';
  return locale === 'tr' ? tr[key] : en[key];
}

function fields(locale: 'en' | 'tr', ctx: WhatsAppCtx): string[] {
  const labelOf = (en: string, tr: string) => (locale === 'tr' ? tr : en);
  const out: string[] = [];

  if (ctx.vessel || ctx.intent === 'service' || ctx.intent === 'emergency') {
    out.push(`${labelOf('Vessel', 'Gemi')}: ${ctx.vessel ?? '____'}`);
  }
  if (ctx.imo || ctx.intent === 'service' || ctx.intent === 'emergency') {
    out.push(`${labelOf('IMO', 'IMO')}: ${ctx.imo ?? '____'}`);
  }
  if (ctx.port || ctx.intent === 'service' || ctx.intent === 'emergency' || ctx.intent === 'supply') {
    out.push(`${labelOf('Port', 'Liman')}: ${ctx.port ?? '____'}`);
  }
  if (ctx.system) {
    out.push(`${labelOf('System', 'Sistem')}: ${ctx.system}`);
  }
  if (ctx.brand || ctx.partNumber) {
    if (ctx.brand) out.push(`${labelOf('Brand', 'Marka')}: ${ctx.brand}`);
    if (ctx.partNumber) out.push(`${labelOf('Part / Model', 'Parça / Model')}: ${ctx.partNumber}`);
  } else if (ctx.intent === 'supply' || ctx.intent === 'product') {
    out.push(`${labelOf('Brand', 'Marka')}: ____`);
    out.push(`${labelOf('Part / Model', 'Parça / Model')}: ____`);
  }
  if (ctx.qty && ctx.qty > 0) {
    out.push(`${labelOf('Qty', 'Adet')}: ${ctx.qty}`);
  }
  if (ctx.description) {
    out.push('');
    out.push(ctx.description);
  } else if (ctx.intent === 'service' || ctx.intent === 'emergency') {
    out.push(`${labelOf('Symptom / urgency', 'Belirti / aciliyet')}: ____`);
  }

  return out;
}

export function whatsappUrl(ctx: WhatsAppCtx = {}): string {
  const locale = ctx.locale ?? 'en';
  const lines = [intro(locale, ctx.intent), '', ...fields(locale, ctx)];
  const text = encodeURIComponent(lines.join('\n'));
  return `${BASE}?text=${text}`;
}

/** Bare wa.me URL with no template — kept for compatibility where the
 *  context is too thin to be helpful (e.g. global drawer footer). */
export function whatsappBare(): string {
  return BASE;
}
