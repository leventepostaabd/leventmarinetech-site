'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ct, pick } from '@/lib/i18n-client';

type Service = {
  slug: string;
  name_en: string;
  name_tr: string;
  kicker_en: string;
  kicker_tr: string;
  popular?: boolean;
};

/**
 * Compact system picker for the wizard's first step.
 *
 * Fits a single viewport: search input + 6 most-requested tiles
 * + a "See all 19 systems" button that opens a modal overlay
 * (overlay doesn't grow the page, so the no-scroll rule holds).
 */
export default function SystemPicker({
  services,
  popular,
  value,
  onChange,
  locale
}: {
  services: Service[];
  popular: Service[];
  value: string;
  onChange: (slug: string) => void;
  locale: Locale;
}) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);

  const matches = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return [];
    return services.filter((s) =>
      [s.name_en, s.name_tr, s.kicker_en, s.kicker_tr, s.slug]
        .join(' ')
        .toLowerCase()
        .includes(qq)
    );
  }, [services, q]);

  return (
    <div>
      <h2 className="text-[22px] md:text-[24px] font-bold leading-tight mb-1.5">
        {ct(locale, 'services.searchPlaceholder')}
      </h2>
      <p className="text-ink-muted text-[13.5px] mb-4">
        {ct(locale, 'services.pickerHint')}
      </p>

      {/* Live search */}
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={ct(locale, 'services.searchExample')}
          className="field-input pl-10"
          aria-label={ct(locale, 'services.searchPlaceholder')}
        />
        {/* Match dropdown */}
        {q && (
          <ul className="absolute z-20 left-0 right-0 mt-1 max-h-56 overflow-auto rounded-md border border-line bg-white shadow-lg">
            {matches.length === 0 ? (
              <li className="px-3 py-2 text-[12.5px] text-ink-subtle">
                {ct(locale, 'services.noMatches')}
              </li>
            ) : (
              matches.slice(0, 8).map((s) => (
                <li key={s.slug}>
                  <button
                    type="button"
                    onClick={() => { onChange(s.slug); setQ(''); }}
                    className="block w-full text-left px-3 py-2 text-[13.5px] hover:bg-amber/10"
                  >
                    <span className="font-semibold">{pick(s, 'name', locale)}</span>
                    <span className="ml-2 text-ink-subtle">{pick(s, 'kicker', locale)}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {/* Popular six (always visible) */}
      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-subtle mb-2">
        {ct(locale, 'services.mostRequested')}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {popular.map((s) => {
          const on = value === s.slug;
          return (
            <button
              key={s.slug}
              type="button"
              onClick={() => onChange(s.slug)}
              className={`text-left px-3 py-2.5 rounded-md border transition ${
                on
                  ? 'border-amber bg-amber/10 text-ink'
                  : 'border-line bg-white text-ink hover:border-amber'
              }`}
            >
              <div className="font-semibold text-[13.5px]">{pick(s, 'name', locale)}</div>
              <div className="text-[11.5px] text-ink-subtle">{pick(s, 'kicker', locale)}</div>
            </button>
          );
        })}
      </div>

      {/* Open full list overlay */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 font-mono text-[11.5px] uppercase tracking-[0.14em] text-amber-600 hover:text-amber"
      >
        {ct(locale, 'services.seeAll')} →
      </button>

      {/* Full-list modal — overlay, doesn't grow the page */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="lm-sys-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-navy-900/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              key="lm-sys-panel"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 6 }}
              transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              className="fixed left-1/2 top-1/2 z-50 max-h-[80vh] w-[min(640px,94vw)] -translate-x-1/2 -translate-y-1/2 flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
              role="dialog"
            >
              <div className="shrink-0 flex items-center justify-between border-b border-line px-5 py-3">
                <span className="font-head font-bold text-[15px] text-navy-700">
                  {ct(locale, 'services.systemsCount')}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={ct(locale, 'services.close')}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-navy-50 hover:bg-navy-100"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <ul className="grid gap-2 sm:grid-cols-2">
                  {services.map((s) => {
                    const on = value === s.slug;
                    return (
                      <li key={s.slug}>
                        <button
                          type="button"
                          onClick={() => { onChange(s.slug); setOpen(false); }}
                          className={`w-full text-left px-3 py-2.5 rounded-md border transition ${
                            on
                              ? 'border-amber bg-amber/10 text-ink'
                              : 'border-line bg-white text-ink hover:border-amber'
                          }`}
                        >
                          <div className="font-semibold text-[13.5px]">{locale === 'tr' ? s.name_tr : s.name_en}</div>
                          <div className="text-[11.5px] text-ink-subtle">{locale === 'tr' ? s.kicker_tr : s.kicker_en}</div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
