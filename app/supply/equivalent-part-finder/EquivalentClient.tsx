'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PhotoUpload, { type UploadedFile } from '@/components/PhotoUpload';
import { whatsappUrl } from '@/lib/whatsapp';

export default function EquivalentClient() {
  const params = useSearchParams();
  const [s, setS] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ ok: boolean; id?: string; via?: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const q = params.get('q');
    const product = params.get('product');
    if (q) setS((x) => ({ ...x, originalPartNumber: q }));
    if (product) setS((x) => ({ ...x, originalPartNumber: product }));
  }, [params]);

  function b(k: string) {
    return { value: s[k] ?? '', onChange: (e: any) => setS((x) => ({ ...x, [k]: e.target.value })) };
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!s.originalPartNumber && !s.equipmentType && (s.attachments?.length ?? 0) === 0) {
      setErr('Enter at least the original part number, equipment type, or upload a photo.');
      return;
    }
    if (!s.contactEmail) { setErr('Email is required.'); return; }
    setErr(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/quote-request', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...s, kind: 'equivalent' })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setDone({ ok: true, id: data?.id });
    } catch {
      const description = Object.entries(s)
        .filter(([k]) => k !== 'attachments')
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n');
      window.open(
        whatsappUrl({
          intent: 'supply',
          brand: s.originalBrand,
          partNumber: s.originalPartNumber,
          vessel: s.vesselName,
          imo: s.imo,
          port: s.port,
          description: `Equivalent finder request:\n${description}`
        }),
        '_blank',
        'noopener'
      );
      setDone({ ok: true, via: 'whatsapp' });
    } finally {
      setSubmitting(false);
    }
  }

  if (done?.ok) return (
    <div className="card border-l-4 border-l-green-600 max-w-2xl">
      <h2 className="mb-2">Cross-reference request received.</h2>
      <p className="text-ink-muted">
        We&apos;ll come back with one or more compatible candidates plus an engineering note. Same business day.
      </p>
    </div>
  );

  return (
    <form onSubmit={submit} className="grid gap-4 max-w-2xl">
      <div className="grid sm:grid-cols-2 gap-3">
        <div><label className="field-label">Original maker</label><input className="field-input" {...b('originalBrand')} /></div>
        <div><label className="field-label">Original part number</label><input className="field-input" {...b('originalPartNumber')} /></div>
      </div>
      <div>
        <label className="field-label">Equipment type / where it sits</label>
        <input className="field-input" placeholder="e.g. Generator AVR, Bridge gyro, Fire panel zone module" {...b('equipmentType')} />
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <div><label className="field-label">Voltage</label><input className="field-input" placeholder="e.g. 24V DC" {...b('voltage')} /></div>
        <div><label className="field-label">Current / power</label><input className="field-input" {...b('current')} /></div>
        <div><label className="field-label">Other specs</label><input className="field-input" placeholder="IP rating, frequency, ..." {...b('specs')} /></div>
      </div>
      <div>
        <label className="field-label">Shipboard application</label>
        <input className="field-input" placeholder="e.g. Auxiliary 1 generator field exciter on a Handymax" {...b('application')} />
      </div>
      <div>
        <label className="field-label">Failure description (helpful for compatibility)</label>
        <textarea className="field-input min-h-[80px]" {...b('failureDescription')} />
      </div>

      <div>
        <label className="field-label">Nameplate photo (gold standard for cross-reference)</label>
        <PhotoUpload
          prefix="equivalent"
          onChange={(files: UploadedFile[]) => setS((x) => ({ ...x, attachments: files }))}
        />
      </div>

      <div className="border-t border-line pt-4 mt-2 grid sm:grid-cols-3 gap-3">
        <div><label className="field-label">Vessel name</label><input className="field-input" {...b('vesselName')} /></div>
        <div><label className="field-label">IMO</label><input className="field-input" {...b('imo')} /></div>
        <div><label className="field-label">Port</label><input className="field-input" {...b('port')} /></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div><label className="field-label">Your name *</label><input className="field-input" required {...b('contactName')} /></div>
        <div><label className="field-label">Email *</label><input className="field-input" type="email" required {...b('contactEmail')} /></div>
      </div>

      <div className="card bg-navy-50 border-l-4 border-l-amber text-[13px] text-ink-muted leading-relaxed">
        <strong className="text-ink block mb-1">Compatibility disclaimer</strong>
        Every equivalent we propose comes with a note documenting where it matches the original and where it differs. Final acceptance must be confirmed by the vessel&apos;s technical team. We don&apos;t ship an alternative without an explicit go-ahead.
      </div>

      {err && <div className="text-[13px] font-mono text-red-600">{err}</div>}
      <button type="submit" disabled={submitting} className="btn-accent btn-lg w-fit disabled:opacity-60">
        {submitting ? 'Sending…' : 'Find an equivalent'}
      </button>
    </form>
  );
}
