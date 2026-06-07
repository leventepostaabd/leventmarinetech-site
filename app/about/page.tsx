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

        {/* FIRST SCREEN — map fills the view (Gulf anchored at the bottom),
            credentials marquee tucked underneath. Narrative floats high in the
            cleared interior so it never covers the Gulf ports. */}
        <section className="pt-20">
          <div className="relative mx-auto h-[70vh] w-full max-w-[1180px] px-4">
            {/* Fill the box, bottom-anchored on the Gulf; only the empty top sky
                is trimmed — northern ports and bottom labels stay. */}
            <USAMap fit transparent />

            <div className="pointer-events-none absolute inset-0 flex items-start justify-center px-4 pt-[3%]">
              <div className="pointer-events-auto w-full max-w-2xl rounded-[28px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.96)_62%,rgba(255,255,255,0)_100%)] px-6 py-5 text-center">
                <p className="text-balance text-[16px] font-medium leading-relaxed text-navy-700 md:text-[19px]">
                  {t('about.lead')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Credentials — peek under the map on the first screen */}
        <section className="px-4 pb-3 pt-1 md:px-8">
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
