import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLead, getLeadEvents, getLeadNotes, sourceLabel, stageLabel, STAGE_ORDER, type LeadStage } from '@/lib/crm';
import LeadDetailClient from './LeadDetailClient';

export const dynamic = 'force-dynamic';

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const lead = await getLead(params.id);
  if (!lead) notFound();
  const [notes, events] = await Promise.all([getLeadNotes(lead.id), getLeadEvents(lead.id)]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href={`/admin/leads?tab=${lead.track}`} className="font-mono text-[12px] text-ink-subtle hover:text-ink no-underline">
            ← Back to {lead.track} leads
          </Link>
          <h2 className="text-[22px] mt-2 leading-tight">
            {lead.company?.name ?? <span className="text-ink-subtle italic">No company</span>}
            {lead.vessel && (
              <span className="text-ink-muted text-[16px] font-normal ml-2">
                · {lead.vessel.name}{lead.vessel.imo_no ? ` · IMO ${lead.vessel.imo_no}` : ''}
              </span>
            )}
          </h2>
          <div className="flex flex-wrap gap-2 mt-2 text-[11px] font-mono uppercase tracking-[0.1em]">
            <span className="px-2 py-0.5 rounded-full bg-navy-50 text-ink-subtle">{sourceLabel(lead.source)}</span>
            <span className="px-2 py-0.5 rounded-full bg-navy-50 text-ink-subtle">{lead.track}</span>
            <span className="px-2 py-0.5 rounded-full bg-amber/15 text-amber-700">score {lead.priority_score}</span>
          </div>
        </div>
      </header>

      <LeadDetailClient
        lead={lead}
        notes={notes}
        events={events}
        stageOrder={STAGE_ORDER}
        stageLabels={Object.fromEntries(STAGE_ORDER.map((s) => [s, stageLabel(s)])) as Record<LeadStage, string>}
      />
    </div>
  );
}
