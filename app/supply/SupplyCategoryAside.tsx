'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

export type CatItem = {
  slug: string;
  /** Headline (semibold). */
  name: string;
  /** One/two-line description (normal weight). */
  description: string;
  href: string;
  /** Ordered fallback list — first that loads wins, else a soft placeholder. */
  imageSrcs: string[];
};

/**
 * Supply left showcase — slowly cross-fades premium promo photos (ports,
 * smart products, quality, replacements). Minimalist, Apple/Siemens-style:
 * a left-aligned semibold headline + a calm two-line description sit in the
 * upper area (clear of the site header), dark ink directly on the artwork —
 * no card, scrim, badge or decoration. The whole panel deep-links. Honoured
 * under prefers-reduced-motion (no autoplay).
 */
export default function SupplyCategoryAside({ items }: { items: CatItem[] }) {
  const [i, setI] = useState(0);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current =
      typeof window !== 'undefined' &&
      !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (reduce.current || items.length < 2) return;
    const id = setInterval(() => setI((x) => (x + 1) % items.length), 6000);
    return () => clearInterval(id);
  }, [items.length]);

  const active = items[i];
  if (!active) return null;

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-100">
      <AnimatePresence initial={false}>
        <motion.div
          key={active.slug}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.2, ease: 'easeInOut' }, scale: { duration: 8, ease: 'linear' } }}
          className="absolute inset-0"
        >
          <ProbeImg item={active} />
        </motion.div>
      </AnimatePresence>

      {/* Soft, wide blend into the theme-tinted search panel on the right edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-48 bg-gradient-to-l from-[#EFF4FB] via-[#EFF4FB]/55 to-transparent"
      />

      {/* Whole panel deep-links the active slide */}
      <Link href={active.href} aria-label={active.name} className="absolute inset-0 z-20" />

      {/* Slogan — upper area, clear of the site header; left-aligned, no decoration */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 px-7 pt-28">
        <motion.div
          key={`t-${active.slug}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <h2 className="max-w-[15rem] font-head text-[22px] font-semibold leading-snug text-[#0d1b2e]/90">
            {active.name}
          </h2>
          <p className="mt-3 line-clamp-2 max-w-[17rem] text-[13.5px] font-normal leading-relaxed text-[#0d1b2e]/80">
            {active.description}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Probes each candidate src with a detached Image() before rendering, so a
 * missing photo never shows a broken <img>; auto-upgrades when a real file
 * is dropped in /public/supply/stage/.
 */
function ProbeImg({ item }: { item: CatItem }) {
  const [resolved, setResolved] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setResolved(null);
    const srcs = item.imageSrcs;
    (function tryAt(n: number) {
      if (cancelled) return;
      if (n >= srcs.length) { setResolved(''); return; }
      const probe = new Image();
      probe.onload = () => { if (!cancelled) setResolved(srcs[n]); };
      probe.onerror = () => { if (!cancelled) tryAt(n + 1); };
      probe.src = srcs[n];
    })(0);
    return () => { cancelled = true; };
  }, [item]);

  if (resolved) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={resolved} alt={item.name} className="h-full w-full object-cover" />;
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-blue-100" />
  );
}
