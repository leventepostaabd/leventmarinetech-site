import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { productsByCategory, readProducts } from '@/lib/content';

export function generateStaticParams() {
  const cats = new Set<string>();
  readProducts().forEach((p) => cats.add(p.category));
  return Array.from(cats).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const label = params.slug.replace(/-/g, ' ');
  return {
    title: `${label} — marine technical supply`,
    description: `Marine ${label} for commercial vessels. Request quote, find equivalent, urgent vessel supply.`,
    alternates: { canonical: `/supply/category/${params.slug}` }
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const items = productsByCategory(params.slug);
  if (!items.length) notFound();
  const label = params.slug.replace(/-/g, ' ');

  return (
    <div className="container-x py-16">
      <nav className="text-[12px] font-mono text-ink-subtle mb-6">
        <Link href="/" className="hover:text-amber-600 no-underline">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/supply" className="hover:text-amber-600 no-underline">Supply</Link>
        <span className="mx-2">/</span>
        <Link href="/supply/categories" className="hover:text-amber-600 no-underline">Catalog</Link>
        <span className="mx-2">/</span>
        <span className="capitalize">{label}</span>
      </nav>
      <div className="kicker mb-3 capitalize">{label}</div>
      <h1 className="mb-3 capitalize">{label}</h1>
      <p className="text-ink-muted mb-12">{items.length} items. Request quote on any.</p>

      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <li key={p.id}>
            <Link href={`/supply/product/${p.slug}`} className="block card hover:border-amber group no-underline h-full">
              <div className="flex justify-between mb-2">
                <span className="font-mono text-[11px] text-ink-subtle">{p.brand}</span>
                <span className={`font-mono text-[10.5px] uppercase ${p.availability === 'in-stock' ? 'text-green-700' : p.availability === 'available-supplier' ? 'text-amber-600' : 'text-ink-subtle'}`}>{p.availability.replace(/-/g, ' ')}</span>
              </div>
              <h3 className="text-[16px] font-bold mb-1 group-hover:text-amber-600">{p.name}</h3>
              <div className="font-mono text-[12px] text-ink-subtle mb-2">{p.partNumber}</div>
              <p className="text-[13.5px] text-ink-muted line-clamp-3">{p.shortDescription}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
