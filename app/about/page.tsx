import type { Metadata } from 'next';
import Link from 'next/link';
import USAMap from '@/components/USAMap';
import LogoStrip from '@/components/LogoStrip';
import CertMarquee from '@/components/CertMarquee';
import { SITE } from '@/lib/site';
import { organizationSchema, breadcrumbSchema } from '@/lib/schema-org';
import { getLocale, getTranslator } from '@/lib/i18n';

/**
 * /about — compact profile.
 *
 * Title + position, then the credentials marquee, then a full-bleed US
 * coverage map whose empty interior carries the about narrative on a
 * feathered white panel (Gulf Coast = primary area). Client logos + CTA close.
 */
export const metadata: Metadata = {
  title: 'About — Marine Electrical Service & Parts Supply',
  description:
    "Florida-based, Wyoming-registered marine electrical service desk. STCW III/6 ETO and control-system engineer, class-aware reports for DNV · BV · ABS · Lloyd's · TL · RINA · ClassNK · IRS. Gulf Coast primary area, 24/7 worldwide.",
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Levent Marine — STCW III/6 ETO, US-registered, worldwide',
    description:
      'Marine electrical service and parts supply by an active STCW III/6 Electro-Technical Officer and control-system engineer. Class-aware paperwork, Gulf Coast response, AOG parts dispatch.',
    type: 'profile'
  }
};

const CLASS_AUTHORITIES = ['DNV', 'BV', 'ABS', "Lloyd's Register", 'TL', 'RINA', 'ClassNK', 'IRS'] as const;

export default function AboutPage() {
  const locale = getLocale();
  const t = getTranslator(locale);
  const tr = locale === 'tr';

  const breadcrumb = breadcrumbSchema([
    { name: 'Home',  url: `${SITE.url}/` },
    { name: 'About', url: `${SITE.url}/about` }
  ]);
  const profile = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Levent Marine',
    url: `${SITE.url}/about`,
    mainEntity: organizationSchema()
  };

  return (
    <div className="lm-screen bg-white">
      <article className="lm-screen-body">
        {/* Certifications flow straight in (headings removed per request).
            sr-only h1 keeps the page titled for SEO / a11y. */}
        <h1 className="sr-only">{t('about.h1')} — {t('about.position')}</h1>
        <section className="container-x pt-8 pb-8 md:pt-10 md:pb-10">
          <CertMarquee viewLabel={t('about.viewCert')} />
        </section>

        {/* COVERAGE — full-bleed map, narrative floated in the empty interior */}
        <section className="relative w-full border-y border-line bg-white">
          <USAMap transparent />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
            <div className="pointer-events-auto w-full max-w-md rounded-[28px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.97)_58%,rgba(255,255,255,0)_100%)] p-7 text-center md:p-9">
              <div className="kicker mb-2 text-amber-700">{t('about.coverageKicker')}</div>
              <p className="text-[14.5px] leading-relaxed text-ink-muted md:text-[15.5px]">
                {t('about.lead')}
              </p>

              <div className="mt-5">
                <div className="kicker mb-2 text-amber-700">{t('about.classKicker')}</div>
                <ul className="flex flex-wrap justify-center gap-1.5">
                  {CLASS_AUTHORITIES.map((c) => (
                    <li
                      key={c}
                      className="inline-flex items-center rounded-md bg-white px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wide text-navy-700 ring-1 ring-line"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-subtle">
                {tr ? 'Kalibreli test ekipmanı' : 'Calibrated test gear'} · Megger · FLIR · OMICRON · Fluke · Hioki
              </p>
            </div>
          </div>
        </section>

        {/* CLIENT LOGOS */}
        <LogoStrip />

        {/* CTA */}
        <section className="border-t border-line bg-white py-16 md:py-20">
          <div className="container-x text-center">
            <div className="kicker mb-3 inline-block justify-center text-amber-700">{t('about.nextStepKicker')}</div>
            <h2 className="mx-auto mb-4 max-w-2xl text-navy-700">{t('about.nextStepH2')}</h2>
            <p className="mx-auto mb-7 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
              {t('about.nextStepLead')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/service-wizard" className="btn-primary btn-lg no-underline">
                {t('about.requestService')}
              </Link>
              <Link href="/supply" className="btn-accent btn-lg no-underline">
                {t('about.browseSupply')}
              </Link>
              <Link href="/contact" className="btn-ghost btn-lg no-underline">
                {t('about.contact')}
              </Link>
            </div>
            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-subtle">
              {SITE.legalName} · {t('about.finePrint')}
            </p>
          </div>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profile) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      </article>
    </div>
  );
}
