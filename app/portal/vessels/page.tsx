import { createServerSupabase } from '@/lib/supabase/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function PortalVessels() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  const email = user?.email ?? '';

  // Aggregate vessels from past RFQs + service requests, dedupe by vessel_name + imo
  const [rfqs, svcs] = await Promise.all([
    supabase.from('rfq_requests').select('vessel_name, imo_number, vessel_type, created_at').eq('contact_email', email),
    supabase.from('service_requests').select('vessel_name, imo_number, vessel_type, port, created_at').eq('contact_email', email)
  ]);

  const map = new Map<string, { name: string; imo: string; type: string; lastSeen: string; ports: Set<string> }>();
  function ingest(rows: any[]) {
    rows?.forEach((r: any) => {
      const key = `${r.vessel_name ?? '?'}|${r.imo_number ?? '?'}`;
      const entry = map.get(key) ?? { name: r.vessel_name ?? '—', imo: r.imo_number ?? '—', type: r.vessel_type ?? '', lastSeen: r.created_at, ports: new Set<string>() };
      if (new Date(r.created_at) > new Date(entry.lastSeen)) entry.lastSeen = r.created_at;
      if (r.port) entry.ports.add(r.port);
      map.set(key, entry);
    });
  }
  ingest(rfqs.data ?? []);
  ingest(svcs.data ?? []);
  const vessels = Array.from(map.values()).filter((v) => v.name !== '—');

  return (
    <div>
      <h2 className="mb-5">My vessels</h2>
      {vessels.length === 0 ? (
        <div className="card text-ink-muted">No vessels yet. Vessels are picked up from your RFQ and service request submissions automatically.</div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {vessels.map((v) => (
            <li key={`${v.name}-${v.imo}`} className="card">
              <h3 className="text-[17px] mb-0.5">{v.name}</h3>
              <div className="font-mono text-[11.5px] text-ink-subtle mb-3">IMO {v.imo} {v.type ? ` · ${v.type}` : ''}</div>
              <div className="text-[13px] text-ink-muted">
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-amber-600 block mb-1">Recent ports</span>
                {[...v.ports].slice(0, 5).join(' · ') || '—'}
              </div>
              <div className="mt-3 flex gap-2">
                <Link href={`/supply-wizard?vessel=${encodeURIComponent(v.name)}`} className="btn-ghost btn-sm">Supply RFQ</Link>
                <Link href={`/service-wizard?vessel=${encodeURIComponent(v.name)}`} className="btn-ghost btn-sm">Service request</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
