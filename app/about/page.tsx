import type { Metadata } from 'next';
import Link from 'next/link';
import USAMap from '@/components/USAMap';
import LogoStrip from '@/components/LogoStrip';
import CertMarquee from '@/components/CertMarquee';
import { SITE } from '@/lib/site';
import { organizationSchema, breadcrumbSchema } from '@/lib/schema-org';
import { getLocale, getTranslator } from '@/lib/i18n';

/**
 * /about — minimalist single-screen profile.
 *
 * First screen: a full-bleed, transparent US coverage map (Gulf = primary
 * area) with the about narrative + class-society chips floated on a feathered
 * white panel over the cleared interior. Credentials marquee, client logos
 * and CTA follow below (inner-scroll, per the no-scroll shell rule).
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
        <h1 className="sr-only">{t('about.h1')} — {t('about.position')}</h1>

        {/* COVERAGE — full-bleed map sized to one screen; narrative floats in
            the cleared interior (no grid, no interior dots, no overlap). */}
        <section className="relative h-screen w-full">
          <div className="absolute inset-0 pt-20">
            <div className="relative h-full w-full">
              <USAMap fit transparent />

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
                <div className="pointer-events-auto w-full max-w-lg rounded-[28px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.97)_60%,rgba(255,255,255,0)_100%)] p-7 text-center md:p-10">
                  <p className="text-[14.5px] leading-relaxed text-ink-muted md:text-[16px]">
                    {t('about.lead')}
                  </p>
                  <ul className="mt-5 flex flex-wrap justify-center gap-1.5">
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
              </div>
            </div>
          </div>
        </section>

        {/* CREDENTIALS — below the map */}
        <section className="container-x py-10 md:py-12">
          <CertMarquee viewLabel={t('about.viewCert')} />
        </section>

        {/* CLIENT LOGOS */}
        <LogoStrip />

        {/* CTA */}
        <section className="border-t border-line bg-white py-16 md:py-20">
          <div className="container-x text-center">
            <div className="kicker mb-3 inline-block text-amber-700">{t('about.nextStepKicker')}</div>
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
