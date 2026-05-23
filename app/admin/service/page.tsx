import { createServerSupabase } from '@/lib/supabase/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const STATUS_TONE: Record<string, string> = {
  new: 'bg-amber/10 text-amber-700',
  reviewing: 'bg-navy-50 text-ink',
  scheduled: 'bg-blue-50 text-blue-700',
  on_attendance: 'bg-amber/10 text-amber-700',
  reporting: 'bg-blue-50 text-blue-700',
  closed: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700'
};

export default async function AdminService({
  searchParams
}: {
  searchParams: { status?: string; q?: string; urgency?: string };
}) {
  const supabase = createServerSupabase();
  let q = supabase
    .from('service_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);
  if (searchParams.status) q = q.eq('status', searchParams.status);
  if (searchParams.urgency) q = q.eq('urgency', searchParams.urgency);
  if (searchParams.q) {
    const term = `%${searchParams.q}%`;
    q = q.or(
      [
        `problem_category.ilike.${term}`,
        `contact_email.ilike.${term}`,
        `contact_name.ilike.${term}`,
        `company.ilike.${term}`,
        `vessel_name.ilike.${term}`,
        `port.ilike.${term}`
      ].join(',')
    );
  }
  const { data, error } = await q;

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2>Service requests</h2>
        <span className="font-mono text-[11.5px] text-ink-subtle">{data?.length ?? 0} rows</span>
      </div>

      <div className="card !p-3 mb-4 space-y-2.5">
        <form method="get" className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={searchParams.q ?? ''}
            placeholder="Search system, vessel, port, contact name or email…"
            className="field-input !py-1.5 !text-[13px] flex-1"
          />
          {searchParams.status && <input type="hidden" name="status" value={searchParams.status} />}
          {searchParams.urgency && <input type="hidden" name="urgency" value={searchParams.urgency} />}
          <button type="submit" className="btn-primary btn-sm">Search</button>
          {searchParams.q && (
            <Link
              href={{
                pathname: '/admin/service',
                query: {
                  ...(searchParams.status && { status: searchParams.status }),
                  ...(searchParams.urgency && { urgency: searchParams.urgency })
                }
              }}
              className="btn-ghost btn-sm no-underline"
            >
              Clear
            </Link>
          )}
        </form>

        <div className="flex flex-wrap gap-1 font-mono text-[11px]">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-subtle pr-2 py-1.5">Status:</span>
          {['all', 'new', 'reviewing', 'scheduled', 'on_attendance', 'reporting', 'closed'].map((s) => {
            const next = { ...searchParams };
            if (s === 'all') delete next.status;
            else next.status = s;
            return (
              <Link
                key={s}
                href={{ pathname: '/admin/service', query: next }}
                className={`px-2 py-1.5 rounded-md no-underline ${
                  (!searchParams.status && s === 'all') || searchParams.status === s
                    ? 'bg-navy-700 text-white'
                    : 'bg-navy-50 text-ink hover:bg-navy-100'
                }`}
              >
                {s}
              </Link>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-1 font-mono text-[11px]">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-subtle pr-2 py-1.5">Urgency:</span>
          {['all', 'aog', 'urgent', 'planned'].map((u) => {
            const next = { ...searchParams };
            if (u === 'all') delete next.urgency;
            else next.urgency = u;
            return (
              <Link
                key={u}
                href={{ pathname: '/admin/service', query: next }}
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
                {u}
              </Link>
            );
          })}
        </div>
      </div>

      {error && <div className="card text-red-600 text-sm">Error: {error.message}</div>}

      <div className="overflow-x-auto card !p-0">
        <table className="w-full text-[13px]">
          <thead className="bg-navy-50 text-left">
            <tr>
              {['When', 'Urg', 'System / vessel', 'Port', 'Contact', 'Status', ''].map((h) => (
                <th key={h} className="px-3 py-2 font-mono text-[10.5px] uppercase tracking-wider text-ink-subtle">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((r: any) => (
              <tr key={r.id} className="border-t border-line hover:bg-navy-50 cursor-pointer">
                <td className="px-3 py-2 font-mono text-[11.5px] text-ink-subtle whitespace-nowrap">
                  <Link href={`/admin/service/${r.id}`} className="no-underline text-ink-subtle hover:text-amber-600">
                    {new Date(r.created_at).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
                  </Link>
                </td>
                <td className="px-3 py-2">
                  <span className={`font-mono text-[10.5px] uppercase tracking-wider ${
                    r.urgency === 'aog' ? 'text-red-600' :
                    r.urgency === 'urgent' ? 'text-amber-600' :
                    'text-ink-subtle'
                  }`}>
                    {r.urgency}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <Link href={`/admin/service/${r.id}`} className="no-underline text-ink hover:text-amber-600 block">
                    <div className="text-[13px]">{r.problem_category ?? '—'}</div>
                    <div className="font-mono text-[11px] text-ink-subtle">{r.vessel_name ?? '—'}</div>
                  </Link>
                </td>
                <td className="px-3 py-2 text-ink-muted text-[12px]">{r.port ?? '—'}</td>
                <td className="px-3 py-2 text-ink-muted text-[12px]">
                  {r.contact_name ?? '—'}
                  <div className="font-mono text-[11px] text-ink-subtle truncate max-w-[180px]">{r.contact_email}</div>
                </td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded font-mono text-[10.5px] uppercase tracking-wider ${STATUS_TONE[r.status] ?? STATUS_TONE.new}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <Link
                    href={`/admin/service/${r.id}`}
                    className="font-mono text-[11px] uppercase tracking-[0.12em] text-amber-600 no-underline hover:text-amber"
                  >
                    Open →
                  </Link>
                </td>
              </tr>
            ))}
            {(data ?? []).length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center text-ink-subtle text-[13px]">
                  No service requests match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
