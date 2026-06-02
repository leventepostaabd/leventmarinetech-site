'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export type HeroDoorProps = {
  side: 'left' | 'right';
  image: string;
  videoSrc?: string;
  /** Pre-resolved (already localised) display strings. */
  label: string;
  ctaHref: string;
  ctaLabel: string;
  /** Optional small kicker text shown above CTA */
  kicker?: string;
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
  label,
  ctaHref,
  ctaLabel,
  kicker
}: HeroDoorProps) {
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
          className="absolute inset-0 h-full w-full object-cover brightness-[0.92] contrast-[1.06] saturate-[1.12] transition-transform duration-[1200ms] group-hover:scale-[1.03]"
          aria-hidden
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center brightness-[0.92] contrast-[1.06] saturate-[1.12] transition-transform duration-[1200ms] group-hover:scale-[1.03]"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}

      {/* Legibility stack — keeps the artwork visible while stopping the busy
          photo from competing with the overlaid UI:
          1) directional wash anchors contrast on the label side,
          2) top scrim sits under the global TopBar (logo / flags / hamburger),
          3) bottom scrim carries the trust stats,
          4) centre radial scrim isolates the white label + CTA. */}
      <div
        aria-hidden
        className={[
          'absolute inset-0',
          side === 'left'
            ? 'bg-gradient-to-br from-navy-900/55 via-navy-900/22 to-navy-900/5'
            : 'bg-gradient-to-bl from-navy-900/55 via-navy-900/22 to-navy-900/5'
        ].join(' ')}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-navy-900/80 via-navy-900/35 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-navy-900/70 via-navy-900/20 to-transparent"
      />

      {/* Soft amber radial accent */}
      <div
        aria-hidden
        className={[
          'absolute -z-0 h-[520px] w-[520px] rounded-full bg-amber/15 blur-3xl',
          side === 'left' ? '-bottom-40 -left-32' : '-bottom-40 -right-32'
        ].join(' ')}
      />

      {/* Foreground — content lifts off the busy photo inside a retro framed
          glass panel (blur + translucent fill + amber corner brackets). */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 text-center">
        <div className="relative rounded-2xl border border-white/20 bg-navy-900/30 px-8 py-9 shadow-[0_10px_50px_rgba(0,0,0,0.4)] backdrop-blur-md md:px-14 md:py-12">
          {/* retro corner brackets */}
          <span aria-hidden className="pointer-events-none absolute left-2.5 top-2.5 h-5 w-5 border-l-2 border-t-2 border-amber/70" />
          <span aria-hidden className="pointer-events-none absolute right-2.5 top-2.5 h-5 w-5 border-r-2 border-t-2 border-amber/70" />
          <span aria-hidden className="pointer-events-none absolute bottom-2.5 left-2.5 h-5 w-5 border-b-2 border-l-2 border-amber/70" />
          <span aria-hidden className="pointer-events-none absolute bottom-2.5 right-2.5 h-5 w-5 border-b-2 border-r-2 border-amber/70" />

        {kicker ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-amber drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)]"
          >
            {kicker}
          </motion.div>
        ) : null}

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.55 }}
          className="font-head text-3xl font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)] sm:text-4xl md:text-5xl lg:text-6xl"
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
      </div>
    </motion.div>
  );
}
