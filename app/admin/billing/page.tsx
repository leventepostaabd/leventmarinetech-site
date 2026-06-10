import Link from 'next/link';
import { createServiceSupabase } from '@/lib/supabase/server';
import { money, QUOTE_STATUS_LABEL, type QuoteStatus } from '@/lib/billing';

export const dynamic = 'force-dynamic';

async function loadOverview() {
  const s = createServiceSupabase();
  try {
    const year = new Date().getFullYear();
    const [openQuotes, acceptedQuotes, totalQuotes, unpaid, recent, paidYear, expYear] = await Promise.all([
      s.from('quotes').select('total').in('status', ['draft', 'sent']),
      s.from('quotes').select('id', { count: 'exact', head: true }).eq('status', 'accepted'),
      s.from('quotes').select('id', { count: 'exact', head: true }).in('status', ['accepted', 'declined']),
      s.from('invoices').select('total, amount_paid').in('status', ['sent', 'partial', 'overdue']),
      s.from('quotes').select('id, number, status, total, currency, created_at, companies(name)').order('created_at', { ascending: false }).limit(8),
      s.from('payments').select('amount_usd').gte('received_at', `${year}-01-01`),
      s.from('expenses').select('amount_usd').gte('spent_on', `${year}-01-01`)
    ]);
    const pipeline = (openQuotes.data ?? []).reduce((sum, q) => sum + Number(q.total ?? 0), 0);
    const won = acceptedQuotes.count ?? 0;
    const decided = totalQuotes.count ?? 0;
    const winRate = decided > 0 ? Math.round((won / decided) * 100) : null;
    const ar = (unpaid.data ?? []).reduce((sum, i) => sum + (Number(i.total ?? 0) - Number(i.amount_paid ?? 0)), 0);
    const income = (paidYear.data ?? []).reduce((sum, p) => sum + Number(p.amount_usd ?? 0), 0);
    const expense = (expYear.data ?? []).reduce((sum, e) => sum + Number(e.amount_usd ?? 0), 0);
    return { pipeline, winRate, ar, income, expense, net: income - expense, year, recent: recent.data ?? [], ready: true };
  } catch {
    return { pipeline: 0, winRate: null as number | null, ar: 0, income: 0, expense: 0, net: 0, year: new Date().getFullYear(), recent: [] as never[], ready: false };
  }
}

const SECTIONS = [
  { href: '/admin/billing/quotes', title: 'Teklifler', sub: 'Quote → PDF, kabul/ret takibi', icon: '📝' },
  { href: '/admin/billing/invoices', title: 'Faturalar', sub: 'Invoice, ödeme, AR yaşlandırma', icon: '🧾' },
  { href: '/admin/billing/service-reports', title: 'Servis Raporları', sub: 'Foto + çift imza, class formatı', icon: '🔧' },
  { href: '/admin/billing/expenses', title: 'Giderler', sub: 'Fiş + kategori · kâr/zarar', icon: '💸' },
  { href: '/admin/billing/price-book', title: 'Fiyat Kitabı', sub: 'Tekrar kullanılan hizmet/parça', icon: '📚' },
  { href: '/admin/billing/settings', title: 'Ayarlar', sub: 'Firma · banka · EIN · şartname', icon: '⚙️' }
];

export default async function BillingHome() {
  const o = await loadOverview();
  return (
    <div>
      {!o.ready && (
        <div className="card border-l-4 border-l-amber mb-5">
          <p className="text-[13.5px] text-ink-muted">
            Veritabanı tabloları henüz yok gibi görünüyor. <span className="font-mono">0004_billing.sql</span> migration&apos;ı
            Supabase&apos;e uygulanınca bu bölüm aktifleşir.
          </p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3 mb-4">
        <Kpi label="Pipeline (açık teklif)" value={money(o.pipeline)} />
        <Kpi label="Kazanma oranı" value={o.winRate === null ? '—' : `%${o.winRate}`} />
        <Kpi label="Tahsil edilmemiş (AR)" value={money(o.ar)} />
      </div>

      {/* Profit / loss this year */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Kpi label={`Gelir · tahsil (${o.year})`} value={money(o.income)} />
        <Kpi label={`Gider (${o.year})`} value={money(o.expense)} />
        <div className={`card ${o.net >= 0 ? 'border-l-4 border-l-green-600' : 'border-l-4 border-l-red-600'}`}>
          <div className="kicker text-ink-subtle">Net kâr/zarar ({o.year})</div>
          <div className={`mt-1 font-head text-[22px] font-extrabold ${o.net >= 0 ? 'text-green-700' : 'text-red-700'}`}>{money(o.net)}</div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {SECTIONS.map((sx) => (
          <Link
            key={sx.href}
            href={sx.href}
            className="card no-underline transition hover:border-amber hover:shadow-md"
          >
            <div className="text-2xl mb-2">{sx.icon}</div>
            <div className="font-head font-bold text-[16px] text-navy-700">{sx.title}</div>
            <div className="text-[12.5px] text-ink-muted mt-0.5">{sx.sub}</div>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[18px]">Son teklifler</h2>
        <Link href="/admin/billing/quotes/new" className="btn-accent btn-sm no-underline">+ Yeni teklif</Link>
      </div>
      {o.recent.length === 0 ? (
        <p className="text-[13px] text-ink-muted">Henüz teklif yok.</p>
      ) : (
        <div className="overflow-hidden rounded-lg ring-1 ring-line">
          <table className="w-full text-[13px]">
            <thead className="bg-navy-50/60 text-left font-mono text-[11px] uppercase tracking-wide text-ink-subtle">
              <tr>
                <th className="px-3 py-2">No</th>
                <th className="px-3 py-2">Müşteri</th>
                <th className="px-3 py-2">Durum</th>
                <th className="px-3 py-2 text-right">Tutar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {o.recent.map((q: any) => (
                <tr key={q.id} className="hover:bg-navy-50/40">
                  <td className="px-3 py-2 font-mono">
                    <Link href={`/admin/billing/quotes/${q.id}`} className="text-navy-700 no-underline hover:text-amber-700">{q.number}</Link>
                  </td>
                  <td className="px-3 py-2">{q.companies?.name ?? '—'}</td>
                  <td className="px-3 py-2">{QUOTE_STATUS_LABEL[q.status as QuoteStatus] ?? q.status}</td>
                  <td className="px-3 py-2 text-right font-mono">{money(Number(q.total ?? 0), q.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <div className="kicker text-ink-subtle">{label}</div>
      <div className="mt-1 font-head text-[22px] font-extrabold text-navy-700">{value}</div>
    </div>
  );
}
