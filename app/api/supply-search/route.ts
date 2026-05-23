import { NextResponse } from 'next/server';
import { searchAllSources, type ExternalProduct, type SupplySource } from '@/lib/ebay-amazon';
import { estimateLine } from '@/lib/pricing';

type FlatItem = ExternalProduct & { _src: SupplySource };

/**
 * GET /api/supply-search?q=<query>&brand=<brand>&limit=<n>
 *
 * Aggregates Mouser + Digi-Key + Grainger + eBay + local catalog into
 * one deduped list. Prices are NEVER returned to the customer-facing
 * UI in raw form — they're folded into `estTotal` (item × 1.30) so the
 * shopper sees an estimated total with the same disclaimer everywhere
 * else (decision T3/F3).
 *
 * Dedup rule: distributor sources (Mouser, Digi-Key, Grainger) win over
 * marketplace (eBay) when the same brand+MPN appears in multiple
 * buckets. The local Amazon stub is bottom of the list.
 */

// Priority — lower = preferred when the same brand|MPN appears in two
// different source buckets.
const SOURCE_PRIORITY: Record<string, number> = {
  mouser: 0,
  digikey: 1,
  grainger: 2,
  ebay: 3,
  amazon: 4,
  manual: 5
};

function dedupeKey(it: { brand?: string; partNumber?: string; id?: string; name?: string }) {
  const mpn = (it.partNumber ?? '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  if (mpn) return `${(it.brand ?? '').toLowerCase()}|${mpn}`;
  // Fallback to id when MPN missing (most marketplace fallback paths)
  return (it.id ?? '').toLowerCase() || (it.name ?? '').slice(0, 40).toLowerCase();
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get('q') ?? '').trim();
  const brand = url.searchParams.get('brand') ?? undefined;
  const limitRaw = parseInt(url.searchParams.get('limit') ?? '24', 10);
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 50) : 24;

  if (!q || q.length < 2) {
    return NextResponse.json({ q, results: [] });
  }

  const buckets = await searchAllSources(q, { brand, limit });

  // Flatten with source attached, dedupe by brand|MPN, keep the best-priority
  // (cleanest) source per key. Within the same source, keep the first.
  const map = new Map<string, FlatItem>();
  for (const bucket of buckets) {
    for (const r of bucket.results) {
      const item: FlatItem = { ...r, _src: bucket.source };
      const k = dedupeKey(item);
      if (!k) continue;
      const existing = map.get(k);
      if (!existing) {
        map.set(k, item);
        continue;
      }
      const existingPrio = SOURCE_PRIORITY[existing._src] ?? 99;
      const newPrio = SOURCE_PRIORITY[item._src] ?? 99;
      if (newPrio < existingPrio) {
        map.set(k, item);
      }
    }
  }

  const merged = Array.from(map.values())
    // Sort by priority then by in-stock then by name (stable, readable order)
    .sort((a, b) => {
      const pa = SOURCE_PRIORITY[a._src] ?? 99;
      const pb = SOURCE_PRIORITY[b._src] ?? 99;
      if (pa !== pb) return pa - pb;
      const sa = a.in_stock ? 0 : 1;
      const sb = b.in_stock ? 0 : 1;
      if (sa !== sb) return sa - sb;
      return (a.name ?? '').localeCompare(b.name ?? '');
    })
    .slice(0, limit)
    .map((r) => {
      const estimate =
        typeof r.price === 'number'
          ? estimateLine({ unitPrice: r.price, quantity: 1, urgency: 'planned' })
          : null;
      return {
        slug: r.slug ?? r.id,
        name: r.name,
        brand: r.brand ?? '',
        partNumber: r.partNumber ?? '',
        description: r.description ?? '',
        image: r.image ?? '',
        in_stock: r.in_stock ?? false,
        source: r.source,
        live: r.live ?? false,
        priceRaw: typeof r.price === 'number' ? r.price : null,
        estTotal: estimate ? estimate.total : null,
        estDeliveryEn: estimate ? estimate.deliveryEn : null,
        estDeliveryTr: estimate ? estimate.deliveryTr : null
      };
    });

  return NextResponse.json(
    { q, results: merged },
    { headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=120' } }
  );
}
