/**
 * lib/ebay-amazon.ts
 * ------------------
 * Typed integration surface for searching Amazon Business + eBay business
 * catalogues, used by the Supply flow.
 *
 * Wave 2 contract: the supply flow needs typed `searchAmazonBusiness`,
 * `searchEbay`, and `getProductBySource` calls. Real API wiring is
 * deferred to Wave 4 (credentials + rate-limit handling). For now,
 * implementations return either:
 *   - local-catalog matches (from content/products.json) when the
 *     local seed already covers the query, so the UI is exercised, or
 *   - an empty array, so callers gracefully fall back to RFQ.
 *
 * Pricing is INTENTIONALLY OMITTED from the return shape — decision T3/F3
 * forbids customer-facing price display, so the type surface never
 * exposes a price field even after the real API is wired in Wave 4.
 *
 * TODO (Wave 4):
 *   - Wire Amazon SP-API / Selling Partner API once vendor account ready.
 *   - Wire eBay Browse API once business account ready.
 *   - Add stricter typing for shipping/availability windows.
 */

import { readProducts, type ProductContent } from './content';
import { getEbayAccessToken } from './ebay-auth';

// ---------------------------------------------------------------------------
//  Public types
// ---------------------------------------------------------------------------

export type SupplySource = 'amazon' | 'ebay' | 'mouser' | 'digikey' | 'grainger' | 'manual';

export type ExternalProduct = {
  /** Stable id from the external source. */
  id: string;
  /** Local slug — populated when result matches a local catalog entry. */
  slug?: string;
  source: SupplySource;
  /** Display name. */
  name: string;
  /** Manufacturer / brand. */
  brand?: string;
  /** Manufacturer part number / SKU / model. */
  partNumber?: string;
  /** Short description, never includes price text. */
  description?: string;
  /** Public listing URL (we strip price params client-side when rendering). */
  url?: string;
  /** Optional preview image URL — must be a stable HTTPS URL. */
  image?: string;
  /** Whether the supplier currently shows the item as in stock. */
  in_stock?: boolean;
  /** Free-form availability label as returned by the supplier (no price). */
  availability_label?: string;
  /** True for results returned from a live external API (eBay/Amazon Business).
      These don't have a local /supply/product/{slug} page; the UI should
      route a click into the quote wizard with brand/part pre-filled. */
  live?: boolean;
  /** Raw supplier price in USD — only surfaced for live external results
      where we apply our own markup before display. Local catalog results
      leave this undefined (quote-only). */
  price?: number;
};

export type SupplySearchOptions = {
  /** Brand filter (case-insensitive). */
  brand?: string;
  /** Maximum number of results to return. */
  limit?: number;
  /** Optional category / subcategory hint to bias results. */
  categoryHint?: string;
};

export type SupplySearchResult = {
  source: SupplySource;
  query: string;
  results: ExternalProduct[];
  /** True when the result set was generated from local data because the live API is not wired yet. */
  fromLocalFallback: boolean;
};

// ---------------------------------------------------------------------------
//  Internal helpers
// ---------------------------------------------------------------------------

function localMatches(query: string, source: SupplySource, opts?: SupplySearchOptions): ExternalProduct[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const limit = Math.max(1, Math.min(opts?.limit ?? 12, 50));

  const all = readProducts();
  const filtered = all.filter((p: ProductContent) => {
    if (p.source && p.source !== source) return false;
    if (opts?.brand && p.brand?.toLowerCase() !== opts.brand.toLowerCase()) return false;
    if (opts?.categoryHint) {
      const hint = opts.categoryHint.toLowerCase();
      const inCat =
        (p.category_slug ?? '').toLowerCase() === hint ||
        (p.subcategory_slug ?? p.category ?? '').toLowerCase() === hint;
      if (!inCat) return false;
    }
    const hay = [
      p.name,
      p.brand,
      p.partNumber,
      p.sku,
      p.shortDescription,
      ...(p.alternativePartNumbers ?? []),
      ...(p.tags ?? [])
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });

  return filtered.slice(0, limit).map((p) => ({
    id: p.id,
    slug: p.slug,
    source: (p.source ?? 'manual') as SupplySource,
    name: p.name,
    brand: p.brand,
    partNumber: p.partNumber,
    description: p.shortDescription,
    url: p.source_url || undefined,
    image: p.image,
    in_stock: typeof p.in_stock === 'boolean' ? p.in_stock : p.availability === 'in-stock',
    availability_label: p.availability
  }));
}

// ---------------------------------------------------------------------------
//  Public API — search
// ---------------------------------------------------------------------------

/**
 * Search Amazon Business by a free-form query (typically brand + part number).
 * Returns local catalog matches today; will hit Amazon SP-API in Wave 4.
 */
// TODO: wire real API in Wave 4
export async function searchAmazonBusiness(
  query: string,
  opts?: SupplySearchOptions
): Promise<SupplySearchResult> {
  const results = localMatches(query, 'amazon', opts);
  return { source: 'amazon', query, results, fromLocalFallback: true };
}

/**
 * Search eBay Browse API by a free-form query. Falls back to local
 * catalog matches when EBAY_APP_ID / EBAY_CERT_ID are not configured
 * or when the request errors. Prices are stripped from results to honour
 * the F3 / T3 "quote-only" decision.
 *
 * Required env (set in Vercel → Project → Settings → Environment Variables):
 *   - EBAY_APP_ID            — Production Client ID
 *   - EBAY_CERT_ID           — Production Client Secret
 *   - EBAY_MARKETPLACE_ID    — optional, defaults to EBAY_US
 *   - EBAY_ENV               — optional, 'production' (default) or 'sandbox'
 *
 * The OAuth application access token is fetched + cached by
 * lib/ebay-auth.getEbayAccessToken() (2-hour TTL, in-memory).
 */
export async function searchEbay(
  query: string,
  opts?: SupplySearchOptions
): Promise<SupplySearchResult> {
  const local = () => ({
    source: 'ebay' as const,
    query,
    results: localMatches(query, 'ebay', opts),
    fromLocalFallback: true as const
  });

  if (!query.trim()) return local();
  const auth = await getEbayAccessToken();
  if (!auth) return local();
  const { token, env } = auth;

  try {
    // Increase requested limit so we can dedupe by MPN after filtering and
    // still show a full grid. eBay's Browse API hard-caps at 200.
    const requested = Math.min((opts?.limit ?? 12) * 4, 50);
    const url = new URL(`${env.browseBase}/item_summary/search`);
    url.searchParams.set('q', query.slice(0, 100));
    url.searchParams.set('limit', String(requested));

    // Quality filters — these dramatically clean up the marketplace noise:
    //   - conditionIds:{1000}  → NEW only (skip used, refurbished, parts)
    //   - buyingOptions:{FIXED_PRICE} → skip auctions
    //   - sellerFeedbackScore filter could be added; left off for now since
    //     it can suppress small but legitimate marine specialists.
    const filters: string[] = ['conditionIds:{1000}', 'buyingOptions:{FIXED_PRICE}'];
    if (opts?.brand) filters.push(`brand:{${opts.brand}}`);
    url.searchParams.set('filter', filters.join(','));

    // Sort by best match (default); price ascending would surface used cheap
    // copies from grey-market sellers, which we already filtered out above.

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-EBAY-C-MARKETPLACE-ID': env.marketplaceId,
        Accept: 'application/json'
      },
      next: { revalidate: 60 }
    });

    if (!res.ok) return local();
    const json = (await res.json()) as {
      itemSummaries?: Array<{
        itemId?: string;
        title?: string;
        brand?: string;
        mpn?: string;
        condition?: string;
        shortDescription?: string;
        image?: { imageUrl?: string };
        itemWebUrl?: string;
        price?: { value?: string; currency?: string };
        seller?: { username?: string; feedbackPercentage?: string };
      }>;
    };

    const items = Array.isArray(json.itemSummaries) ? json.itemSummaries : [];

    // Dedupe within eBay by MPN — same part from multiple sellers shows up
    // many times; keep the cheapest (USD) per MPN. Falls back to a
    // normalised title-fragment when MPN is missing.
    const cap = Math.min(opts?.limit ?? 12, 50);
    const dedupeKey = (it: { mpn?: string; brand?: string; title?: string }) => {
      const mpn = (it.mpn ?? '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      if (mpn) return `${(it.brand ?? '').toLowerCase()}|${mpn}`;
      // Fallback: first 4 significant words of the title
      const title = (it.title ?? '')
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 2)
        .slice(0, 4)
        .join(' ');
      return title || (it.title ?? '').slice(0, 40).toLowerCase();
    };
    const seen = new Map<string, (typeof items)[number] & { _price: number }>();
    for (const it of items) {
      const k = dedupeKey(it);
      if (!k) continue;
      const price =
        it.price?.value && it.price.currency === 'USD' ? parseFloat(it.price.value) : Number.POSITIVE_INFINITY;
      const existing = seen.get(k);
      if (!existing || price < existing._price) {
        seen.set(k, { ...it, _price: price });
      }
    }

    const results: ExternalProduct[] = Array.from(seen.values())
      .slice(0, cap)
      .map((it) => {
        const rawPrice = Number.isFinite(it._price) ? it._price : undefined;
        return {
          id: it.itemId ?? '',
          slug: (it.itemId ?? '').toLowerCase(),
          source: 'ebay',
          name: it.title ?? '',
          brand: it.brand,
          partNumber: it.mpn,
          description: it.shortDescription,
          // Strip eBay's auction/price params from the outbound URL
          url: it.itemWebUrl ? sanitizeExternalUrl(it.itemWebUrl) : undefined,
          image: it.image?.imageUrl,
          in_stock: true,
          availability_label: 'in-stock',
          live: true,
          price: rawPrice
        };
      });

    return { source: 'ebay', query, results, fromLocalFallback: false };
  } catch {
    return local();
  }
}

/**
 * Unified search across every configured catalog provider.
 *
 * Order returned matches our quality priority — catalog distributors
 * (Mouser, Digi-Key, Grainger) before the marketplace (eBay) before the
 * local Amazon stub. Downstream dedupe should prefer the earlier source
 * when the same MPN appears in multiple buckets.
 *
 * NOTE (2026-05): the eBay feed is PAUSED. Marketplace listings (used /
 * grey-market photos, noisy titles, inconsistent images) were degrading
 * the catalog grid, so only the distributor sources are surfaced for now.
 * Re-enable later by adding 'ebay' back to LIVE_SOURCES — the eBay code
 * path (searchEbay) is left fully intact.
 */
const LIVE_SOURCES: SupplySource[] = ['mouser', 'digikey', 'grainger'];

export async function searchAllSources(
  query: string,
  opts?: SupplySearchOptions
): Promise<SupplySearchResult[]> {
  // Imports inline to avoid a circular reference (each provider imports
  // ExternalProduct + sanitizeExternalUrl from this module).
  const [{ searchMouser }, { searchDigiKey }, { searchGrainger }] = await Promise.all([
    import('./mouser'),
    import('./digikey'),
    import('./grainger')
  ]);

  const tasks: Array<Promise<SupplySearchResult>> = [];
  if (LIVE_SOURCES.includes('mouser')) tasks.push(searchMouser(query, opts));
  if (LIVE_SOURCES.includes('digikey')) tasks.push(searchDigiKey(query, opts));
  if (LIVE_SOURCES.includes('grainger')) tasks.push(searchGrainger(query, opts));
  if (LIVE_SOURCES.includes('ebay')) tasks.push(searchEbay(query, opts));
  if (LIVE_SOURCES.includes('amazon')) tasks.push(searchAmazonBusiness(query, opts));

  return Promise.all(tasks);
}

// ---------------------------------------------------------------------------
//  Public API — fetch by id
// ---------------------------------------------------------------------------

/**
 * Resolve a specific product by source + external id.
 * Falls back to the local catalog when the source equals 'manual' or when
 * the live API is not wired yet.
 */
// TODO: wire real API in Wave 4
export async function getProductBySource(
  source: SupplySource,
  id: string
): Promise<ExternalProduct | undefined> {
  const found = readProducts().find((p) => p.id === id || p.slug === id);
  if (!found) return undefined;
  if (found.source && found.source !== source && source !== 'manual') return undefined;
  return {
    id: found.id,
    slug: found.slug,
    source: (found.source ?? 'manual') as SupplySource,
    name: found.name,
    brand: found.brand,
    partNumber: found.partNumber,
    description: found.shortDescription,
    url: found.source_url || undefined,
    image: found.image,
    in_stock: typeof found.in_stock === 'boolean' ? found.in_stock : found.availability === 'in-stock',
    availability_label: found.availability
  };
}

// ---------------------------------------------------------------------------
//  Display helpers
// ---------------------------------------------------------------------------

/**
 * Strip any price-bearing query params from an external URL before showing
 * it to a customer. Belt-and-braces for decision T3/F3 ("no prices visible").
 */
export function sanitizeExternalUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  try {
    const u = new URL(url);
    const stripped = ['price', 'cost', 'amount', 'amt', 'list_price'];
    stripped.forEach((k) => u.searchParams.delete(k));
    return u.toString();
  } catch {
    return url;
  }
}
