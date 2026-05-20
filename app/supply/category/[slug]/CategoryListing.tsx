'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { ProductContent } from '@/lib/content';

type Props = {
  products: ProductContent[];
  brands: string[];
  locale: 'en' | 'tr';
  labels: {
    inStock: string;
    getQuote: string;
    filterBrand: string;
    filterAvailability: string;
    filterAll: string;
  };
};

export default function CategoryListing({ products, brands, locale, labels }: Props) {
  const [brand, setBrand] = useState<string>('');
  const [stockOnly, setStockOnly] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (brand && p.brand !== brand) return false;
      if (stockOnly && !p.in_stock) return false;
      return true;
    });
  }, [products, brand, stockOnly]);

  return (
    <>
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-white rounded-md border border-line">
        <div className="flex items-center gap-2">
          <label className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-subtle">{labels.filterBrand}</label>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="rounded-md border border-line-strong bg-white px-3 py-1.5 text-[13px] text-ink focus:border-amber focus:ring-2 focus:ring-amber/30 focus:outline-none"
          >
            <option value="">{labels.filterAll}</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 ml-auto cursor-pointer">
          <input
            type="checkbox"
            checked={stockOnly}
            onChange={(e) => setStockOnly(e.target.checked)}
            className="rounded border-line-strong text-amber focus:ring-amber"
          />
          <span className="font-mono text-[11.5px] uppercase tracking-[0.06em] text-ink">
            {labels.inStock} {locale === 'tr' ? 'sadece' : 'only'}
          </span>
        </label>

        <span className="font-mono text-[11px] text-ink-subtle">
          {filtered.length} / {products.length}
        </span>
      </div>

      {/* Listing */}
      {filtered.length === 0 ? (
        <div className="card border-l-4 border-l-amber">
          <p className="text-ink-muted">
            {locale === 'tr'
              ? 'Bu filtrelerle eşleşen ürün yok. Filtreleri değiştirin veya '
              : 'No items match these filters. Reset, or '}
            <Link href="/supply/unlisted-request" className="text-amber-600 hover:text-amber">
              {locale === 'tr' ? 'listede olmayan parça için istek gönderin' : 'send an unlisted request'}
            </Link>.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const name = locale === 'tr' && p.name_tr ? p.name_tr : p.name;
            const desc = locale === 'tr' && p.description_tr ? p.description_tr : p.shortDescription;
            return (
              <li key={p.id}>
                <Link href={`/supply/product/${p.slug}`} className="block card hover:border-amber group no-underline h-full">
                  {p.image && (
                    <div className="aspect-[4/3] -mx-5 -mt-5 mb-4 bg-navy-50 overflow-hidden rounded-t-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image}
                        alt={name}
                        loading="lazy"
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  )}
                  <div className="flex justify-between mb-2">
                    <span className="font-mono text-[11px] text-ink-subtle">{p.brand}</span>
                    <span className={`font-mono text-[10.5px] uppercase tracking-wider ${p.in_stock ? 'text-green-700' : 'text-amber-600'}`}>
                      {p.in_stock ? '● ' + labels.inStock : labels.getQuote}
                    </span>
                  </div>
                  <h3 className="text-[15.5px] font-bold mb-1 group-hover:text-amber-600 leading-snug">{name}</h3>
                  <div className="font-mono text-[11.5px] text-ink-subtle mb-2">{p.partNumber}</div>
                  <p className="text-[13px] text-ink-muted line-clamp-3">{desc}</p>
                  <div className="mt-3 inline-flex items-center text-[11.5px] font-mono uppercase tracking-wider text-amber-600 group-hover:text-amber">
                    {labels.getQuote} →
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
