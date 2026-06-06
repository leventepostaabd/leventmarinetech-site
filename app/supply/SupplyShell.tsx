'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import ProductQuoteModal, { type ModalProduct } from './ProductQuoteModal';
import SourcingChannelTabs from './SourcingChannelTabs';
import InlineHeader from '@/components/InlineHeader';
import LocaleToggle from '@/components/LocaleToggle';
import { ct } from '@/lib/i18n-client';

type SourceTag = 'local' | 'mouser' | 'digikey' | 'grainger' | string;

type Item = {
  slug: string;
  name: string;
  brand: string;
  partNumber: string;
  description?: string;
  image?: string;
  in_stock: boolean;
  source?: SourceTag;
  price?: number | null;
  priceRaw?: number | null;
};

const PRESET_QUERIES = [
  { en: 'Marine electrical', tr: 'Marine elektrik', q: 'marine electrical' },
  { en: 'Radar / magnetron',  tr: 'Radar / magnetron', q: 'radar magnetron' },
  { en: 'GMDSS / VHF',        tr: 'GMDSS / VHF',       q: 'gmdss vhf' },
  { en: 'BWTS spares',        tr: 'BWTS yedek',        q: 'ballast water bwts' },
  { en: 'AVR / generator',    tr: 'AVR / jeneratör',   q: 'generator avr' },
  { en: 'Fire detection',     tr: 'Yangın algılama',   q: 'fire detector' },
  { en: 'LED nav lights',     tr: 'LED seyir feneri',  q: 'navigation light' },
  { en: 'PLC modules',        tr: 'PLC modülleri',     q: 'plc module' }
];

// Idle demo — typed automatically into the search until the visitor engages,
// so the grid keeps moving through real results instead of sitting on the
// full unfiltered catalog. Part terms; identical in both locales.
const DEMO_WORDS = ['mccb', 'crane', 'receptacle', 'plc', 'encoder', 'voltmeter', 'soft starter'];

// Owner-only origin hint — tiny, low-contrast, bottom-right of the image.
// The visitor barely registers it; the owner sees at a glance whether a
// card came from Mouser (M), Digi-Key (D), Grainger (G) or our catalog (L).
const SOURCE_BADGE: Record<string, { letter: string; title: string }> = {
  local:    { letter: 'L', title: 'Levent Marine' },
  mouser:   { letter: 'M', title: 'Mouser' },
  digikey:  { letter: 'D', title: 'Digi-Key' },
  grainger: { letter: 'G', title: 'Grainger' }
};

function SourceBadge({ source }: { source?: string }) {
  const m = source ? SOURCE_BADGE[source] : undefined;
  if (!m) return null;
  return (
    <span
      title={m.title}
      aria-label={m.title}
      className="absolute bottom-1.5 right-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-black/25 text-white/80 font-mono text-[9px] font-semibold backdrop-blur-[2px] z-10 pointer-events-none"
    >
      {m.letter}
    </span>
  );
}

function tokens(s: string): string[] {
  return s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 2);
}

/**
 * /supply — owns the entire left column (header + tight hero + prominent
 * search + sourcing tabs over the scrolling results grid). One unified,
 * relevance-ranked list — our catalog + distributor network — with a
 * source badge (M/D/G/L) on each card. Items without a photo are dropped.
 */
export default function SupplyShell({
  locale,
  catalog,
  heroLine
}: {
  locale: Locale;
  catalog: Item[];
  heroLine: string;
}) {
  const [q, setQ] = useState('');
  const [picked, setPicked] = useState<ModalProduct | null>(null);

  // Distributor-network feed (live, debounced)
  const [distItems, setDistItems] = useState<Item[]>([]);
  const [distLoading, setDistLoading] = useState(false);
  const [distErr, setDistErr] = useState<string | null>(null);
  const [distRan, setDistRan] = useState(false);
  const distAbort = useRef<AbortController | null>(null);
  const distDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Idle auto-type demo. demoDone (state) drives the effect cleanup; demoDoneRef
  // lets the in-flight async loop bail synchronously the instant the user engages.
  const [demoDone, setDemoDone] = useState(false);
  const demoDoneRef = useRef(false);

  const t = (en: string, tr: string) => (locale === 'tr' ? tr : en);

  // Stop the demo the moment the visitor interacts (focus, type, chip, card).
  function engageSearch() {
    if (demoDoneRef.current) return;
    demoDoneRef.current = true;
    setDemoDone(true);
  }

  // Demo loop: type a word, hold ~4s so results render, erase, advance. Never
  // restarts once dismissed; skipped entirely under prefers-reduced-motion.
  useEffect(() => {
    if (demoDone) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(setTimeout(resolve, ms));
      });
    const live = () => !cancelled && !demoDoneRef.current;

    (async () => {
      await wait(1200); // let the page settle before the first keystroke
      let i = 0;
      while (live()) {
        const word = DEMO_WORDS[i % DEMO_WORDS.length];
        for (let c = 1; c <= word.length && live(); c++) {
          setQ(word.slice(0, c));
          await wait(190); // slower, calmer typing
        }
        await wait(6500); // hold so products load and can be read
        for (let c = word.length; c >= 0 && live(); c--) {
          setQ(word.slice(0, c));
          await wait(75);
        }
        await wait(700);
        i++;
      }
    })();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoDone]);

  useEffect(() => {
    if (distDebounce.current) clearTimeout(distDebounce.current);
    distAbort.current?.abort();
    setDistErr(null);
    const query = q.trim();
    if (query.length < 2) {
      setDistItems([]);
      setDistRan(false);
      setDistLoading(false);
      return;
    }
    setDistLoading(true);
    distDebounce.current = setTimeout(() => {
      searchDistributors();
    }, 350);
    return () => {
      if (distDebounce.current) clearTimeout(distDebounce.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  async function searchDistributors() {
    const query = q.trim();
    if (query.length < 2) return;
    distAbort.current?.abort();
    const ac = new AbortController();
    distAbort.current = ac;
    setDistLoading(true);
    setDistErr(null);
    setDistRan(true);
    try {
      const res = await fetch('/api/supply-search?q=' + encodeURIComponent(query) + '&limit=24', {
        cache: 'no-store',
        signal: ac.signal
      });
      if (!res.ok) {
        setDistErr(ct(locale, 'supply.errorSearch'));
        setDistItems([]);
      } else {
        const data = await res.json();
        const live: Item[] = Array.isArray(data?.results)
          ? data.results.filter((r: any) => r.live).map((r: any) => ({
              slug: r.slug,
              name: r.name,
              brand: r.brand ?? '',
              partNumber: r.partNumber ?? '',
              description: r.description,
              image: r.image,
              in_stock: r.in_stock ?? false,
              source: r.source as SourceTag,
              priceRaw: r.priceRaw ?? null
            }))
          : [];
        setDistItems(live);
      }
    } catch (e: any) {
      if (e?.name !== 'AbortError') {
        setDistErr(ct(locale, 'supply.errorNetwork'));
        setDistItems([]);
      }
    } finally {
      setDistLoading(false);
    }
  }

  const combined = useMemo(() => {
    const query = q.trim();
    const queryLow = query.toLowerCase();
    const toks = tokens(queryLow);

    const pool: Item[] = [];
    for (const it of catalog) {
      if (!it.image) continue;
      const tagged: Item = { ...it, source: it.source ?? 'local' };
      if (toks.length === 0) { pool.push(tagged); continue; }
      const hay = `${it.name} ${it.brand} ${it.partNumber} ${it.description ?? ''}`.toLowerCase();
      if (toks.some((tk) => hay.includes(tk))) pool.push(tagged);
    }
    if (query.length >= 2) {
      for (const it of distItems) {
        if (!it.image) continue;
        pool.push(it);
      }
    }
    if (toks.length === 0) return pool;

    const scored = pool.map((it) => {
      const name = (it.name ?? '').toLowerCase();
      const brand = (it.brand ?? '').toLowerCase();
      const part = (it.partNumber ?? '').toLowerCase();
      const hay = `${name} ${brand} ${part} ${(it.description ?? '').toLowerCase()}`;
      let s = 0;
      if (part && part.includes(queryLow)) s += 12;
      if (name.includes(queryLow)) s += 6;
      if (brand && brand.includes(queryLow)) s += 4;
      for (const tk of toks) if (hay.includes(tk)) s += 1;
      if (it.in_stock) s += 0.5;
      if ((it.source ?? 'local') === 'local') s += 0.25;
      return { it, s };
    });
    scored.sort((a, b) => b.s - a.s);
    return scored.map((x) => x.it);
  }, [catalog, distItems, q]);

  function openCard(it: Item) {
    engageSearch();
    setPicked({
      id: it.slug,
      slug: it.slug,
      name: it.name,
      brand: it.brand,
      partNumber: it.partNumber,
      description: it.description,
      image: it.image,
      priceRaw: it.priceRaw ?? null
    });
  }

  function Card({ it }: { it: Item }) {
    return (
      <button
        type="button"
        onClick={() => openCard(it)}
        className="text-left w-full h-full rounded-2xl bg-white ring-1 ring-line/60 hover:ring-amber/60 hover:shadow-md transition group overflow-hidden flex flex-col shadow-sm"
      >
        <div className="aspect-[4/3] bg-navy-50 relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={it.image}
            alt={it.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <SourceBadge source={it.source} />
        </div>
        <div className="p-3.5 flex flex-col flex-1">
          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-amber-600 mb-1">
            {it.brand || ct(locale, 'supply.brandOnRequest')}
          </div>
          <h3 className="text-[13px] font-semibold text-ink leading-tight mb-1 line-clamp-2">
            {it.name}
          </h3>
          {it.partNumber && (
            <div className="font-mono text-[11px] text-ink-subtle mb-2">{it.partNumber}</div>
          )}
          <div className="mt-auto pt-2">
            {typeof it.price === 'number' ? (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-navy-700 px-2.5 py-1.5 font-mono text-[11px] font-semibold tracking-[0.04em] text-white group-hover:bg-amber group-hover:text-navy-700 transition">
                ${it.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-amber/15 px-2.5 py-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-amber-700 group-hover:bg-amber group-hover:text-navy-700 transition">
                {ct(locale, 'supply.getQuote')} →
              </span>
            )}
          </div>
        </div>
      </button>
    );
  }

  return (
    <div
      className="flex h-full flex-col min-w-0 min-h-0 bg-[#EFF4FB]"
      style={{ paddingTop: 'env(safe-area-inset-top, 0)' }}
    >
      {/* Top zone — compact: header, tight h1, prominent search, chips, channels. */}
      <div className="relative z-10 shrink-0 bg-[#EFF4FB] px-5 pb-3 pt-2 shadow-[0_14px_26px_-18px_rgba(11,31,58,0.4)] md:px-10 md:pb-3 lg:pt-6">
        {/* Mobile keeps the header here; on desktop it floats over the photo. */}
        <div className="lg:hidden">
          <InlineHeader locale={locale} />
        </div>

        <div className="mb-2.5 mt-1 flex items-start justify-between gap-4 md:mb-3 md:mt-2">
          <h1 className="min-w-0 flex-1 truncate font-head text-[18px] font-extrabold leading-tight tracking-[-0.01em] text-ink md:text-[20px] lg:text-[23px]">
            {heroLine}
          </h1>
          <div className="hidden shrink-0 lg:block">
            <LocaleToggle current={locale} />
          </div>
        </div>

        {/* Search bar — moved up to where the subtitle used to sit. */}
        <div className="relative">
          <svg
            className="absolute left-5 top-1/2 z-10 -translate-y-1/2 text-amber-500"
            width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={q}
            onChange={(e) => {
              engageSearch();
              setQ(e.target.value);
            }}
            onFocus={engageSearch}
            placeholder={ct(locale, 'supply.searchPlaceholder')}
            aria-label={t('Search marine supply', 'Marine tedarik ara')}
            className="w-full bg-white text-ink placeholder:text-ink-subtle rounded-full pl-13 pr-32 py-3.5 text-[15px] ring-2 ring-amber/35 shadow-[0_3px_18px_rgba(245,165,36,0.12)] outline-none transition hover:ring-amber/55 focus:ring-amber/80 focus:shadow-[0_4px_22px_rgba(245,165,36,0.20)]"
            style={{ paddingLeft: '3.25rem' }}
          />
          {q && (
            <button
              type="button"
              onClick={() => {
                engageSearch();
                setQ('');
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[11px] text-ink-subtle ring-1 ring-line transition hover:bg-white hover:text-ink"
            >
              ✕ {ct(locale, 'supply.clear')}
            </button>
          )}
        </div>

        {/* Preset chips — compact row */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {PRESET_QUERIES.map((p) => (
            <button
              key={p.q}
              type="button"
              onClick={() => {
                engageSearch();
                setQ(p.q);
              }}
              className={`px-3 py-1 rounded-full text-[11px] transition ${
                q === p.q
                  ? 'bg-navy-700 text-white shadow-sm'
                  : 'bg-navy-50/60 text-ink-muted ring-1 ring-line/60 hover:bg-amber/10 hover:text-amber-700 hover:ring-amber/40'
              }`}
            >
              {locale === 'tr' ? p.tr : p.en}
            </button>
          ))}
        </div>

        {/* Sourcing channels — compact, below */}
        <div className="mt-3">
          <SourcingChannelTabs locale={locale} />
        </div>
      </div>

      {/* Scroll zone — counter + results grid. */}
      <div
        className="flex-1 overflow-y-auto px-5 pt-3 md:px-10 md:pt-4"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0) + 4.5rem)' }}
      >
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-ink-subtle mb-3">
          <span>
            {distLoading
              ? ct(locale, 'supply.searching')
              : ct(locale, 'supply.catalogResults').replace('{n}', String(combined.length))}
          </span>
          <span className="text-amber-600">{ct(locale, 'supply.quoteOnly')}</span>
        </div>

        {distErr && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13.5px] text-red-700 mb-3">
            {distErr}
          </div>
        )}

        {combined.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {combined.map((it) => (
              <li key={`${it.source ?? 'local'}-${it.slug}`}><Card it={it} /></li>
            ))}
          </ul>
        ) : (
          !distLoading && q.trim().length >= 2 && distRan && (
            <div className="rounded-xl border border-line bg-white p-10 text-center">
              <p className="text-[15px] text-ink-muted mb-4">
                {ct(locale, 'supply.noMatchTitle')}
              </p>
              <Link href={`/supply/unlisted-request?q=${encodeURIComponent(q)}`} className="btn-accent btn-sm no-underline">
                {ct(locale, 'supply.uploadNameplate')}
              </Link>
            </div>
          )
        )}

        {/* Footer helpers */}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-[12.5px] font-mono uppercase tracking-[0.1em] text-ink-subtle pt-3 border-t border-line">
          <Link href="/supply-wizard" className="hover:text-amber no-underline">
            {ct(locale, 'supply.stepByStep')} →
          </Link>
          <span className="opacity-40">·</span>
          <Link href="/supply/unlisted-request" className="hover:text-amber no-underline">
            {ct(locale, 'supply.unlistedItem')} →
          </Link>
          <span className="opacity-40">·</span>
          <Link href="/supply/equivalent-part-finder" className="hover:text-amber no-underline">
            {ct(locale, 'supply.findEquivalent')} →
          </Link>
        </div>
      </div>

      <ProductQuoteModal
        product={picked}
        open={!!picked}
        onClose={() => setPicked(null)}
        locale={locale}
      />
    </div>
  );
}
