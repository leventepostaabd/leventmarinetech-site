'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import ServiceTile from '@/components/ServiceTile';
import type { ServiceContent } from '@/lib/content';

type UI = {
  search_placeholder: string;
  popular: string;
  see_all: string;
  close: string;
  no_matches: string;
};

/**
 * Service browser — drives the /services page.
 *
 * Layout (per DECISIONS.md S1, F1):
 *   - Search box at top (filters on name + kicker + summary + symptoms + keywords)
 *   - 6 most-requested tiles below it
 *   - "See all 19 systems" button → modal grid (no scroll on desktop hero;
 *     scroll is allowed inside the modal because it's a focused task surface)
 *   - Always-visible "Other / not listed" small chip
 *
 * Click on any system → /service-wizard?system=<slug> (3-step flow).
 */
export default function ServicesBrowser({
  services,
  popular,
  ui,
  locale = 'en'
}: {
  services: ServiceContent[];
  popular: ServiceContent[];
  ui: UI;
  locale?: 'en' | 'tr';
}) {
  const [query, setQuery] = useState('');
  const [allOpen, setAllOpen] = useState(false);

  const all19 = useMemo(() => services.filter((s) => s.slug !== 'other'), [services]);
  const other = useMemo(() => services.find((s) => s.slug === 'other'), [services]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as ServiceContent[];
    return services.filter((s) => {
      const haystack = [
        s.name_en, s.name_tr, s.kicker_en, s.kicker_tr,
        s.summary_en, s.summary_tr,
        ...(s.seo_keywords ?? []),
        ...(s.symptoms ?? [])
      ].join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [services, query]);

  return (
    <div className="mt-6 md:mt-8">
      {/* Search — soft pill, no hard borders, amber halo on focus */}
      <div className="relative max-w-2xl">
        <svg
          aria-hidden
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round"
          className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={ui.search_placeholder}
          className="w-full rounded-full bg-navy-50/70 pl-12 pr-5 py-4 text-[15px] text-ink placeholder:text-ink-subtle outline-none ring-1 ring-line/60 transition focus:bg-white focus:ring-2 focus:ring-amber/50 hover:bg-navy-50"
          aria-label={ui.search_placeholder}
        />
      </div>

      {/* Search results */}
      {query.trim() && (
        <div className="mt-6">
          {matches.length === 0 ? (
            <div className="card border-l-4 border-l-amber">
              <p className="text-[14px] text-ink-muted">{ui.no_matches}</p>
              {other && (
                <div className="mt-3">
                  <ServiceTile s={other} locale={locale} variant="compact" />
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {matches.map((s) => (
                <ServiceTile key={s.slug} s={s} locale={locale} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Popular 6 — only show when not searching */}
      {!query.trim() && (
        <>
          <div className="mt-10 flex items-end justify-between gap-4">
            <div className="kicker">{ui.popular}</div>
            <button
              type="button"
              onClick={() => setAllOpen(true)}
              className="btn-ghost btn-sm"
            >
              {ui.see_all} →
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((s) => (
              <ServiceTile key={s.slug} s={s} locale={locale} />
            ))}
          </div>

          {other && (
            <div className="mt-6 max-w-xl">
              <ServiceTile s={other} locale={locale} variant="compact" />
            </div>
          )}
        </>
      )}

      {/* All systems modal */}
      <AnimatePresence>
        {allOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[200] bg-navy-900/65 backdrop-blur-sm"
            onClick={() => setAllOpen(false)}
            role="presentation"
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ type: 'tween', duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(96vw,1100px)] max-h-[88vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={locale === 'tr' ? 'Tüm sistemler' : 'All systems'}
            >
              <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-line bg-white">
                <div>
                  <div className="kicker mb-0.5">{ui.popular}</div>
                  <h2 className="text-[20px]">
                    {locale === 'tr' ? '19 sistem + Diğer' : '19 systems + Other'}
                  </h2>
                </div>
                <button
                  onClick={() => setAllOpen(false)}
                  aria-label={ui.close}
                  className="w-9 h-9 grid place-items-center rounded-md hover:bg-navy-50"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </header>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {all19.map((s) => (
                    <ServiceTile key={s.slug} s={s} locale={locale} variant="compact" />
                  ))}
                </div>
                {other && (
                  <div className="mt-5">
                    <div className="kicker mb-2">{locale === 'tr' ? 'Liste dışı' : 'Not listed'}</div>
                    <ServiceTile s={other} locale={locale} variant="compact" />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
