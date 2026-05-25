'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

type Deck = {
  slug: string;
  image: string;
  name_en: string;
  name_tr: string;
  kicker_en: string;
  kicker_tr: string;
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
  locale: 'en' | 'tr';
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
            alt={locale === 'tr' ? active.name_tr : active.name_en}
            fill
            priority
            sizes="(min-width: 1024px) 30vw, 100vw"
            className="object-contain object-center"
          />
          {ctaEnabled && (
            <>
              {/* Subtle bottom gradient — only enough to seat the CTA legibly,
                  the artwork already carries its own captions. */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy-700/85 to-transparent" />

              {/* Single CTA — opens the dedicated detail page where the same
                  image is shown again with full content. */}
              <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
                <Link
                  href={`${hrefPrefix}${active.slug}`}
                  className="inline-flex items-center gap-2 rounded-md bg-amber px-4 py-2.5 text-[13px] font-mono font-semibold uppercase tracking-[0.12em] text-navy-700 no-underline shadow-lg transition hover:bg-amber-600"
                >
                  {locale === 'tr'
                    ? readMoreLabel?.tr ?? 'Detayını oku'
                    : readMoreLabel?.en ?? 'Read more'} →
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="absolute right-5 top-5 flex flex-col gap-1.5 z-10">
        {items.map((it, i) => (
          <button
            key={it.slug}
            onClick={() => setIdx(i)}
            aria-label={locale === 'tr' ? it.name_tr : it.name_en}
            className={`block h-6 w-1 rounded-full transition-all ${
              i === idx ? 'bg-amber' : 'bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Pause indicator (silent) */}
      <div
        aria-hidden
        className={`absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 transition ${
          paused ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {locale === 'tr' ? 'duraklatıldı' : 'paused'}
      </div>
    </div>
  );
}
