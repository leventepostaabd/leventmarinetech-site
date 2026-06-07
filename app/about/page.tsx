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
    <div className="bg-white">
      <article>
        {/* TITLE + position */}
        <section className="container-x pt-10 md:pt-14">
          <div className="kicker mb-3 text-amber-700">{t('about.kicker')}</div>
          <h1 className="text-balance max-w-4xl text-[26px] leading-[1.1] text-navy-700 md:text-[36px]">
            {t('about.h1')}
          </h1>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-amber-700 md:text-[12px]">
            {t('about.position')}
          </p>
        </section>

        {/* CREDENTIALS — moved up, right under the title */}
        <section className="container-x pt-7 pb-10 md:pb-12">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <div className="kicker mb-2 text-amber-700">{t('about.certsKicker')}</div>
              <h2 className="max-w-3xl text-[20px] text-navy-700 md:text-[22px]">{t('about.certsH2')}</h2>
            </div>
            <p className="hidden max-w-xs text-right text-[12.5px] text-ink-subtle sm:block">
              {t('about.certsTapHint')}
            </p>
          </div>
          <CertMarquee viewLabel={t('about.viewCert')} />
        </section>

        {/* COVERAGE — full-bleed map, narrative floated in the empty interior */}
        <section className="relative w-full border-y border-line bg-white">
          <USAMap transparent />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 md:justify-start md:pl-[7%]">
            <div className="pointer-events-auto w-full max-w-lg rounded-[28px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.97)_56%,rgba(255,255,255,0)_100%)] p-7 text-center md:p-10 md:text-left">
              <div className="kicker mb-2 text-amber-700">{t('about.coverageKicker')}</div>
              <p className="text-[14.5px] leading-relaxed text-ink-muted md:text-[15.5px]">
                {t('about.lead')}
              </p>

              <div className="mt-5">
                <div className="kicker mb-2 text-amber-700">{t('about.classKicker')}</div>
                <ul className="flex flex-wrap justify-center gap-1.5 md:justify-start">
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
