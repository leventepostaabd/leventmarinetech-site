'use client';
import { useState, useMemo, type ReactNode } from 'react';

export type WizardStep = {
  id: string;
  title: string;
  description?: string;
  fields: (state: Record<string, any>) => ReactNode;
  validate?: (state: Record<string, any>) => string | null;
};

export default function Wizard({
  steps,
  initial,
  endpoint,
  successHref,
  whatsappFallback
}: {
  steps: WizardStep[];
  initial?: Record<string, any>;
  endpoint: string;
  successHref?: string;
  /** WhatsApp number (no +) — used when fetch fails so the user still has a path. */
  whatsappFallback?: string;
}) {
  const [idx, setIdx] = useState(0);
  const [state, setState] = useState<Record<string, any>>(initial ?? {});
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<null | { ok: boolean; id?: string; via?: 'api' | 'whatsapp' }>(null);

  const current = steps[idx];
  const last = idx === steps.length - 1;
  const progress = useMemo(() => ((idx + 1) / steps.length) * 100, [idx, steps.length]);

  function update(patch: Record<string, any>) {
    setState((s) => ({ ...s, ...patch }));
  }

  function next() {
    const errMsg = current.validate?.(state) ?? null;
    if (errMsg) { setErr(errMsg); return; }
    setErr(null);
    setIdx((i) => Math.min(i + 1, steps.length - 1));
  }
  function back() { setErr(null); setIdx((i) => Math.max(i - 1, 0)); }

  async function submit() {
    const errMsg = current.validate?.(state) ?? null;
    if (errMsg) { setErr(errMsg); return; }
    setErr(null);
    setSubmitting(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setDone({ ok: true, id: data?.id, via: 'api' });
    } catch (e: any) {
      if (whatsappFallback) {
        const summary = Object.entries(state).map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`).join('\n');
        const text = encodeURIComponent(`LEVENT MARINE — request from web\n\n${summary}`);
        window.open(`https://wa.me/${whatsappFallback}?text=${text}`, '_blank', 'noopener');
        setDone({ ok: true, via: 'whatsapp' });
      } else {
        setErr(e?.message ?? 'Submission failed. Please WhatsApp us.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (done?.ok) {
    return (
      <div className="card border-l-4 border-l-green-600 max-w-2xl">
        <div className="kicker mb-3 !text-green-700 before:!bg-green-600">Request received</div>
        <h2 className="mb-3 text-[24px]">Thanks. We'll come back the same business day.</h2>
        {done.via === 'whatsapp' ? (
          <p className="text-ink-muted leading-relaxed">Our backend was unreachable, so we opened WhatsApp pre-filled with your request. Tap send there and we'll have it.</p>
        ) : (
          <p className="text-ink-muted leading-relaxed">
            Reference: <span className="font-mono text-ink">{done.id ?? '—'}</span><br />
            For AOG, also WhatsApp us at +1 619 384 0403 so we can dispatch faster.
          </p>
        )}
        {successHref && (
          <div className="mt-5">
            <a href={successHref} className="btn-primary btn-md">Continue</a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-[260px_1fr]">
      {/* Progress sidebar */}
      <aside className="md:sticky md:top-24 md:self-start">
        <div className="bg-navy-50 rounded-lg p-5 border border-line">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-subtle mb-3">Step {idx + 1} / {steps.length}</div>
          <div className="h-1 bg-line rounded-full overflow-hidden mb-5">
            <div className="h-full bg-amber transition-all" style={{ width: `${progress}%` }} />
          </div>
          <ol className="space-y-2">
            {steps.map((s, i) => (
              <li key={s.id} className={`flex items-start gap-2 text-[13px] ${i === idx ? 'text-ink font-semibold' : i < idx ? 'text-ink-muted' : 'text-ink-subtle'}`}>
                <span className={`font-mono text-[11px] w-5 ${i < idx ? 'text-green-700' : i === idx ? 'text-amber' : 'text-ink-subtle'}`}>{i < idx ? '✓' : String(i + 1).padStart(2, '0')}</span>
                <span>{s.title}</span>
              </li>
            ))}
          </ol>
        </div>
      </aside>

      {/* Current step */}
      <div>
        <div className="kicker mb-3">Step {idx + 1}</div>
        <h2 className="mb-2 text-[26px]">{current.title}</h2>
        {current.description && <p className="text-ink-muted mb-7 max-w-xl">{current.description}</p>}

        <div className="space-y-4 max-w-xl">{current.fields({ ...state, _update: update })}</div>

        {err && <div className="mt-4 text-[13px] font-mono text-red-600">{err}</div>}

        <div className="mt-8 flex items-center justify-between gap-3 max-w-xl">
          <button onClick={back} disabled={idx === 0 || submitting} className="btn-ghost btn-md disabled:opacity-40 disabled:cursor-not-allowed">← Back</button>
          {last ? (
            <button onClick={submit} disabled={submitting} className="btn-accent btn-lg disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? 'Sending…' : 'Submit request'}
            </button>
          ) : (
            <button onClick={next} className="btn-primary btn-md">Continue →</button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Tiny helper to inject `_update` cleanly into a controlled input. */
export function bind(state: any, key: string) {
  return {
    value: state[key] ?? '',
    onChange: (e: any) => state._update({ [key]: typeof e === 'object' ? e.target.value : e })
  };
}
