'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabase, createServiceSupabase } from '@/lib/supabase/server';
import { computeTotals, docNumber, type LineKind, type QuoteLine, type CompanySettings } from '@/lib/billing';
import { sendDocumentEmail } from '@/lib/notify';
import { renderInvoicePdf, renderQuotePdf, renderServiceReportPdf } from '@/lib/pdf-render';

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

// ── Deletes (with detailed confirmation on the client) ───────────────────────
export async function deleteQuote(id: string) {
  await requireAdmin();
  const service = createServiceSupabase();
  const { error } = await service.from('quotes').delete().eq('id', id); // quote_lines cascade
  if (error) throw new Error(error.message);
  revalidatePath('/admin/billing/quotes');
  revalidatePath('/admin/billing');
}

export async function deleteInvoice(id: string) {
  await requireAdmin();
  const service = createServiceSupabase();
  const { error } = await service.from('invoices').delete().eq('id', id); // invoice_lines + payments cascade
  if (error) throw new Error(error.message);
  revalidatePath('/admin/billing/invoices');
  revalidatePath('/admin/billing');
}

export async function deleteServiceReport(id: string) {
  await requireAdmin();
  const service = createServiceSupabase();
  const { data: rep } = await service.from('service_reports').select('signed_pdf_path').eq('id', id).single();
  if (rep?.signed_pdf_path) { await service.storage.from('billing-docs').remove([rep.signed_pdf_path]); }
  const { error } = await service.from('service_reports').delete().eq('id', id); // photos cascade; invoice ref set null
  if (error) throw new Error(error.message);
  revalidatePath('/admin/billing/service-reports');
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

// ── Direct invoice (without a quote) ─────────────────────────────────────────
export type InvoiceInput = {
  id?: string;
  company_id?: string | null;
  vessel_id?: string | null;
  service_report_id?: string | null;
  po_reference?: string;
  currency?: string;
  incoterm?: string;
  due_date?: string | null;
  tax_rate_pct?: number;
  payment_scope?: 'both' | 'domestic' | 'international';
  notes?: string;
  lines: {
    item_id?: string | null;
    kind: LineKind;
    description: string;
    qty: number;
    unit_price_usd: number;
    cost_usd?: number | null;
  }[];
};

export async function saveInvoice(input: InvoiceInput): Promise<{ id: string; number: string }> {
  await requireAdmin();
  const service = createServiceSupabase();

  const rawLines: QuoteLine[] = (input.lines ?? [])
    .filter((l) => l.description?.trim())
    .map((l, i) => ({
      item_id: l.item_id ?? null, kind: l.kind, description: l.description.trim(),
      qty: num(l.qty), unit_price_usd: num(l.unit_price_usd), cost_usd: l.cost_usd ?? null,
      line_total: 0, sort_order: i
    }));
  const { lines, subtotal, tax, total } = computeTotals(rawLines, num(input.tax_rate_pct));

  const head = {
    company_id: input.company_id || null,
    vessel_id: input.vessel_id || null,
    service_report_id: input.service_report_id || null,
    po_reference: input.po_reference?.trim() || null,
    currency: input.currency?.trim() || 'USD',
    incoterm: input.incoterm?.trim() || null,
    due_date: input.due_date || null,
    payment_scope: input.payment_scope || 'both',
    notes: input.notes?.trim() || null,
    subtotal, tax, total,
    updated_at: new Date().toISOString()
  };

  let invoiceId = input.id;
  let number: string;
  if (invoiceId) {
    const { data: ex } = await service.from('invoices').select('number').eq('id', invoiceId).single();
    number = ex?.number ?? '';
    const { error } = await service.from('invoices').update(head).eq('id', invoiceId);
    if (error) throw new Error(error.message);
    await service.from('invoice_lines').delete().eq('invoice_id', invoiceId);
  } else {
    number = await nextNumber('INV');
    const { data, error } = await service.from('invoices').insert({ ...head, number, type: 'full', status: 'draft' }).select('id').single();
    if (error) throw new Error(error.message);
    invoiceId = data.id as string;
  }

  if (lines.length) {
    const { error } = await service.from('invoice_lines').insert(
      lines.map((l) => ({
        invoice_id: invoiceId, item_id: l.item_id ?? null, kind: l.kind, description: l.description,
        qty: l.qty, unit_price_usd: l.unit_price_usd, cost_usd: l.cost_usd ?? null, line_total: l.line_total, sort_order: l.sort_order ?? 0
      }))
    );
    if (error) throw new Error(error.message);
  }

  revalidatePath('/admin/billing/invoices');
  return { id: invoiceId!, number };
}

// ── Email an invoice with its evidence attached ──────────────────────────────
export async function emailInvoice(invoiceId: string, overrideEmail?: string): Promise<{ ok: boolean; to: string; warning?: string }> {
  await requireAdmin();
  const service = createServiceSupabase();
  const inv = await renderInvoicePdf(invoiceId);
  if (!inv) throw new Error('Fatura bulunamadı');
  const to = overrideEmail?.trim() || inv.companyEmail || '';
  if (!to) throw new Error('Müşteri e-postası yok — müşteri kaydına e-posta ekleyin veya elle girin.');

  const attachments: { filename: string; content: string }[] = [
    { filename: `${inv.number}.pdf`, content: inv.buffer.toString('base64') }
  ];
  let warning: string | undefined;

  if (inv.quoteId) {
    const q = await renderQuotePdf(inv.quoteId);
    if (q) attachments.push({ filename: `${q.number}.pdf`, content: q.buffer.toString('base64') });
  }
  if (inv.serviceReportId) {
    const { data: rep } = await service.from('service_reports').select('number, signed_pdf_path').eq('id', inv.serviceReportId).single();
    if (rep?.signed_pdf_path) {
      const { data: file } = await service.storage.from('billing-docs').download(rep.signed_pdf_path);
      if (file) {
        const buf = Buffer.from(await file.arrayBuffer());
        const ext = rep.signed_pdf_path.split('.').pop() || 'pdf';
        attachments.push({ filename: `${rep.number}-signed.${ext}`, content: buf.toString('base64') });
      }
    } else {
      const r = await renderServiceReportPdf(inv.serviceReportId);
      if (r) attachments.push({ filename: `${r.number}-unsigned.pdf`, content: r.buffer.toString('base64') });
      warning = 'Servis raporunun imzalı kopyası henüz yüklenmemiş — imzasız şablon eklendi. Gemide imzalatıp yükledikten sonra tekrar gönderebilirsiniz.';
    }
  }

  const subject = `Invoice ${inv.number} · Levent Marine Tech`;
  const text = `Please find attached invoice ${inv.number}. Payment details and terms are on the invoice. Please quote the invoice number on your transfer.`;
  const html = `<p>Dear Sir/Madam,</p><p>Please find attached our invoice <strong>${inv.number}</strong>${inv.quoteId ? ', together with the referenced quotation' : ''}${inv.serviceReportId ? ' and the service report' : ''}.</p><p>Payment details (bank wire) and terms are stated on the invoice. Kindly quote the invoice number on your transfer.</p><p>Best regards,<br>Levent Marine Electro Technical Services LLC</p>`;
  const res = await sendDocumentEmail({ to, subject, html, text, replyTo: 'info@leventmarinetech.com', attachments });
  if (!res.ok && !res.skipped) throw new Error(res.error || 'E-posta gönderilemedi');

  await service.from('invoices').update({ emailed_at: new Date().toISOString(), emailed_to: to, status: 'sent', sent_at: new Date().toISOString() }).eq('id', invoiceId);
  revalidatePath('/admin/billing/invoices');
  return { ok: true, to, warning: res.skipped ? 'E-posta servisi henüz yapılandırılmamış (RESEND_API_KEY) — gönderim atlandı, fatura "gönderildi" işaretlenmedi.' : warning };
}

// ── Re-upload the wet-signed service report (scan/photo from onboard) ─────────
export async function uploadSignedReport(reportId: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) throw new Error('Dosya yok');
  if (file.size > 15 * 1024 * 1024) throw new Error('Dosya çok büyük (en fazla 15MB)');
  const ext = (file.name.split('.').pop() || 'pdf').toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `signed-reports/${reportId}.${ext}`;
  const service = createServiceSupabase();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await service.storage.from('billing-docs').upload(path, bytes, { contentType: file.type || 'application/pdf', upsert: true });
  if (error) throw new Error(error.message);
  const { error: e2 } = await service.from('service_reports').update({ signed_pdf_path: path, status: 'signed' }).eq('id', reportId);
  if (e2) throw new Error(e2.message);
  revalidatePath('/admin/billing/service-reports');
}

// ── Service / attendance reports ─────────────────────────────────────────────
import type { TestRow } from '@/lib/billing';

export type ServiceReportInput = {
  id?: string;
  company_id?: string | null;
  vessel_id?: string | null;
  job_id?: string | null;
  po_reference?: string;
  port?: string;
  attended_on?: string | null;
  class_format?: string;
  findings?: string;
  work_performed?: string;
  parts_used?: string;
  outstanding?: string;
  engineer_name?: string;
  ce_name?: string;
  ce_rank?: string;
  test_results?: TestRow[];
};

export async function saveServiceReport(input: ServiceReportInput): Promise<{ id: string; number: string }> {
  await requireAdmin();
  const service = createServiceSupabase();

  const tests = (input.test_results ?? []).filter((t) => t.point?.trim() || t.value?.trim());
  const row = {
    company_id: input.company_id || null,
    vessel_id: input.vessel_id || null,
    job_id: input.job_id || null,
    po_reference: input.po_reference?.trim() || null,
    port: input.port?.trim() || null,
    attended_on: input.attended_on || null,
    class_format: input.class_format?.trim() || null,
    findings: input.findings?.trim() || null,
    work_performed: input.work_performed?.trim() || null,
    parts_used: input.parts_used?.trim() || null,
    outstanding: input.outstanding?.trim() || 'NIL',
    engineer_name: input.engineer_name?.trim() || null,
    ce_name: input.ce_name?.trim() || null,
    ce_rank: input.ce_rank?.trim() || null,
    test_results: tests,
    updated_at: new Date().toISOString()
  };

  if (input.id) {
    const { data: ex } = await service.from('service_reports').select('number').eq('id', input.id).single();
    const { error } = await service.from('service_reports').update(row).eq('id', input.id);
    if (error) throw new Error(error.message);
    revalidatePath('/admin/billing/service-reports');
    return { id: input.id, number: ex?.number ?? '' };
  }
  const number = await nextNumber('SR');
  const { data, error } = await service.from('service_reports').insert({ ...row, number }).select('id').single();
  if (error) throw new Error(error.message);
  revalidatePath('/admin/billing/service-reports');
  return { id: data.id as string, number };
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
