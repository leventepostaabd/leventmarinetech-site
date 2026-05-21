import Link from 'next/link';
import type { Metadata } from 'next';
import { readProducts, readCategories, readProductLabels } from '@/lib/content';
import { getLocale } from '@/lib/i18n';
import SupplySearchBox from './SupplySearchBox';
import SupplyCatalogBrowser from './SupplyCatalogBrowser';

export const metadata: Metadata = {
  title: 'Marine Technical Supply — Parts, Spares & Equivalents',
  description: 'Find any marine electrical or mechanical part — paste a model, upload a nameplate photo, or browse Marine Electric / General Electric / General Marine. Quote-only, no public prices.',
  alternates: { canonical: '/supply' }
};

const ICON: Record<string, string> = {
  ship: 'M2 21l8-3 4 3 8-3-3-9c-1-3-4-5-7-5s-6 2-7 5l-3 12z',
  bolt: 'M13 2L3 14h7l-1 8 10-12h-7l1-8z',
  wrench: 'M14.7 6.3a4.5 4.5 0 0 1 6.4 6.4l-9.9 9.9-6.4-6.4 9.9-9.9z'
};

export default function SupplyIndex() {
  const locale = getLocale();
  const labels = readProductLabels(locale);
  const products = readProducts();
  const categories = readCategories().sort((a, b) => a.order - b.order);

  // Counts per top-level category
  const counts: Record<string, number> = {};
  products.forEach((p) => {
    const k = p.category_slug ?? '';
    counts[k] = (counts[k] ?? 0) + 1;
  });

  const nameOf = (c: { name_en: string; name_tr: string }) => (locale === 'tr' ? c.name_tr : c.name_en);
  const summaryOf = (c: { summary_en: string; summary_tr: string }) => (locale === 'tr' ? c.summary_tr : c.summary_en);

  return (
    <>
      {/* HERO + SEARCH */}
      <section className="bg-navy-700 text-white py-14 md:py-20">
        <div className="container-x">
          <div className="kicker text-white/70 mb-3">{locale === 'tr' ? 'Denizcilik teknik tedarik' : 'Marine technical supply'}</div>
          <h1 className="text-white text-balance max-w-4xl">{labels.catalogTitle}</h1>
          <p className="mt-5 text-[16.5px] text-white/75 max-w-3xl leading-relaxed">
            {labels.noPrice}
          </p>

          <div className="mt-7 max-w-3xl">
            <SupplySearchBox
              placeholder={labels.searchPlaceholder}
              hint={labels.photoCta}
              locale={locale}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-[12.5px] font-mono uppercase tracking-[0.08em] text-white/60">
            <Link href="/supply-wizard" className="hover:text-amber no-underline text-white/80">{locale === 'tr' ? 'Adım-adım istek' : 'Step-by-step intake'} →</Link>
            <span className="opacity-40">·</span>
            <Link href="/supply/unlisted-request" className="hover:text-amber no-underline text-white/80">{locale === 'tr' ? 'Listede yok' : 'Unlisted item'} →</Link>
            <span className="opacity-40">·</span>
            <Link href="/supply/equivalent-part-finder" className="hover:text-amber no-underline text-white/80">{locale === 'tr' ? 'Eşdeğer bul' : 'Find equivalent'} →</Link>
          </div>
        </div>
      </section>

      {/* 3 TOP CATEGORY CARDS */}
      <section className="py-14 md:py-16 bg-white">
        <div className="container-x">
          <div className="kicker mb-3">{labels.categoriesHeading}</div>
          <h2 className="mb-9 text-[26px] max-w-3xl">
            {locale === 'tr'
              ? 'Üç ana grup — denizciliğe özel, genel elektrik, ve genel mekanik.'
              : 'Three groups — marine-specific, general electric, and general marine mechanical.'}
          </h2>

          <ul className="grid gap-5 md:grid-cols-3">
            {categories.map((c) => {
              const itemCount = counts[c.slug] ?? 0;
              const subCount = c.subcategories.length;
              return (
                <li key={c.slug}>
                  <Link
                    href={`/supply/category/${c.slug}`}
                    className="block card hover:border-amber group h-full no-underline relative overflow-hidden"
                  >
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber/10 rounded-full transition-transform group-hover:scale-110" />
                    <svg
                      className="relative text-amber-600 mb-3"
                      width="36" height="36" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round"
                    >
                      <path d={ICON[c.icon ?? 'bolt']} />
                    </svg>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-amber-600">{itemCount} items · {subCount} sub</span>
                      <span className="text-amber group-hover:translate-x-0.5 transition">→</span>
                    </div>
                    <h3 className="font-head font-bold text-[22px] text-ink mb-2 group-hover:text-amber-600">{nameOf(c)}</h3>
                    <p className="text-[13.5px] text-ink-muted leading-relaxed">{summaryOf(c)}</p>

                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {c.subcategories.slice(0, 4).map((s) => (
                        <li key={s.slug} className="text-[11px] font-mono uppercase tracking-wider text-ink-subtle">
                          {nameOf(s)}
                        </li>
                      )).reduce<React.ReactNode[]>((acc, el, i, arr) => {
                        acc.push(el);
                        if (i < arr.length - 1) acc.push(<li key={`sep-${i}`} className="text-ink-subtle/40">·</li>);
                        return acc;
                      }, [])}
                    </ul>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* LIVE CATALOG BROWSER — search + chip filter + grid */}
      <section className="py-12 md:py-16 bg-navy-50">
        <div className="container-x">
          <div className="kicker mb-3">{locale === 'tr' ? 'Canlı katalog' : 'Live catalog'}</div>
          <h2 className="mb-2 text-[26px] max-w-3xl">
            {locale === 'tr'
              ? 'Yaz, filtrele, bul. Fiyat yok — sadece teklif.'
              : 'Type, filter, find. No prices — quote only.'}
          </h2>
          <p className="text-ink-muted text-[14.5px] max-w-2xl mb-6">
            {locale === 'tr'
              ? 'Tedarikçi ağımızdan canlı katalog. Aramaya yaz veya kategoriye tıkla — grid anında filtrelenir. Fiyat yok, sadece teklif.'
              : 'Live catalog from our supplier network. Type or tap a chip and the grid filters in real time. No prices — quote only.'}
          </p>

          <SupplyCatalogBrowser
            products={products}
            categories={categories.map((c) => ({ slug: c.slug, name_en: c.name_en, name_tr: c.name_tr }))}
            labels={{
              inStock: labels.inStock,
              getQuote: labels.getQuote,
              searchPlaceholder: locale === 'tr' ? 'Marka, parça no, model veya sistem ara…' : 'Brand, part no, model, system…',
              all: labels.filterAll,
              showing: locale === 'tr' ? '{n} ürün' : '{n} items',
              noResults: locale === 'tr' ? 'Eşleşme yok. Bilmediğin parça için fotoğraf yükle.' : 'No match. Upload a nameplate photo and we will source it.',
              filterBrand: labels.filterBrand,
              clearFilters: locale === 'tr' ? 'Filtreleri temizle' : 'Clear filters',
              liveBadge: locale === 'tr' ? 'Canlı' : 'Live'
            }}
            locale={locale}
          />

          <div className="mt-8 text-center">
            <Link href="/supply/categories" className="btn-ghost btn-md">
              {locale === 'tr' ? 'Kategori indeksi →' : 'Browse all categories →'}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
