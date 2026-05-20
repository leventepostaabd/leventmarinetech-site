import Link from 'next/link';
import { SITE } from '@/lib/site';

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-700 text-white">
        <div className="absolute inset-0 opacity-25">
          {/* Soft amber + navy aurora — uses CSS for performance instead of bg image */}
          <div className="absolute -top-40 -right-20 w-[600px] h-[600px] rounded-full bg-amber/30 blur-3xl" />
          <div className="absolute -bottom-40 -left-20 w-[600px] h-[600px] rounded-full bg-navy-500/40 blur-3xl" />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }}
          />
        </div>
        <div className="container-x relative py-20 md:py-28">
          <div className="kicker text-white/70 mb-5">Marine Electrical Service · Since 2012</div>
          <h1 className="text-balance max-w-4xl text-white">
            Marine Electrical Service &amp; Parts Supply<br />
            <span className="text-amber">— Wyoming, USA + Tuzla, Türkiye</span>
          </h1>
          <p className="mt-5 text-[17px] md:text-[18px] text-white/75 max-w-2xl leading-relaxed">
            Coast-to-coast US response · 24/7 AOG dispatch · 12 years onboard.
            Engineer on board within hours, the right part on its way within a day.
          </p>

          {/* DUAL CTA */}
          <div className="mt-10 grid gap-4 md:grid-cols-2 max-w-4xl">
            <Link href="/service-wizard" className="group relative block rounded-lg border border-white/10 bg-white/5 backdrop-blur-md p-7 hover:bg-white/10 hover:border-amber transition no-underline">
              <div className="kicker !text-amber !pl-0 before:hidden">01 · I NEED SERVICE</div>
              <h2 className="text-white mt-3 mb-2 text-[26px] md:text-[28px] font-bold tracking-tight">Marine Electrical Service</h2>
              <p className="text-white/70 text-[14.5px] leading-relaxed">
                Generator, MSB, propulsion, navigation, automation, safety, deck machinery, survey prep.
                We dispatch an engineer to your vessel.
              </p>
              <span className="absolute top-6 right-6 text-amber group-hover:translate-x-1 transition">→</span>
            </Link>

            <Link href="/supply-wizard" className="group relative block rounded-lg border border-white/10 bg-white/5 backdrop-blur-md p-7 hover:bg-white/10 hover:border-amber transition no-underline">
              <div className="kicker !text-amber !pl-0 before:hidden">02 · I NEED PARTS / SUPPLY</div>
              <h2 className="text-white mt-3 mb-2 text-[26px] md:text-[28px] font-bold tracking-tight">Technical Parts Supply</h2>
              <p className="text-white/70 text-[14.5px] leading-relaxed">
                Obsolete OEM, AOG emergency, compatible alternative, repack and ship.
                We source, verify, and deliver to vessel / agent / port.
              </p>
              <span className="absolute top-6 right-6 text-amber group-hover:translate-x-1 transition">→</span>
            </Link>
          </div>

          {/* Universal search teaser */}
          <div className="mt-8 max-w-3xl">
            <Link href="/supply" className="flex items-center gap-3 bg-white/90 hover:bg-white text-navy-700 px-5 py-3.5 rounded-md font-medium transition no-underline">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
              <span className="text-[14.5px]">Search by part number, maker, vessel system, or upload a photo…</span>
            </Link>
          </div>

          {/* Trust band */}
          <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[11.5px] uppercase tracking-[0.08em] text-white/65">
            <li>STCW III/6 ETO</li>
            <li>HV ≤1000V</li>
            <li>{SITE.trust.vessels} vessels</li>
            <li>{SITE.trust.years} yrs onboard</li>
            <li>24/7 response</li>
          </ul>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-white">
        <div className="container-x">
          <div className="kicker mb-3">How it works</div>
          <h2 className="text-balance max-w-3xl">From part number on a label to delivery on the gangway.</h2>
          <ol className="mt-12 grid gap-5 md:grid-cols-4">
            {[
              { n: '01', t: 'Send', d: 'Part number, photo of the nameplate, or describe the symptom. WhatsApp, form, or email — your choice.' },
              { n: '02', t: 'Verify', d: "We confirm exact or equivalent spare. Our database holds compatibility notes from years of onboard work." },
              { n: '03', t: 'Source', d: 'Trusted supplier network across US, Europe, and Asia. Internal-only — we never expose suppliers or margin.' },
              { n: '04', t: 'Deliver', d: 'Direct to vessel, port agent, or warehouse consolidation. Repack under our invoice if needed. USD or TRY invoicing.' }
            ].map((s) => (
              <li key={s.n} className="card">
                <div className="font-mono text-amber text-[18px] font-bold mb-2">{s.n}</div>
                <h3 className="mb-2">{s.t}</h3>
                <p className="text-ink-muted text-[14px] leading-relaxed">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="py-20 bg-navy-50">
        <div className="container-x">
          <div className="kicker mb-3">Need it now</div>
          <h2 className="mb-10">Common starting points.</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/supply-wizard" className="card hover:border-amber group no-underline">
              <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-amber mb-2">Quote</div>
              <h3 className="mb-2 group-hover:text-amber-600">Request a quote</h3>
              <p className="text-ink-muted text-[14px]">Brand + part number + vessel + port. We come back the same day with a price and lead time.</p>
            </Link>
            <Link href="/supply/equivalent-part-finder" className="card hover:border-amber group no-underline">
              <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-amber mb-2">Equivalent</div>
              <h3 className="mb-2 group-hover:text-amber-600">Find an equivalent part</h3>
              <p className="text-ink-muted text-[14px]">OEM obsolete? We propose a compatible alternative with an engineering note.</p>
            </Link>
            <Link href="/supply/unlisted-request" className="card hover:border-amber group no-underline">
              <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-amber mb-2">Urgent</div>
              <h3 className="mb-2 group-hover:text-amber-600">Urgent vessel supply</h3>
              <p className="text-ink-muted text-[14px]">AOG dispatch under 24h. Photo of the label is enough — we'll do the legwork.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-20 bg-white">
        <div className="container-x grid gap-12 md:grid-cols-2 items-start">
          <div>
            <div className="kicker mb-3">Why us</div>
            <h2 className="mb-5">Onboard background. Not a procurement broker.</h2>
            <p className="text-ink-muted leading-relaxed mb-4">
              Levent Marine is run by a working Marine Electro-Technical Officer with shipboard experience across
              bulk carriers, tankers, container vessels and OSVs. Every RFQ goes through someone who has actually
              terminated a busbar on a moving deck.
            </p>
            <p className="text-ink-muted leading-relaxed">
              We registered in Wyoming so US fleets get clean USD invoicing and TWIC/port-access-ready
              coordination. Tuzla is our operational base for European and global engineer dispatch.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="stat"><span className="num">{SITE.trust.vessels}</span><span className="lbl">vessels serviced</span></div>
            <div className="stat"><span className="num">{SITE.trust.years} yr</span><span className="lbl">onboard experience</span></div>
            <div className="stat"><span className="num">&lt;{SITE.trust.response}</span><span className="lbl">engineer on board</span></div>
            <div className="stat"><span className="num">{SITE.trust.network}</span><span className="lbl">supplier countries</span></div>
          </div>
        </div>
      </section>
    </>
  );
}
