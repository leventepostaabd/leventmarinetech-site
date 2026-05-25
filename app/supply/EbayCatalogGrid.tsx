'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ProductQuoteModal, { type ModalProduct } from './ProductQuoteModal';

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
  locale: Locale;
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
      {/* Search bar — soft pill, no hard border, gentle amber halo on focus */}
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
          placeholder={t('Brand, part no, model, system…', 'Marka, parça no, model, sistem…')}
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
            ✕ {t('clear', 'temizle')}
          </button>
        )}
      </div>

      {/* Preset query chips — softer pills */}
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

                      {/* No price shown to the customer (decision F3 / T3).
                          Item identity is enough; price + lead time travel
                          through the RFQ form and back via email / WhatsApp. */}
                      <div className="mt-auto pt-2">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-amber/15 px-2.5 py-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-amber-700 group-hover:bg-amber group-hover:text-navy-700 transition">
                          {t('Get a quote', 'Teklif iste')} →
                        </span>
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
