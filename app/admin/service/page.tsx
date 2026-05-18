import { createServerSupabase } from '@/lib/supabase/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminService({ searchParams }: { searchParams: { status?: string } }) {
  const supabase = createServerSupabase();
  let q = supabase.from('service_requests').select('*').order('created_at', { ascending: false }).limit(100);
  if (searchParams.status) q = q.eq('status', searchParams.status);
  const { data, error } = await q;

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2>Service requests</h2>
        <span className="font-mono text-[11.5px] text-ink-subtle">{data?.length ?? 0} rows</span>
      </div>

      <div className="flex gap-1 mb-4 font-mono text-[11.5px]">
        {['all', 'new', 'reviewing', 'scheduled', 'on_attendance', 'reporting', 'closed'].map((s) => (
          <Link key={s} href={s === 'all' ? '/admin/service' : `/admin/service?status=${s}`} className={`px-2.5 py-1.5 rounded-md no-underline ${(!searchParams.status && s === 'all') || searchParams.status === s ? 'bg-navy-700 text-white' : 'bg-navy-50 text-ink hover:bg-navy-100'}`}>{s}</Link>
        ))}
      </div>

      {error && <div className="card text-red-600 text-sm">Error: {error.message}</div>}

      <div className="overflow-x-auto card !p-0">
        <table className="w-full text-[13px]">
          <thead className="bg-navy-50 text-left">
            <tr>
              {['When', 'Urgency', 'Vessel · Port', 'Category', 'Symptoms', 'Contact', 'Status'].map((h) => (
                <th key={h} className="px-3 py-2 font-mono text-[10.5px] uppercase tracking-wider text-ink-subtle">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((r: any) => (
              <tr key={r.id} className="border-t border-line hover:bg-navy-50">
                <td className="px-3 py-2 font-mono text-[11.5px] text-ink-subtle whitespace-nowrap">{new Date(r.created_at).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}</td>
                <td className="px-3 py-2"><span className={`font-mono text-[10.5px] uppercase ${r.urgency === 'aog' ? 'text-red-600' : r.urgency === 'urgent' ? 'text-amber-600' : 'text-ink-subtle'}`}>{r.urgency}</span></td>
                <td className="px-3 py-2 text-ink-muted">{r.vessel_name ?? '—'} · {r.port ?? '—'}</td>
                <td className="px-3 py-2">{r.problem_category ?? '—'}</td>
                <td className="px-3 py-2 text-ink-muted text-[12px]">{(r.symptoms ?? []).slice(0, 3).join(', ')}{(r.symptoms ?? []).length > 3 ? '…' : ''}</td>
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
