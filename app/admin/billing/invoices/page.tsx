import { createServiceSupabase } from '@/lib/supabase/server';
import { money } from '@/lib/billing';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  draft: 'Taslak', sent: 'Gönderildi', partial: 'Kısmi', paid: 'Ödendi', overdue: 'Gecikmiş', void: 'İptal'
};

export default async function InvoicesPage() {
  const s = createServiceSupabase();
  let rows: any[] = [];
  try {
    const { data } = await s
      .from('invoices')
      .select('*, companies(name), vessels(name, imo_no)')
      .order('created_at', { ascending: false })
      .limit(100);
    rows = data ?? [];
  } catch {
    /* not migrated yet */
  }

  return (
    <div>
      <div className="mb-4">
        <div className="kicker">Evrak & Finans</div>
        <h2 className="text-[20px] mt-0.5">Faturalar</h2>
        <p className="text-[12.5px] text-ink-muted mt-0.5">Kabul edilen teklifi &quot;Faturaya çevir&quot; ile fatura oluşur. Ödeme ve PDF: bir sonraki dilimde.</p>
      </div>
      {rows.length === 0 ? (
        <p className="text-[13px] text-ink-muted">Henüz fatura yok.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg ring-1 ring-line">
          <table className="w-full min-w-[760px] text-[13px]">
            <thead className="bg-navy-50/60 text-left font-mono text-[10.5px] uppercase tracking-wide text-ink-subtle">
              <tr>
                <th className="px-3 py-2">No</th>
                <th className="px-3 py-2">Müşteri / Gemi</th>
                <th className="px-3 py-2">Durum</th>
                <th className="px-3 py-2">Vade</th>
                <th className="px-3 py-2 text-right">Tutar</th>
                <th className="px-3 py-2 text-right">Ödenen</th>
                <th className="px-3 py-2 text-right">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {rows.map((i) => (
                <tr key={i.id} className="hover:bg-navy-50/40">
                  <td className="px-3 py-2 font-mono">{i.number}</td>
                  <td className="px-3 py-2">
                    <div className="text-ink">{i.companies?.name ?? '—'}</div>
                    <div className="text-[11.5px] text-ink-subtle">{i.vessels?.name ?? '—'}</div>
                  </td>
                  <td className="px-3 py-2">{STATUS_LABEL[i.status] ?? i.status}</td>
                  <td className="px-3 py-2 font-mono text-[12px]">{i.due_date ?? '—'}</td>
                  <td className="px-3 py-2 text-right font-mono">{money(Number(i.total ?? 0), i.currency)}</td>
                  <td className="px-3 py-2 text-right font-mono text-ink-subtle">{money(Number(i.amount_paid ?? 0), i.currency)}</td>
                  <td className="px-3 py-2 text-right">
                    <a href={`/api/admin/billing/invoices/${i.id}/pdf`} target="_blank" rel="noreferrer" className="text-navy-700 no-underline hover:text-amber-700">PDF</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
