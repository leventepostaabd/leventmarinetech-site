'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import HeroDoor from './HeroDoor';
import EmergencyModal from './EmergencyModal';
import { SITE } from '@/lib/site';

export type HeroProps = {
  locale: 'en' | 'tr';
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

  const text = slogan ?? SITE.tagline ?? FALLBACK_SLOGAN;
  const safeSlogan = /24\/7/i.test(text) ? text : FALLBACK_SLOGAN;

  return (
    <section
      aria-label="Levent Marine — main entrance"
      className="relative w-full overflow-hidden bg-navy-900"
      style={{ height: 'calc(100vh - var(--header-h, 72px))' }}
    >
      {/* Slogan ribbon */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
        className="pointer-events-none absolute left-0 right-0 top-0 z-30 px-6 pt-6 text-center"
      >
        <div className="mx-auto inline-block max-w-4xl">
          <p className="font-head text-[13px] uppercase tracking-[0.22em] text-white/85 md:text-sm">
            {safeSlogan}
          </p>
        </div>
      </motion.div>

      {/* Split layout — full viewport, no scroll */}
      <div className="grid h-full w-full grid-cols-2">
        <HeroDoor
          side="left"
          /* Real legacy engine-room photo — Wave 0 polish. Video swap deferred to Wave 4. */
          image="/hero/engine-room.jpg"
          label_en="Service"
          label_tr="Servis"
          kicker_en="Engineer on board"
          kicker_tr="Mühendis gemide"
          ctaHref="/service-wizard"
          ctaLabel_en="I need service"
          ctaLabel_tr="Servis istiyorum"
          locale={locale}
        />
        <HeroDoor
          side="right"
          /* Real warehouse photo wired Wave 0 polish. Video swap deferred to Wave 4. */
          image="/hero/warehouse.jpg"
          label_en="Supply"
          label_tr="Tedarik"
          kicker_en="Parts on the way"
          kicker_tr="Parça yolda"
          ctaHref="/supply"
          ctaLabel_en="I need parts"
          ctaLabel_tr="Parça istiyorum"
          locale={locale}
        />
      </div>

      {/* Center divider with pulsing emergency button */}
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
        {/* Soft seam line between doors */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/15 to-transparent"
        />

        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="pointer-events-auto relative"
        >
          {/* Pulsing rings */}
          <span aria-hidden className="lm-pulse-ring lm-pulse-ring--1" />
          <span aria-hidden className="lm-pulse-ring lm-pulse-ring--2" />

          <button
            type="button"
            onClick={() => setEmergencyOpen(true)}
            aria-label={locale === 'tr' ? 'Acil — 3 seçenek aç' : 'Emergency — open 3-option modal'}
            className="relative z-10 flex h-32 w-32 flex-col items-center justify-center rounded-full bg-red-600 text-white shadow-[0_18px_60px_rgba(239,68,68,0.55)] ring-4 ring-white/15 transition-transform duration-150 hover:scale-[1.04] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber md:h-36 md:w-36"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
            <div className="mt-1 font-head text-base font-extrabold uppercase tracking-wider md:text-lg">
              {emergencyCta ?? (locale === 'tr' ? 'Acil' : 'Emergency')}
            </div>
            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/90">24/7</div>
          </button>
        </motion.div>
      </div>

      {/* Footer hint (legibility / proof) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="pointer-events-none absolute bottom-3 left-0 right-0 z-30 flex items-center justify-center gap-6 px-6 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/65"
      >
        <span>STCW III/6 ETO</span>
        <span aria-hidden>·</span>
        <span>24/7 AOG</span>
        <span aria-hidden>·</span>
        <span>{SITE.trust.vessels} vessels</span>
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
