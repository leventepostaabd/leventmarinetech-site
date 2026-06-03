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
  /** Ordered fallback list — first that loads wins; else a soft placeholder. */
  imageSrcs: string[];
};
export type StageGroup = { label: string; items: StageItem[] };

/**
 * Cinematic Stage — the /services (and /supply) experience.
 *
 * One screen, no downward scroll:
 *   - Left: light panel with header, heading, search, and a grouped system index.
 *   - Right: an edge-to-edge cinematic photo stage for the active system, with a
 *     dark glass caption + CTA over the (soft, light) artwork.
 *
 * Self-flowing + interactive: when idle the stage cross-fades through systems
 * every ~5s (subtle Ken-Burns). Hovering/focusing an index row pauses the flow
 * and jumps the stage to that system; leaving the index resumes it. Honoured
 * under prefers-reduced-motion (no autoplay). The index scrolls inside its own
 * panel so the page shell stays fixed (F1).
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

  // Keep the active system valid within the filtered set.
  useEffect(() => {
    if (flat.length && !flat.some((it) => it.slug === active)) setActive(flat[0].slug);
  }, [flat, active]);

  // Idle auto-flow.
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
    <div className="h-screen max-h-screen overflow-hidden bg-white lg:grid lg:grid-cols-[minmax(0,38%)_minmax(0,62%)]">
      {/* LEFT — light index panel */}
      <div
        className="flex h-full min-h-0 flex-col border-r border-line bg-white"
        style={{ paddingTop: 'env(safe-area-inset-top, 0)' }}
      >
        <div className="shrink-0 px-5 md:px-8">
          <InlineHeader locale={locale} />
          <h1 className="mt-1 font-head text-[24px] md:text-[30px] lg:text-[34px] font-extrabold leading-[1.08] tracking-[-0.01em] text-ink">
            {heading}
          </h1>
          <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-ink-muted">{sub}</p>

          {/* Search */}
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

        {/* Grouped index — scrolls inside its own panel */}
        <div
          className="mt-3 flex-1 overflow-y-auto px-5 pb-6 md:px-8"
          onMouseLeave={() => setPaused(false)}
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0) + 1.5rem)' }}
        >
          {flat.length === 0 ? (
            <p className="mt-4 text-[13px] text-ink-muted">{noMatch}</p>
          ) : (
            filtered.map((g) => (
              <div key={g.label} className="mb-4">
                <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-amber-600">
                  {g.label}
                </div>
                <ul className="space-y-0.5">
                  {g.items.map((it) => {
                    const on = it.slug === active;
                    return (
                      <li key={it.slug}>
                        <Link
                          href={it.href}
                          onMouseEnter={() => { setActive(it.slug); setPaused(true); }}
                          onFocus={() => { setActive(it.slug); setPaused(true); }}
                          className={`group flex items-center justify-between gap-3 rounded-lg px-3 py-2 no-underline transition ${
                            on ? 'bg-navy-700 text-white shadow-sm' : 'text-ink-muted hover:bg-navy-50 hover:text-ink'
                          }`}
                        >
                          <span className="truncate text-[14px] font-semibold">{it.name}</span>
                          <svg
                            width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden
                            className={`flex-shrink-0 transition ${on ? 'text-amber opacity-100' : 'opacity-0 group-hover:opacity-50'}`}
                          >
                            <path d="M5 12h14" /><path d="M13 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT — cinematic stage (lg+ only) */}
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

        {/* Caption — dark glass over the soft, light artwork */}
        {activeItem && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-8">
            <motion.div
              key={`cap-${activeItem.slug}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
              className="pointer-events-auto max-w-md rounded-2xl bg-navy-900/70 p-5 text-white shadow-[0_10px_40px_rgba(0,0,0,0.3)] ring-1 ring-white/10 backdrop-blur-md"
            >
              <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-amber">
                {activeItem.kicker}
              </div>
              <h2 className="text-[22px] font-extrabold leading-tight text-white">{activeItem.name}</h2>
              <p className="mt-1.5 line-clamp-2 text-[13px] text-white/75">{activeItem.summary}</p>
              <Link href={activeItem.href} className="btn-accent btn-sm mt-3 no-underline">
                {ctaLabel} →
              </Link>
            </motion.div>
          </div>
        )}
      </aside>
    </div>
  );
}

/**
 * Stage image with an ordered fallback chain. Tries each src in turn; if all
 * fail it renders a soft light placeholder so the stage is never broken.
 * Re-mounts per system (keyed by parent), so the index resets automatically.
 */
function StageImage({ item }: { item: StageItem }) {
  // null = probing, '' = none loaded (placeholder), string = resolved src.
  const [resolved, setResolved] = useState<string | null>(null);

  // Probe each candidate with a detached Image() so we never render a broken
  // <img>; listeners are attached before src is set, so there is no hydration
  // race. Auto-upgrades the moment a real stage photo is dropped in /public.
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

  // Probing or no image yet — soft light placeholder (label only when settled).
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-blue-100">
      {resolved === '' && (
        <span className="px-10 text-center font-head text-[38px] font-extrabold leading-tight text-slate-400/70">
          {item.name}
        </span>
      )}
    </div>
  );
}
