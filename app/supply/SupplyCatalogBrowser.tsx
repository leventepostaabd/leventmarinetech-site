'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ProductImage from '@/components/ProductImage';

type Product = {
  id: string;
  slug: string;
  name: string;
  name_en?: string;
  name_tr?: string;
  brand?: string;
  partNumber?: string;
  category_slug?: string;
  subcategory_slug?: string;
  shortDescription?: string;
  description_en?: string;
  description_tr?: string;
  image?: string;
  in_stock?: boolean;
  source?: string;
};

type CategoryOption = {
  slug: string;
  name_en: string;
  name_tr: string;
};

type Labels = {
  inStock: string;
  getQuote: string;
  searchPlaceholder: string;
  all: string;
  showing: string;
  noResults: string;
  filterBrand: string;
  clearFilters: string;
  liveBadge: string;
};

/**
 * Live-filter catalog browser. Server passes in the full product list
 * and category options; this client component filters in-place as the
 * user types or toggles chips — no page navigation, no debounce-then-redirect.
 *
 * Wave-4 hook: when EBAY_APP_ID lands in env, /api/supply-search will
 * merge live eBay results into `extra` and this component will surface
 * them with a "live" badge. Today it operates on the local 47-item catalog.
 */
export default function SupplyCatalogBrowser({
  products,
  categories,
  labels,
  locale
}: {
  products: Product[];
  categories: CategoryOption[];
  labels: Labels;
  locale: Locale;
}) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<string>('all');
  const [brand, setBrand] = useState<string>('all');

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return products.filter((p) => {
      if (cat !== 'all' && p.category_slug !== cat) return false;
      if (brand !== 'all' && p.brand !== brand) return false;
      if (!qq) return true;
      const haystack = [
        p.name,
        p.name_en,
        p.name_tr,
        p.brand,
        p.partNumber,
        p.shortDescription,
        p.description_en,
        p.description_tr,
        p.subcategory_slug
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(qq);
    });
  }, [products, q, cat, brand]);

  // Brand chips computed off the current category filter so they shrink to relevance
  const brandsForCategory = useMemo(() => {
    const arr = (cat === 'all' ? products : products.filter((p) => p.category_slug === cat))
      .map((p) => p.brand)
      .filter(Boolean) as string[];
    return Array.from(new Set(arr)).sort();
  }, [products, cat]);

  const nameOf = (p: Product) => (locale === 'tr' && p.name_tr ? p.name_tr : p.name);
  const descOf = (p: Product) =>
    locale === 'tr' && p.description_tr
      ? p.description_tr
      : p.description_en ?? p.shortDescription ?? '';

  return (
    <div>
      {/* Sticky filter rail */}
      <div className="sticky top-16 z-20 -mx-4 mb-6 bg-navy-50/95 px-4 py-4 backdrop-blur md:-mx-0 md:rounded-xl md:bg-white md:shadow-sm md:border md:border-line md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle"
              width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={labels.searchPlaceholder}
              aria-label={labels.searchPlaceholder}
              className="w-full rounded-lg border border-line bg-white pl-10 pr-3 py-2.5 text-[14.5px] focus:border-amber focus:ring-2 focus:ring-amber/30 focus:outline-none"
            />
          </div>

          <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-subtle md:ml-2">
            {labels.showing.replace('{n}', String(filtered.length))}
          </div>

          {(q || cat !== 'all' || brand !== 'all') && (
            <button
              onClick={() => {
                setQ('');
                setCat('all');
                setBrand('all');
              }}
              className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-amber-600 hover:text-amber"
            >
              ✕ {labels.clearFilters}
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <FilterChip active={cat === 'all'} onClick={() => setCat('all')} label={labels.all} />
          {categories.map((c) => (
            <FilterChip
              key={c.slug}
              active={cat === c.slug}
              onClick={() => {
                setCat(c.slug);
                setBrand('all'); // reset brand when category changes
              }}
              label={locale === 'tr' ? c.name_tr : c.name_en}
            />
          ))}
        </div>

        {/* Brand chips (only when a category is picked, to avoid 50+ chips) */}
        {cat !== 'all' && brandsForCategory.length > 1 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            <FilterChip
              size="xs"
              active={brand === 'all'}
              onClick={() => setBrand('all')}
              label={labels.filterBrand}
            />
            {brandsForCategory.map((b) => (
              <FilterChip
                key={b}
                size="xs"
                active={brand === b}
                onClick={() => setBrand(b)}
                label={b}
              />
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-line bg-white p-10 text-center">
          <p className="text-[15px] text-ink-muted mb-4">{labels.noResults}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href={`/supply/unlisted-request?q=${encodeURIComponent(q)}`} className="btn-accent btn-sm no-underline">
              {locale === 'tr' ? 'Fotoğraf yükle, biz bulalım' : 'Upload photo, we will find it'}
            </Link>
            <Link href={`/supply-wizard?q=${encodeURIComponent(q)}`} className="btn-ghost btn-sm no-underline">
              {labels.getQuote}
            </Link>
          </div>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <li key={p.id}>
              <Link
                href={`/supply/product/${p.slug}`}
                className="block card hover:border-amber group h-full no-underline relative overflow-hidden"
              >
                <div className="relative -mx-5 -mt-5 mb-4 aspect-[4/3] overflow-hidden bg-navy-50">
                  <ProductImage
                    src={p.image}
                    alt={nameOf(p)}
                    brand={p.brand}
                    partNumber={p.partNumber}
                    className="transition-transform group-hover:scale-105"
                  />
                </div>

                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[11px] text-ink-subtle">{p.brand ?? '—'}</span>
                  <span
                    className={`font-mono text-[10.5px] uppercase tracking-wider ${
                      p.in_stock ? 'text-green-700' : 'text-amber-600'
                    }`}
                  >
                    {p.in_stock ? '● ' + labels.inStock : labels.getQuote}
                  </span>
                </div>

                <h3 className="text-[15px] font-bold leading-tight text-ink mb-1 group-hover:text-amber-600 line-clamp-2">
                  {nameOf(p)}
                </h3>
                {p.partNumber && (
                  <div className="font-mono text-[11.5px] text-ink-subtle mb-2">{p.partNumber}</div>
                )}
                <p className="text-[12.5px] text-ink-muted leading-relaxed line-clamp-3">{descOf(p)}</p>

                <div className="mt-3 inline-flex items-center text-[11.5px] font-mono uppercase tracking-wider text-amber-600 group-hover:text-amber">
                  {labels.getQuote} →
                </div>

                {/* Source supplier names (Amazon / eBay) are intentionally
                    not surfaced — only the product and our quote path show. */}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  size = 'sm'
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  size?: 'xs' | 'sm';
}) {
  const px = size === 'xs' ? 'px-2.5 py-1' : 'px-3 py-1.5';
  const fz = size === 'xs' ? 'text-[10.5px]' : 'text-[11.5px]';
  return (
    <button
      onClick={onClick}
      className={`${px} ${fz} font-mono uppercase tracking-[0.1em] rounded-full transition border ${
        active
          ? 'bg-navy-700 text-white border-navy-700'
          : 'bg-white text-ink-muted border-line hover:border-amber hover:text-amber-600'
      }`}
    >
      {label}
    </button>
  );
}
