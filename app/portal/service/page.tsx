import { createServerSupabase } from '@/lib/supabase/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function PortalService() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  const email = user?.email ?? '';
  const { data, error } = await supabase
    .from('service_requests')
    .select('*')
    .eq('contact_email', email)
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2>My service jobs</h2>
        <Link href="/service-wizard" className="btn-primary btn-sm">New service request</Link>
      </div>
      {error && <div className="card text-red-600 text-sm">Error: {error.message}</div>}
      {(data?.length ?? 0) === 0 ? (
        <div className="card text-ink-muted">No service jobs yet.</div>
      ) : (
        <div className="overflow-x-auto card !p-0">
          <table className="w-full text-[13px]">
            <thead className="bg-navy-50 text-left">
              <tr>{['Date', 'Urgency', 'Vessel · Port', 'Category', 'Status'].map((h) => (
                <th key={h} className="px-3 py-2 font-mono text-[10.5px] uppercase tracking-wider text-ink-subtle">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {(data ?? []).map((r: any) => (
                <tr key={r.id} className="border-t border-line hover:bg-navy-50">
                  <td className="px-3 py-2 font-mono text-[11.5px] text-ink-subtle whitespace-nowrap">{new Date(r.created_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}</td>
                  <td className="px-3 py-2"><span className={`font-mono text-[10.5px] uppercase ${r.urgency === 'aog' ? 'text-red-600' : r.urgency === 'urgent' ? 'text-amber-600' : 'text-ink-subtle'}`}>{r.urgency}</span></td>
                  <td className="px-3 py-2 text-ink-muted">{r.vessel_name ?? '—'} · {r.port ?? '—'}</td>
                  <td className="px-3 py-2">{r.problem_category ?? '—'}</td>
                  <td className="px-3 py-2"><span className="font-mono text-[10.5px] uppercase">{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
