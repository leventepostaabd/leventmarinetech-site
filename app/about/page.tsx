import type { Metadata } from 'next';
import Link from 'next/link';
import USAMap from '@/components/USAMap';
import LogoStrip from '@/components/LogoStrip';
import CertBadges, { CERTIFICATIONS } from '@/components/CertBadges';
import { SITE } from '@/lib/site';
import { organizationSchema, breadcrumbSchema } from '@/lib/schema-org';

/**
 * /about — SEO depth page (Y2).
 *
 * Quick-look modal lives in <AboutModal /> rendered from the homepage. This
 * page is the search-engine-optimised long-form profile: company narrative,
 * 16-year background, equipment, client list, cert detail, class authorities,
 * coverage map. Server-rendered, full metadata, breadcrumb + about schema.
 */
export const metadata: Metadata = {
  title: 'About — Marine Electrical Service & Parts Supply',
  description:
    "Florida-based, Wyoming-registered marine electrical service desk. 16 years onboard, STCW III/6 ETO, class-aware reports for DNV · BV · ABS · Lloyd's · TL · RINA · ClassNK · IRS. 24/7 worldwide.",
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Levent Marine — 16 yr ETO, US-registered, worldwide',
    description:
      'Marine electrical service and parts supply by an active STCW III/6 Electro-Technical Officer. Class-aware paperwork, US-port response, AOG parts dispatch.',
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
    <article>
      {/* HERO */}
      <section className="bg-navy-700 text-white py-20">
        <div className="container-x">
          <div className="kicker text-white/70 mb-3">About</div>
          <h1 className="text-white text-balance max-w-4xl">
            Marine Electrical Service &amp; Parts Supply
          </h1>
          <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.18em] text-amber">
            24/7 Worldwide · Florida-based · Wyoming LLC
          </p>
          <p className="mt-6 text-[17px] text-white/80 max-w-3xl leading-relaxed">
            Levent Marine is a commercial-vessel-focused marine electrical service desk and
            technical parts supplier. Founded and operated by a working STCW Reg. III/6
            Electro-Technical Officer with sixteen years aboard bulkers, tankers, container
            ships and offshore support units. We dispatch an engineer to any US port within
            hours, ship AOG-grade spares the same day, and deliver class-aware reports the
            superintendent can hand straight to the surveyor.
          </p>
          <div className="mt-7">
            <CertBadges />
          </div>
        </div>
      </section>

      {/* KEY NUMBERS */}
      <section className="py-12 bg-white border-b border-line">
        <div className="container-x">
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <li className="stat"><span className="num">16 yr</span><span className="lbl">onboard background</span></li>
            <li className="stat"><span className="num">25</span><span className="lbl">US ports covered</span></li>
            <li className="stat"><span className="num">24/7</span><span className="lbl">aog dispatch</span></li>
            <li className="stat"><span className="num">8</span><span className="lbl">class authorities</span></li>
          </ul>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="py-16 bg-white">
        <div className="container-x grid gap-12 md:grid-cols-2">
          <div>
            <div className="kicker mb-3">Background</div>
            <h2 className="mb-4 text-[26px]">Sixteen years on the deckplate, not behind a desk.</h2>
            <p className="text-ink-muted leading-relaxed mb-4">
              The lead engineer carries a current STCW III/6 ETO licence with HV &le; 1000 V
              endorsement, plus Advanced Fire Fighting (VI/3), Medical First Aid (VI/4-1),
              Basic Safety (VI/1) and Gas / Oil &amp; Chemical Tanker familiarisation.
              Every RFQ, every dispatch and every report is reviewed by someone who has
              actually terminated a busbar on a moving deck &mdash; not forwarded to a generic
              procurement agent.
            </p>
            <p className="text-ink-muted leading-relaxed">
              When the OEM is obsolete, we propose a compatible replacement and document
              where it matches and where it differs. The final call belongs to your
              superintendent &mdash; we provide the paper trail and the class wording.
            </p>
          </div>
          <div>
            <div className="kicker mb-3">What we do not do</div>
            <h2 className="mb-4 text-[26px]">Commercial vessels only.</h2>
            <ul className="space-y-3 text-ink-muted text-[14.5px] leading-relaxed">
              <li>• No yachts, no pleasure craft, no superyacht refits.</li>
              <li>• No public pricing &mdash; every order is RFQ-first to protect margin and audit trail.</li>
              <li>• No customer login required &mdash; single sender / sole contact through the wizard.</li>
              <li>• No subcontracting of class-witnessed work to unbranded third parties.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS DETAIL */}
      <section className="py-16 bg-navy-50 border-y border-line">
        <div className="container-x">
          <div className="kicker mb-3">Certifications</div>
          <h2 className="mb-6 text-[26px] max-w-3xl">
            STCW endorsements held by the lead engineer.
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
            <div className="kicker mb-3">Equipment</div>
            <h2 className="mb-4 text-[26px]">Test kit on every dispatch.</h2>
            <p className="text-ink-muted leading-relaxed text-[14.5px]">
              We arrive with the meter, not just the wrench. Standard go-bag includes
              insulation testers up to 5 kV, infrared cameras, power-quality analysers and
              protection-relay test sets. Heavier kit (primary injection, partial-discharge,
              transformer ratiometer) follows on the next freight if the job calls for it.
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
          <div className="kicker mb-3">Repeat fleets</div>
          <h2 className="mb-6 text-[24px] max-w-3xl">
            A small list, deliberately. Long-running working relationships.
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
          <div className="kicker mb-3">Class authorities</div>
          <h2 className="mb-6 text-[26px] max-w-3xl">
            Reports written for the eight major class societies.
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
            Every dispatch concludes with a report formatted to the requesting class
            society&apos;s template &mdash; including measured values, calibration certificate IDs,
            photographic evidence and a recommended action list with timing. Hand it
            straight to the surveyor; no rewriting required.
          </p>
        </div>
      </section>

      {/* COVERAGE MAP */}
      <section className="py-16 bg-navy-700 text-white">
        <div className="container-x">
          <div className="kicker text-white/70 mb-3">Coverage</div>
          <h2 className="text-white mb-3 text-[26px]">Twenty-five US ports. One number.</h2>
          <p className="text-white/75 max-w-3xl text-[15px] leading-relaxed mb-8">
            Service available at all US ports &mdash; East Coast, West Coast, Gulf, Great Lakes,
            plus Anchorage and Honolulu. Worldwide attendance available on request.
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
          <div className="kicker justify-center mb-3 inline-block">Next step</div>
          <h2 className="mb-4 max-w-2xl mx-auto">
            Vessel due in a US port? Tell us the system and the ETA.
          </h2>
          <p className="text-ink-muted max-w-2xl mx-auto mb-7 text-[15.5px] leading-relaxed">
            Three taps in the wizard puts an engineer or a quote on your superintendent&apos;s
            desk. Email + WhatsApp acknowledgement within minutes &mdash; first available technician
            on the phone within an hour.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/service-wizard" className="btn-primary btn-lg no-underline">
              Request service
            </Link>
            <Link href="/supply-wizard" className="btn-accent btn-lg no-underline">
              Request a quote
            </Link>
            <Link href="/contact" className="btn-ghost btn-lg no-underline">
              Contact
            </Link>
          </div>
          <p className="mt-8 text-[11px] font-mono uppercase tracking-[0.14em] text-ink-subtle">
            {SITE.legalName} · Wyoming LLC · Florida operations · 24/7 worldwide
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
  );
}
