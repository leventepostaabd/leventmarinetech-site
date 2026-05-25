import type { Metadata } from 'next';
import Link from 'next/link';
import USAMap from '@/components/USAMap';
import LogoStrip from '@/components/LogoStrip';
import CertBadges, { CERTIFICATIONS } from '@/components/CertBadges';
import { SITE } from '@/lib/site';
import { organizationSchema, breadcrumbSchema } from '@/lib/schema-org';
import { getLocale, getTranslator } from '@/lib/i18n';

/**
 * /about — SEO depth page (Y2).
 *
 * Quick-look modal lives in <AboutModal /> rendered from the homepage. This
 * page is the search-engine-optimised long-form profile: company narrative,
 * engineer background, equipment, client list, cert detail, class authorities,
 * coverage map. Server-rendered, full metadata, breadcrumb + about schema.
 */
export const metadata: Metadata = {
  title: 'About — Marine Electrical Service & Parts Supply',
  description:
    "Florida-based, Wyoming-registered marine electrical service desk. STCW III/6 ETO and control-system engineer, class-aware reports for DNV · BV · ABS · Lloyd's · TL · RINA · ClassNK · IRS. 24/7 worldwide.",
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Levent Marine — STCW III/6 ETO, US-registered, worldwide',
    description:
      'Marine electrical service and parts supply by an active STCW III/6 Electro-Technical Officer and control-system engineer. Class-aware paperwork, US-port response, AOG parts dispatch.',
    type: 'profile'
  }
};

const CLASS_AUTHORITIES = ['DNV', 'BV', 'ABS', "Lloyd's Register", 'TL', 'RINA', 'ClassNK', 'IRS'] as const;

const EQUIPMENT = [
  { kit: 'Insulation',        tools: 'Megger MIT525 (5 kV), Fluke 1587 FC' },
  { kit: 'Power Quality',     tools: 'Hioki PW3198, Yokogawa CW240 clamp' },
  { kit: 'Thermography',      tools: 'FLIR T540, FLIR E96' },
  { kit: 'Protection Relay',  tools: 'OMICRON CMC 356, SVERKER 900' },
  { kit: 'Earth Loop / GFCI', tools: 'Fluke 1664 FC, Megger DLRO10HD' },
  { kit: 'Marine Comms',      tools: 'JRC, Furuno, Sailor — survey terminals' }
];

const CLIENT_LIST = [
  'MSC / MEDLOG',
  'TP Offshore',
  'Polaris Denizcilik',
  'Bright Denizcilik',
  'Çebi Kaptan',
  'Reederei NORD'
] as const;

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
      {/* HERO */}
      <section className="bg-navy-700 text-white pt-10 pb-12 md:pt-14 md:pb-16">
        <div className="container-x">
          <div className="kicker text-white/70 mb-3">{t('about.kicker')}</div>
          <h1 className="text-white text-balance max-w-4xl text-[26px] md:text-[36px] leading-[1.1]">
            {t('about.h1')}
          </h1>
          <p className="mt-3 font-mono text-[11px] md:text-[12px] uppercase tracking-[0.18em] text-amber">
            {t('about.position')}
          </p>
          <p className="mt-5 text-[15px] md:text-[17px] text-white/80 max-w-3xl leading-relaxed">
            {t('about.lead')}
          </p>
          <div className="mt-6">
            <CertBadges />
          </div>
        </div>
      </section>

      {/* KEY NUMBERS */}
      <section className="py-12 bg-white border-b border-line">
        <div className="container-x">
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <li className="stat"><span className="num">19</span><span className="lbl">{t('about.statsYearsLbl')}</span></li>
            <li className="stat"><span className="num">25</span><span className="lbl">{t('about.statsPortsLbl')}</span></li>
            <li className="stat"><span className="num">24/7</span><span className="lbl">{t('about.statsAogLbl')}</span></li>
            <li className="stat"><span className="num">8</span><span className="lbl">{t('about.statsClassLbl')}</span></li>
          </ul>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="py-16 bg-white">
        <div className="container-x grid gap-12 md:grid-cols-2">
          <div>
            <div className="kicker mb-3">{t('about.backgroundKicker')}</div>
            <h2 className="mb-4 text-[26px]">{t('about.backgroundH2')}</h2>
            <p className="text-ink-muted leading-relaxed mb-4">
              {t('about.backgroundP1')}
            </p>
            <p className="text-ink-muted leading-relaxed">
              {t('about.backgroundP2')}
            </p>
          </div>
          <div>
            <div className="kicker mb-3">{t('about.notDoKicker')}</div>
            <h2 className="mb-4 text-[26px]">{t('about.notDoH2')}</h2>
            <ul className="space-y-3 text-ink-muted text-[14.5px] leading-relaxed">
              <li>• {t('about.notDo1')}</li>
              <li>• {t('about.notDo2')}</li>
              <li>• {t('about.notDo3')}</li>
              <li>• {t('about.notDo4')}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS DETAIL */}
      <section className="py-16 bg-navy-50 border-y border-line">
        <div className="container-x">
          <div className="kicker mb-3">{t('about.certsKicker')}</div>
          <h2 className="mb-6 text-[26px] max-w-3xl">
            {t('about.certsH2')}
          </h2>
          <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {CERTIFICATIONS.map((c) => (
              <li key={c.abbr} className="card">
                <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-amber mb-1">
                  {c.reg}
                </div>
                <h3 className="text-[17px] mb-0.5">{c.full}</h3>
                <p className="text-ink-subtle text-[12.5px] font-mono">{c.abbr}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* EQUIPMENT */}
      <section className="py-16 bg-white">
        <div className="container-x grid gap-10 md:grid-cols-[1fr_1.2fr]">
          <div>
            <div className="kicker mb-3">{t('about.equipmentKicker')}</div>
            <h2 className="mb-4 text-[26px]">{t('about.equipmentH2')}</h2>
            <p className="text-ink-muted leading-relaxed text-[14.5px]">
              {t('about.equipmentLead')}
            </p>
            <div
              className="mt-6 aspect-[4/3] w-full rounded-md bg-navy-700 border border-navy-600 grid place-items-center"
              aria-label="Photograph placeholder of test equipment cases on a vessel deck"
            >
              <svg viewBox="0 0 64 64" className="w-16 h-16 text-amber/70" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="6" y="14" width="52" height="40" rx="3" />
                <path d="M22 14v-4h20v4M14 32h36M28 24h8" />
              </svg>
            </div>
          </div>
          <div>
            <ul className="grid gap-2">
              {EQUIPMENT.map((e) => (
                <li
                  key={e.kit}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4 py-3 border-b border-line last:border-b-0"
                >
                  <span className="font-head font-bold text-ink text-[15px]">{e.kit}</span>
                  <span className="font-mono text-[12.5px] text-ink-muted md:text-right">{e.tools}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CLIENT LIST */}
      <section className="py-12 bg-navy-50 border-y border-line">
        <div className="container-x">
          <div className="kicker mb-3">{t('about.clientsKicker')}</div>
          <h2 className="mb-6 text-[24px] max-w-3xl">
            {t('about.clientsH2')}
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {CLIENT_LIST.map((c) => (
              <li
                key={c}
                className="card flex items-center justify-center text-center text-ink font-mono text-[12.5px] tracking-[0.08em] font-semibold"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CLASS AUTHORITIES */}
      <section className="py-16 bg-white">
        <div className="container-x">
          <div className="kicker mb-3">{t('about.classKicker')}</div>
          <h2 className="mb-6 text-[26px] max-w-3xl">
            {t('about.classH2')}
          </h2>
          <ul className="flex flex-wrap gap-2.5">
            {CLASS_AUTHORITIES.map((c) => (
              <li
                key={c}
                className="inline-flex items-center px-4 py-2 rounded-md border border-line-strong bg-navy-50 font-mono text-[12.5px] font-semibold tracking-wide text-navy-700"
              >
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-ink-muted text-[14px] leading-relaxed max-w-3xl">
            {t('about.classLead')}
          </p>
        </div>
      </section>

      {/* COVERAGE MAP */}
      <section className="py-16 bg-navy-700 text-white">
        <div className="container-x">
          <div className="kicker text-white/70 mb-3">{t('about.coverageKicker')}</div>
          <h2 className="text-white mb-3 text-[26px]">{t('about.coverageH2')}</h2>
          <p className="text-white/75 max-w-3xl text-[15px] leading-relaxed mb-8">
            {t('about.coverageLead')}
          </p>
          <div className="rounded-lg overflow-hidden border border-navy-600 bg-navy-800/60">
            <USAMap />
          </div>
        </div>
      </section>

      {/* LOGO STRIP — same band the home page uses */}
      <LogoStrip />

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="container-x text-center">
          <div className="kicker justify-center mb-3 inline-block">{t('about.nextStepKicker')}</div>
          <h2 className="mb-4 max-w-2xl mx-auto">
            {t('about.nextStepH2')}
          </h2>
          <p className="text-ink-muted max-w-2xl mx-auto mb-7 text-[15.5px] leading-relaxed">
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
