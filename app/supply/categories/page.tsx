import Link from 'next/link';
import type { Metadata } from 'next';
import { readProducts } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Catalog — All Categories',
  description: 'Browse the marine technical supply catalog by category.',
  alternates: { canonical: '/supply/categories' }
};

const ORDER = [
  'breakers-contactors', 'automation-control', 'plc-hmi', 'alarm-monitoring',
  'sensors-transmitters', 'navigation-lights', 'batteries-ups', 'cables-glands',
  'motors-fans', 'solenoid-valves', 'test-instruments', 'safety-lsa',
  'engine-room-consumables', 'electrical-spares'
];

export default function CategoriesPage() {
  const products = readProducts();
  const byCat = ORDER.map((cat) => ({ cat, items: products.filter((p) => p.category === cat) }));

  return (
    <div className="container-x py-16">
      <nav className="text-[12px] font-mono text-ink-subtle mb-6">
        <Link href="/" className="hover:text-amber-600 no-underline">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/supply" className="hover:text-amber-600 no-underline">Supply</Link>
        <span className="mx-2">/</span>
        <span>Catalog</span>
      </nav>
      <div className="kicker mb-3">Catalog</div>
      <h1 className="mb-3">All categories.</h1>
      <p className="text-ink-muted max-w-2xl mb-12">{products.length} demo items. Live inventory grows weekly. Don't see your item? Use <Link href="/supply/unlisted-request" className="text-amber-600">unlisted request</Link>.</p>

      <div className="space-y-14">
        {byCat.map(({ cat, items }) => items.length === 0 ? null : (
          <section key={cat}>
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-[22px] capitalize">{cat.replace(/-/g, ' ')}</h2>
              <Link href={`/supply/category/${cat}`} className="font-mono text-[11.5px] text-amber-600 no-underline">View all {items.length} →</Link>
            </div>
            <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {items.slice(0, 3).map((p) => (
                <li key={p.id}>
                  <Link href={`/supply/product/${p.slug}`} className="block card hover:border-amber no-underline">
                    <div className="flex justify-between mb-1">
                      <span className="font-mono text-[11px] text-ink-subtle">{p.brand}</span>
                      <span className={`font-mono text-[10.5px] uppercase ${p.availability === 'in-stock' ? 'text-green-700' : p.availability === 'available-supplier' ? 'text-amber-600' : 'text-ink-subtle'}`}>{p.availability.replace(/-/g, ' ')}</span>
                    </div>
                    <div className="font-head font-bold text-ink text-[15px] mb-1">{p.name}</div>
                    <div className="font-mono text-[11.5px] text-ink-subtle">{p.partNumber}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
