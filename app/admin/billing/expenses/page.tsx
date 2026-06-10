import { createServiceSupabase } from '@/lib/supabase/server';
import type { ExpenseRow } from '@/lib/billing';
import ExpensesClient from './ExpensesClient';

export const dynamic = 'force-dynamic';

export default async function ExpensesPage() {
  const s = createServiceSupabase();
  let rows: ExpenseRow[] = [];
  try {
    const { data } = await s
      .from('expenses')
      .select('id, spent_on, vendor, category, description, amount_usd, payment_method, rebillable, receipt_path, notes')
      .order('spent_on', { ascending: false })
      .limit(300);
    rows = (data ?? []) as ExpenseRow[];
  } catch {
    /* not migrated */
  }
  return <ExpensesClient initial={rows} />;
}
