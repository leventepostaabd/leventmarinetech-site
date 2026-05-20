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
 * Service image deck — vertical wide showcase that auto-advances
 * through service photos with bilingual headline + kicker overlay.
 *
 * Lives next to the services search/grid; conveys "this is what we do"
 * visually before the customer ever fills the form.
 */
export default function ServiceImageDeck({
  items,
  locale,
  intervalMs = 4500
}: {
  items: Deck[];
  locale: 'en' | 'tr';
  intervalMs?: number;
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
      className="relative h-[78vh] min-h-[520px] max-h-[820px] w-full overflow-hidden rounded-2xl bg-navy-700"
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
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover"
          />
          {/* Navy → transparent gradient for legible text */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-700/95 via-navy-700/35 to-transparent" />

          {/* Overlay text */}
          <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber-400 mb-2">
              {String(idx + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
              {' · '}
              {locale === 'tr' ? 'Servis veriyoruz' : 'We service'}
            </div>
            <h3 className="font-head text-white text-[26px] md:text-[30px] font-bold leading-tight mb-1.5">
              {locale === 'tr' ? active.name_tr : active.name_en}
            </h3>
            <p className="text-white/80 text-[15px] md:text-[16px] leading-snug mb-5 max-w-md">
              {locale === 'tr' ? active.kicker_tr : active.kicker_en}
            </p>
            <Link
              href={`/services/${active.slug}`}
              className="inline-flex items-center gap-2 text-[13px] font-mono uppercase tracking-[0.14em] text-amber hover:text-amber-300 no-underline"
            >
              {locale === 'tr' ? 'Detayını oku' : 'Read more'} →
            </Link>
          </div>
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
