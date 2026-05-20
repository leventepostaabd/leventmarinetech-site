import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { readServices } from '@/lib/content';
import { SERVICE_SLUGS, SITE } from '@/lib/site';
import { serviceSchema, breadcrumbSchema } from '@/lib/schema-org';

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const s = readServices()[params.slug];
  if (!s) return {};
  return {
    title: s.metaTitle,
    description: s.metaDescription,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: { title: s.metaTitle, description: s.metaDescription, url: `${SITE.url}/services/${s.slug}` }
  };
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const s = readServices()[params.slug];
  if (!s) notFound();

  const url = `${SITE.url}/services/${s.slug}`;

  return (
    <article>
      {/* HERO */}
      <header className="bg-navy-700 text-white py-16 md:py-20">
        <div className="container-x">
          <nav className="text-[12px] font-mono text-white/55 mb-6">
            <Link href="/" className="hover:text-amber no-underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/services" className="hover:text-amber no-underline">Services</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{s.kicker}</span>
          </nav>
          <div className="kicker text-white/70 mb-3">{s.kicker}</div>
          <h1 className="text-white text-balance max-w-4xl">{s.title}</h1>
          <p className="mt-5 text-[17px] text-white/75 max-w-3xl leading-relaxed">{s.intro}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={`/service-wizard?service=${s.slug}`} className="btn-accent btn-lg">{s.ctaService}</Link>
            <Link href={`/supply-wizard?service=${s.slug}`} className="btn-ghost btn-lg !bg-transparent !text-white !border-white/30 hover:!bg-white/10">{s.ctaSupply}</Link>
          </div>
        </div>
      </header>

      {/* SYMPTOMS + ROOT CAUSES */}
      <section className="py-16 bg-white">
        <div className="container-x grid gap-12 md:grid-cols-2">
          <div>
            <div className="kicker mb-3">Common symptoms</div>
            <h2 className="mb-4 text-[26px]">What we hear from the bridge.</h2>
            <ul className="space-y-2.5">
              {s.symptoms.map((sym) => (
                <li key={sym} className="flex items-start gap-3 text-ink-muted text-[14.5px] leading-relaxed">
                  <span className="text-amber font-bold mt-1.5 leading-none">›</span>
                  <span>{sym}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="kicker mb-3">Likely root causes</div>
            <h2 className="mb-4 text-[26px]">Where the fault usually lives.</h2>
            <ul className="space-y-2.5">
              {s.rootCauses.map((c) => (
                <li key={c} className="flex items-start gap-3 text-ink-muted text-[14.5px] leading-relaxed">
                  <span className="text-amber font-bold mt-1.5 leading-none">›</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* WHAT WE CHECK + TOOLS */}
      <section className="py-16 bg-navy-50">
        <div className="container-x grid gap-12 md:grid-cols-2">
          <div>
            <div className="kicker mb-3">What we check</div>
            <h2 className="mb-4 text-[26px]">Inspection steps.</h2>
            <ol className="space-y-3">
              {s.whatWeCheck.map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="font-mono text-amber text-[13px] font-bold w-6 flex-shrink-0 pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-ink-muted text-[14.5px] leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <div className="kicker mb-3">Tools we bring</div>
            <h2 className="mb-4 text-[26px]">Test equipment.</h2>
            <ul className="flex flex-wrap gap-2">
              {s.tools.map((t) => (
                <li key={t} className="chip">{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CASE */}
      <section className="py-16 bg-white">
        <div className="container-x">
          <div className="kicker mb-3">Real case</div>
          <h2 className="mb-6 text-[26px] max-w-3xl">{s.exampleCase.headline}</h2>
          <div className="card border-l-4 border-l-amber max-w-3xl bg-navy-50">
            <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-subtle mb-3">
              <span>{s.exampleCase.vesselType}</span>
              <span>{s.exampleCase.port}</span>
              <span>{s.exampleCase.year}</span>
            </div>
            <p className="text-ink leading-relaxed text-[15px]">{s.exampleCase.summary}</p>
          </div>
        </div>
      </section>

      {/* RELATED SUPPLY */}
      {s.relatedSupply.length > 0 && (
        <section className="py-16 bg-navy-50">
          <div className="container-x">
            <div className="kicker mb-3">Related supply items</div>
            <h2 className="mb-6 text-[26px] max-w-3xl">Parts most often requested with this service.</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {s.relatedSupply.map((p) => (
                <li key={p} className="card text-[14px]">{p}</li>
              ))}
            </ul>
            <div className="mt-8">
              <Link href={`/supply-wizard?service=${s.slug}`} className="btn-accent btn-lg">Request these parts</Link>
            </div>
          </div>
        </section>
      )}

      {/* DUAL CTA */}
      <section className="py-16 bg-navy-700 text-white">
        <div className="container-x text-center">
          <h2 className="text-white mb-3">Have a vessel calling?</h2>
          <p className="text-white/70 max-w-xl mx-auto mb-7">Engineer onboard within hours of a confirmed request. We confirm the same business day.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href={`/service-wizard?service=${s.slug}`} className="btn-accent btn-lg">Request service</Link>
            <a href={SITE.whatsappUS} target="_blank" rel="noopener" className="btn-ghost btn-lg !bg-transparent !text-white !border-white/30 hover:!bg-white/10">WhatsApp US</a>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema({ name: s.title, description: s.intro, url })) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema([
            { name: 'Home', url: SITE.url },
            { name: 'Services', url: `${SITE.url}/services` },
            { name: s.title, url }
          ]))
        }}
      />
    </article>
  );
}
