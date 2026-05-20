'use client';
import { useState } from 'react';

export default function UnlistedClient() {
  const [state, setState] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ ok: boolean; id?: string; via?: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function bind(key: string) {
    return {
      value: state[key] ?? '',
      onChange: (e: any) => setState((s) => ({ ...s, [key]: e.target.value }))
    };
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.vesselName && !state.partNumber && !state.description) {
      setErr('Please add at least a vessel name, part number, or description.');
      return;
    }
    if (!state.contactEmail) { setErr('Email is required.'); return; }
    setErr(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/quote-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...state, kind: 'unlisted' })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setDone({ ok: true, id: data?.id, via: 'api' });
    } catch (e: any) {
      const summary = Object.entries(state).map(([k, v]) => `${k}: ${v}`).join('\n');
      const text = encodeURIComponent(`LEVENT MARINE — unlisted part request\n\n${summary}`);
      window.open(`https://wa.me/16193840403?text=${text}`, '_blank', 'noopener');
      setDone({ ok: true, via: 'whatsapp' });
    } finally {
      setSubmitting(false);
    }
  }

  if (done?.ok) return (
    <div className="card border-l-4 border-l-green-600 max-w-2xl">
      <h2 className="mb-2">Got it.</h2>
      <p className="text-ink-muted">We&apos;ll come back the same business day. Reference: <span className="font-mono">{done.id ?? 'sent via WhatsApp'}</span></p>
    </div>
  );

  return (
    <form onSubmit={submit} className="grid gap-4 max-w-2xl">
      <div className="grid sm:grid-cols-2 gap-3">
        <div><label className="field-label">Vessel name</label><input className="field-input" {...bind('vesselName')} /></div>
        <div><label className="field-label">IMO</label><input className="field-input" {...bind('imo')} /></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div><label className="field-label">Port</label><input className="field-input" {...bind('port')} /></div>
        <div><label className="field-label">Required by</label><input className="field-input" type="date" {...bind('requiredBy')} /></div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <div><label className="field-label">Maker / brand</label><input className="field-input" {...bind('brand')} /></div>
        <div><label className="field-label">Model</label><input className="field-input" {...bind('model')} /></div>
        <div><label className="field-label">Part number</label><input className="field-input" {...bind('partNumber')} /></div>
      </div>
      <div className="grid sm:grid-cols-[2fr_1fr] gap-3">
        <div><label className="field-label">Product description *</label>
        <input className="field-input" placeholder="What is it? Voltage, type, where it sits on the ship" {...bind('description')} /></div>
        <div><label className="field-label">Quantity</label><input className="field-input" type="number" min={1} defaultValue={1} {...bind('quantity')} /></div>
      </div>
      <div><label className="field-label">Notes</label>
        <textarea className="field-input min-h-[100px]" {...bind('notes')} /></div>
      <p className="text-[12px] text-ink-subtle">Upload photos/nameplate via WhatsApp +1 619 384 0403 after submission (we'll thread it to your reference).</p>

      <div className="border-t border-line pt-4 mt-2 grid sm:grid-cols-2 gap-3">
        <div><label className="field-label">Your name *</label><input className="field-input" required {...bind('contactName')} /></div>
        <div><label className="field-label">Email *</label><input className="field-input" type="email" required {...bind('contactEmail')} /></div>
      </div>

      {err && <div className="text-[13px] font-mono text-red-600">{err}</div>}
      <button type="submit" disabled={submitting} className="btn-accent btn-lg w-fit disabled:opacity-60">{submitting ? 'Sending…' : 'Send request'}</button>
    </form>
  );
}
