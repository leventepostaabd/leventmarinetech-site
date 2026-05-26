import type { Metadata } from 'next';
import Link from 'next/link';
import { readRegionsList } from '@/lib/content';
import { getLocale, getTranslator } from '@/lib/i18n';
import { SITE } from '@/lib/site';
import { breadcrumbSchema } from '@/lib/schema-org';

export const metadata: Metadata = {
  title: 'US Port Coverage — Marine Electrical Service at Every Major Port',
  description:
    'Marine electrical service and parts supply at every major US port — Houston, NY/NJ, Long Beach, Savannah, Charleston, Norfolk, Baltimore, LA, Oakland, Seattle and more. Engineer on board within hours, AOG spares same day.',
  alternates: { canonical: '/ports' }
};

export default function PortsIndex() {
  const regions = readRegionsList();
  const t = getTranslator(getLocale());
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: `${SITE.url}/` },
    { name: 'US Ports', url: `${SITE.url}/ports` }
  ]);
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'US Port Coverage — Levent Marine',
    itemListElement: regions.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE.url}/ports/${r.slug}`,
      name: `${r.city}, ${r.state}`
    }))
  };

  return (
    <div className="lm-screen bg-white">
      <article className="lm-screen-body">
        <section className="bg-navy-700 text-white py-16 md:py-20">
          <div className="container-x">
            <div className="kicker text-white/70 mb-3">{t('portsIndex.kicker')}</div>
            <h1 className="text-white text-balance max-w-4xl text-[28px] md:text-[40px] leading-[1.1]">
              {t('portsIndex.h1')}
            </h1>
            <p className="mt-5 text-[15.5px] md:text-[17px] text-white/75 max-w-3xl leading-relaxed">
              {t('portsIndex.lead')}
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-white">
          <div className="container-x">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {regions.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/ports/${r.slug}`}
                    className="card no-underline h-full flex flex-col group hover:border-amber transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-amber mb-1.5">
                      {r.state}
                    </div>
                    <h2 className="text-[19px] mb-2 leading-tight font-head font-bold group-hover:text-amber-600">
                      {r.city}
                    </h2>
                    <p className="text-ink-muted text-[13.5px] leading-relaxed line-clamp-3 mb-3">
                      {r.intro}
                    </p>
                    <div className="mt-auto pt-3 border-t border-line text-[11px] font-mono text-ink-subtle">
                      {r.logistics?.responseNote ?? t('portsIndex.responseFallback')}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-12 bg-navy-50 border-y border-line">
          <div className="container-x text-center">
            <h2 className="text-[22px] mb-2">{t('portsIndex.notListedH2')}</h2>
            <p className="text-ink-muted max-w-2xl mx-auto mb-5 text-[14.5px]">
              {t('portsIndex.notListedLead')}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/service-wizard" className="btn-primary btn-md no-underline">
                {t('portsIndex.requestService')}
              </Link>
              <Link href="/contact" className="btn-ghost btn-md no-underline">
                {t('portsIndex.contact')}
              </Link>
            </div>
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
        />
      </article>
    </div>
  );
}
