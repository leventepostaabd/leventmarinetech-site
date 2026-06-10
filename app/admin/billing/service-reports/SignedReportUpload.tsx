'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadSignedReport } from '../_actions';

export default function SignedReportUpload({ id, signed }: { id: string; signed: boolean }) {
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      await uploadSignedReport(id, fd);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Hata');
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = '';
    }
  }

  return (
    <>
      <input ref={ref} type="file" accept="application/pdf,image/*" className="hidden" onChange={onFile} aria-label="İmzalı rapor yükle" />
      <button type="button" className="btn-ghost btn-sm" disabled={busy} onClick={() => ref.current?.click()}>
        {busy ? '…' : signed ? 'İmzalıyı değiştir' : 'İmzalı yükle'}
      </button>
    </>
  );
}
