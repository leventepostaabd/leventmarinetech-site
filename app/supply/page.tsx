import Link from 'next/link';
import type { Metadata } from 'next';
import { readProducts, readCategories, readProductLabels } from '@/lib/content';
import { getLocale } from '@/lib/i18n';
import SupplySearchBox from './SupplySearchBox';

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

      {/* SAMPLE PRODUCTS */}
      <section className="py-14 md:py-16 bg-navy-50">
        <div className="container-x">
          <div className="kicker mb-3">{locale === 'tr' ? 'Örnek stoklu ürünler' : 'Sample stocked items'}</div>
          <h2 className="mb-8 text-[24px] max-w-3xl">
            {locale === 'tr'
              ? 'Tedarikçi ağımızda olanlardan küçük bir kesit.'
              : "A small slice of what's already in our supplier network."}
          </h2>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.filter((p) => p.in_stock).slice(0, 9).map((p) => {
              const name = locale === 'tr' && p.name_tr ? p.name_tr : p.name;
              const desc = locale === 'tr' && p.description_tr ? p.description_tr : p.shortDescription;
              return (
                <li key={p.id}>
                  <Link href={`/supply/product/${p.slug}`} className="block card hover:border-amber group no-underline h-full">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[11px] text-ink-subtle">{p.brand}</span>
                      <span className="font-mono text-[10.5px] uppercase tracking-wider text-green-700">
                        ● {labels.inStock}
                      </span>
                    </div>
                    <h3 className="text-[15.5px] font-bold mb-1 group-hover:text-amber-600">{name}</h3>
                    <div className="font-mono text-[11.5px] text-ink-subtle mb-2">{p.partNumber}</div>
                    <p className="text-[13px] text-ink-muted leading-relaxed line-clamp-3">{desc}</p>
                    <div className="mt-3">
                      <span className="inline-flex items-center text-[11.5px] font-mono uppercase tracking-wider text-amber-600 group-hover:text-amber">
                        {labels.getQuote} →
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-8 text-center">
            <Link href="/supply/categories" className="btn-primary btn-lg">
              {locale === 'tr' ? 'Tüm kataloğu gör' : 'View full catalog'}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
