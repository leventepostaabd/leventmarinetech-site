'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ProductQuoteModal, { type ModalProduct } from './ProductQuoteModal';
import { MARKUP_RATE, fmt } from '@/lib/pricing';

type Item = {
  slug: string;
  name: string;
  brand: string;
  partNumber: string;
  description?: string;
  image?: string;
  in_stock: boolean;
  source: string;
  live: boolean;
  /** Raw eBay price (USD) before markup — internal use only, not displayed. */
  priceRaw?: number | null;
  /** Estimated end-customer total (USD) for default planned + Florida → US East. */
  estTotal?: number | null;
  estDeliveryEn?: string | null;
  estDeliveryTr?: string | null;
};

const PRESET_QUERIES = [
  { en: 'Marine electrical', tr: 'Marine elektrik', q: 'marine electrical' },
  { en: 'Radar / magnetron',  tr: 'Radar / magnetron', q: 'marine radar magnetron' },
  { en: 'GMDSS / VHF',        tr: 'GMDSS / VHF',       q: 'marine gmdss vhf' },
  { en: 'BWTS spares',        tr: 'BWTS yedek',        q: 'ballast water treatment' },
  { en: 'AVR / generator',    tr: 'AVR / jeneratör',   q: 'marine generator avr' },
  { en: 'Fire detection',     tr: 'Yangın algılama',   q: 'marine fire detector' },
  { en: 'LED nav lights',     tr: 'LED seyir feneri',  q: 'marine led navigation light' },
  { en: 'PLC modules',        tr: 'PLC modülleri',     q: 'marine plc module' }
];

/**
 * Live eBay-powered catalog grid for /supply.
 *
 * UX:
 *  - Search box at the top — debounced, hits /api/supply-search.
 *  - 8 preset query chips so the page isn't empty on first load.
 *  - Grid of cards with eBay's photo / brand / model. Cards link into
 *    /supply-wizard with brand + part pre-filled (the customer asks for
 *    a quote; we never expose eBay's price).
 *  - Empty / loading / error states all render in-place — page doesn't
 *    grow. The grid uses internal scroll inside lm-screen-body.
 */
export default function EbayCatalogGrid({
  locale,
  initialQuery = 'marine electrical'
}: {
  locale: 'en' | 'tr';
  initialQuery?: string;
}) {
  const [q, setQ] = useState(initialQuery);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [picked, setPicked] = useState<ModalProduct | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const t = (en: string, tr: string) => (locale === 'tr' ? tr : en);

  // Debounced fetch whenever q changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q || q.trim().length < 2) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setErr(null);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/supply-search?q=' + encodeURIComponent(q) + '&limit=24', { cache: 'no-store' });
        if (!res.ok) {
          setErr(t('Search temporarily unavailable. Try a slightly different query.', 'Arama şu an cevap vermiyor. Biraz farklı bir kelimeyle dene.'));
          setItems([]);
        } else {
          const data = await res.json();
          setItems(Array.isArray(data?.results) ? data.results : []);
        }
      } catch {
        setErr(t('Network error. Retry in a moment.', 'Ağ hatası. Biraz sonra tekrar dene.'));
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, 280);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [q, locale]);

  const liveOnly = items.filter((it) => it.live);

  return (
    <div className="flex flex-col gap-5">
      {/* Search bar */}
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle"
          width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('Brand, part no, model, system…', 'Marka, parça no, model, sistem…')}
          aria-label={t('Search marine supply', 'Marine tedarik ara')}
          className="w-full bg-white text-ink placeholder:text-ink-subtle border border-line-strong rounded-lg pl-12 pr-32 py-3.5 text-[15px] focus:border-amber focus:ring-2 focus:ring-amber/30 focus:outline-none shadow-sm"
          autoFocus
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-subtle hover:text-ink"
          >
            ✕ {t('clear', 'temizle')}
          </button>
        )}
      </div>

      {/* Preset query chips */}
      <div className="flex flex-wrap gap-1.5">
        {PRESET_QUERIES.map((p) => (
          <button
            key={p.q}
            type="button"
            onClick={() => setQ(p.q)}
            className={`px-2.5 py-1 rounded-full border font-mono text-[10.5px] uppercase tracking-[0.1em] transition ${
              q === p.q
                ? 'bg-navy-700 text-white border-navy-700'
                : 'bg-white text-ink-muted border-line hover:border-amber hover:text-amber-600'
            }`}
          >
            {locale === 'tr' ? p.tr : p.en}
          </button>
        ))}
      </div>

      {/* Result counter */}
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-ink-subtle">
        <span>
          {loading
            ? t('Searching live supply network…', 'Tedarikçi ağı taranıyor…')
            : t(`${liveOnly.length} live results`, `${liveOnly.length} canlı sonuç`)}
        </span>
        <span className="text-amber-600">
          {t('Quote-only · no prices shown', 'Sadece teklif · fiyat yok')}
        </span>
      </div>

      {/* Grid / states */}
      <div className="flex-1 min-h-0">
        {err && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13.5px] text-red-700">
            {err}
          </div>
        )}

        {!err && !loading && liveOnly.length === 0 && (
          <div className="rounded-xl border border-line bg-white p-10 text-center">
            <p className="text-[15px] text-ink-muted mb-3">
              {t(
                'No live matches yet. Try a brand + model, e.g. "Furuno MG5436".',
                'Henüz canlı eşleşme yok. Marka + model dene, örn. "Furuno MG5436".'
              )}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link href={`/supply/unlisted-request?q=${encodeURIComponent(q)}`} className="btn-accent btn-sm no-underline">
                {t('Upload nameplate photo', 'Etiket fotoğrafı yükle')}
              </Link>
              <Link href={`/supply-wizard?q=${encodeURIComponent(q)}`} className="btn-ghost btn-sm no-underline">
                {t('Request quote anyway', 'Yine de teklif iste')}
              </Link>
            </div>
          </div>
        )}

        {liveOnly.length > 0 && (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {liveOnly.map((it) => {
              return (
                <li key={it.slug}>
                  <button
                    type="button"
                    onClick={() => setPicked({
                      id: it.slug,
                      slug: it.slug,
                      name: it.name,
                      brand: it.brand,
                      partNumber: it.partNumber,
                      description: it.description,
                      image: it.image,
                      priceRaw: it.priceRaw ?? null
                    })}
                    className="text-left w-full h-full rounded-xl border border-line bg-white hover:border-amber transition group overflow-hidden flex flex-col"
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
                          {t('No photo', 'Foto yok')}
                        </div>
                      )}
                    </div>
                    <div className="p-3.5 flex flex-col flex-1">
                      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-amber-600 mb-1">
                        {it.brand || t('Brand on request', 'Marka teklifle')}
                      </div>
                      <h3 className="text-[13px] font-semibold text-ink leading-tight mb-1 line-clamp-2">
                        {it.name}
                      </h3>
                      {it.partNumber && (
                        <div className="font-mono text-[11px] text-ink-subtle mb-2">{it.partNumber}</div>
                      )}

                      {/* Estimated ITEM price only — shipping is computed
                          after the customer submits company + delivery info,
                          so we don't show a misleading baseline here. */}
                      <div className="mt-auto pt-2">
                        {it.priceRaw != null ? (
                          <>
                            <div className="font-head font-extrabold text-[16px] text-navy-700 leading-none">
                              {fmt(it.priceRaw * (1 + MARKUP_RATE), locale)}
                            </div>
                            <div className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-subtle mt-1">
                              {t('+ shipping · same-day quote', '+ kargo · aynı gün teklif')}
                            </div>
                          </>
                        ) : (
                          <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-amber-600">
                            {t('Quote on request', 'Talep üzerine teklif')}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

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
          {t('Step-by-step intake →', 'Adım-adım talep →')}
        </Link>
        <span className="opacity-40">·</span>
        <Link href="/supply/unlisted-request" className="hover:text-amber no-underline">
          {t('Unlisted item →', 'Listede yok →')}
        </Link>
        <span className="opacity-40">·</span>
        <Link href="/supply/equivalent-part-finder" className="hover:text-amber no-underline">
          {t('Find equivalent →', 'Eşdeğer bul →')}
        </Link>
      </div>
    </div>
  );
}
