'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabase, createServiceSupabase } from '@/lib/supabase/server';
import { computeTotals, docNumber, type LineKind, type QuoteLine, type CompanySettings } from '@/lib/billing';

async function requireAdmin() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const service = createServiceSupabase();
  const { data: profile } = await service.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') throw new Error('Not admin');
  return user;
}

/** Gapless, concurrency-safe document number via the Postgres function. */
async function nextNumber(type: string): Promise<string> {
  const service = createServiceSupabase();
  const year = new Date().getFullYear();
  const { data, error } = await service.rpc('next_doc_number', { p_type: type, p_year: year });
  if (error) throw new Error(error.message);
  return docNumber(type, year, data as number);
}

const num = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

// ── Company / billing settings ───────────────────────────────────────────────
export async function saveSettings(input: Partial<CompanySettings>) {
  await requireAdmin();
  const service = createServiceSupabase();
  const clean: Record<string, unknown> = { id: 1, updated_at: new Date().toISOString() };
  (Object.keys(input) as (keyof CompanySettings)[]).forEach((k) => {
    const v = input[k];
    clean[k] = typeof v === 'string' ? (v.trim() || null) : v ?? null;
  });
  const { error } = await service.from('company_settings').upsert(clean, { onConflict: 'id' });
  if (error) throw new Error(error.message);
  revalidatePath('/admin/billing/settings');
}

// ── New customer / vessel (manual entry from the builders) ────────────────────
export async function createCompany(input: { name: string; billing_address?: string; tax_id?: string }): Promise<{ id: string; name: string }> {
  await requireAdmin();
  if (!input.name?.trim()) throw new Error('Firma adı zorunlu');
  const service = createServiceSupabase();
  const { data, error } = await service
    .from('companies')
    .insert({ name: input.name.trim(), billing_address: input.billing_address?.trim() || null, tax_id: input.tax_id?.trim() || null })
    .select('id, name')
    .single();
  if (error) throw new Error(error.message);
  return { id: data.id as string, name: data.name as string };
}

export async function createVessel(input: { name: string; imo_no?: string; company_id?: string | null; flag?: string; class_society?: string }): Promise<{ id: string; name: string; imo_no: string | null; company_id: string | null }> {
  await requireAdmin();
  if (!input.name?.trim()) throw new Error('Gemi adı zorunlu');
  const service = createServiceSupabase();
  const { data, error } = await service
    .from('vessels')
    .insert({
      name: input.name.trim(),
      imo_no: input.imo_no?.trim() || null,
      company_id: input.company_id || null,
      flag: input.flag?.trim() || null,
      class_society: input.class_society?.trim() || null
    })
    .select('id, name, imo_no, company_id')
    .single();
  if (error) throw new Error(error.message);
  return { id: data.id as string, name: data.name as string, imo_no: data.imo_no as string | null, company_id: data.company_id as string | null };
}

// ── Price book ──────────────────────────────────────────────────────────────
export type PriceBookInput = {
  id?: string;
  kind: LineKind;
  code?: string;
  name_en: string;
  name_tr?: string;
  default_price_usd?: number | null;
  default_cost_usd?: number | null;
  unit?: string;
  taxable?: boolean;
  active?: boolean;
};

function pbRow(input: PriceBookInput) {
  return {
    kind: input.kind,
    code: input.code?.trim() || null,
    name_en: input.name_en.trim(),
    name_tr: input.name_tr?.trim() || null,
    default_price_usd: input.default_price_usd ?? null,
    default_cost_usd: input.default_cost_usd ?? null,
    unit: input.unit?.trim() || 'ea',
    taxable: input.taxable ?? true,
    active: input.active ?? true,
    updated_at: new Date().toISOString()
  };
}

export async function savePriceItem(input: PriceBookInput) {
  await requireAdmin();
  if (!input.name_en?.trim()) throw new Error('Ad (EN) zorunlu');
  const service = createServiceSupabase();
  if (input.id) {
    const { error } = await service.from('price_book_items').update(pbRow(input)).eq('id', input.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await service.from('price_book_items').insert(pbRow(input));
    if (error) throw new Error(error.message);
  }
  revalidatePath('/admin/billing/price-book');
}

export async function deletePriceItem(id: string) {
  await requireAdmin();
  const service = createServiceSupabase();
  const { error } = await service.from('price_book_items').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/billing/price-book');
}

// ── Quotes ──────────────────────────────────────────────────────────────────
export type QuoteInput = {
  id?: string;
  company_id?: string | null;
  vessel_id?: string | null;
  po_reference?: string;
  currency?: string;
  incoterm?: string;
  valid_until?: string | null;
  tax_rate_pct?: number;
  notes?: string;
  lines: {
    item_id?: string | null;
    kind: LineKind;
    description: string;
    qty: number;
    unit_price_usd: number;
    cost_usd?: number | null;
    is_optional?: boolean;
  }[];
};

export async function saveQuote(input: QuoteInput): Promise<{ id: string; number: string }> {
  await requireAdmin();
  const service = createServiceSupabase();

  const rawLines: QuoteLine[] = (input.lines ?? [])
    .filter((l) => l.description?.trim())
    .map((l, i) => ({
      item_id: l.item_id ?? null,
      kind: l.kind,
      description: l.description.trim(),
      qty: num(l.qty),
      unit_price_usd: num(l.unit_price_usd),
      cost_usd: l.cost_usd ?? null,
      is_optional: !!l.is_optional,
      line_total: 0,
      sort_order: i
    }));
  const { lines, subtotal, tax, total } = computeTotals(rawLines, num(input.tax_rate_pct));

  const head = {
    company_id: input.company_id || null,
    vessel_id: input.vessel_id || null,
    po_reference: input.po_reference?.trim() || null,
    currency: input.currency?.trim() || 'USD',
    incoterm: input.incoterm?.trim() || null,
    valid_until: input.valid_until || null,
    notes: input.notes?.trim() || null,
    subtotal,
    tax,
    total,
    updated_at: new Date().toISOString()
  };

  let quoteId = input.id;
  let number: string;

  if (quoteId) {
    const { data: existing } = await service.from('quotes').select('number').eq('id', quoteId).single();
    number = existing?.number ?? '';
    const { error } = await service.from('quotes').update(head).eq('id', quoteId);
    if (error) throw new Error(error.message);
    await service.from('quote_lines').delete().eq('quote_id', quoteId);
  } else {
    number = await nextNumber('QT');
    const { data, error } = await service
      .from('quotes')
      .insert({ ...head, number, status: 'draft' })
      .select('id')
      .single();
    if (error) throw new Error(error.message);
    quoteId = data.id as string;
  }

  if (lines.length) {
    const { error } = await service.from('quote_lines').insert(
      lines.map((l) => ({
        quote_id: quoteId,
        item_id: l.item_id ?? null,
        kind: l.kind,
        description: l.description,
        qty: l.qty,
        unit_price_usd: l.unit_price_usd,
        cost_usd: l.cost_usd ?? null,
        line_total: l.line_total,
        is_optional: l.is_optional ?? false,
        sort_order: l.sort_order ?? 0
      }))
    );
    if (error) throw new Error(error.message);
  }

  revalidatePath('/admin/billing/quotes');
  return { id: quoteId!, number };
}

export async function setQuoteStatus(id: string, status: string, lostReason?: string) {
  await requireAdmin();
  const service = createServiceSupabase();
  const patch: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
  if (status === 'accepted') patch.accepted_at = new Date().toISOString();
  if (status === 'declined') patch.lost_reason = lostReason?.trim() || null;
  const { error } = await service.from('quotes').update(patch).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/billing/quotes');
  revalidatePath(`/admin/billing/quotes/${id}`);
}

/** Convert an accepted quote into a draft invoice (linked, copies lines). */
export async function convertQuoteToInvoice(quoteId: string): Promise<{ id: string; number: string }> {
  await requireAdmin();
  const service = createServiceSupabase();
  const { data: q, error: qe } = await service.from('quotes').select('*').eq('id', quoteId).single();
  if (qe || !q) throw new Error(qe?.message || 'Teklif bulunamadı');
  const { data: qlines } = await service.from('quote_lines').select('*').eq('quote_id', quoteId).order('sort_order');

  const number = await nextNumber('INV');
  const due = new Date();
  due.setDate(due.getDate() + 30);
  const { data: inv, error } = await service
    .from('invoices')
    .insert({
      number,
      type: 'full',
      quote_id: quoteId,
      company_id: q.company_id,
      vessel_id: q.vessel_id,
      po_reference: q.po_reference,
      currency: q.currency,
      incoterm: q.incoterm,
      subtotal: q.subtotal,
      tax: q.tax,
      total: q.total,
      status: 'draft',
      due_date: due.toISOString().slice(0, 10)
    })
    .select('id')
    .single();
  if (error) throw new Error(error.message);

  const lines = (qlines ?? []).filter((l) => !l.is_optional);
  if (lines.length) {
    await service.from('invoice_lines').insert(
      lines.map((l, i) => ({
        invoice_id: inv.id,
        item_id: l.item_id,
        kind: l.kind,
        description: l.description,
        qty: l.qty,
        unit_price_usd: l.unit_price_usd,
        cost_usd: l.cost_usd,
        line_total: l.line_total,
        sort_order: i
      }))
    );
  }
  revalidatePath('/admin/billing/invoices');
  return { id: inv.id as string, number };
}
