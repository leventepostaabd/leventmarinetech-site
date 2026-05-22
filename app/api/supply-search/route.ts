import { NextResponse } from 'next/server';
import { searchAllSources } from '@/lib/ebay-amazon';
import { estimateLine } from '@/lib/pricing';

/**
 * GET /api/supply-search?q=<query>&brand=<brand>&limit=<n>
 * Returns deduped supply suggestions across Amazon Business + eBay.
 * Prices are NEVER returned (decision T3/F3).
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get('q') ?? '').trim();
  const brand = url.searchParams.get('brand') ?? undefined;
  const limitRaw = parseInt(url.searchParams.get('limit') ?? '8', 10);
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 25) : 8;

  if (!q || q.length < 2) {
    return NextResponse.json({ q, results: [] });
  }

  const buckets = await searchAllSources(q, { brand, limit });

  // Dedupe by partNumber preferring in-stock Amazon results. Falsy check
  // (||) instead of nullish (??) so that empty strings — which eBay can
  // return for mpn — fall back to the id rather than collapsing every
  // empty-MPN result into one bucket.
  const seen = new Set<string>();
  const merged = buckets
    .flatMap((b) => b.results.map((r) => ({ ...r, _src: b.source })))
    .filter((r) => {
      const k = (r.partNumber || r.id || '').toLowerCase();
      if (!k || seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .sort((a, b) => Number(b.in_stock) - Number(a.in_stock))
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
        // 'live' = result came from an external live API (eBay/Amazon) and
        // has no static /supply/product/{slug} page. UI routes it to the
        // quote wizard instead.
        live: r.live ?? false,
        // Raw supplier price (we hide from card text; the modal uses it
        // to recalc on quantity / urgency / port changes client-side).
        priceRaw: typeof r.price === 'number' ? r.price : null,
        // Pre-baked estimate for default conditions (planned, default ship
        // baseline). Card shows total + delivery; modal can override.
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
