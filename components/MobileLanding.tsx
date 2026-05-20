'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import EmergencyModal from './EmergencyModal';
import { SITE } from '@/lib/site';

export type MobileLandingProps = {
  locale: 'en' | 'tr';
  slogan?: string;
};

const FALLBACK_SLOGAN = 'Marine Electrical Service & Parts Supply — 24/7 Worldwide';

/**
 * Mobile-only variant: three stacked big buttons (Service / Supply / Emergency).
 * No video, no split — just decisive action targets (F4).
 */
export default function MobileLanding({ locale, slogan }: MobileLandingProps) {
  const [open, setOpen] = useState(false);
  const text = slogan ?? SITE.tagline ?? FALLBACK_SLOGAN;
  const safeSlogan = /24\/7/i.test(text) ? text : FALLBACK_SLOGAN;

  const labels = {
    en: { service: 'Service', supply: 'Supply', emergency: 'Emergency', serviceSub: 'Engineer on board', supplySub: 'Parts on the way', emergencySub: '24/7 worldwide' },
    tr: { service: 'Servis', supply: 'Tedarik', emergency: 'Acil', serviceSub: 'Mühendis gemide', supplySub: 'Parça yolda', emergencySub: '7/24 worldwide' }
  }[locale];

  return (
    <section
      aria-label="Levent Marine — main entrance"
      className="relative flex w-full flex-col bg-navy-900 px-5 py-8 text-white"
      style={{ minHeight: 'calc(100vh - var(--header-h, 72px))' }}
    >
      {/* Slogan */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-1 pt-2"
      >
        <p className="font-head text-[11px] uppercase tracking-[0.22em] text-white/85">
          {safeSlogan}
        </p>
      </motion.div>

      {/* Stacked buttons */}
      <div className="mt-7 flex flex-1 flex-col gap-4">
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

      {/* Bottom trust strip */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-1 pb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">
        <span>STCW III/6 ETO</span>
        <span>{SITE.trust.vessels} vessels</span>
        <span>24/7 AOG</span>
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
