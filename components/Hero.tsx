'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import HeroDoor from './HeroDoor';
import EmergencyModal from './EmergencyModal';
import TrustStats from './TrustStats';
import { SITE } from '@/lib/site';
import { ct } from '@/lib/i18n-client';

export type HeroProps = {
  locale: Locale;
  /** Slogan from i18n (preferred). Falls back to P4 literal. */
  slogan?: string;
  /** Optional CTA labels override (i18n). */
  serviceCta?: string;
  supplyCta?: string;
  emergencyCta?: string;
};

const FALLBACK_SLOGAN = 'Marine Electrical Service & Parts Supply — 24/7 Worldwide';

export default function Hero({
  locale,
  slogan,
  serviceCta,
  supplyCta,
  emergencyCta
}: HeroProps) {
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  return (
    <section
      aria-label="Levent Marine — main entrance"
      className="relative w-full overflow-hidden bg-navy-900"
      style={{ height: '100vh' }}
    >
      {/* Slogan now lives in the global TopBar — no top ribbon needed here. */}

      {/* Split layout — full viewport, no scroll */}
      <div className="grid h-full w-full grid-cols-2">
        <HeroDoor
          side="left"
          /* User-provided main artwork for the Service door — Wave 4 swap. */
          image="/hero/servicesmain.png"
          label={ct(locale, 'nav.service')}
          kicker={ct(locale, 'home.doorServiceKicker')}
          ctaHref="/service-wizard"
          ctaLabel={serviceCta ?? ct(locale, 'home.doorServiceCta')}
        />
        <HeroDoor
          side="right"
          /* User-provided main artwork for the Supply door — Wave 4 swap. */
          image="/hero/supplymain.png"
          label={ct(locale, 'nav.supply')}
          kicker={ct(locale, 'home.doorSupplyKicker')}
          ctaHref="/supply"
          ctaLabel={supplyCta ?? ct(locale, 'home.doorSupplyCta')}
        />
      </div>

      {/* Decorative seam between doors — amber-cored glowing divider that points
          up toward the framed logo badge in the TopBar. */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 z-10 -translate-x-1/2">
        <div className="h-full w-[3px] bg-gradient-to-b from-white/0 via-white/30 to-white/0 shadow-[0_0_18px_2px_rgba(245,165,36,0.3)]" />
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-amber/60 to-transparent" />
      </div>

      {/* Compact pulsing emergency button — lower, smaller, less visual weight */}
      <div className="pointer-events-none absolute inset-x-0 z-20 flex justify-center" style={{ bottom: 'calc(48px + env(safe-area-inset-bottom))' }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          className="pointer-events-auto relative"
        >
          <span aria-hidden className="lm-pulse-ring lm-pulse-ring--1" />
          <span aria-hidden className="lm-pulse-ring lm-pulse-ring--2" />

          <button
            type="button"
            onClick={() => setEmergencyOpen(true)}
            aria-label={locale === 'tr' ? 'Acil — 3 seçenek aç' : 'Emergency — open 3-option modal'}
            className="relative z-10 inline-flex items-center gap-2.5 rounded-full bg-red-600 px-5 py-2.5 text-white shadow-[0_10px_30px_rgba(239,68,68,0.45)] ring-2 ring-white/20 transition-transform duration-150 hover:scale-[1.04] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
            <span className="font-head text-[13px] font-extrabold uppercase tracking-[0.16em]">
              {emergencyCta ?? (locale === 'tr' ? 'Acil' : 'Emergency')}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/85">24/7</span>
          </button>
        </motion.div>
      </div>

      {/* Footer hint (legibility / proof) — tucked into the very bottom edge.
          'About' button uses the global event so the modal opens without leaving
          this no-scroll viewport (F1 decision). */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="absolute bottom-3 left-0 right-0 z-30 px-6 flex flex-col items-center gap-2"
      >
        <TrustStats variant="mono" locale={locale} />
        <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/55 flex items-center gap-3">
          <span>STCW III/6 ETO</span>
          <span aria-hidden>·</span>
          <span>24/7 AOG</span>
          <span aria-hidden>·</span>
          <button
            type="button"
            data-about-trigger
            className="hover:text-amber transition-colors underline-offset-4 hover:underline"
          >
            {locale === 'tr' ? 'Hakkımızda' : 'About'}
          </button>
        </div>
      </motion.div>

      <EmergencyModal
        open={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
        locale={locale}
      />

      {/* Local styles: pulsing rings for the emergency button.
          (CSS is the lightest path here — no Framer loops needed.) */}
      <style jsx>{`
        .lm-pulse-ring {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: rgba(239, 68, 68, 0.55);
          animation: lm-pulse 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          pointer-events: none;
        }
        .lm-pulse-ring--2 {
          animation-delay: 1.1s;
        }
        @keyframes lm-pulse {
          0% {
            transform: scale(0.95);
            opacity: 0.55;
          }
          80% {
            transform: scale(1.7);
            opacity: 0;
          }
          100% {
            transform: scale(1.7);
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .lm-pulse-ring {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
