import Link from 'next/link';
import { createServiceSupabase } from '@/lib/supabase/server';
import type { QuoteRow } from '@/lib/billing';
import QuotesListClient from './QuotesListClient';

export const dynamic = 'force-dynamic';

export default async function QuotesPage() {
  const s = createServiceSupabase();
  let rows: QuoteRow[] = [];
  try {
    const { data } = await s
      .from('quotes')
      .select('*, companies(name), vessels(name, imo_no)')
      .order('created_at', { ascending: false })
      .limit(100);
    rows = (data ?? []) as unknown as QuoteRow[];
  } catch {
    /* not migrated yet */
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="kicker">Evrak & Finans</div>
          <h2 className="text-[20px] mt-0.5">Teklifler</h2>
        </div>
        <Link href="/admin/billing/quotes/new" className="btn-accent btn-sm no-underline">+ Yeni teklif</Link>
      </div>
      <QuotesListClient rows={rows} />
    </div>
  );
}
