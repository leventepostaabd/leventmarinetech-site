import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { readRegions } from '@/lib/content';
import { REGION_SLUGS, SITE } from '@/lib/site';
import { localBusinessSchema, breadcrumbSchema } from '@/lib/schema-org';

export function generateStaticParams() {
  return REGION_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const r = readRegions()[params.slug];
  if (!r) return {};
  return {
    title: r.metaTitle,
    description: r.metaDescription,
    alternates: { canonical: `/usa/${r.slug}` }
  };
}

export default function RegionPage({ params }: { params: { slug: string } }) {
  const r = readRegions()[params.slug];
  if (!r) notFound();
  const url = `${SITE.url}/usa/${r.slug}`;

  return (
    <article>
      <header className="bg-navy-700 text-white py-16 md:py-20">
        <div className="container-x">
          <nav className="text-[12px] font-mono text-white/55 mb-6">
            <Link href="/" className="hover:text-amber no-underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/usa" className="hover:text-amber no-underline">USA</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{r.city}, {r.state}</span>
          </nav>
          <div className="kicker text-white/70 mb-3">{r.state} · USA</div>
          <h1 className="text-white text-balance max-w-4xl">{r.h1}</h1>
          <p className="mt-5 text-[17px] text-white/75 max-w-3xl leading-relaxed whitespace-pre-line">{r.intro}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={`/service-wizard?region=${r.slug}`} className="btn-accent btn-lg">Emergency dispatch</Link>
            <a href={SITE.whatsappUS} target="_blank" rel="noopener" className="btn-ghost btn-lg !bg-transparent !text-white !border-white/30 hover:!bg-white/10">WhatsApp 24/7</a>
          </div>
        </div>
      </header>

      {/* Logistics */}
      <section className="py-16 bg-white">
        <div className="container-x grid gap-12 md:grid-cols-2">
          <div>
            <div className="kicker mb-3">Logistics</div>
            <h2 className="mb-5 text-[26px]">How engineers and parts get to your ship.</h2>
            <p className="text-ink-muted leading-relaxed mb-4">{r.logistics.responseNote}</p>
            <dl className="grid gap-3 text-[14px]">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-amber-600 mb-1">Nearest air hubs</dt>
                <dd className="text-ink">{r.logistics.airports.join(' · ')}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-amber-600 mb-1">Freight nodes</dt>
                <dd className="text-ink">{r.logistics.freightHubs.join(' · ')}</dd>
              </div>
            </dl>
          </div>
          <div>
            <div className="kicker mb-3">USD invoicing</div>
            <h2 className="mb-5 text-[26px]">Wyoming LLC. Clean US billing.</h2>
            <p className="text-ink-muted leading-relaxed">{r.usdInvoicing}</p>
          </div>
        </div>
      </section>

      {/* Ports */}
      {r.ports?.length > 0 && (
        <section className="py-16 bg-navy-50">
          <div className="container-x">
            <div className="kicker mb-3">Terminals we attend</div>
            <h2 className="mb-8 text-[26px]">{r.city} berths.</h2>
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {r.ports.map((p) => (
                <li key={p.name} className="card">
                  <div className="font-head font-bold text-ink mb-1">{p.name}</div>
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-amber-600 mb-2">{p.vesselTypes.join(' · ')}</div>
                  <p className="text-ink-muted text-[13.5px] leading-relaxed">{p.notes}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Scenarios */}
      {r.scenarios?.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-x">
            <div className="kicker mb-3">Typical jobs</div>
            <h2 className="mb-8 text-[26px] max-w-3xl">What we get called for in {r.city}.</h2>
            <div className="grid gap-5 md:grid-cols-2">
              {r.scenarios.map((sc) => (
                <article key={sc.title} className="card border-l-4 border-l-amber">
                  <h3 className="mb-2 text-[17px]">{sc.title}</h3>
                  <p className="text-ink-muted text-[14px] leading-relaxed">{sc.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-navy-700 text-white">
        <div className="container-x text-center">
          <h2 className="text-white mb-3">Vessel calling {r.city}?</h2>
          <p className="text-white/70 max-w-xl mx-auto mb-7">Send vessel name, IMO and ETA. We confirm engineer + parts plan the same day.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href={`/service-wizard?region=${r.slug}`} className="btn-accent btn-lg">Send dispatch request</Link>
            <Link href={`/supply-wizard?region=${r.slug}`} className="btn-ghost btn-lg !bg-transparent !text-white !border-white/30 hover:!bg-white/10">Request parts</Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema({
            name: `${SITE.legalName} — ${r.city}`,
            city: r.schemaCity,
            state: r.state,
            serviceArea: r.schemaServiceArea,
            description: r.metaDescription,
            url
          }))
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema([
            { name: 'Home', url: SITE.url },
            { name: 'USA', url: `${SITE.url}/usa` },
            { name: r.city, url }
          ]))
        }}
      />
    </article>
  );
}
