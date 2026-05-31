'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import ProductQuoteModal, { type ModalProduct } from './ProductQuoteModal';
import { ct } from '@/lib/i18n-client';

type Item = {
  slug: string;
  name: string;
  brand: string;
  partNumber: string;
  description?: string;
  image?: string;
  in_stock: boolean;
  /** Optional public selling price (USD). Shown when set; otherwise the card
      shows "Get quote" (decision S9). */
  price?: number | null;
  /** Raw distributor price (USD) — internal only, never displayed. */
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

function tokens(s: string): string[] {
  return s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 2);
}

/**
 * /supply catalog grid.
 *
 * Primary content is OUR hand-curated marine catalog (passed in as `catalog`),
 * filtered client-side as the customer types — no irrelevant marketplace junk.
 * When nothing in our catalog matches, a clearly-labelled fallback runs a live
 * search of our distributor network (Mouser / Digi-Key / Grainger) via
 * /api/supply-search. Prices are never shown — quote-only (decision F3 / T3).
 */
export default function EbayCatalogGrid({
  locale,
  catalog
}: {
  locale: Locale;
  catalog: Item[];
}) {
  const [q, setQ] = useState('');
  const [picked, setPicked] = useState<ModalProduct | null>(null);

  // Distributor-network fallback (live)
  const [distItems, setDistItems] = useState<Item[]>([]);
  const [distLoading, setDistLoading] = useState(false);
  const [distErr, setDistErr] = useState<string | null>(null);
  const [distRan, setDistRan] = useState(false);
  const distAbort = useRef<AbortController | null>(null);
  const distDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const t = (en: string, tr: string) => (locale === 'tr' ? tr : en);

  // Auto-run the distributor (Mouser / Digi-Key / Grainger) search, debounced,
  // whenever the visitor types. Prices are never returned to the card — the
  // API only exposes `priceRaw` (internal), so the card falls back to
  // "Get quote". The distributor section streams in below the catalog grid.
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

  const filtered = useMemo(() => {
    const toks = tokens(q);
    if (toks.length === 0) return catalog;
    return catalog.filter((it) => {
      const hay = `${it.name} ${it.brand} ${it.partNumber} ${it.description ?? ''}`.toLowerCase();
      return toks.some((tk) => hay.includes(tk));
    });
  }, [catalog, q]);

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
        const live = Array.isArray(data?.results) ? data.results.filter((r: any) => r.live) : [];
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

  function openCard(it: Item) {
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
          {it.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={it.image}
              alt={it.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-ink-subtle font-mono text-[10px] uppercase tracking-[0.16em]">
              {ct(locale, 'supply.noPhoto')}
            </div>
          )}
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
          {/* Price shown only when set (decision S9); otherwise "Get quote". */}
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
    <div className="flex flex-col gap-5">
      {/* Search bar — filters our catalog client-side */}
      <div className="relative">
        <svg
          className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-subtle"
          width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={ct(locale, 'supply.searchPlaceholder')}
          aria-label={t('Search marine supply', 'Marine tedarik ara')}
          className="w-full bg-navy-50/70 text-ink placeholder:text-ink-subtle rounded-full pl-13 pr-32 py-4 text-[15px] ring-1 ring-line/60 outline-none transition hover:bg-navy-50 focus:bg-white focus:ring-2 focus:ring-amber/50"
          style={{ paddingLeft: '3.25rem' }}
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[11px] text-ink-subtle ring-1 ring-line transition hover:bg-white hover:text-ink"
          >
            ✕ {ct(locale, 'supply.clear')}
          </button>
        )}
      </div>

      {/* Preset query chips */}
      <div className="flex flex-wrap gap-2">
        {PRESET_QUERIES.map((p) => (
          <button
            key={p.q}
            type="button"
            onClick={() => setQ(p.q)}
            className={`px-3.5 py-1.5 rounded-full text-[11.5px] transition ${
              q === p.q
                ? 'bg-navy-700 text-white shadow-sm'
                : 'bg-navy-50/60 text-ink-muted ring-1 ring-line/60 hover:bg-amber/10 hover:text-amber-700 hover:ring-amber/40'
            }`}
          >
            {locale === 'tr' ? p.tr : p.en}
          </button>
        ))}
      </div>

      {/* Result counter */}
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-ink-subtle">
        <span>{ct(locale, 'supply.catalogResults').replace('{n}', String(filtered.length))}</span>
        <span className="text-amber-600">{ct(locale, 'supply.quoteOnly')}</span>
      </div>

      {/* Catalog grid / empty state */}
      <div className="flex-1 min-h-0">
        {filtered.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((it) => (
              <li key={it.slug}><Card it={it} /></li>
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-line bg-white p-10 text-center">
            <p className="text-[15px] text-ink-muted mb-4">
              {ct(locale, 'supply.noMatchTitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link href={`/supply/unlisted-request?q=${encodeURIComponent(q)}`} className="btn-ghost btn-sm no-underline">
                {ct(locale, 'supply.uploadNameplate')}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Distributor network — auto-runs while the visitor types (debounced).
          Cards show item identity only; prices are never sent to the UI. */}
      {q.trim().length >= 2 && (
        <div className="border-t border-line pt-4">
          {distLoading && (
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-subtle">
              {ct(locale, 'supply.searching')}
            </div>
          )}

          {distErr && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13.5px] text-red-700">
              {distErr}
            </div>
          )}

          {distRan && !distLoading && !distErr && distItems.length > 0 && (
            <>
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-subtle mb-3">
                {ct(locale, 'supply.distributorResults')} · {distItems.length}
              </div>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {distItems.map((it) => (
                  <li key={it.slug}><Card it={it} /></li>
                ))}
              </ul>
            </>
          )}

          {distRan && !distLoading && !distErr && distItems.length === 0 && filtered.length === 0 && (
            <div className="flex flex-wrap items-center gap-2 text-[13.5px] text-ink-muted">
              <span>{ct(locale, 'supply.noMatchTitle')}</span>
              <Link href={`/supply/unlisted-request?q=${encodeURIComponent(q)}`} className="btn-accent btn-sm no-underline">
                {ct(locale, 'supply.uploadNameplate')}
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Product quote modal */}
      <ProductQuoteModal
        product={picked}
        open={!!picked}
        onClose={() => setPicked(null)}
        locale={locale}
      />

      {/* Footer helpers */}
      <div className="flex flex-wrap items-center gap-3 text-[12.5px] font-mono uppercase tracking-[0.1em] text-ink-subtle pt-2 border-t border-line">
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
  );
}
