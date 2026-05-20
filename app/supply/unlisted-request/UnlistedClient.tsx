'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PhotoUpload, { type UploadedFile } from '@/components/PhotoUpload';

export default function UnlistedClient() {
  const params = useSearchParams();
  const [state, setState] = useState<Record<string, any>>({ quantity: 1 });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ ok: boolean; id?: string; via?: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Seed description from a search query if user landed here from the catalog search.
  useEffect(() => {
    const q = params.get('q');
    if (q) setState((s) => ({ ...s, description: q }));
  }, [params]);

  function bind(key: string) {
    return {
      value: state[key] ?? '',
      onChange: (e: any) => setState((s) => ({ ...s, [key]: e.target.value }))
    };
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const hasAnyContent =
      state.vesselName || state.partNumber || state.description || (state.attachments?.length ?? 0) > 0;
    if (!hasAnyContent) {
      setErr('Please add at least a vessel name, part number, description, or photo.');
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
    } catch {
      const summary = Object.entries(state)
        .filter(([k]) => k !== 'attachments')
        .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
        .join('\n');
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
      <p className="text-ink-muted">
        We&apos;ll come back the same business day. Reference:{' '}
        <span className="font-mono">{done.id ?? 'sent via WhatsApp'}</span>
      </p>
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
        <div>
          <label className="field-label">Product description *</label>
          <input
            className="field-input"
            placeholder="What is it? Voltage, type, where it sits on the ship"
            {...bind('description')}
          />
        </div>
        <div>
          <label className="field-label">Quantity</label>
          <input
            className="field-input"
            type="number"
            min={1}
            value={state.quantity ?? 1}
            onChange={(e) => setState((s) => ({ ...s, quantity: parseInt(e.target.value, 10) || 1 }))}
          />
        </div>
      </div>
      <div>
        <label className="field-label">Notes</label>
        <textarea className="field-input min-h-[100px]" {...bind('notes')} />
      </div>

      <div>
        <label className="field-label">Nameplate / panel photos (up to 5)</label>
        <PhotoUpload
          prefix="unlisted"
          onChange={(files: UploadedFile[]) => setState((s) => ({ ...s, attachments: files }))}
        />
      </div>

      <div className="border-t border-line pt-4 mt-2 grid sm:grid-cols-2 gap-3">
        <div><label className="field-label">Your name *</label><input className="field-input" required {...bind('contactName')} /></div>
        <div><label className="field-label">Email *</label><input className="field-input" type="email" required {...bind('contactEmail')} /></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div><label className="field-label">WhatsApp</label><input className="field-input" placeholder="+1 ..." {...bind('contactWhatsapp')} /></div>
        <div><label className="field-label">Company / fleet</label><input className="field-input" {...bind('company')} /></div>
      </div>

      {err && <div className="text-[13px] font-mono text-red-600">{err}</div>}
      <button type="submit" disabled={submitting} className="btn-accent btn-lg w-fit disabled:opacity-60">
        {submitting ? 'Sending…' : 'Send request'}
      </button>
    </form>
  );
}
