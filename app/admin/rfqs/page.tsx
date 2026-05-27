import { createServerSupabase } from '@/lib/supabase/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const STATUS_TONE: Record<string, string> = {
  new: 'bg-amber/10 text-amber-700',
  reviewing: 'bg-navy-50 text-ink',
  supplier_checking: 'bg-navy-50 text-ink',
  quoted: 'bg-blue-50 text-blue-700',
  waiting_approval: 'bg-amber/10 text-amber-700',
  ordered: 'bg-green-50 text-green-700',
  delivered: 'bg-green-100 text-green-700',
  closed: 'bg-navy-50 text-ink-subtle',
  cancelled: 'bg-red-50 text-red-700'
};

// Display-only Turkish labels. The underlying slug values (used in links,
// filters and DB comparisons) are never changed.
const STATUS_LABEL: Record<string, string> = {
  all: 'Tümü',
  new: 'Yeni',
  reviewing: 'İnceleniyor',
  supplier_checking: 'Tedarikçi kontrolü',
  quoted: 'Teklif verildi',
  waiting_approval: 'Onay bekliyor',
  ordered: 'Sipariş verildi',
  delivered: 'Teslim edildi',
  closed: 'Kapatıldı',
  cancelled: 'İptal edildi'
};

const URGENCY_LABEL: Record<string, string> = {
  all: 'Tümü',
  aog: 'AOG',
  urgent: 'Acil',
  planned: 'Planlı'
};

export default async function AdminRfqs({
  searchParams
}: {
  searchParams: { status?: string; q?: string; urgency?: string };
}) {
  const supabase = createServerSupabase();
  let q = supabase
    .from('rfq_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);
  if (searchParams.status) q = q.eq('status', searchParams.status);
  if (searchParams.urgency) q = q.eq('urgency', searchParams.urgency);
  if (searchParams.q) {
    const term = `%${searchParams.q}%`;
    q = q.or(
      [
        `brand.ilike.${term}`,
        `part_number.ilike.${term}`,
        `contact_email.ilike.${term}`,
        `contact_name.ilike.${term}`,
        `company.ilike.${term}`,
        `vessel_name.ilike.${term}`
      ].join(',')
    );
  }
  const { data, error } = await q;

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2>Teklif Talepleri · tedarik / muadil / listelenmemiş</h2>
        <span className="font-mono text-[11.5px] text-ink-subtle">{data?.length ?? 0} kayıt</span>
      </div>

      {/* Filters: status + urgency + free-text */}
      <div className="card !p-3 mb-4 space-y-2.5">
        <form method="get" className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={searchParams.q ?? ''}
            placeholder="Marka, parça no, gemi, e-posta, ad, firma ara…"
            className="field-input !py-1.5 !text-[13px] flex-1"
          />
          {searchParams.status && <input type="hidden" name="status" value={searchParams.status} />}
          {searchParams.urgency && <input type="hidden" name="urgency" value={searchParams.urgency} />}
          <button type="submit" className="btn-primary btn-sm">Ara</button>
          {searchParams.q && (
            <Link
              href={{
                pathname: '/admin/rfqs',
                query: {
                  ...(searchParams.status && { status: searchParams.status }),
                  ...(searchParams.urgency && { urgency: searchParams.urgency })
                }
              }}
              className="btn-ghost btn-sm no-underline"
            >
              Temizle
            </Link>
          )}
        </form>

        <div className="flex flex-wrap gap-1 font-mono text-[11px]">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-subtle pr-2 py-1.5">Durum:</span>
          {['all', 'new', 'reviewing', 'supplier_checking', 'quoted', 'waiting_approval', 'ordered', 'closed'].map((s) => {
            const next = { ...searchParams };
            if (s === 'all') delete next.status;
            else next.status = s;
            return (
              <Link
                key={s}
                href={{ pathname: '/admin/rfqs', query: next }}
                className={`px-2 py-1.5 rounded-md no-underline ${
                  (!searchParams.status && s === 'all') || searchParams.status === s
                    ? 'bg-navy-700 text-white'
                    : 'bg-navy-50 text-ink hover:bg-navy-100'
                }`}
              >
                {STATUS_LABEL[s] ?? s}
              </Link>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-1 font-mono text-[11px]">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-subtle pr-2 py-1.5">Aciliyet:</span>
          {['all', 'aog', 'urgent', 'planned'].map((u) => {
            const next = { ...searchParams };
            if (u === 'all') delete next.urgency;
            else next.urgency = u;
            return (
              <Link
                key={u}
                href={{ pathname: '/admin/rfqs', query: next }}
                className={`px-2 py-1.5 rounded-md no-underline ${
                  (!searchParams.urgency && u === 'all') || searchParams.urgency === u
                    ? u === 'aog'
                      ? 'bg-red-600 text-white'
                      : u === 'urgent'
                        ? 'bg-amber text-navy-700'
                        : 'bg-navy-700 text-white'
                    : 'bg-navy-50 text-ink hover:bg-navy-100'
                }`}
              >
                {URGENCY_LABEL[u] ?? u}
              </Link>
            );
          })}
        </div>
      </div>

      {error && <div className="card text-red-600 text-sm">Hata: {error.message}</div>}

      <div className="overflow-x-auto card !p-0">
        <table className="w-full text-[13px]">
          <thead className="bg-navy-50 text-left">
            <tr>
              <th className="px-3 py-2 font-mono text-[10.5px] uppercase tracking-wider text-ink-subtle">Tarih</th>
              <th className="px-3 py-2 font-mono text-[10.5px] uppercase tracking-wider text-ink-subtle">Acil.</th>
              <th className="px-3 py-2 font-mono text-[10.5px] uppercase tracking-wider text-ink-subtle">Öğe</th>
              <th className="px-3 py-2 font-mono text-[10.5px] uppercase tracking-wider text-ink-subtle">Gemi · Liman</th>
              <th className="px-3 py-2 font-mono text-[10.5px] uppercase tracking-wider text-ink-subtle">İletişim</th>
              <th className="px-3 py-2 font-mono text-[10.5px] uppercase tracking-wider text-ink-subtle">Durum</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((r: any) => (
              <tr key={r.id} className="border-t border-line hover:bg-navy-50 cursor-pointer">
                <td className="px-3 py-2 font-mono text-[11.5px] text-ink-subtle whitespace-nowrap">
                  <Link href={`/admin/rfqs/${r.id}`} className="no-underline text-ink-subtle hover:text-amber-600">
                    {new Date(r.created_at).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
                  </Link>
                </td>
                <td className="px-3 py-2">
                  <span className={`font-mono text-[10.5px] uppercase tracking-wider ${
                    r.urgency === 'aog' ? 'text-red-600' :
                    r.urgency === 'urgent' ? 'text-amber-600' :
                    'text-ink-subtle'
                  }`}>
                    {URGENCY_LABEL[r.urgency] ?? r.urgency}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <Link href={`/admin/rfqs/${r.id}`} className="no-underline text-ink hover:text-amber-600 block">
                    <div className="text-[13px]">{r.brand ?? '—'}</div>
                    <div className="font-mono text-[11px] text-ink-subtle">{r.part_number ?? r.description?.slice(0, 40) ?? '—'}</div>
                  </Link>
                </td>
                <td className="px-3 py-2 text-ink-muted text-[12px]">
                  {r.vessel_name ?? '—'}
                  <div className="text-[11px] text-ink-subtle">{r.current_port ?? '—'}</div>
                </td>
                <td className="px-3 py-2 text-ink-muted text-[12px]">
                  {r.contact_name ?? '—'}
                  <div className="font-mono text-[11px] text-ink-subtle truncate max-w-[180px]">{r.contact_email}</div>
                </td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded font-mono text-[10.5px] uppercase tracking-wider ${STATUS_TONE[r.status] ?? STATUS_TONE.new}`}>
                    {STATUS_LABEL[r.status] ?? r.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <Link
                    href={`/admin/rfqs/${r.id}`}
                    className="font-mono text-[11px] uppercase tracking-[0.12em] text-amber-600 no-underline hover:text-amber"
                  >
                    Aç →
                  </Link>
                </td>
              </tr>
            ))}
            {(data ?? []).length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center text-ink-subtle text-[13px]">
                  Geçerli filtrelerle eşleşen teklif talebi yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
