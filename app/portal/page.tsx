import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function PortalHome() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  const email = user?.email ?? '';

  const [rfqsRes, srvRes] = await Promise.all([
    supabase.from('rfq_requests').select('id, status, created_at, brand, part_number, vessel_name, urgency').eq('contact_email', email).order('created_at', { ascending: false }).limit(5),
    supabase.from('service_requests').select('id, status, created_at, problem_category, vessel_name, port, urgency').eq('contact_email', email).order('created_at', { ascending: false }).limit(5)
  ]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[22px]">Recent supply RFQs</h2>
          <Link href="/portal/rfqs" className="font-mono text-[11.5px] text-amber-600 no-underline">All →</Link>
        </div>
        {(rfqsRes.data?.length ?? 0) === 0 ? (
          <div className="card text-ink-muted text-[14px]">
            No RFQs yet. <Link href="/supply-wizard" className="text-amber-600">Send your first one →</Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {(rfqsRes.data ?? []).map((r: any) => (
              <li key={r.id} className="card !p-3 text-[13.5px]">
                <div className="flex justify-between mb-0.5">
                  <span className="font-mono text-[11px] text-ink-subtle">{new Date(r.created_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
                  <span className={`font-mono text-[10.5px] uppercase tracking-wider ${r.urgency === 'aog' ? 'text-red-600' : r.urgency === 'urgent' ? 'text-amber-600' : 'text-ink-subtle'}`}>{r.urgency}</span>
                </div>
                <div className="font-semibold text-ink">{r.brand ?? '—'} <span className="font-mono text-ink-muted">{r.part_number ?? ''}</span></div>
                <div className="text-ink-muted text-[12.5px]">{r.vessel_name ?? '—'} · <span className="font-mono">{r.status}</span></div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[22px]">Recent service jobs</h2>
          <Link href="/portal/service" className="font-mono text-[11.5px] text-amber-600 no-underline">All →</Link>
        </div>
        {(srvRes.data?.length ?? 0) === 0 ? (
          <div className="card text-ink-muted text-[14px]">
            No service jobs yet. <Link href="/service-wizard" className="text-amber-600">Open a service request →</Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {(srvRes.data ?? []).map((r: any) => (
              <li key={r.id} className="card !p-3 text-[13.5px]">
                <div className="flex justify-between mb-0.5">
                  <span className="font-mono text-[11px] text-ink-subtle">{new Date(r.created_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
                  <span className={`font-mono text-[10.5px] uppercase tracking-wider ${r.urgency === 'aog' ? 'text-red-600' : r.urgency === 'urgent' ? 'text-amber-600' : 'text-ink-subtle'}`}>{r.urgency}</span>
                </div>
                <div className="font-semibold text-ink">{r.problem_category ?? 'Service request'}</div>
                <div className="text-ink-muted text-[12.5px]">{r.vessel_name ?? '—'} · {r.port ?? '—'} · <span className="font-mono">{r.status}</span></div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="md:col-span-2">
        <div className="card bg-navy-50 border-l-4 border-l-amber">
          <h3 className="text-[17px] mb-1">Quick actions</h3>
          <p className="text-ink-muted text-[14px] mb-4">Two clicks away.</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/supply-wizard"  className="btn-accent btn-md">New supply RFQ</Link>
            <Link href="/service-wizard" className="btn-primary btn-md">New service request</Link>
            <Link href="/supply/equivalent-part-finder" className="btn-ghost btn-md">Find equivalent</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
