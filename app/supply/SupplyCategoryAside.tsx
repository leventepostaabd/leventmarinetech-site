'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

export type CatItem = {
  slug: string;
  name: string;
  makers: string;
  cta: string;
  href: string;
  /** Ordered fallback list — first that loads wins, else a soft placeholder. */
  imageSrcs: string[];
};

/**
 * Soft rotating category panel for /supply (right column, narrower than the
 * search). Slowly cross-fades through the category artwork, blends into the
 * white search panel on its left edge, and deep-links each category. The live
 * product search lives in the left column (SupplyShell); this is browse-by-
 * category. Honoured under prefers-reduced-motion (no autoplay).
 */
export default function SupplyCategoryAside({
  items,
  kicker
}: {
  items: CatItem[];
  kicker: string;
}) {
  const [i, setI] = useState(0);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current =
      typeof window !== 'undefined' &&
      !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (reduce.current || items.length < 2) return;
    const id = setInterval(() => setI((x) => (x + 1) % items.length), 5500);
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
          transition={{ opacity: { duration: 1.2, ease: 'easeInOut' }, scale: { duration: 7, ease: 'linear' } }}
          className="absolute inset-0"
        >
          <ProbeImg item={active} />
        </motion.div>
      </AnimatePresence>

      {/* Soft blend into the white search panel on the left edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-white via-white/45 to-transparent"
      />

      {/* Progress dots */}
      <div className="absolute right-4 top-4 z-10 flex gap-1.5">
        {items.map((it, k) => (
          <span
            key={it.slug}
            className={`h-1.5 rounded-full transition-all duration-500 ${k === i ? 'w-5 bg-amber' : 'w-1.5 bg-white/60'}`}
          />
        ))}
      </div>

      {/* Caption — dark glass, deep-links the active category */}
      <Link href={active.href} className="absolute inset-x-0 bottom-0 z-10 block p-6 no-underline">
        <motion.div
          key={`cap-${active.slug}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="rounded-2xl bg-navy-900/70 p-4 text-white shadow-[0_10px_40px_rgba(0,0,0,0.3)] ring-1 ring-white/10 backdrop-blur-md transition hover:bg-navy-900/80"
        >
          <div className="mb-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-amber">{kicker}</div>
          <h3 className="text-[17px] font-extrabold leading-tight text-white">{active.name}</h3>
          <p className="mt-1 line-clamp-1 text-[11.5px] text-white/70">{active.makers}</p>
          <span className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.08em] text-amber">
            {active.cta} →
          </span>
        </motion.div>
      </Link>
    </div>
  );
}

/**
 * Probes each candidate src with a detached Image() before rendering, so a
 * missing stage photo never shows a broken <img>; auto-upgrades when a real
 * file is dropped in /public/supply/stage/.
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
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-blue-100">
      {resolved === '' && (
        <span className="px-8 text-center font-head text-[26px] font-extrabold leading-tight text-slate-400/70">
          {item.name}
        </span>
      )}
    </div>
  );
}
