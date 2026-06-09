import { createServiceSupabase } from '@/lib/supabase/server';
import type { PriceBookItem } from '@/lib/billing';
import PriceBookClient from './PriceBookClient';

export const dynamic = 'force-dynamic';

export default async function PriceBookPage() {
  const s = createServiceSupabase();
  let items: PriceBookItem[] = [];
  try {
    const { data } = await s
      .from('price_book_items')
      .select('*')
      .order('kind')
      .order('name_en');
    items = (data ?? []) as PriceBookItem[];
  } catch {
    /* tables not migrated yet */
  }
  return <PriceBookClient initial={items} />;
}
