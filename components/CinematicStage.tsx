'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import InlineHeader from '@/components/InlineHeader';

export type StageItem = {
  slug: string;
  name: string;
  kicker: string;
  summary: string;
  href: string;
  /** Ordered fallback list — first that loads wins, else a soft placeholder. */
  imageSrcs: string[];
};
export type StageGroup = { label: string; items: StageItem[] };

/**
 * Cinematic Stage — the /services experience.
 *
 * One screen, no downward scroll:
 *   - Left: light panel with header, heading, search, and the systems as
 *     interactive cards (grouped by category). Only systems with artwork show.
 *   - Right: an edge-to-edge photo for the active system — clean, no overlay.
 *
 * Self-flowing + interactive: idle cross-fades through systems every ~5s
 * (subtle Ken-Burns); hovering/focusing a card pauses the flow and switches
 * the photo. Honoured under prefers-reduced-motion. The card list scrolls
 * inside its own panel so the shell stays fixed (F1).
 */
export default function CinematicStage({
  locale,
  heading,
  sub,
  searchPlaceholder,
  ctaLabel,
  noMatch,
  groups
}: {
  locale: Locale;
  heading: string;
  sub: string;
  searchPlaceholder: string;
  ctaLabel: string;
  noMatch: string;
  groups: StageGroup[];
}) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(groups[0]?.items[0]?.slug ?? '');
  const [paused, setPaused] = useState(false);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current =
      typeof window !== 'undefined' &&
      !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter((it) =>
          `${it.name} ${it.kicker} ${it.summary}`.toLowerCase().includes(q)
        )
      }))
      .filter((g) => g.items.length > 0);
  }, [groups, query]);

  const flat = useMemo(() => filtered.flatMap((g) => g.items), [filtered]);

  useEffect(() => {
    if (flat.length && !flat.some((it) => it.slug === active)) setActive(flat[0].slug);
  }, [flat, active]);

  useEffect(() => {
    if (paused || reduceMotion.current || flat.length < 2) return;
    const id = setInterval(() => {
      setActive((cur) => {
        const i = flat.findIndex((it) => it.slug === cur);
        return flat[(i + 1) % flat.length].slug;
      });
    }, 5000);
    return () => clearInterval(id);
  }, [paused, flat]);

  const activeItem = flat.find((it) => it.slug === active) ?? flat[0];

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-white lg:grid lg:grid-cols-[minmax(0,45%)_minmax(0,55%)]">
      {/* LEFT — clean cinematic photo (no overlay card) */}
      <aside className="relative hidden h-full overflow-hidden bg-slate-100 lg:block">
        <AnimatePresence initial={false}>
          {activeItem && (
            <motion.div
              key={activeItem.slug}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 0.8, ease: 'easeInOut' }, scale: { duration: 6, ease: 'linear' } }}
              className="absolute inset-0"
            >
              <StageImage item={activeItem} />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Soft blend into the content panel on the right edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-white via-white/45 to-transparent"
        />
      </aside>

      {/* RIGHT — header + heading + search + interactive cards */}
      <div
        className="flex h-full min-h-0 flex-col bg-white"
        style={{ paddingTop: 'env(safe-area-inset-top, 0)' }}
      >
        <div className="relative z-10 shrink-0 bg-white px-5 pb-3 shadow-[0_14px_26px_-18px_rgba(11,31,58,0.4)] md:px-8">
          <InlineHeader locale={locale} />
          <h1 className="mt-1 font-head text-[24px] md:text-[30px] lg:text-[34px] font-extrabold leading-[1.08] tracking-[-0.01em] text-ink">
            {heading}
          </h1>
          <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-ink-muted">{sub}</p>

          <div className="relative mt-4">
            <svg
              aria-hidden
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="w-full rounded-full bg-navy-50/70 pl-11 pr-4 py-3 text-[14px] text-ink placeholder:text-ink-subtle outline-none ring-1 ring-line/60 transition hover:bg-navy-50 focus:bg-white focus:ring-2 focus:ring-amber/50"
            />
          </div>
        </div>

        {/* Cards — scroll inside their own panel */}
        <div
          className="mt-4 flex-1 overflow-y-auto px-5 pb-6 md:px-8"
          onMouseLeave={() => setPaused(false)}
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0) + 1.5rem)' }}
        >
          {flat.length === 0 ? (
            <p className="mt-4 text-[13px] text-ink-muted">{noMatch}</p>
          ) : (
            filtered.map((g) => (
              <div key={g.label} className="mb-5">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-amber-600">
                  {g.label}
                </div>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {g.items.map((it) => {
                    const on = it.slug === active;
                    return (
                      <Link
                        key={it.slug}
                        href={it.href}
                        onMouseEnter={() => { setActive(it.slug); setPaused(true); }}
                        onFocus={() => { setActive(it.slug); setPaused(true); }}
                        className={`group block rounded-xl border p-3.5 no-underline transition ${
                          on
                            ? 'border-amber bg-amber/5 shadow-sm ring-1 ring-amber'
                            : 'border-line bg-white hover:border-amber/50 hover:shadow-sm'
                        }`}
                      >
                        <div className="mb-0.5 font-mono text-[9.5px] uppercase tracking-[0.13em] text-amber-600">
                          {it.kicker}
                        </div>
                        <h3 className="text-[15px] font-bold leading-tight text-ink">{it.name}</h3>
                        <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-ink-muted">
                          {it.summary}
                        </p>
                        <span className="mt-2 inline-flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-[0.08em] text-amber-700">
                          {ctaLabel}
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M5 12h14" /><path d="M13 5l7 7-7 7" />
                          </svg>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Probes each candidate src with a detached Image() before rendering, so a
 * missing stage photo never shows a broken <img>; auto-upgrades when a real
 * file is dropped in /public/services/stage/.
 */
function StageImage({ item }: { item: StageItem }) {
  const [resolved, setResolved] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setResolved(null);
    const srcs = item.imageSrcs;
    (function tryAt(i: number) {
      if (cancelled) return;
      if (i >= srcs.length) { setResolved(''); return; }
      const probe = new Image();
      probe.onload = () => { if (!cancelled) setResolved(srcs[i]); };
      probe.onerror = () => { if (!cancelled) tryAt(i + 1); };
      probe.src = srcs[i];
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
        <span className="px-10 text-center font-head text-[34px] font-extrabold leading-tight text-slate-400/70">
          {item.name}
        </span>
      )}
    </div>
  );
}
