'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import EmergencyModal from './EmergencyModal';
import { SITE } from '@/lib/site';
import { ct } from '@/lib/i18n-client';

export type MobileLandingProps = {
  locale: Locale;
  slogan?: string;
};

/**
 * Mobile-only variant: three stacked big buttons (Service / Supply / Emergency).
 * No video, no split — just decisive action targets (F4). Slogan stays in
 * the global TopBar so it isn't repeated here.
 */
export default function MobileLanding({ locale }: MobileLandingProps) {
  const [open, setOpen] = useState(false);

  const labels = {
    service: ct(locale, 'nav.service'),
    supply: ct(locale, 'nav.supply'),
    emergency: ct(locale, 'nav.emergency'),
    serviceSub: ct(locale, 'home.doorServiceKicker'),
    supplySub: ct(locale, 'home.doorSupplyKicker'),
    emergencySub: '24/7 worldwide'
  };

  return (
    <section
      aria-label="Levent Marine — main entrance"
      className="relative flex w-full flex-col bg-navy-900 px-5 pb-[calc(env(safe-area-inset-bottom)+1rem)] text-white"
      style={{
        minHeight: '100vh',
        paddingTop: 'calc(var(--lm-topbar-h, 56px) + 1.25rem)'
      }}
    >
      {/* Slogan moved into the global TopBar — no duplicate ribbon here. */}

      {/* Stacked buttons */}
      <div className="flex flex-1 flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.45 }}
        >
          <Link
            href="/service-wizard"
            className="flex w-full items-center justify-between rounded-xl bg-amber px-6 py-7 text-navy-700 no-underline shadow-lg transition active:scale-[0.99]"
          >
            <div>
              <div className="font-head text-2xl font-extrabold tracking-tight">{labels.service}</div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-navy-700/80">
                {labels.serviceSub}
              </div>
            </div>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14" />
              <path d="M13 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.45 }}
        >
          <Link
            href="/supply"
            className="flex w-full items-center justify-between rounded-xl border-2 border-white/30 bg-white/5 px-6 py-7 text-white no-underline backdrop-blur-sm transition active:scale-[0.99]"
          >
            <div>
              <div className="font-head text-2xl font-extrabold tracking-tight">{labels.supply}</div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-white/70">
                {labels.supplySub}
              </div>
            </div>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14" />
              <path d="M13 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.45 }}
          className="relative"
        >
          {/* Pulse halo */}
          <span aria-hidden className="lm-m-pulse" />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative z-10 flex w-full items-center justify-between rounded-xl bg-red-600 px-6 py-7 text-white shadow-[0_12px_36px_rgba(239,68,68,0.4)] transition active:scale-[0.99]"
          >
            <div className="text-left">
              <div className="font-head text-2xl font-extrabold tracking-tight">{labels.emergency}</div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-white/90">
                {labels.emergencySub}
              </div>
            </div>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
          </button>
        </motion.div>
      </div>

      {/* Bottom trust strip — About trigger opens the quick-look modal */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-1 pb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">
        <span>STCW III/6 ETO</span>
        <span>{SITE.trust.vessels} vessels</span>
        <span>24/7 AOG</span>
        <button
          type="button"
          data-about-trigger
          className="hover:text-amber transition-colors underline-offset-4 hover:underline"
        >
          {locale === 'tr' ? 'Hakkımızda' : 'About'}
        </button>
      </div>

      <EmergencyModal open={open} onClose={() => setOpen(false)} locale={locale} />

      <style jsx>{`
        .lm-m-pulse {
          position: absolute;
          inset: 0;
          border-radius: 0.75rem;
          background: rgba(239, 68, 68, 0.5);
          animation: lm-m-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          pointer-events: none;
        }
        @keyframes lm-m-pulse {
          0% {
            transform: scale(1);
            opacity: 0.45;
          }
          80% {
            transform: scale(1.04);
            opacity: 0;
          }
          100% {
            transform: scale(1.04);
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .lm-m-pulse {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
