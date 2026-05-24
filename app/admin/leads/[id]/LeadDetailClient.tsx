'use client';

import { useState, useTransition } from 'react';
import { addLeadNote, saveLeadDraft, scoreLeadWithAI, updateLeadStage } from '@/app/admin/_actions';
import type { LeadEvent, LeadNote, LeadStage, LeadWithRefs } from '@/lib/crm';
import type { ScoringResult } from '@/lib/scoring';

export default function LeadDetailClient({
  lead,
  notes,
  events,
  stageOrder,
  stageLabels
}: {
  lead: LeadWithRefs;
  notes: LeadNote[];
  events: LeadEvent[];
  stageOrder: LeadStage[];
  stageLabels: Record<LeadStage, string>;
}) {
  const [draft, setDraft] = useState(lead.draft_message ?? '');
  const [stage, setStage] = useState<LeadStage>(lead.stage);
  const [newNote, setNewNote] = useState('');
  const [copied, setCopied] = useState(false);
  const [saving, startSave] = useTransition();
  const [stageSaving, startStage] = useTransition();
  const [noteSaving, startNote] = useTransition();
  const [scoring, startScore] = useTransition();
  const [ai, setAi] = useState<ScoringResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  function runScore() {
    setAiError(null);
    startScore(async () => {
      const res = await scoreLeadWithAI(lead.id);
      if (res.ok) setAi(res.result);
      else setAiError(res.error);
    });
  }

  const ctx = (lead.context ?? {}) as Record<string, string>;
  const reason = (lead.priority_reason ?? {}) as Record<string, unknown>;

  function copy() {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        {/* Draft message */}
        <section className="card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="kicker">Draft outreach</div>
              <p className="text-[12px] text-ink-subtle mt-1">
                Edit and copy — the panel <span className="font-bold">does not send</span>. You send from your own WhatsApp / email.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={runScore}
                disabled={scoring}
                className="btn-ghost btn-sm disabled:opacity-60"
                title="Ask Claude to score this lead and draft outreach"
              >
                {scoring ? 'Scoring…' : '✦ Score with AI'}
              </button>
              <button
                type="button"
                onClick={copy}
                className="btn-ghost btn-sm"
                disabled={!draft.trim()}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {aiError && (
            <div className="mb-3 rounded-md bg-red-50 ring-1 ring-red-200 px-3 py-2 text-[12.5px] text-red-700">
              {aiError}
            </div>
          )}

          {ai && (
            <div className="mb-4 rounded-md bg-navy-50/50 ring-1 ring-line p-3 space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-head text-2xl font-extrabold text-ink">{ai.priority_score}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-subtle">AI priority</span>
              </div>
              <p className="text-[13px] text-ink-muted">{ai.rationale}</p>
              {ai.factors.length > 0 && (
                <ul className="space-y-1">
                  {ai.factors.map((f, i) => (
                    <li key={i} className="text-[12px] text-ink">
                      <span className={`font-mono text-[10px] uppercase tracking-wider mr-1.5 ${
                        f.weight === 'high' ? 'text-red-600' : f.weight === 'medium' ? 'text-amber-600' : 'text-ink-subtle'
                      }`}>{f.weight}</span>
                      <span className="font-semibold">{f.label}:</span> <span className="text-ink-muted">{f.note}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="text-[12.5px] text-ink">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-subtle mr-1.5">Next</span>
                {ai.recommended_action}
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <button type="button" onClick={() => setDraft(ai.draft_en)} className="btn-accent btn-sm">
                  Use English draft
                </button>
                <button type="button" onClick={() => setDraft(ai.draft_tr)} className="btn-ghost btn-sm">
                  Türkçe taslağı kullan
                </button>
              </div>
            </div>
          )}
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={10}
            className="w-full rounded-md bg-white ring-1 ring-line px-3 py-2 text-[14px] leading-relaxed font-sans"
            placeholder="Initial outreach. Reference vessel name, US port window, system specifics."
          />
          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={() => startSave(async () => { await saveLeadDraft(lead.id, draft); })}
              disabled={saving}
              className="btn-accent btn-sm disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save draft'}
            </button>
          </div>
        </section>

        {/* Context */}
        {Object.keys(ctx).length > 0 && (
          <section className="card">
            <div className="kicker mb-3">Context</div>
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[13px]">
              {Object.entries(ctx).map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-subtle">{k.replace(/_/g, ' ')}</dt>
                  <dd className="text-ink mt-0.5 break-words">{String(v)}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Priority reason */}
        {Object.keys(reason).length > 0 && (
          <section className="card">
            <div className="kicker mb-3">Priority breakdown</div>
            <pre className="text-[11.5px] leading-relaxed text-ink-muted overflow-x-auto bg-navy-50/40 p-3 rounded-md font-mono">
{JSON.stringify(reason, null, 2)}
            </pre>
          </section>
        )}

        {/* Notes */}
        <section className="card">
          <div className="kicker mb-3">Notes</div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Quick note…"
              className="flex-1 rounded-md bg-white ring-1 ring-line px-3 py-2 text-[13.5px]"
            />
            <button
              type="button"
              disabled={noteSaving || !newNote.trim()}
              onClick={() => startNote(async () => {
                await addLeadNote(lead.id, newNote.trim());
                setNewNote('');
              })}
              className="btn-ghost btn-sm disabled:opacity-60"
            >
              {noteSaving ? 'Adding…' : 'Add'}
            </button>
          </div>
          {notes.length === 0 ? (
            <p className="text-ink-subtle text-[12.5px]">No notes yet.</p>
          ) : (
            <ul className="space-y-3">
              {notes.map((n) => (
                <li key={n.id} className="border-l-2 border-amber pl-3 py-1">
                  <div className="text-[14px] text-ink whitespace-pre-wrap">{n.body}</div>
                  <div className="text-[10.5px] font-mono text-ink-subtle mt-1">
                    {n.author ?? 'admin'} · {new Date(n.created_at).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Sidebar */}
      <aside className="space-y-5">
        {/* Stage */}
        <section className="card">
          <div className="kicker mb-2">Stage</div>
          <select
            value={stage}
            onChange={(e) => {
              const next = e.target.value as LeadStage;
              setStage(next);
              startStage(async () => {
                await updateLeadStage(lead.id, next);
              });
            }}
            disabled={stageSaving}
            className="w-full rounded-md bg-white ring-1 ring-line px-3 py-2 text-[14px]"
          >
            {stageOrder.map((s) => (
              <option key={s} value={s}>{stageLabels[s]}</option>
            ))}
          </select>
          {stageSaving && <div className="text-[11px] font-mono text-ink-subtle mt-2">Saving…</div>}
        </section>

        {/* Contact shortcuts */}
        {(ctx.contact_email || ctx.contact_phone || lead.company?.contact_email) && (
          <section className="card">
            <div className="kicker mb-2">Contact</div>
            <ul className="space-y-1.5 text-[13px] font-mono">
              {(ctx.contact_email || lead.company?.contact_email) && (
                <li>
                  <a
                    href={`mailto:${ctx.contact_email || lead.company?.contact_email}`}
                    className="text-ink hover:text-amber-600 no-underline break-all"
                  >
                    ✉  {ctx.contact_email || lead.company?.contact_email}
                  </a>
                </li>
              )}
              {(ctx.contact_phone || lead.company?.contact_phone) && (
                <li>
                  <a
                    href={`tel:${(ctx.contact_phone || lead.company?.contact_phone || '').replace(/\s/g, '')}`}
                    className="text-ink hover:text-amber-600 no-underline"
                  >
                    📞 {ctx.contact_phone || lead.company?.contact_phone}
                  </a>
                </li>
              )}
            </ul>
          </section>
        )}

        {/* Timeline */}
        <section className="card">
          <div className="kicker mb-3">Timeline</div>
          {events.length === 0 ? (
            <p className="text-ink-subtle text-[12.5px]">No events yet.</p>
          ) : (
            <ul className="space-y-2">
              {events.slice(0, 30).map((e) => (
                <li key={e.id} className="text-[12px]">
                  <div className="font-mono text-ink uppercase tracking-[0.06em] text-[10.5px]">{e.event_type}</div>
                  <div className="text-ink-subtle text-[10.5px] font-mono">
                    {new Date(e.created_at).toLocaleString()}
                  </div>
                  {e.detail && Object.keys(e.detail).length > 0 && (
                    <div className="text-ink-muted text-[11.5px] mt-0.5">
                      {Object.entries(e.detail).slice(0, 4).map(([k, v]) => `${k}: ${String(v)}`).join(' · ')}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </aside>
    </div>
  );
}
