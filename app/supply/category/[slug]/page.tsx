import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  readProducts, readCategories, readProductLabels,
  categoryBySlug, subcategoryBySlug, productsByTopCategory, productsBySubcategory
} from '@/lib/content';
import { supplyImage } from '@/lib/deck-images';
import { getLocale } from '@/lib/i18n';
import CategoryListing from './CategoryListing';

export function generateStaticParams() {
  const slugs = new Set<string>();
  readCategories().forEach((c) => {
    slugs.add(c.slug);
    c.subcategories.forEach((s) => slugs.add(s.slug));
  });
  // Legacy single-category slugs (backward compat)
  readProducts().forEach((p) => slugs.add(p.category));
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const top = categoryBySlug(params.slug);
  const subHit = subcategoryBySlug(params.slug);
  const label = top
    ? top.name_en
    : subHit?.sub.name_en
    ?? params.slug.replace(/-/g, ' ');
  return {
    title: `${label} — Marine Technical Supply`,
    description: `Marine ${label} for commercial vessels. Request a quote on any item, search for equivalents, or upload a nameplate photo.`,
    alternates: { canonical: `/supply/category/${params.slug}` }
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const locale = getLocale();
  const labels = readProductLabels(locale);

  const top = categoryBySlug(params.slug);
  const subHit = subcategoryBySlug(params.slug);

  let items = top
    ? productsByTopCategory(params.slug)
    : subHit
    ? productsBySubcategory(params.slug)
    : productsBySubcategory(params.slug); // legacy slug

  if (items.length === 0) notFound();

  const labelOf = (en: string, tr?: string) => (locale === 'tr' && tr ? tr : en);
  const heading = top
    ? labelOf(top.name_en, top.name_tr)
    : subHit
    ? labelOf(subHit.sub.name_en, subHit.sub.name_tr)
    : params.slug.replace(/-/g, ' ');

  const breadcrumbCategory = top
    ? null
    : subHit
    ? subHit.category
    : null;

  const brands = Array.from(new Set(items.map((p) => p.brand))).sort((a, b) => a.localeCompare(b));
  const heroImage = supplyImage(params.slug);
  const backLabel = locale === 'tr' ? 'Tedariğe dön' : 'Back to supply';

  return (
    <div className="container-x py-12 md:py-16">
      {/* Prominent back button — sits above the breadcrumb so the reader
          always sees how to step out of this listing. */}
      <Link
        href="/supply"
        className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-4 py-2 text-[13px] font-mono uppercase tracking-[0.14em] text-ink no-underline transition hover:border-amber hover:text-amber-600 mb-6"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        {backLabel}
      </Link>

      <nav className="text-[12px] font-mono text-ink-subtle mb-6">
        <Link href="/" className="hover:text-amber-600 no-underline">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/supply" className="hover:text-amber-600 no-underline">Supply</Link>
        <span className="mx-2">/</span>
        <Link href="/supply/categories" className="hover:text-amber-600 no-underline">{locale === 'tr' ? 'Katalog' : 'Catalog'}</Link>
        {breadcrumbCategory && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/supply/category/${breadcrumbCategory.slug}`} className="hover:text-amber-600 no-underline">
              {labelOf(breadcrumbCategory.name_en, breadcrumbCategory.name_tr)}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="capitalize">{heading}</span>
      </nav>

      <div className={heroImage ? 'grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] items-start mb-8' : 'mb-8'}>
        <div className="min-w-0">
          <div className="kicker mb-3 capitalize">{heading}</div>
          <h1 className="mb-3 capitalize">{heading}</h1>
          {top && (
            <p className="text-ink-muted max-w-3xl mb-4">{locale === 'tr' ? top.summary_tr : top.summary_en}</p>
          )}
          <p className="text-ink-subtle text-[12.5px] mb-2">{labels.noPrice}</p>
          <p className="text-ink-muted">{items.length} {locale === 'tr' ? 'ürün' : 'items'}.</p>
        </div>

        {heroImage && (
          <div className="relative w-full overflow-hidden rounded-lg border border-line bg-navy-50 shadow-md lg:max-w-[320px]">
            <Image
              src={heroImage}
              alt={heading}
              width={1080}
              height={1920}
              priority
              sizes="(min-width: 1024px) 320px, 100vw"
              className="h-auto w-full object-contain"
            />
          </div>
        )}
      </div>

      {/* If this is a top-level category, surface the sub-category chips. */}
      {top && (
        <ul className="flex flex-wrap gap-2 mb-8">
          {top.subcategories.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/supply/category/${s.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-line bg-white text-[12.5px] text-ink hover:border-amber hover:text-amber-600 no-underline"
              >
                {labelOf(s.name_en, s.name_tr)}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <CategoryListing
        products={items}
        brands={brands}
        locale={locale}
        labels={{
          inStock: labels.inStock,
          getQuote: labels.getQuote,
          filterBrand: labels.filterBrand,
          filterAvailability: labels.filterAvailability,
          filterAll: labels.filterAll
        }}
      />
    </div>
  );
}
