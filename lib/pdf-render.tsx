/**
 * Server-side PDF rendering for billing documents — shared by the PDF routes
 * and the invoice-email action so the render logic lives in one place.
 */
import { renderToBuffer } from '@react-pdf/renderer';
import { createServiceSupabase } from '@/lib/supabase/server';
import InvoiceDocument, { type InvoicePdfData } from '@/components/pdf/InvoiceDocument';
import QuoteDocument, { type QuotePdfData } from '@/components/pdf/QuoteDocument';
import ServiceReportDocument from '@/components/pdf/ServiceReportDocument';
import type { CompanySettings, LineKind, ServiceReportData, TestRow } from '@/lib/billing';

type Client = ReturnType<typeof createServiceSupabase>;

async function loadSettings(s: Client): Promise<CompanySettings | undefined> {
  const { data } = await s.from('company_settings').select('*').eq('id', 1).single();
  return (data as CompanySettings) ?? undefined;
}

export async function renderQuotePdf(id: string): Promise<{ buffer: Buffer; number: string } | null> {
  const s = createServiceSupabase();
  const { data: q } = await s
    .from('quotes')
    .select('*, companies(name, billing_address), vessels(name, imo_no)')
    .eq('id', id)
    .single();
  if (!q) return null;
  const { data: lines } = await s.from('quote_lines').select('kind, description, qty, unit_price_usd, line_total, is_optional').eq('quote_id', id).order('sort_order');
  const data: QuotePdfData = {
    number: q.number, revision: q.revision ?? 1, created_at: q.created_at, valid_until: q.valid_until,
    currency: q.currency ?? 'USD', incoterm: q.incoterm, po_reference: q.po_reference, notes: q.notes,
    subtotal: Number(q.subtotal ?? 0), tax: Number(q.tax ?? 0), total: Number(q.total ?? 0),
    company: q.companies ?? null, vessel: q.vessels ?? null,
    lines: (lines ?? []).map((l) => ({ kind: l.kind as LineKind, description: l.description, qty: Number(l.qty), unit_price_usd: Number(l.unit_price_usd), line_total: Number(l.line_total), is_optional: l.is_optional ?? false }))
  };
  const seller = await loadSettings(s);
  const buffer = (await renderToBuffer(<QuoteDocument data={data} seller={seller} />)) as Buffer;
  return { buffer, number: q.number };
}

export async function renderServiceReportPdf(id: string): Promise<{ buffer: Buffer; number: string } | null> {
  const s = createServiceSupabase();
  const { data: r } = await s
    .from('service_reports')
    .select('*, companies(name), vessels(name, imo_no, flag)')
    .eq('id', id)
    .single();
  if (!r) return null;
  const data: ServiceReportData = {
    number: r.number, attended_on: r.attended_on, created_at: r.created_at, port: r.port, po_reference: r.po_reference,
    class_format: r.class_format, findings: r.findings, work_performed: r.work_performed, parts_used: r.parts_used,
    outstanding: r.outstanding, engineer_name: r.engineer_name, ce_name: r.ce_name, ce_rank: r.ce_rank,
    test_results: Array.isArray(r.test_results) ? (r.test_results as TestRow[]) : [],
    company: r.companies ?? null, vessel: r.vessels ?? null
  };
  const seller = await loadSettings(s);
  const buffer = (await renderToBuffer(<ServiceReportDocument data={data} seller={seller} />)) as Buffer;
  return { buffer, number: r.number };
}

export async function renderInvoicePdf(id: string): Promise<{ buffer: Buffer; number: string; companyEmail: string | null; quoteId: string | null; serviceReportId: string | null } | null> {
  const s = createServiceSupabase();
  const { data: inv } = await s
    .from('invoices')
    .select('*, companies(name, billing_address, contact_email), vessels(name, imo_no)')
    .eq('id', id)
    .single();
  if (!inv) return null;
  const { data: lines } = await s.from('invoice_lines').select('kind, description, qty, unit_price_usd, line_total').eq('invoice_id', id).order('sort_order');

  // Reference numbers for the linked quote + service report.
  let refQuote: string | null = null;
  if (inv.quote_id) { const { data } = await s.from('quotes').select('number').eq('id', inv.quote_id).single(); refQuote = data?.number ?? null; }
  let refReport: string | null = null;
  if (inv.service_report_id) { const { data } = await s.from('service_reports').select('number').eq('id', inv.service_report_id).single(); refReport = data?.number ?? null; }

  const data: InvoicePdfData = {
    number: inv.number, type: inv.type, created_at: inv.created_at, issue_date: inv.issue_date, due_date: inv.due_date,
    currency: inv.currency ?? 'USD', incoterm: inv.incoterm, po_reference: inv.po_reference, payment_scope: inv.payment_scope,
    ref_quote_number: refQuote, ref_report_number: refReport, notes: inv.notes,
    subtotal: Number(inv.subtotal ?? 0), tax: Number(inv.tax ?? 0), total: Number(inv.total ?? 0), amount_paid: Number(inv.amount_paid ?? 0),
    company: inv.companies ?? null, vessel: inv.vessels ?? null,
    lines: (lines ?? []).map((l) => ({ kind: l.kind as LineKind, description: l.description, qty: Number(l.qty), unit_price_usd: Number(l.unit_price_usd), line_total: Number(l.line_total) }))
  };
  const seller = await loadSettings(s);
  const buffer = (await renderToBuffer(<InvoiceDocument data={data} seller={seller} />)) as Buffer;
  return { buffer, number: inv.number, companyEmail: (inv.companies as any)?.contact_email ?? null, quoteId: inv.quote_id ?? null, serviceReportId: inv.service_report_id ?? null };
}
