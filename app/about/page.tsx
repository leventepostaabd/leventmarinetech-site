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

const ABOUT_EN = [
  'Levent Marine Tech is a U.S.-based company providing electro-technical services, engineering support, and technical spare-part supply for commercial vessels.',
  'Founded in 2025 by a marine electrical and control systems engineer with extensive seagoing and shore-based experience across various vessel types, the company combines practical expertise with a responsive, solution-oriented approach.',
  'We deliver reliable and timely services in fault diagnosis, maintenance, commissioning, technical support, and spare-part sourcing, helping vessel operators and technical management teams maintain safe and efficient operations.'
];
const ABOUT_TR = [
  'Levent Marine Tech, ticari gemiler için elektro-teknik hizmetler, mühendislik desteği ve teknik yedek parça tedariği sunan ABD merkezli bir şirkettir.',
  '2025 yılında, farklı gemi tiplerinde kapsamlı deniz ve kara tecrübesine sahip bir gemi elektrik ve kontrol sistemleri mühendisi tarafından kurulmuştur; pratik uzmanlığı hızlı ve çözüm odaklı bir yaklaşımla birleştirir.',
  'Arıza teşhisi, bakım, devreye alma, teknik destek ve yedek parça tedariğinde güvenilir ve zamanında hizmet sunarak gemi işletmecilerinin ve teknik yönetim ekiplerinin güvenli ve verimli operasyon sürdürmesine yardımcı oluruz.'
];

export default function AboutPage() {
  const locale = getLocale();
  const t = getTranslator(locale);
  const about = locale === 'tr' ? ABOUT_TR : ABOUT_EN;

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
        {/* FIRST SCREEN — small header gap, the map in a fixed box that leaves
            room for the credentials marquee right under it (both always in view). */}
        <section className="pt-16">
          <div className="relative mx-auto h-[calc(100svh-13rem)] min-h-[360px] w-full px-2">
            <USAMap fit transparent />

            <div className="pointer-events-none absolute inset-0 flex items-start justify-center px-4 pt-[2%]">
              <div className="pointer-events-auto w-full max-w-2xl space-y-3 rounded-[28px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.97)_64%,rgba(255,255,255,0)_100%)] px-6 py-4 text-center">
                {about.map((p, i) => (
                  <p
                    key={i}
                    className={`leading-relaxed text-navy-700 ${i === 0 ? 'text-[15px] font-semibold md:text-[17px]' : 'text-[13px] font-normal text-ink-muted md:text-[14px]'}`}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Credentials — right under the map, on the first screen */}
        <section className="px-4 pb-3 md:px-8">
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
