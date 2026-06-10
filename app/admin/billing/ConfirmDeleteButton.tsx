'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Reusable delete button with a detailed confirmation dialog — re-shows exactly
 * which record is being deleted (number, customer, amount…) so nothing is
 * removed by accident. `action` is a server action bound to the row id.
 */
export default function ConfirmDeleteButton({
  id,
  action,
  heading,
  details,
  label = 'Sil'
}: {
  id: string;
  action: (id: string) => Promise<void>;
  heading: string;
  details: { k: string; v: string }[];
  label?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function go() {
    setBusy(true);
    try {
      await action(id);
      setOpen(false);
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Silinemedi');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button type="button" className="btn-ghost btn-sm text-red-600" onClick={() => setOpen(true)}>{label}</button>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden />
          <div className="relative w-[min(440px,95vw)] rounded-2xl bg-white p-5 shadow-2xl">
            <div className="mb-2 flex items-center gap-2 text-red-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 9v4" /><path d="M12 17h.01" />
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              </svg>
              <h3 className="text-[16px] font-bold">{heading}</h3>
            </div>
            <p className="mb-3 text-[13px] text-ink-muted">
              Aşağıdaki kayıt <strong className="text-ink">kalıcı olarak silinecek</strong>. Bu işlem geri alınamaz.
            </p>
            <div className="rounded-lg bg-navy-50/60 p-3 text-[13px] ring-1 ring-line">
              {details.map((d) => (
                <div key={d.k} className="flex justify-between gap-3 py-0.5">
                  <span className="text-ink-subtle">{d.k}</span>
                  <span className="text-right font-medium text-ink">{d.v}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="btn-ghost btn-md" onClick={() => setOpen(false)}>Vazgeç</button>
              <button type="button" className="btn-md rounded-md bg-red-600 px-4 text-white transition hover:bg-red-700 disabled:opacity-50" disabled={busy} onClick={go}>
                {busy ? 'Siliniyor…' : 'Evet, sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
