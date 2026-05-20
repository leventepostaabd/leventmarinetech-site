import Link from 'next/link';
import type { Metadata } from 'next';
import { readProducts, readCategories, readProductLabels } from '@/lib/content';
import { getLocale } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Catalog — All Categories',
  description: 'Browse the full Levent Marine supply catalog by category — Marine Electric, General Electric, General Marine.',
  alternates: { canonical: '/supply/categories' }
};

export default function CategoriesPage() {
  const locale = getLocale();
  const labels = readProductLabels(locale);
  const products = readProducts();
  const categories = readCategories().sort((a, b) => a.order - b.order);
  const nameOf = (c: { name_en: string; name_tr: string }) => (locale === 'tr' ? c.name_tr : c.name_en);

  return (
    <div className="container-x py-12 md:py-16">
      <nav className="text-[12px] font-mono text-ink-subtle mb-6">
        <Link href="/" className="hover:text-amber-600 no-underline">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/supply" className="hover:text-amber-600 no-underline">Supply</Link>
        <span className="mx-2">/</span>
        <span>{locale === 'tr' ? 'Katalog' : 'Catalog'}</span>
      </nav>
      <div className="kicker mb-3">{locale === 'tr' ? 'Katalog' : 'Catalog'}</div>
      <h1 className="mb-3">{locale === 'tr' ? 'Tüm kategoriler.' : 'All categories.'}</h1>
      <p className="text-ink-muted max-w-2xl mb-2">
        {products.length} {locale === 'tr' ? 'ürün katalogda' : 'items in the catalog'}.
        {' '}
        <Link href="/supply/unlisted-request" className="text-amber-600 hover:text-amber">
          {locale === 'tr' ? 'Listede yoksa istek gönder' : 'Send an unlisted request'}
        </Link>.
      </p>
      <p className="text-ink-subtle text-[12.5px] max-w-2xl mb-12">{labels.noPrice}</p>

      <div className="space-y-16">
        {categories.map((cat) => {
          const catProducts = products.filter((p) => p.category_slug === cat.slug);
          if (catProducts.length === 0) return null;
          return (
            <section key={cat.slug}>
              <div className="flex items-baseline justify-between mb-2">
                <h2 className="text-[24px]">{nameOf(cat)}</h2>
                <Link href={`/supply/category/${cat.slug}`} className="font-mono text-[11.5px] text-amber-600 no-underline whitespace-nowrap">
                  {locale === 'tr' ? 'Tümünü gör' : 'View all'} {catProducts.length} →
                </Link>
              </div>
              <p className="text-ink-muted text-[14px] mb-6 max-w-3xl">
                {locale === 'tr' ? cat.summary_tr : cat.summary_en}
              </p>

              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {cat.subcategories.map((sub) => {
                  const subItems = catProducts.filter((p) => (p.subcategory_slug ?? p.category) === sub.slug);
                  if (subItems.length === 0) return null;
                  return (
                    <Link
                      key={sub.slug}
                      href={`/supply/category/${sub.slug}`}
                      className="block card hover:border-amber group no-underline"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[11px] text-amber-600">{subItems.length} {locale === 'tr' ? 'ürün' : 'items'}</span>
                        <span className="text-amber group-hover:translate-x-0.5 transition">→</span>
                      </div>
                      <div className="font-head font-bold text-[15px] text-ink mb-1 group-hover:text-amber-600">
                        {nameOf(sub)}
                      </div>
                      {sub.hint_en && (
                        <div className="text-[12.5px] text-ink-muted leading-relaxed">
                          {locale === 'tr' && sub.hint_tr ? sub.hint_tr : sub.hint_en}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
