'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import InlineHeader from '@/components/InlineHeader';
import LocaleToggle from '@/components/LocaleToggle';
import ServiceChannelTabs from '@/app/services/ServiceChannelTabs';
import ServiceRequestModal from '@/components/ServiceRequestModal';

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
  const [requested, setRequested] = useState<StageItem | null>(null);
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
    <div className="h-screen max-h-screen overflow-hidden bg-[#EFF4FB] lg:grid lg:grid-cols-[minmax(0,35%)_minmax(0,65%)]">
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
        {/* Soft, wide blend into the content panel — feathers the photo into
            the theme-tinted right side. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-44 bg-gradient-to-l from-[#EFF4FB] via-[#EFF4FB]/55 to-transparent"
        />

        {/* Header floats over the photo (desktop): hamburger, logo, locale — on
            a soft whitening scrim, no solid bar. */}
        <div className="absolute inset-x-0 top-0 z-30">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-white/95 via-white/60 to-transparent backdrop-blur-[2px]"
          />
          <div className="relative px-3 md:px-5">
            <InlineHeader locale={locale} variant="stage" />
          </div>
        </div>
      </aside>

      {/* RIGHT — header + heading + search + interactive cards. Background tinted
          with the photo theme palette (soft pale blue) for cohesion. */}
      <div
        className="flex h-full min-h-0 flex-col bg-[#EFF4FB]"
        style={{ paddingTop: 'env(safe-area-inset-top, 0)' }}
      >
        <div className="relative z-10 shrink-0 bg-[#EFF4FB] px-5 pb-3 pt-2 shadow-[0_14px_26px_-18px_rgba(11,31,58,0.4)] md:px-8 lg:pt-6">
          {/* Mobile keeps the header here; on desktop it floats over the photo. */}
          <div className="lg:hidden">
            <InlineHeader locale={locale} />
          </div>
          {/* Heading on one line, language flags pinned top-right (desktop). */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="mt-1 min-w-0 flex-1 truncate font-head text-[18px] font-extrabold leading-tight tracking-[-0.01em] text-ink md:text-[20px] lg:mt-0 lg:text-[23px]">
              {heading}
            </h1>
            <div className="mt-1 hidden shrink-0 lg:block">
              <LocaleToggle current={locale} />
            </div>
          </div>
          <p className="mt-1.5 max-w-md truncate text-[13px] leading-relaxed text-ink-muted">{sub}</p>

          <div className="relative mt-3.5">
            <svg
              aria-hidden
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.2" strokeLinecap="round"
              className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-amber-500"
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
              className="w-full rounded-full bg-white pl-11 pr-4 py-3 text-[14px] text-ink placeholder:text-ink-subtle outline-none ring-2 ring-amber/35 shadow-[0_3px_18px_rgba(245,165,36,0.12)] transition hover:ring-amber/55 focus:shadow-[0_4px_22px_rgba(245,165,36,0.20)] focus:ring-amber/80"
            />
          </div>

          {/* Contact channels — mirrors the /supply layout. */}
          <div className="mt-3">
            <ServiceChannelTabs locale={locale} />
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
                <div className="divide-y divide-line/60">
                  {g.items.map((it) => {
                    const on = it.slug === active;
                    return (
                      <button
                        key={it.slug}
                        type="button"
                        onClick={() => setRequested(it)}
                        onMouseEnter={() => { setActive(it.slug); setPaused(true); }}
                        onFocus={() => { setActive(it.slug); setPaused(true); }}
                        className={`group relative flex w-full items-center gap-3 rounded-lg py-3 pl-4 pr-3 text-left transition ${
                          on ? 'bg-amber/[0.06]' : 'hover:bg-navy-50/50'
                        }`}
                      >
                        <span
                          aria-hidden
                          className={`absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full transition ${on ? 'bg-amber' : 'bg-transparent'}`}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block font-head text-[16.5px] font-bold leading-tight tracking-[-0.01em] text-ink">
                            {it.name}
                          </span>
                          <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.18em] text-amber-600">
                            {it.kicker}
                          </span>
                          <span className="mt-1 block truncate text-[12px] leading-relaxed text-ink-muted">
                            {it.summary}
                          </span>
                        </span>
                        <svg
                          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden
                          className={`flex-shrink-0 transition ${on ? 'translate-x-0 text-amber opacity-100' : '-translate-x-1 text-ink-subtle opacity-0 group-hover:translate-x-0 group-hover:opacity-60'}`}
                        >
                          <path d="M5 12h14" /><path d="M13 5l7 7-7 7" />
                        </svg>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ServiceRequestModal
        item={requested}
        open={!!requested}
        onClose={() => setRequested(null)}
        locale={locale}
      />
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
