import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';

async function counts() {
  const supabase = createServerSupabase();
  const [a, b, c, d] = await Promise.all([
    supabase.from('rfq_requests').select('id', { count: 'exact', head: true }),
    supabase.from('rfq_requests').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('service_requests').select('id', { count: 'exact', head: true }),
    supabase.from('service_requests').select('id', { count: 'exact', head: true }).eq('status', 'new')
  ]);
  return {
    rfqTotal: a.count ?? 0,
    rfqNew: b.count ?? 0,
    serviceTotal: c.count ?? 0,
    serviceNew: d.count ?? 0
  };
}

export default async function AdminHome() {
  const k = await counts();
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <KPI label="RFQs — new" value={k.rfqNew} href="/admin/rfqs?status=new" hot />
      <KPI label="RFQs — total" value={k.rfqTotal} href="/admin/rfqs" />
      <KPI label="Service — new" value={k.serviceNew} href="/admin/service?status=new" hot />
      <KPI label="Service — total" value={k.serviceTotal} href="/admin/service" />
    </div>
  );
}

function KPI({ label, value, href, hot }: { label: string; value: number; href: string; hot?: boolean }) {
  return (
    <Link href={href} className={`card no-underline group ${hot && value > 0 ? 'border-l-4 border-l-amber' : ''}`}>
      <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-subtle mb-2">{label}</div>
      <div className="font-head text-4xl font-extrabold text-ink">{value}</div>
      <div className="text-[12px] text-amber-600 group-hover:translate-x-0.5 transition font-mono mt-2">View →</div>
    </Link>
  );
}
