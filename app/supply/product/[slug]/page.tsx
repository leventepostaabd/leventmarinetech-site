import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  productBySlug, readProducts, readProductLabels, subcategoryBySlug, categoryBySlug
} from '@/lib/content';
import { SITE } from '@/lib/site';
import { breadcrumbSchema } from '@/lib/schema-org';
import { getLocale } from '@/lib/i18n';
import ProductImage from '@/components/ProductImage';

export function generateStaticParams() {
  return readProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = productBySlug(params.slug);
  if (!p) return {};
  return {
    title: `${p.name} — ${p.brand} ${p.partNumber}`,
    description: p.shortDescription,
    alternates: { canonical: `/supply/product/${p.slug}` }
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const p = productBySlug(params.slug);
  if (!p) notFound();
  const locale = getLocale();
  const labels = readProductLabels(locale);

  const name = locale === 'tr' && p.name_tr ? p.name_tr : p.name;
  const desc = locale === 'tr' && p.description_tr ? p.description_tr : p.shortDescription;
  const url = `${SITE.url}/supply/product/${p.slug}`;

  const subKey = p.subcategory_slug ?? p.category;
  const subHit = subcategoryBySlug(subKey);
  const topCat = p.category_slug ? categoryBySlug(p.category_slug) : subHit?.category;
  const labelOf = (en: string, tr?: string) => (locale === 'tr' && tr ? tr : en);

  // Equivalents — fetch matching products
  const equivalents = (p.equivalents ?? [])
    .map((slug) => productBySlug(slug))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));

  return (
    <article>
      <header className="bg-white border-b border-line">
        <div className="container-x py-10 md:py-14">
          <nav className="text-[12px] font-mono text-ink-subtle mb-6">
            <Link href="/" className="hover:text-amber-600 no-underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/supply" className="hover:text-amber-600 no-underline">Supply</Link>
            {topCat && (
              <>
                <span className="mx-2">/</span>
                <Link href={`/supply/category/${topCat.slug}`} className="hover:text-amber-600 no-underline">
                  {labelOf(topCat.name_en, topCat.name_tr)}
                </Link>
              </>
            )}
            {subHit && (
              <>
                <span className="mx-2">/</span>
                <Link href={`/supply/category/${subHit.sub.slug}`} className="hover:text-amber-600 no-underline">
                  {labelOf(subHit.sub.name_en, subHit.sub.name_tr)}
                </Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="text-ink">{p.partNumber}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr_0.9fr] items-start">
            {/* IMAGE */}
            <div className="aspect-square overflow-hidden rounded-lg border border-line bg-navy-50">
              <ProductImage
                src={p.image}
                alt={name}
                brand={p.brand}
                partNumber={p.partNumber}
              />
            </div>

            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-amber-600 mb-2">{p.brand}</div>
              <h1 className="text-balance">{name}</h1>
              <div className="font-mono text-[14px] text-ink-muted mt-2">
                {p.partNumber}
                {p.alternativePartNumbers.length > 0 && <span className="text-ink-subtle"> · alt: {p.alternativePartNumbers.join(', ')}</span>}
              </div>
              <p className="mt-5 text-[16px] text-ink-muted leading-relaxed max-w-2xl">{desc}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.slice(0, 6).map((t) => <span key={t} className="chip">{t}</span>)}
              </div>
            </div>

            {/* RIGHT: CTA box — NEVER show price (F3 / T3) */}
            <aside className="card border-l-4 border-l-amber">
              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-subtle">
                  {locale === 'tr' ? 'Durum' : 'Status'}
                </span>
                <span className={`font-mono text-[11px] uppercase tracking-wider ${p.in_stock ? 'text-green-700' : 'text-amber-600'}`}>
                  {p.in_stock ? '● ' + labels.inStock : labels.getQuote}
                </span>
              </div>
              <div className="font-mono text-[12.5px] text-ink-muted mb-5 leading-snug">{p.deliveryEstimate}</div>

              <div className="flex flex-col gap-2">
                <Link href={`/supply-wizard?product=${p.slug}`} className="btn-accent btn-md">
                  {labels.getQuote}
                </Link>
                <Link href={`/supply/equivalent-part-finder?product=${p.slug}`} className="btn-ghost btn-md">
                  {labels.requestEquivalent}
                </Link>
                <Link href={`/supply-wizard?product=${p.slug}&urgency=aog`} className="btn-ghost btn-md">
                  {locale === 'tr' ? 'Acil gemi teslimi' : 'Urgent vessel delivery'}
                </Link>
              </div>
              <p className="mt-4 text-[11.5px] text-ink-subtle leading-relaxed">{p.disclaimer}</p>
              <p className="mt-3 text-[11px] font-mono uppercase tracking-[0.06em] text-ink-subtle/80">
                {labels.noPrice}
              </p>
            </aside>
          </div>
        </div>
      </header>

      <section className="py-14 bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="kicker mb-3">{locale === 'tr' ? 'Açıklama' : 'Description'}</div>
            <div className="prose prose-slate max-w-none">
              {p.longDescription.split(/\n\n+/).map((para, i) => (
                <p key={i} className="text-ink-muted leading-relaxed mb-4">{para}</p>
              ))}
            </div>

            {p.applications.length > 0 && (
              <>
                <div className="kicker mb-3 mt-10">{locale === 'tr' ? 'Tipik gemi kullanımı' : 'Typical shipboard applications'}</div>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {p.applications.map((a) => (
                    <li key={a} className="flex items-start gap-2 text-ink-muted text-[14px]">
                      <span className="text-amber mt-1">›</span><span>{a}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {p.compatibleSystems.length > 0 && (
              <>
                <div className="kicker mb-3 mt-10">{locale === 'tr' ? 'Uyumlu sistemler' : 'Compatible systems'}</div>
                <ul className="flex flex-wrap gap-2">
                  {p.compatibleSystems.map((c) => <li key={c} className="chip">{c}</li>)}
                </ul>
              </>
            )}

            {equivalents.length > 0 && (
              <>
                <div className="kicker mb-3 mt-10">{locale === 'tr' ? 'Eşdeğer parçalar' : 'Equivalent parts'}</div>
                <ul className="grid gap-3 md:grid-cols-2">
                  {equivalents.map((e) => (
                    <li key={e.id}>
                      <Link href={`/supply/product/${e.slug}`} className="block card hover:border-amber no-underline">
                        <div className="font-mono text-[11px] text-ink-subtle">{e.brand}</div>
                        <div className="font-bold text-[14px] mt-1">{e.name}</div>
                        <div className="font-mono text-[11.5px] text-ink-subtle mt-1">{e.partNumber}</div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside className="card">
            <div className="kicker mb-3">{locale === 'tr' ? 'Teknik özellikler' : 'Technical specs'}</div>
            <dl className="text-[13.5px]">
              {Object.entries(p.specs).filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="flex justify-between py-1.5 border-b border-line last:border-0">
                  <dt className="font-mono text-[11.5px] uppercase tracking-[0.06em] text-ink-subtle">{k}</dt>
                  <dd className="text-ink text-right">{v}</dd>
                </div>
              ))}
            </dl>
            {p.datasheetUrl && (
              <a href={p.datasheetUrl} target="_blank" rel="noopener" className="mt-5 inline-flex items-center text-[13px] font-mono text-amber-600 no-underline">
                {locale === 'tr' ? 'Datasheet' : 'Datasheet'} ↗
              </a>
            )}

            <div className="mt-6 pt-5 border-t border-line text-[11.5px] font-mono text-ink-subtle space-y-1">
              <div className="uppercase tracking-[0.08em] text-ink">{locale === 'tr' ? 'Tedarik' : 'Sourcing'}</div>
              <div>{locale === 'tr' ? 'OEM ve onaylı dağıtım ağı · ABD üzerinden sevkiyat' : 'OEM and approved distributor network · US-based shipping'}</div>
            </div>
          </aside>
        </div>
      </section>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: p.name,
            brand: { '@type': 'Brand', name: p.brand },
            mpn: p.partNumber,
            sku: p.sku ?? p.partNumber,
            description: p.shortDescription,
            category: p.category_slug ?? p.category,
            ...(p.image ? { image: `${SITE.url}${p.image}` } : {}),
            offers: {
              '@type': 'Offer',
              availability: p.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
              // Intentionally no price — RFQ-only sales (T3 / F3).
              priceCurrency: 'USD',
              seller: { '@type': 'Organization', name: SITE.legalName }
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema([
            { name: 'Home', url: SITE.url },
            { name: 'Supply', url: `${SITE.url}/supply` },
            ...(topCat ? [{ name: topCat.name_en, url: `${SITE.url}/supply/category/${topCat.slug}` }] : []),
            ...(subHit ? [{ name: subHit.sub.name_en, url: `${SITE.url}/supply/category/${subHit.sub.slug}` }] : []),
            { name: p.name, url }
          ]))
        }}
      />
    </article>
  );
}
