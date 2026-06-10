import { createServiceSupabase } from '@/lib/supabase/server';
import type { PriceBookItem } from '@/lib/billing';
import InvoiceBuilderClient from '../InvoiceBuilderClient';

export const dynamic = 'force-dynamic';

export default async function NewInvoicePage() {
  const s = createServiceSupabase();
  let companies: { id: string; name: string }[] = [];
  let vessels: { id: string; name: string; imo_no: string | null; company_id: string | null }[] = [];
  let priceBook: PriceBookItem[] = [];
  let reports: { id: string; number: string; company_id: string | null; signed: boolean }[] = [];
  try {
    const [c, v, p, r] = await Promise.all([
      s.from('companies').select('id, name').order('name'),
      s.from('vessels').select('id, name, imo_no, company_id').order('name'),
      s.from('price_book_items').select('*').eq('active', true).order('name_en'),
      s.from('service_reports').select('id, number, company_id, signed_pdf_path').order('created_at', { ascending: false }).limit(100)
    ]);
    companies = (c.data ?? []) as typeof companies;
    vessels = (v.data ?? []) as typeof vessels;
    priceBook = (p.data ?? []) as PriceBookItem[];
    reports = (r.data ?? []).map((x: any) => ({ id: x.id, number: x.number, company_id: x.company_id, signed: !!x.signed_pdf_path }));
  } catch {
    /* not migrated */
  }
  return <InvoiceBuilderClient companies={companies} vessels={vessels} priceBook={priceBook} reports={reports} />;
}
