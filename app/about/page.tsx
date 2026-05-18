import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

export const metadata: Metadata = { title: 'About', alternates: { canonical: '/about' } };

export default function About() {
  return (
    <article>
      <section className="bg-navy-700 text-white py-16">
        <div className="container-x">
          <div className="kicker text-white/70 mb-3">About</div>
          <h1 className="text-white text-balance max-w-4xl">Onboard background, US-registered, RFQ-first.</h1>
          <p className="mt-5 text-[17px] text-white/75 max-w-3xl leading-relaxed">
            Levent Marine is a commercial-vessel-focused marine electrical service and technical parts supply desk. Founded by a working STCW III/6 Electro-Technical Officer with 12 years aboard bulk carriers, tankers, container vessels and offshore units. Wyoming-registered for clean US procurement; Tuzla-based for European and Mediterranean operations.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-x grid gap-12 md:grid-cols-2">
          <div>
            <div className="kicker mb-3">Why us</div>
            <h2 className="mb-4 text-[26px]">Not a procurement broker.</h2>
            <p className="text-ink-muted leading-relaxed mb-4">
              Every RFQ is reviewed by someone who has actually terminated a busbar on a moving deck. We don't forward inquiries to a generic agent — we read the part number, look at the photo, and reply with a real engineering opinion.
            </p>
            <p className="text-ink-muted leading-relaxed">
              When an OEM is obsolete, we propose a compatible replacement and document where it matches and where it differs. The final call belongs to your superintendent — we provide the paper trail.
            </p>
          </div>
          <div>
            <div className="kicker mb-3">Stats</div>
            <ul className="grid grid-cols-2 gap-3">
              <li className="stat"><span className="num">{SITE.trust.vessels}</span><span className="lbl">vessels serviced</span></li>
              <li className="stat"><span className="num">{SITE.trust.years} yr</span><span className="lbl">onboard background</span></li>
              <li className="stat"><span className="num">&lt;{SITE.trust.response}</span><span className="lbl">engineer on board</span></li>
              <li className="stat"><span className="num">{SITE.trust.network}</span><span className="lbl">supplier countries</span></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 bg-navy-50">
        <div className="container-x">
          <div className="kicker mb-3">Compliance</div>
          <h2 className="mb-6 text-[26px] max-w-3xl">Set up for US-flag and US-port operations.</h2>
          <ul className="grid gap-4 md:grid-cols-2">
            <li className="card">
              <h3 className="text-[17px] mb-1">Wyoming LLC</h3>
              <p className="text-ink-muted text-[14px]">Clean US-bank USD invoicing. TWIC/port-access-ready coordination. USCG / CBP-aware paperwork.</p>
            </li>
            <li className="card">
              <h3 className="text-[17px] mb-1">STCW III/6 ETO</h3>
              <p className="text-ink-muted text-[14px]">Internationally recognised Electro-Technical Officer certification. HV ≤1000V endorsement.</p>
            </li>
            <li className="card">
              <h3 className="text-[17px] mb-1">Safety endorsements</h3>
              <p className="text-ink-muted text-[14px]">Advanced Fire Fighting (STCW VI/3), Medical First Aid (VI/4-1), Basic Safety (VI/1), Gas & Oil/Chem Tanker familiarization.</p>
            </li>
            <li className="card">
              <h3 className="text-[17px] mb-1">Commercial vessel focus</h3>
              <p className="text-ink-muted text-[14px]">Bulker, tanker, container, OSV, Ro-Ro. We do not service yachts or pleasure craft.</p>
            </li>
          </ul>
        </div>
      </section>
    </article>
  );
}
