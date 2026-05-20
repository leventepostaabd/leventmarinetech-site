import { createServerSupabase } from '@/lib/supabase/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminRfqs({ searchParams }: { searchParams: { status?: string } }) {
  const supabase = createServerSupabase();
  let q = supabase.from('rfq_requests').select('*').order('created_at', { ascending: false }).limit(100);
  if (searchParams.status) q = q.eq('status', searchParams.status);
  const { data, error } = await q;

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2>RFQs · supply / equivalent / unlisted</h2>
        <span className="font-mono text-[11.5px] text-ink-subtle">{data?.length ?? 0} rows</span>
      </div>

      <div className="flex gap-1 mb-4 font-mono text-[11.5px]">
        {['all', 'new', 'reviewing', 'supplier_checking', 'quoted', 'closed'].map((s) => (
          <Link key={s} href={s === 'all' ? '/admin/rfqs' : `/admin/rfqs?status=${s}`} className={`px-2.5 py-1.5 rounded-md no-underline ${(!searchParams.status && s === 'all') || searchParams.status === s ? 'bg-navy-700 text-white' : 'bg-navy-50 text-ink hover:bg-navy-100'}`}>{s}</Link>
        ))}
      </div>

      {error && <div className="card text-red-600 text-sm">Error: {error.message}</div>}

      <div className="overflow-x-auto card !p-0">
        <table className="w-full text-[13px]">
          <thead className="bg-navy-50 text-left">
            <tr>
              <th className="px-3 py-2 font-mono text-[10.5px] uppercase tracking-wider text-ink-subtle">When</th>
              <th className="px-3 py-2 font-mono text-[10.5px] uppercase tracking-wider text-ink-subtle">Kind</th>
              <th className="px-3 py-2 font-mono text-[10.5px] uppercase tracking-wider text-ink-subtle">Urgency</th>
              <th className="px-3 py-2 font-mono text-[10.5px] uppercase tracking-wider text-ink-subtle">Brand / Part</th>
              <th className="px-3 py-2 font-mono text-[10.5px] uppercase tracking-wider text-ink-subtle">Vessel · Port</th>
              <th className="px-3 py-2 font-mono text-[10.5px] uppercase tracking-wider text-ink-subtle">Contact</th>
              <th className="px-3 py-2 font-mono text-[10.5px] uppercase tracking-wider text-ink-subtle">Status</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((r: any) => (
              <tr key={r.id} className="border-t border-line hover:bg-navy-50">
                <td className="px-3 py-2 font-mono text-[11.5px] text-ink-subtle whitespace-nowrap">{new Date(r.created_at).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}</td>
                <td className="px-3 py-2 capitalize">{r.kind}</td>
                <td className="px-3 py-2"><span className={`font-mono text-[10.5px] uppercase tracking-wider ${r.urgency === 'aog' ? 'text-red-600' : r.urgency === 'urgent' ? 'text-amber-600' : 'text-ink-subtle'}`}>{r.urgency}</span></td>
                <td className="px-3 py-2">{r.brand ?? '—'} · <span className="font-mono">{r.part_number ?? '—'}</span></td>
                <td className="px-3 py-2 text-ink-muted">{r.vessel_name ?? '—'} · {r.current_port ?? '—'}</td>
                <td className="px-3 py-2 text-ink-muted">{r.contact_name} · <a href={`mailto:${r.contact_email}`} className="text-amber-600 no-underline">{r.contact_email}</a></td>
                <td className="px-3 py-2"><span className="font-mono text-[10.5px] uppercase">{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
