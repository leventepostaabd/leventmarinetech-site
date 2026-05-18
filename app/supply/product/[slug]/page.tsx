import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { productBySlug, readProducts } from '@/lib/content';
import { SITE } from '@/lib/site';
import { breadcrumbSchema } from '@/lib/schema-org';

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
  const url = `${SITE.url}/supply/product/${p.slug}`;

  return (
    <article>
      <header className="bg-white border-b border-line">
        <div className="container-x py-10">
          <nav className="text-[12px] font-mono text-ink-subtle mb-6">
            <Link href="/" className="hover:text-amber-600 no-underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/supply" className="hover:text-amber-600 no-underline">Supply</Link>
            <span className="mx-2">/</span>
            <Link href={`/supply/category/${p.category}`} className="hover:text-amber-600 no-underline capitalize">{p.category.replace(/-/g, ' ')}</Link>
            <span className="mx-2">/</span>
            <span className="text-ink">{p.partNumber}</span>
          </nav>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] items-start">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-amber-600 mb-2">{p.brand}</div>
              <h1 className="text-balance">{p.name}</h1>
              <div className="font-mono text-[14px] text-ink-muted mt-2">{p.partNumber}{p.alternativePartNumbers.length > 0 && <span className="text-ink-subtle"> · alt: {p.alternativePartNumbers.join(', ')}</span>}</div>
              <p className="mt-5 text-[16px] text-ink-muted leading-relaxed max-w-2xl">{p.shortDescription}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.slice(0, 6).map((t) => <span key={t} className="chip">{t}</span>)}
              </div>
            </div>

            {/* RIGHT: CTA box */}
            <aside className="card border-l-4 border-l-amber">
              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-subtle">Availability</span>
                <span className={`font-mono text-[11px] uppercase tracking-wider ${p.availability === 'in-stock' ? 'text-green-700' : p.availability === 'available-supplier' ? 'text-amber-600' : 'text-ink-subtle'}`}>{p.availability.replace(/-/g, ' ')}</span>
              </div>
              <div className="font-mono text-[12.5px] text-ink-muted mb-5 leading-snug">{p.deliveryEstimate}</div>

              <div className="flex flex-col gap-2">
                <Link href={`/supply-wizard?product=${p.slug}`} className="btn-accent btn-md">Request quote</Link>
                <Link href={`/supply/equivalent-part-finder?product=${p.slug}`} className="btn-ghost btn-md">Ask for equivalent</Link>
                <Link href={`/supply-wizard?product=${p.slug}&urgency=aog`} className="btn-ghost btn-md">Urgent vessel delivery</Link>
              </div>
              <p className="mt-4 text-[11.5px] text-ink-subtle leading-relaxed">{p.disclaimer}</p>
            </aside>
          </div>
        </div>
      </header>

      <section className="py-14 bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="kicker mb-3">Description</div>
            <div className="prose prose-slate max-w-none">
              {p.longDescription.split(/\n\n+/).map((para, i) => (
                <p key={i} className="text-ink-muted leading-relaxed mb-4">{para}</p>
              ))}
            </div>

            {p.applications.length > 0 && (
              <>
                <div className="kicker mb-3 mt-10">Typical shipboard applications</div>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {p.applications.map((a) => (
                    <li key={a} className="flex items-start gap-2 text-ink-muted text-[14px]"><span className="text-amber mt-1">›</span><span>{a}</span></li>
                  ))}
                </ul>
              </>
            )}

            {p.compatibleSystems.length > 0 && (
              <>
                <div className="kicker mb-3 mt-10">Compatible systems</div>
                <ul className="flex flex-wrap gap-2">{p.compatibleSystems.map((c) => <li key={c} className="chip">{c}</li>)}</ul>
              </>
            )}
          </div>

          {/* Specs sidebar */}
          <aside className="card">
            <div className="kicker mb-3">Technical specs</div>
            <dl className="text-[13.5px]">
              {Object.entries(p.specs).filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="flex justify-between py-1.5 border-b border-line last:border-0">
                  <dt className="font-mono text-[11.5px] uppercase tracking-[0.06em] text-ink-subtle">{k}</dt>
                  <dd className="text-ink text-right">{v}</dd>
                </div>
              ))}
            </dl>
            {p.datasheetUrl && (
              <a href={p.datasheetUrl} target="_blank" rel="noopener" className="mt-5 inline-flex items-center text-[13px] font-mono text-amber-600 no-underline">Datasheet ↗</a>
            )}
          </aside>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: p.name,
          brand: { '@type': 'Brand', name: p.brand },
          mpn: p.partNumber,
          description: p.shortDescription,
          category: p.category,
          offers: {
            '@type': 'Offer',
            availability: p.availability === 'in-stock' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
            priceSpecification: { '@type': 'PriceSpecification', price: 0, priceCurrency: 'USD', valueAddedTaxIncluded: false },
            seller: { '@type': 'Organization', name: SITE.legalName }
          }
        })
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbSchema([
          { name: 'Home', url: SITE.url },
          { name: 'Supply', url: `${SITE.url}/supply` },
          { name: p.category.replace(/-/g, ' '), url: `${SITE.url}/supply/category/${p.category}` },
          { name: p.name, url }
        ]))
      }} />
    </article>
  );
}
