import { createServiceSupabase } from '@/lib/supabase/server';
import type { PriceBookItem } from '@/lib/billing';
import QuoteBuilderClient from '../QuoteBuilderClient';

export const dynamic = 'force-dynamic';

export default async function NewQuotePage() {
  const s = createServiceSupabase();
  let companies: { id: string; name: string }[] = [];
  let vessels: { id: string; name: string; imo_no: string | null; company_id: string | null }[] = [];
  let priceBook: PriceBookItem[] = [];
  try {
    const [c, v, p] = await Promise.all([
      s.from('companies').select('id, name').order('name'),
      s.from('vessels').select('id, name, imo_no, company_id').order('name'),
      s.from('price_book_items').select('*').eq('active', true).order('name_en')
    ]);
    companies = (c.data ?? []) as typeof companies;
    vessels = (v.data ?? []) as typeof vessels;
    priceBook = (p.data ?? []) as PriceBookItem[];
  } catch {
    /* not migrated yet */
  }
  return <QuoteBuilderClient companies={companies} vessels={vessels} priceBook={priceBook} />;
}
