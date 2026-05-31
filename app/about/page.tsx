import type { Metadata } from 'next';
import Link from 'next/link';
import USAMap from '@/components/USAMap';
import LogoStrip from '@/components/LogoStrip';
import CertMarquee from '@/components/CertMarquee';
import { SITE } from '@/lib/site';
import { organizationSchema, breadcrumbSchema } from '@/lib/schema-org';
import { getLocale, getTranslator } from '@/lib/i18n';

/**
 * /about — long-form profile.
 *
 * Light, corporate palette throughout (white + navy-50 alternating bands,
 * amber accents). Compact section list, no repetition: hero with stats,
 * credentials marquee (RTL, modal on tap), one engineer-background block
 * with class authorities + equipment as inline chip rows, US coverage map
 * with the Gulf coast highlighted as the primary work area, client logo
 * strip, CTA. Server-rendered with full metadata + JSON-LD.
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

const EQUIPMENT = [
  { kit: 'Insulation',        tools: 'Megger MIT525 · Fluke 1587 FC' },
  { kit: 'Power Quality',     tools: 'Hioki PW3198 · Yokogawa CW240' },
  { kit: 'Thermography',      tools: 'FLIR T540 · FLIR E96' },
  { kit: 'Protection Relay',  tools: 'OMICRON CMC 356 · SVERKER 900' },
  { kit: 'Earth Loop',        tools: 'Fluke 1664 FC · Megger DLRO10HD' },
  { kit: 'Marine Comms',      tools: 'JRC · Furuno · Sailor terminals' }
];

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
        {/* HERO — light, with inline stats. */}
        <section className="bg-white pt-10 pb-10 md:pt-14 md:pb-12 border-b border-line">
          <div className="container-x">
            <div className="kicker mb-3 text-amber-700">{t('about.kicker')}</div>
            <h1 className="text-balance max-w-4xl text-[26px] md:text-[36px] leading-[1.1] text-navy-700">
              {t('about.h1')}
            </h1>
            <p className="mt-3 font-mono text-[11px] md:text-[12px] uppercase tracking-[0.18em] text-amber-700">
              {t('about.position')}
            </p>
            <p className="mt-5 text-[15px] md:text-[17px] text-ink-muted max-w-3xl leading-relaxed">
              {t('about.lead')}
            </p>

            <ul className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl">
              <li className="rounded-xl bg-navy-50/60 ring-1 ring-line/60 px-4 py-3">
                <div className="font-head font-extrabold text-[28px] text-navy-700 leading-none">19</div>
                <div className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-subtle">{t('about.statsYearsLbl')}</div>
              </li>
              <li className="rounded-xl bg-navy-50/60 ring-1 ring-line/60 px-4 py-3">
                <div className="font-head font-extrabold text-[28px] text-navy-700 leading-none">25</div>
                <div className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-subtle">{t('about.statsPortsLbl')}</div>
              </li>
              <li className="rounded-xl bg-navy-50/60 ring-1 ring-line/60 px-4 py-3">
                <div className="font-head font-extrabold text-[28px] text-navy-700 leading-none">24/7</div>
                <div className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-subtle">{t('about.statsAogLbl')}</div>
              </li>
              <li className="rounded-xl bg-navy-50/60 ring-1 ring-line/60 px-4 py-3">
                <div className="font-head font-extrabold text-[28px] text-navy-700 leading-none">8</div>
                <div className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-subtle">{t('about.statsClassLbl')}</div>
              </li>
            </ul>
          </div>
        </section>

        {/* CREDENTIALS — RTL marquee, tap any chip to open the scan + description */}
        <section className="py-10 md:py-12 bg-white">
          <div className="container-x">
            <div className="flex items-end justify-between gap-4 mb-4">
              <div>
                <div className="kicker mb-2 text-amber-700">{t('about.certsKicker')}</div>
                <h2 className="text-[22px] md:text-[24px] text-navy-700 max-w-3xl">
                  {t('about.certsH2')}
                </h2>
              </div>
              <p className="hidden sm:block text-[12.5px] text-ink-subtle max-w-xs text-right">
                {t('about.certsTapHint')}
              </p>
            </div>
            <CertMarquee viewLabel={t('about.viewCert')} />
          </div>
        </section>

        {/* BACKGROUND — single block, with class authorities + equipment chips */}
        <section className="py-12 md:py-16 bg-navy-50/40 border-y border-line">
          <div className="container-x grid gap-10 md:grid-cols-[1.2fr_1fr]">
            <div>
              <div className="kicker mb-3 text-amber-700">{t('about.backgroundKicker')}</div>
              <h2 className="mb-4 text-[24px] md:text-[26px] text-navy-700">{t('about.backgroundH2')}</h2>
              <p className="text-ink-muted leading-relaxed mb-4 text-[14.5px]">
                {t('about.backgroundP1')}
              </p>
              <p className="text-ink-muted leading-relaxed text-[14.5px]">
                {t('about.backgroundP2')}
              </p>
            </div>
            <div className="flex flex-col gap-6">
              {/* Class authorities */}
              <div>
                <div className="kicker mb-2 text-amber-700">{t('about.classKicker')}</div>
                <p className="text-[13px] text-ink-muted mb-3 leading-relaxed">{t('about.classLead')}</p>
                <ul className="flex flex-wrap gap-1.5">
                  {CLASS_AUTHORITIES.map((c) => (
                    <li
                      key={c}
                      className="inline-flex items-center px-3 py-1.5 rounded-md bg-white ring-1 ring-line font-mono text-[11.5px] font-semibold tracking-wide text-navy-700"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Equipment */}
              <div>
                <div className="kicker mb-2 text-amber-700">{t('about.equipmentKicker')}</div>
                <ul className="divide-y divide-line/60 rounded-md bg-white ring-1 ring-line">
                  {EQUIPMENT.map((e) => (
                    <li key={e.kit} className="flex items-center justify-between gap-4 px-3 py-2">
                      <span className="font-head font-bold text-ink text-[13.5px]">{e.kit}</span>
                      <span className="font-mono text-[11.5px] text-ink-subtle text-right">{e.tools}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* COVERAGE MAP — light, Gulf emphasised */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container-x">
            <div className="max-w-3xl mb-6">
              <div className="kicker mb-2 text-amber-700">{t('about.coverageKicker')}</div>
              <h2 className="text-[24px] md:text-[26px] text-navy-700">{t('about.coverageH2')}</h2>
              <p className="mt-3 text-ink-muted text-[14.5px] leading-relaxed">
                {t('about.coverageLead')}
              </p>
            </div>
            <div className="rounded-xl overflow-hidden ring-1 ring-line bg-white">
              <USAMap />
            </div>
          </div>
        </section>

        {/* CLIENT LOGOS */}
        <LogoStrip />

        {/* CTA */}
        <section className="py-16 md:py-20 bg-white border-t border-line">
          <div className="container-x text-center">
            <div className="kicker justify-center mb-3 inline-block text-amber-700">{t('about.nextStepKicker')}</div>
            <h2 className="mb-4 max-w-2xl mx-auto text-navy-700">{t('about.nextStepH2')}</h2>
            <p className="text-ink-muted max-w-2xl mx-auto mb-7 text-[15px] leading-relaxed">
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
            <p className="mt-8 text-[11px] font-mono uppercase tracking-[0.14em] text-ink-subtle">
              {SITE.legalName} · {t('about.finePrint')}
            </p>
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(profile) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
        />
      </article>
    </div>
  );
}
