'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { SITE } from '@/lib/site';
import { ct } from '@/lib/i18n-client';
import { whatsappUrl } from '@/lib/whatsapp';

export type MobileLandingProps = {
  locale: Locale;
  slogan?: string;
};

/**
 * Mobile-only variant: stacked action targets — Service / Supply / WhatsApp.
 * WhatsApp opens a direct chat with a locale-aware auto message (no modal).
 */
export default function MobileLanding({ locale }: MobileLandingProps) {
  const labels = {
    service: ct(locale, 'nav.service'),
    supply: ct(locale, 'nav.supply'),
    serviceSub: ct(locale, 'home.doorServiceKicker'),
    supplySub: ct(locale, 'home.doorSupplyKicker'),
    whatsappSub: locale === 'tr' ? '7/24 · Anında yanıt' : '24/7 · Instant reply'
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
      <div className="flex flex-1 flex-col gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.45 }}>
          <Link
            href="/services"
            className="flex w-full items-center justify-between rounded-xl bg-amber px-6 py-7 text-navy-700 no-underline shadow-lg transition active:scale-[0.99]"
          >
            <div>
              <div className="font-head text-2xl font-extrabold tracking-tight">{labels.service}</div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-navy-700/80">{labels.serviceSub}</div>
            </div>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14" /><path d="M13 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.45 }}>
          <Link
            href="/supply"
            className="flex w-full items-center justify-between rounded-xl border-2 border-white/30 bg-white/5 px-6 py-7 text-white no-underline backdrop-blur-sm transition active:scale-[0.99]"
          >
            <div>
              <div className="font-head text-2xl font-extrabold tracking-tight">{labels.supply}</div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-white/70">{labels.supplySub}</div>
            </div>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14" /><path d="M13 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        {/* WhatsApp — direct chat, locale-aware auto message (replaces Emergency) */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.45 }}>
          <a
            href={whatsappUrl({ locale, intent: 'general' })}
            target="_blank"
            rel="noreferrer noopener"
            className="flex w-full items-center justify-between rounded-xl bg-[#25D366] px-6 py-7 text-white no-underline shadow-[0_12px_36px_rgba(37,211,102,0.4)] transition active:scale-[0.99]"
          >
            <div className="text-left">
              <div className="font-head text-2xl font-extrabold tracking-tight">WhatsApp</div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-white/90">{labels.whatsappSub}</div>
            </div>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M20.5 3.5A11 11 0 0 0 12 0a11 11 0 0 0-9.5 16.5L0 24l7.7-2.5A11 11 0 1 0 20.5 3.5zM12 21.6a9.6 9.6 0 0 1-4.9-1.4l-.4-.2-4.6 1.5 1.5-4.5-.2-.3a9.6 9.6 0 1 1 8.6 5z" />
            </svg>
          </a>
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
          className="underline-offset-4 transition-colors hover:text-amber hover:underline"
        >
          {locale === 'tr' ? 'Hakkımızda' : 'About'}
        </button>
      </div>
    </section>
  );
}
