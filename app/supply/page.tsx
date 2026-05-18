import Link from 'next/link';
import type { Metadata } from 'next';
import { readProducts } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Marine Technical Supply — Parts & Spares Catalog',
  description: 'Marine electrical spares, automation, sensors, breakers, navigation lights, batteries, test instruments. Request Quote — we source globally, verify compatibility, ship to vessel.',
  alternates: { canonical: '/supply' }
};

const CATEGORY_META: Record<string, { label: string; hint: string }> = {
  'electrical-spares':       { label: 'Electrical spares',        hint: 'Terminals, fuses, busbars, jumper kits' },
  'automation-control':      { label: 'Automation & control',     hint: 'PLC modules, controllers, gateways' },
  'breakers-contactors':     { label: 'Breakers & contactors',    hint: 'MCCB, ACB, motor protection, relays' },
  'sensors-transmitters':    { label: 'Sensors & transmitters',   hint: 'Pressure, level, temperature, vibration' },
  'plc-hmi':                 { label: 'PLC, HMI & I/O',           hint: 'Operator panels, expansion cards' },
  'alarm-monitoring':        { label: 'Alarm monitoring parts',   hint: 'AMS cards, indicators, modules' },
  'navigation-lights':       { label: 'Navigation lights',        hint: 'Masthead, side, stern, anchor LED' },
  'batteries-ups':           { label: 'Batteries / UPS / charger', hint: 'AGM marine, UPS modules, chargers' },
  'cables-glands':           { label: 'Marine cables & glands',   hint: 'LSZH, halogen-free, ATEX glands' },
  'motors-fans':             { label: 'Motors & fans',            hint: 'Marine duty motors, fan assemblies' },
  'solenoid-valves':         { label: 'Solenoid valves',          hint: 'Pneumatic, ATEX, fluid control' },
  'test-instruments':        { label: 'Test instruments',         hint: 'Megger, Fluke, OMICRON' },
  'safety-lsa':              { label: 'Safety & LSA',             hint: 'EPIRB, MOB, LSA electrical items' },
  'engine-room-consumables': { label: 'Engine-room consumables',  hint: 'Level switches, sealing kits' }
};

export default function SupplyIndex() {
  const products = readProducts();
  const counts: Record<string, number> = {};
  products.forEach((p) => { counts[p.category] = (counts[p.category] ?? 0) + 1; });

  return (
    <>
      <section className="bg-navy-700 text-white py-16">
        <div className="container-x">
          <div className="kicker text-white/70 mb-3">Marine technical supply</div>
          <h1 className="text-white text-balance max-w-4xl">Parts &amp; spares for commercial vessels — sourced, verified, shipped.</h1>
          <p className="mt-5 text-[16.5px] text-white/75 max-w-3xl leading-relaxed">
            B2B procurement desk for marine electrical and automation spares. <strong className="text-white">No prices on this site</strong> — every quote is per RFQ, accounts for vessel, port, urgency, and compatibility check. We source from a trusted supplier network and confirm fit before you commit.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/supply-wizard" className="btn-accent btn-lg">Request a quote</Link>
            <Link href="/supply/equivalent-part-finder" className="btn-ghost btn-lg !bg-transparent !text-white !border-white/30 hover:!bg-white/10">Find equivalent part</Link>
            <Link href="/supply/unlisted-request" className="btn-ghost btn-lg !bg-transparent !text-white !border-white/30 hover:!bg-white/10">Unlisted item</Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 bg-white">
        <div className="container-x">
          <div className="kicker mb-3">Browse by category</div>
          <h2 className="mb-8 text-[26px] max-w-3xl">{products.length} demo items across {Object.keys(CATEGORY_META).length} categories. Catalog grows as we onboard inventory.</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Object.entries(CATEGORY_META).map(([slug, meta]) => (
              <li key={slug}>
                <Link href={`/supply/category/${slug}`} className="block card hover:border-amber group no-underline h-full">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-amber-600">{counts[slug] ?? 0} items</span>
                    <span className="text-amber group-hover:translate-x-0.5 transition">→</span>
                  </div>
                  <div className="font-head font-bold text-ink mb-1 group-hover:text-amber-600">{meta.label}</div>
                  <div className="text-[13px] text-ink-muted leading-relaxed">{meta.hint}</div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SAMPLE PRODUCTS */}
      <section className="py-16 bg-navy-50">
        <div className="container-x">
          <div className="kicker mb-3">Sample stocked items</div>
          <h2 className="mb-8 text-[26px] max-w-3xl">A small slice of what's already in our supplier network.</h2>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 9).map((p) => (
              <li key={p.id}>
                <Link href={`/supply/product/${p.slug}`} className="block card hover:border-amber group no-underline h-full">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[11px] text-ink-subtle">{p.brand}</span>
                    <span className={`font-mono text-[10.5px] uppercase tracking-wider ${p.availability === 'in-stock' ? 'text-green-700' : p.availability === 'available-supplier' ? 'text-amber-600' : 'text-ink-subtle'}`}>{p.availability.replace(/-/g, ' ')}</span>
                  </div>
                  <h3 className="text-[16px] font-bold mb-1 group-hover:text-amber-600">{p.name}</h3>
                  <div className="font-mono text-[12px] text-ink-subtle mb-2">{p.partNumber}</div>
                  <p className="text-[13.5px] text-ink-muted leading-relaxed line-clamp-3">{p.shortDescription}</p>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 text-center">
            <Link href="/supply/categories" className="btn-primary btn-lg">View full catalog</Link>
          </div>
        </div>
      </section>
    </>
  );
}
