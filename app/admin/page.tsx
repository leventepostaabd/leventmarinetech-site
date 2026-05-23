import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';

async function loadOverview() {
  const supabase = createServerSupabase();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const since24h = new Date(Date.now() - 24 * 3600 * 1000);

  const [
    rfqTotal, rfqNew, rfqToday, rfqAog, rfqQuoted, rfqLatest,
    svcTotal, svcNew, svcToday, svcAog, svcLatest
  ] = await Promise.all([
    supabase.from('rfq_requests').select('id', { count: 'exact', head: true }),
    supabase.from('rfq_requests').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('rfq_requests').select('id', { count: 'exact', head: true }).gte('created_at', startOfDay.toISOString()),
    supabase.from('rfq_requests').select('id', { count: 'exact', head: true }).eq('urgency', 'aog').not('status', 'in', '("closed","cancelled")'),
    supabase.from('rfq_requests').select('id', { count: 'exact', head: true }).eq('status', 'quoted'),
    supabase.from('rfq_requests').select('id, brand, part_number, urgency, status, contact_name, vessel_name, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('service_requests').select('id', { count: 'exact', head: true }),
    supabase.from('service_requests').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('service_requests').select('id', { count: 'exact', head: true }).gte('created_at', startOfDay.toISOString()),
    supabase.from('service_requests').select('id', { count: 'exact', head: true }).eq('urgency', 'aog').not('status', 'in', '("closed","cancelled")'),
    supabase.from('service_requests').select('id, problem_category, urgency, status, contact_name, vessel_name, port, created_at').order('created_at', { ascending: false }).limit(5)
  ]);

  return {
    rfqTotal: rfqTotal.count ?? 0,
    rfqNew: rfqNew.count ?? 0,
    rfqToday: rfqToday.count ?? 0,
    rfqAog: rfqAog.count ?? 0,
    rfqQuoted: rfqQuoted.count ?? 0,
    rfqLatest: rfqLatest.data ?? [],
    svcTotal: svcTotal.count ?? 0,
    svcNew: svcNew.count ?? 0,
    svcToday: svcToday.count ?? 0,
    svcAog: svcAog.count ?? 0,
    svcLatest: svcLatest.data ?? []
  };
}

export default async function AdminHome() {
  const k = await loadOverview();
  return (
    <div className="space-y-8">
      {/* KPIs */}
      <section className="space-y-3">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-subtle">
          Live counters
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KPI label="AOG · active" value={k.rfqAog + k.svcAog} href="/admin/rfqs?urgency=aog" hot tone="red" />
          <KPI label="RFQs · new" value={k.rfqNew} href="/admin/rfqs?status=new" hot />
          <KPI label="Quoted · awaiting" value={k.rfqQuoted} href="/admin/rfqs?status=quoted" />
          <KPI label="Service · new" value={k.svcNew} href="/admin/service?status=new" hot />
          <KPI label="RFQs today" value={k.rfqToday} href="/admin/rfqs" tone="muted" />
          <KPI label="Service today" value={k.svcToday} href="/admin/service" tone="muted" />
          <KPI label="RFQs · total" value={k.rfqTotal} href="/admin/rfqs" tone="muted" />
          <KPI label="Service · total" value={k.svcTotal} href="/admin/service" tone="muted" />
        </div>
      </section>

      {/* Latest 5 of each */}
      <section className="grid gap-5 lg:grid-cols-2">
        <LatestList title="Latest RFQs" href="/admin/rfqs" rows={k.rfqLatest.map((r: any) => ({
          id: r.id,
          link: `/admin/rfqs/${r.id}`,
          primary: r.brand ? `${r.brand} ${r.part_number ?? ''}`.trim() : (r.part_number ?? 'Untitled'),
          secondary: r.contact_name + (r.vessel_name ? ' · ' + r.vessel_name : ''),
          urgency: r.urgency,
          status: r.status,
          when: r.created_at
        }))} />

        <LatestList title="Latest service requests" href="/admin/service" rows={k.svcLatest.map((r: any) => ({
          id: r.id,
          link: `/admin/service/${r.id}`,
          primary: r.problem_category ?? 'Service',
          secondary: (r.vessel_name ?? '—') + ' · ' + (r.port ?? '—'),
          urgency: r.urgency,
          status: r.status,
          when: r.created_at
        }))} />
      </section>
    </div>
  );
}

function KPI({
  label, value, href, hot, tone = 'default'
}: {
  label: string;
  value: number;
  href: string;
  hot?: boolean;
  tone?: 'default' | 'red' | 'muted';
}) {
  const accent =
    tone === 'red' && value > 0 ? 'border-l-4 border-l-red-600'
    : hot && value > 0 ? 'border-l-4 border-l-amber'
    : '';
  const numColor =
    tone === 'red' && value > 0 ? 'text-red-700'
    : tone === 'muted' ? 'text-ink-muted'
    : 'text-ink';
  return (
    <Link href={href} className={`card no-underline group ${accent}`}>
      <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-subtle mb-1.5">{label}</div>
      <div className={`font-head text-3xl font-extrabold ${numColor}`}>{value}</div>
      <div className="text-[11px] text-amber-600 group-hover:translate-x-0.5 transition font-mono mt-1.5">View →</div>
    </Link>
  );
}

type Row = {
  id: string;
  link: string;
  primary: string;
  secondary: string;
  urgency: string;
  status: string;
  when: string;
};

function LatestList({ title, href, rows }: { title: string; href: string; rows: Row[] }) {
  return (
    <div className="card !p-0 overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-subtle">{title}</div>
        <Link href={href} className="font-mono text-[11px] uppercase tracking-[0.12em] text-amber-600 no-underline hover:text-amber">
          See all →
        </Link>
      </div>
      <ul>
        {rows.length === 0 && (
          <li className="px-4 py-6 text-center text-ink-subtle text-[13px]">No entries yet.</li>
        )}
        {rows.map((r) => (
          <li key={r.id} className="border-t border-line first:border-t-0">
            <Link href={r.link} className="flex items-start justify-between gap-3 px-4 py-2.5 hover:bg-navy-50 no-underline">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`font-mono text-[10px] uppercase tracking-wider ${
                    r.urgency === 'aog' ? 'text-red-600' :
                    r.urgency === 'urgent' ? 'text-amber-600' :
                    'text-ink-subtle'
                  }`}>
                    {r.urgency}
                  </span>
                  <span className="font-mono text-[10px] uppercase text-ink-subtle">
                    {r.status}
                  </span>
                </div>
                <div className="text-[13.5px] font-semibold text-ink truncate">{r.primary}</div>
                <div className="text-[12px] text-ink-muted truncate">{r.secondary}</div>
              </div>
              <div className="font-mono text-[10.5px] text-ink-subtle whitespace-nowrap shrink-0">
                {new Date(r.when).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
