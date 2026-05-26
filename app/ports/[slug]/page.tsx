import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getRegion, readRegionsList } from '@/lib/content';
import { getLocale, getTranslator } from '@/lib/i18n';
import { SITE } from '@/lib/site';
import { breadcrumbSchema, localBusinessSchema } from '@/lib/schema-org';

type Params = { params: { slug: string } };

export function generateStaticParams() {
  return readRegionsList().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const r = getRegion(params.slug);
  if (!r) return { title: 'Port not found' };
  return {
    title: r.metaTitle,
    description: r.metaDescription,
    alternates: { canonical: `/ports/${r.slug}` },
    openGraph: {
      title: r.metaTitle,
      description: r.metaDescription,
      url: `${SITE.url}/ports/${r.slug}`,
      type: 'website'
    }
  };
}

export default function PortPage({ params }: Params) {
  const r = getRegion(params.slug);
  if (!r) notFound();

  const t = getTranslator(getLocale());
  const url = `${SITE.url}/ports/${r.slug}`;
  const breadcrumb = breadcrumbSchema([
    { name: 'Home',     url: SITE.url },
    { name: 'US Ports', url: `${SITE.url}/ports` },
    { name: r.city,     url }
  ]);
  const lb = localBusinessSchema({
    name: `Levent Marine — ${r.city}`,
    city: r.schemaCity ?? r.city,
    state: r.state,
    serviceArea: r.schemaServiceArea ?? [`${r.city}, ${r.state}`],
    description: r.metaDescription,
    url
  });

  return (
    <article>
      <header className="bg-navy-700 text-white">
        <div className="container-x py-10 md:py-14">
          <Link
            href="/ports"
            className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-white/5 px-4 py-2 text-[13px] font-mono uppercase tracking-[0.14em] text-white no-underline transition hover:border-amber hover:bg-amber hover:text-navy-700 mb-6"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            {t('portDetail.allPorts')}
          </Link>

          <nav className="text-[12px] font-mono text-white/55 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-amber no-underline">{t('portDetail.breadcrumbHome')}</Link>
            <span className="mx-2">/</span>
            <Link href="/ports" className="hover:text-amber no-underline">{t('portDetail.breadcrumbPorts')}</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{r.city}, {r.state}</span>
          </nav>

          <div className="kicker text-white/70 mb-3">{r.city}, {r.state}</div>
          <h1 className="text-white text-balance max-w-4xl">{r.h1}</h1>
          <p className="mt-5 text-[15px] md:text-[17px] text-white/80 max-w-3xl leading-relaxed">
            {r.intro}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={`/service-wizard?port=${encodeURIComponent(r.city)}`} className="btn-accent btn-lg">
              {t('portDetail.requestPrefix')} {r.city} →
            </Link>
            <a
              href={SITE.whatsappUS}
              target="_blank"
              rel="noopener"
              className="btn-ghost btn-lg !bg-transparent !text-white !border-white/30 hover:!bg-white/10"
            >
              {t('portDetail.whatsappUs')}
            </a>
          </div>
          {r.logistics?.responseNote && (
            <p className="mt-5 text-[13px] text-white/60 font-mono">{r.logistics.responseNote}</p>
          )}
        </div>
      </header>

      {/* LOGISTICS */}
      {r.logistics && (
        <section className="py-12 md:py-14 bg-white">
          <div className="container-x grid gap-10 md:grid-cols-2">
            <div>
              <div className="kicker mb-3">{t('portDetail.logisticsKicker')}</div>
              <h2 className="mb-4 text-[24px]">{t('portDetail.logisticsH2')}</h2>
              <p className="text-ink-muted leading-relaxed text-[14.5px]">
                {r.logistics.responseNote}
              </p>
            </div>
            <div className="grid gap-5">
              {r.logistics.airports?.length > 0 && (
                <div>
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-amber-600 mb-2">
                    {t('portDetail.airports')}
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {r.logistics.airports.map((a) => (
                      <li key={a} className="chip">{a}</li>
                    ))}
                  </ul>
                </div>
              )}
              {r.logistics.freightHubs?.length > 0 && (
                <div>
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-amber-600 mb-2">
                    {t('portDetail.freightHubs')}
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {r.logistics.freightHubs.map((f) => (
                      <li key={f} className="chip">{f}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* TERMINALS */}
      {r.ports && r.ports.length > 0 && (
        <section className="py-12 md:py-14 bg-navy-50 border-y border-line">
          <div className="container-x">
            <div className="kicker mb-3">{t('portDetail.terminalsKicker')}</div>
            <h2 className="mb-6 text-[24px] max-w-3xl">{r.city} {t('portDetail.terminalsH2Suffix')}</h2>
            <ul className="grid gap-4 md:grid-cols-2">
              {r.ports.map((p) => (
                <li key={p.name} className="card">
                  <h3 className="text-[16px] mb-1 font-head font-bold">{p.name}</h3>
                  {p.vesselTypes?.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5 mb-2.5">
                      {p.vesselTypes.map((v) => (
                        <li key={v} className="inline-block text-[10.5px] font-mono uppercase tracking-[0.1em] text-ink-subtle bg-white px-2 py-0.5 rounded-full ring-1 ring-line">
                          {v}
                        </li>
                      ))}
                    </ul>
                  )}
                  {p.notes && (
                    <p className="text-ink-muted text-[13.5px] leading-relaxed">{p.notes}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* SCENARIOS */}
      {r.scenarios && r.scenarios.length > 0 && (
        <section className="py-12 md:py-14 bg-white">
          <div className="container-x">
            <div className="kicker mb-3">{t('portDetail.scenariosKicker')}</div>
            <h2 className="mb-6 text-[24px] max-w-3xl">{t('portDetail.scenariosH2Prefix')} {r.city}.</h2>
            <ul className="grid gap-5 md:grid-cols-2">
              {r.scenarios.map((s, i) => (
                <li key={i} className="rounded-2xl bg-navy-50 ring-1 ring-line/60 p-5 md:p-6">
                  <h3 className="text-[16.5px] mb-2 font-head font-bold text-navy-700">{s.title}</h3>
                  <p className="text-ink-muted text-[13.5px] leading-relaxed">{s.summary}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* INVOICING */}
      {r.usdInvoicing && (
        <section className="py-10 bg-navy-50 border-y border-line">
          <div className="container-x text-center">
            <p className="text-ink-muted text-[14px] max-w-2xl mx-auto leading-relaxed">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-amber-700 block mb-1.5">
                {t('portDetail.invoicingLabel')}
              </span>
              {r.usdInvoicing}
            </p>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-14 md:py-16 bg-navy-700 text-white">
        <div className="container-x text-center">
          <h2 className="text-white mb-3 text-balance">
            {t('portDetail.ctaPrefix')} {r.city}?
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-7">
            {t('portDetail.ctaLead')}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href={`/service-wizard?port=${encodeURIComponent(r.city)}`}
              className="btn-accent btn-lg"
            >
              {t('portDetail.ctaRequest')}
            </Link>
            <a
              href={SITE.whatsappUS}
              target="_blank"
              rel="noopener"
              className="btn-ghost btn-lg !bg-transparent !text-white !border-white/30 hover:!bg-white/10"
            >
              {t('portDetail.whatsappUs')}
            </a>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lb) }}
      />
    </article>
  );
}
