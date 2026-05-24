import Link from 'next/link';
import { listLeads, type LeadStage, type LeadTrack, sourceLabel, stageLabel } from '@/lib/crm';

export const dynamic = 'force-dynamic';

type SP = { tab?: string; stage?: string; q?: string };

export default async function LeadsListPage({ searchParams }: { searchParams: SP }) {
  const tab = (searchParams.tab === 'supply' ? 'supply' : 'service') as LeadTrack;
  const stage = searchParams.stage as LeadStage | undefined;
  const search = searchParams.q?.trim() || undefined;

  const leads = await listLeads({ track: tab, stage, search, limit: 300 });

  const stageOptions: { value: LeadStage | ''; label: string }[] = [
    { value: '', label: 'All stages' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'replied', label: 'Replied' },
    { value: 'quoting', label: 'Quoting' },
    { value: 'won', label: 'Won' },
    { value: 'lost', label: 'Lost' }
  ];

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="kicker">Leads</div>
          <h2 className="text-[22px] mt-1">CRM pipeline — {tab === 'service' ? 'Service' : 'Supply'} track</h2>
        </div>
        <Link href="/admin/leads/new" className="btn-accent btn-sm">+ New lead</Link>
      </header>

      {/* Track tabs */}
      <div className="flex gap-1 border-b border-line">
        <TabLink active={tab === 'service'} href={`/admin/leads?tab=service${stage ? `&stage=${stage}` : ''}${search ? `&q=${encodeURIComponent(search)}` : ''}`}>Service</TabLink>
        <TabLink active={tab === 'supply'} href={`/admin/leads?tab=supply${stage ? `&stage=${stage}` : ''}${search ? `&q=${encodeURIComponent(search)}` : ''}`}>Supply</TabLink>
      </div>

      {/* Filters */}
      <form className="flex flex-wrap gap-2 items-center" method="get">
        <input type="hidden" name="tab" value={tab} />
        <input
          type="search"
          name="q"
          defaultValue={search ?? ''}
          placeholder="Search company / vessel / IMO…"
          className="rounded-full bg-navy-50/70 px-4 py-2 text-[13.5px] ring-1 ring-line/60 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber/50 min-w-[260px]"
        />
        <select
          name="stage"
          defaultValue={stage ?? ''}
          className="rounded-full bg-white px-3 py-2 text-[13px] ring-1 ring-line/60"
        >
          {stageOptions.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <button type="submit" className="btn-ghost btn-sm">Filter</button>
        {(stage || search) && (
          <Link href={`/admin/leads?tab=${tab}`} className="text-[12px] font-mono text-ink-subtle hover:text-ink">
            ✕ Clear
          </Link>
        )}
      </form>

      {/* List */}
      {leads.length === 0 ? (
        <div className="card border-l-4 border-l-amber/60">
          <p className="text-ink-muted text-[14px] mb-2">No leads yet on this track.</p>
          <p className="text-ink-subtle text-[12.5px]">
            Inbound form submissions land here automatically. You can also{' '}
            <Link href="/admin/leads/new" className="text-amber-600 hover:underline">add a manual lead</Link>{' '}
            from public sources (Equasis, PSC reports).
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-line bg-white overflow-x-auto">
          <table className="w-full text-[13.5px]">
            <thead className="bg-navy-50 text-left text-[11px] font-mono uppercase tracking-[0.12em] text-ink-subtle">
              <tr>
                <th className="px-3 py-2.5">Score</th>
                <th className="px-3 py-2.5">Company / Vessel</th>
                <th className="px-3 py-2.5">Context</th>
                <th className="px-3 py-2.5">Stage</th>
                <th className="px-3 py-2.5">Source</th>
                <th className="px-3 py-2.5">Created</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => {
                const ctx = (l.context ?? {}) as Record<string, string>;
                const port = ctx.port;
                const system = ctx.system;
                const urgency = ctx.urgency;
                return (
                  <tr key={l.id} className="border-t border-line hover:bg-navy-50/40">
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <ScoreBadge score={l.priority_score} />
                    </td>
                    <td className="px-3 py-2.5">
                      <Link href={`/admin/leads/${l.id}`} className="text-ink hover:text-amber-600 no-underline font-medium">
                        {l.company?.name ?? <span className="text-ink-subtle italic">No company</span>}
                      </Link>
                      {l.vessel && (
                        <div className="text-[11.5px] font-mono text-ink-subtle mt-0.5">
                          {l.vessel.name}{l.vessel.imo_no ? ` · IMO ${l.vessel.imo_no}` : ''}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-ink-muted text-[12.5px]">
                      {[urgency && urgency.toUpperCase(), system, port].filter(Boolean).join(' · ')}
                    </td>
                    <td className="px-3 py-2.5">
                      <StageChip stage={l.stage} />
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[11px] text-ink-subtle uppercase tracking-[0.1em]">
                      {sourceLabel(l.source)}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[11px] text-ink-subtle">
                      {new Date(l.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TabLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 text-[13px] font-semibold no-underline border-b-2 transition ${
        active ? 'border-amber text-ink' : 'border-transparent text-ink-subtle hover:text-ink'
      }`}
    >
      {children}
    </Link>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const colour =
    score >= 80 ? 'bg-red-600 text-white'
    : score >= 60 ? 'bg-amber text-navy-700'
    : score >= 40 ? 'bg-navy-50 text-navy-700'
    : 'bg-white text-ink-subtle ring-1 ring-line';
  return (
    <span className={`inline-flex items-center justify-center min-w-[34px] px-2 py-0.5 rounded-md font-mono text-[12px] font-bold ${colour}`}>
      {score}
    </span>
  );
}

function StageChip({ stage }: { stage: import('@/lib/crm').LeadStage }) {
  const colours: Record<string, string> = {
    new:       'bg-navy-50 text-navy-700 ring-1 ring-line',
    contacted: 'bg-amber/15 text-amber-700 ring-1 ring-amber/30',
    replied:   'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    quoting:   'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
    won:       'bg-green-50 text-green-700 ring-1 ring-green-200',
    lost:      'bg-red-50 text-red-700 ring-1 ring-red-200'
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[10.5px] uppercase tracking-[0.1em] ${colours[stage] ?? colours.new}`}>
      {stageLabel(stage)}
    </span>
  );
}
