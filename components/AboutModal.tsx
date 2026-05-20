'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import CertBadges from './CertBadges';

/**
 * AboutModal — quick-look profile dialog (Y2 — DECISIONS.md).
 *
 * - 4-5 line firm profile
 * - Owner photo placeholder
 * - Cert chips
 * - Florida-based / Wyoming LLC fine print
 * - CTA "Full profile →" linking to /about (the SEO depth page)
 *
 * Usage:
 *   <AboutModal />
 * Toggle externally via `[data-about-trigger]` attribute on any clickable element,
 * or programmatically by dispatching `window.dispatchEvent(new Event('lm:about-open'))`.
 */
export default function AboutModal({ triggerLabel = 'About' }: { triggerLabel?: string }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => setOpen(false), []);
  const openModal = useCallback(() => setOpen(true), []);

  // Bind global open event + delegated trigger attribute
  useEffect(() => {
    const onOpen = () => openModal();
    window.addEventListener('lm:about-open', onOpen);

    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const trig = t.closest('[data-about-trigger]');
      if (trig) {
        e.preventDefault();
        openModal();
      }
    };
    document.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('lm:about-open', onOpen);
      document.removeEventListener('click', onClick);
    };
  }, [openModal]);

  // Esc to close + focus mgmt
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    closeBtnRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="text-[13px] font-mono uppercase tracking-[0.12em] text-ink-muted hover:text-amber-600 underline-offset-4 hover:underline transition"
      >
        {triggerLabel}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="about-modal-title"
        >
          {/* Backdrop */}
          <button
            aria-label="Close about modal"
            onClick={close}
            className="absolute inset-0 bg-navy-700/70 backdrop-blur-sm"
            tabIndex={-1}
          />

          {/* Panel */}
          <div
            ref={dialogRef}
            className="relative w-full max-w-2xl rounded-lg bg-white shadow-xl border border-line overflow-hidden animate-fade-up"
          >
            <div className="grid md:grid-cols-[180px_1fr]">
              {/* Photo placeholder */}
              <div className="hidden md:block bg-navy-700 relative">
                <div className="aspect-square w-full grid place-items-center">
                  <svg viewBox="0 0 80 80" className="w-20 h-20 text-amber/80" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="40" cy="28" r="14" />
                    <path d="M12 72 c0 -16 14 -26 28 -26 s28 10 28 26" />
                  </svg>
                </div>
                <div className="absolute bottom-3 left-3 right-3 font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">
                  Lead ETO
                </div>
              </div>

              {/* Body */}
              <div className="p-6 md:p-7">
                <button
                  ref={closeBtnRef}
                  onClick={close}
                  aria-label="Close"
                  className="absolute top-3 right-3 grid place-items-center w-8 h-8 rounded-full border border-line text-ink-muted hover:bg-navy-50 hover:text-ink"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 2l10 10M12 2L2 12" />
                  </svg>
                </button>

                <div className="kicker mb-2">About — quick look</div>
                <h2 id="about-modal-title" className="text-[22px] mb-3 leading-tight">
                  Marine Electrical Service &amp; Parts Supply &mdash; 24/7 Worldwide
                </h2>

                <p className="text-ink-muted text-[14.5px] leading-relaxed">
                  Florida-based, Wyoming-registered marine electrical desk run by an active
                  STCW III/6 Electro-Technical Officer. 16 years aboard bulkers, tankers, container
                  vessels and offshore units. Engineer on board at any US port within hours;
                  AOG parts shipped same day. Class-aware paperwork on every job.
                </p>

                <div className="mt-4">
                  <CertBadges compact />
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-line">
                  <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-ink-subtle">
                    Florida-based · Wyoming LLC · Worldwide attendance
                  </p>
                  <Link
                    href="/about"
                    onClick={close}
                    className="btn-accent btn-sm no-underline"
                  >
                    Full profile →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
