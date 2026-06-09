/**
 * Billing module — shared types + pure helpers for the admin "Evrak & Finans"
 * section (quotes / invoices / service reports + price book). DB schema:
 * supabase/migrations/0004_billing.sql. Spec: ADMIN-BILLING-SPEC.md.
 */

export type LineKind = 'service' | 'labour' | 'part' | 'freight' | 'consumable';
export const LINE_KINDS: LineKind[] = ['service', 'labour', 'part', 'freight', 'consumable'];

export const LINE_KIND_LABEL: Record<LineKind, { en: string; tr: string }> = {
  service: { en: 'Service', tr: 'Hizmet' },
  labour: { en: 'Labour', tr: 'İşçilik' },
  part: { en: 'Part', tr: 'Parça' },
  freight: { en: 'Freight', tr: 'Navlun' },
  consumable: { en: 'Consumable', tr: 'Sarf' }
};

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';
export const QUOTE_STATUS_LABEL: Record<QuoteStatus, string> = {
  draft: 'Taslak',
  sent: 'Gönderildi',
  accepted: 'Kabul',
  declined: 'Reddedildi',
  expired: 'Süresi doldu'
};

export type PriceBookItem = {
  id: string;
  kind: LineKind;
  code: string | null;
  name_en: string;
  name_tr: string | null;
  default_price_usd: number | null;
  default_cost_usd: number | null;
  unit: string | null;
  taxable: boolean;
  active: boolean;
};

export type QuoteLine = {
  id?: string;
  item_id?: string | null;
  kind: LineKind;
  description: string;
  qty: number;
  unit_price_usd: number;
  cost_usd?: number | null;
  line_total: number;
  is_optional?: boolean;
  sort_order?: number;
};

export type QuoteRow = {
  id: string;
  number: string;
  revision: number;
  company_id: string | null;
  vessel_id: string | null;
  po_reference: string | null;
  status: QuoteStatus;
  currency: string;
  incoterm: string | null;
  valid_until: string | null;
  subtotal: number;
  tax: number;
  total: number;
  notes: string | null;
  created_at: string;
  companies?: { name: string } | null;
  vessels?: { name: string; imo_no: string | null } | null;
};

export type CompanySettings = {
  legal_name: string | null;
  address: string | null;
  ein: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  bank_beneficiary: string | null;
  bank_name: string | null;
  bank_account: string | null;
  bank_routing: string | null;
  bank_swift: string | null;
  bank_address: string | null;
  default_payment_terms: string | null;
  default_incoterm: string | null;
  quote_terms: string | null;
  invoice_terms: string | null;
};

export const DEFAULT_SETTINGS: CompanySettings = {
  legal_name: 'Levent Marine Electro Technical Services LLC',
  address: '32 N Gould St, Sheridan, WY 82801, USA',
  ein: null,
  email: 'info@leventmarinetech.com',
  phone: '+1 619 384 04 03',
  website: 'www.leventmarinetech.com',
  bank_beneficiary: null, bank_name: null, bank_account: null, bank_routing: null, bank_swift: null, bank_address: null,
  default_payment_terms: 'Net 30', default_incoterm: null,
  quote_terms: null, invoice_terms: null
};

/** USD-primary money formatter (shows the currency code explicitly — '$' is
    ambiguous internationally). */
export function money(n: number | null | undefined, currency = 'USD'): string {
  const v = typeof n === 'number' && !Number.isNaN(n) ? n : 0;
  return `${currency} ${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Recompute a line's total + the document subtotal/tax/total. taxRatePct is a
    whole-percentage (e.g. 0 = exempt, 7 = 7%). Optional lines are excluded. */
export function computeTotals(
  lines: QuoteLine[],
  taxRatePct = 0
): { lines: QuoteLine[]; subtotal: number; tax: number; total: number } {
  const out = lines.map((l) => ({ ...l, line_total: round2(l.qty * l.unit_price_usd) }));
  const subtotal = round2(
    out.filter((l) => !l.is_optional).reduce((s, l) => s + l.line_total, 0)
  );
  const taxable = round2(
    out
      .filter((l) => !l.is_optional)
      .reduce((s, l) => s + l.line_total, 0)
  );
  const tax = round2((taxable * taxRatePct) / 100);
  return { lines: out, subtotal, tax, total: round2(subtotal + tax) };
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** Format a document number from its parts, e.g. ('QT', 2026, 1001) → 'QT-2026-1001'. */
export function docNumber(type: string, year: number, value: number): string {
  return `${type}-${year}-${value}`;
}
