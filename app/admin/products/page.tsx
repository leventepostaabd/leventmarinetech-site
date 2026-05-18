import Link from 'next/link';
import { readProducts } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default function AdminProducts() {
  const products = readProducts();
  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2>Products</h2>
          <p className="text-[13px] text-ink-muted">Currently sourced from <span className="font-mono">/content/products.json</span> ({products.length} items). Migrate to Supabase later via <code className="font-mono text-[12px] bg-navy-50 px-1.5 py-0.5 rounded">supabase/migrations/0001_init.sql</code>.</p>
        </div>
      </div>

      <div className="overflow-x-auto card !p-0">
        <table className="w-full text-[13px]">
          <thead className="bg-navy-50 text-left">
            <tr>
              {['Name', 'Brand', 'Part', 'Category', 'Availability'].map((h) => (
                <th key={h} className="px-3 py-2 font-mono text-[10.5px] uppercase tracking-wider text-ink-subtle">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-line hover:bg-navy-50">
                <td className="px-3 py-2"><Link href={`/supply/product/${p.slug}`} className="text-ink hover:text-amber-600 no-underline">{p.name}</Link></td>
                <td className="px-3 py-2">{p.brand}</td>
                <td className="px-3 py-2 font-mono text-[11.5px]">{p.partNumber}</td>
                <td className="px-3 py-2 text-ink-muted capitalize">{p.category.replace(/-/g, ' ')}</td>
                <td className="px-3 py-2 font-mono text-[10.5px] uppercase">{p.availability.replace(/-/g, ' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
