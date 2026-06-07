'use client';

import { motion } from 'framer-motion';
import HeroDoor from './HeroDoor';
import TrustStats from './TrustStats';
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

export default function Hero({ locale, serviceCta, supplyCta }: HeroProps) {
  return (
    <section
      aria-label="Levent Marine — main entrance"
      className="relative w-full overflow-hidden bg-navy-900"
      style={{ height: '100vh' }}
    >
      {/* Split layout — full viewport, no scroll */}
      <div className="grid h-full w-full grid-cols-2">
        <HeroDoor
          side="left"
          image="/hero/servicesmain.webp"
          label={ct(locale, 'nav.service')}
          kicker={ct(locale, 'home.doorServiceKicker')}
          ctaHref="/services"
          ctaLabel={serviceCta ?? ct(locale, 'home.doorServiceCta')}
        />
        <HeroDoor
          side="right"
          image="/hero/supplymain.webp"
          label={ct(locale, 'nav.supply')}
          kicker={ct(locale, 'home.doorSupplyKicker')}
          ctaHref="/supply"
          ctaLabel={supplyCta ?? ct(locale, 'home.doorSupplyCta')}
        />
      </div>

      {/* Soft seam — a gentle feather where the two photos meet (no hard line). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-28 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      {/* Footer hint (proof) — tucked into the very bottom edge. 'About' opens
          the quick-look modal via the global event (F1, no navigation). */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="absolute bottom-4 left-0 right-0 z-30 flex flex-col items-center gap-2 px-6"
      >
        <TrustStats variant="mono" locale={locale} />
        <div className="flex items-center gap-3 font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/55">
          <span>STCW III/6 ETO</span>
          <span aria-hidden>·</span>
          <span>24/7 AOG</span>
          <span aria-hidden>·</span>
          <button
            type="button"
            data-about-trigger
            className="underline-offset-4 transition-colors hover:text-amber hover:underline"
          >
            {locale === 'tr' ? 'Hakkımızda' : 'About'}
          </button>
        </div>
      </motion.div>
    </section>
  );
}
