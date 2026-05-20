'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export type HeroDoorProps = {
  side: 'left' | 'right';
  image: string;
  videoSrc?: string;
  label_en: string;
  label_tr: string;
  ctaHref: string;
  ctaLabel_en: string;
  ctaLabel_tr: string;
  locale: 'en' | 'tr';
  /** Optional small kicker text shown above CTA */
  kicker_en?: string;
  kicker_tr?: string;
};

/**
 * One half of the split-screen hero.
 * - Renders an image (placeholder) — swap for <video> when assets are ready.
 * - Centered CTA button with subtle reveal animation.
 * - Responsive: collapses to a stacked block on mobile (parent decides visibility).
 */
export default function HeroDoor({
  side,
  image,
  videoSrc,
  label_en,
  label_tr,
  ctaHref,
  ctaLabel_en,
  ctaLabel_tr,
  locale,
  kicker_en,
  kicker_tr
}: HeroDoorProps) {
  const label = locale === 'tr' ? label_tr : label_en;
  const ctaLabel = locale === 'tr' ? ctaLabel_tr : ctaLabel_en;
  const kicker = locale === 'tr' ? kicker_tr : kicker_en;
  const fromX = side === 'left' ? -32 : 32;

  return (
    <motion.div
      initial={{ opacity: 0, x: fromX }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      className="group relative overflow-hidden bg-navy-700"
    >
      {/* Media layer (placeholder image now; <video> later) */}
      {videoSrc ? (
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          poster={image}
          className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-[1200ms] group-hover:scale-[1.03]"
          aria-hidden
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-[1200ms] group-hover:scale-[1.03]"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}

      {/* Color wash for legibility */}
      <div
        aria-hidden
        className={[
          'absolute inset-0',
          side === 'left'
            ? 'bg-gradient-to-br from-navy-900/85 via-navy-700/60 to-navy-700/30'
            : 'bg-gradient-to-bl from-navy-900/85 via-navy-700/60 to-navy-700/30'
        ].join(' ')}
      />

      {/* Soft amber radial accent */}
      <div
        aria-hidden
        className={[
          'absolute -z-0 h-[520px] w-[520px] rounded-full bg-amber/15 blur-3xl',
          side === 'left' ? '-bottom-40 -left-32' : '-bottom-40 -right-32'
        ].join(' ')}
      />

      {/* Foreground */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 text-center">
        {kicker ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-amber"
          >
            {kicker}
          </motion.div>
        ) : null}

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.55 }}
          className="font-head text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
        >
          {label}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.55 }}
          className="mt-7"
        >
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-3 rounded-md bg-amber px-7 py-4 font-head text-base font-semibold uppercase tracking-wide text-navy-700 no-underline shadow-lg transition-all duration-200 hover:bg-amber-600 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-navy-700 md:text-lg"
          >
            <span>{ctaLabel}</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12h14" />
              <path d="M13 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
