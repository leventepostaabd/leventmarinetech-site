'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { ct } from '@/lib/i18n-client';

type Deck = {
  slug: string;
  image: string;
  /** Pre-resolved (already localised) display strings. */
  name: string;
  kicker: string;
};

/**
 * Service / supply image deck — vertical wide showcase that auto-advances
 * through items with bilingual headline + kicker overlay.
 *
 * Lives next to the services search/grid and the supply grid; conveys
 * "this is what we do" visually before the customer ever fills the form.
 */
export default function ServiceImageDeck({
  items,
  locale,
  intervalMs = 4500,
  fillParent = false,
  hrefPrefix = '/services/',
  readMoreLabel,
  ctaEnabled = true
}: {
  items: Deck[];
  locale: Locale;
  intervalMs?: number;
  /** When true, the deck fills the parent's height edge-to-edge (no rounded
      corners, no max-height) — used by the wizard/services right column. */
  fillParent?: boolean;
  /** Path prefix before the slug. Defaults to /services/. Pass /supply/category/
      to reuse this deck on the supply page. Ignored when ctaEnabled is false. */
  hrefPrefix?: string;
  /** Localised CTA label override. Defaults to "Read more" / "Detayını oku". */
  readMoreLabel?: { en: string; tr: string };
  /** When false, the deck is pure showcase — no link / button on the artwork.
      Used on /supply where the customer doesn't need to navigate into a
      category page; the artwork is marketing only. */
  ctaEnabled?: boolean;
}) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (paused || items.length < 2) return;
    timerRef.current = setTimeout(() => {
      setIdx((i) => (i + 1) % items.length);
    }, intervalMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [idx, paused, items.length, intervalMs]);

  if (!items.length) return null;
  const active = items[idx];

  return (
    <div
      className={`relative w-full overflow-hidden bg-navy-700 ${
        fillParent ? 'h-full' : 'h-[78vh] min-h-[520px] max-h-[820px] rounded-2xl'
      }`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label={locale === 'tr' ? 'Hizmet vitrini' : 'Service showcase'}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={active.slug}
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={active.image}
            alt={active.name}
            fill
            priority
            sizes="(min-width: 1024px) 30vw, 100vw"
            className="object-contain object-center"
          />
          {ctaEnabled && (
            <>
              {/* Subtle top gradient — seats the CTA legibly at the top, clear
                  of the captions baked into the lower half of the artwork. */}
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-navy-700/85 to-transparent" />

              {/* Single CTA — top-right, over the photo area rather than the
                  baked-in captions below. Opens the detail page. */}
              <div className="absolute right-0 top-0 p-5 md:p-6 z-20">
                <Link
                  href={`${hrefPrefix}${active.slug}`}
                  className="inline-flex items-center gap-2 rounded-md bg-amber px-4 py-2.5 text-[13px] font-mono font-semibold uppercase tracking-[0.12em] text-navy-700 no-underline shadow-lg transition hover:bg-amber-600"
                >
                  {readMoreLabel
                    ? (locale === 'tr' ? readMoreLabel.tr : readMoreLabel.en)
                    : ct(locale, 'services.details')} →
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress dots — bottom-right, clear of the top CTA. */}
      <div className="absolute right-5 bottom-5 flex flex-col gap-1.5 z-10">
        {items.map((it, i) => (
          <button
            key={it.slug}
            onClick={() => setIdx(i)}
            aria-label={it.name}
            className={`block h-6 w-1 rounded-full transition-all ${
              i === idx ? 'bg-amber' : 'bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Pause indicator (silent) */}
      <div
        aria-hidden
        className={`absolute left-5 bottom-5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 transition ${
          paused ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {locale === 'tr' ? 'duraklatıldı' : 'paused'}
      </div>
    </div>
  );
}
