/**
 * Mouser Electronics Search API integration.
 *
 * Mouser is a catalog distributor — one part = one listing = one price tier
 * curve. Result quality is dramatically cleaner than a marketplace like
 * eBay: every result is new OEM stock with a real datasheet and live
 * inventory count.
 *
 * Best for: sensors, transmitters, PLC modules, relays, contactors,
 * marine-rated test equipment, semicondutor spares.
 *
 * Required env (Vercel → Project → Settings → Environment Variables):
 *   - MOUSER_API_KEY  — get at https://developer.mouser.com (free)
 *   - MOUSER_LOCALE   — optional, defaults to 'en-US' / USD pricing
 *
 * Falls back silently to an empty result set when the key is missing
 * or the API errors, so search aggregation continues to work.
 */

import type { ExternalProduct, SupplySearchOptions, SupplySearchResult } from './ebay-amazon';
import { sanitizeExternalUrl } from './ebay-amazon';

const ENDPOINT = 'https://api.mouser.com/api/v1/search/keyword';

export async function searchMouser(
  query: string,
  opts?: SupplySearchOptions
): Promise<SupplySearchResult> {
  const empty = (): SupplySearchResult => ({
    source: 'mouser',
    query,
    results: [],
    fromLocalFallback: true
  });

  const apiKey = process.env.MOUSER_API_KEY;
  if (!apiKey || !query.trim()) return empty();

  try {
    const limit = Math.min(opts?.limit ?? 12, 50);
    const url = `${ENDPOINT}?apiKey=${encodeURIComponent(apiKey)}`;
    const body = {
      SearchByKeywordRequest: {
        keyword: query.slice(0, 100),
        records: limit,
        startingRecord: 0,
        searchOptions: 'InStock',
        searchWithYourSignUpLanguage: 'false'
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      next: { revalidate: 60 }
    });
    if (!res.ok) return empty();

    const json = (await res.json()) as {
      SearchResults?: {
        NumberOfResult?: number;
        Parts?: Array<{
          MouserPartNumber?: string;
          ManufacturerPartNumber?: string;
          Manufacturer?: string;
          Description?: string;
          ProductDetailUrl?: string;
          DataSheetUrl?: string;
          ImagePath?: string;
          Category?: string;
          Availability?: string;
          AvailabilityInStock?: string;
          PriceBreaks?: Array<{ Quantity?: number; Price?: string; Currency?: string }>;
          UnitWeightKg?: { UnitWeight?: number };
        }>;
      };
    };

    const parts = json.SearchResults?.Parts ?? [];

    const results: ExternalProduct[] = parts.slice(0, limit).map((p) => {
      // Mouser quotes a price-break ladder; the qty-1 price is the first row.
      const firstBreak = (p.PriceBreaks ?? [])[0];
      const priceStr = firstBreak?.Price ?? '';
      const rawPrice = priceStr
        ? parseFloat(priceStr.replace(/[^0-9.,]/g, '').replace(',', '.'))
        : undefined;

      // In-stock indicator: "1,234" → true, "0" or empty → false.
      const inStockRaw = p.AvailabilityInStock ?? '';
      const inStock =
        inStockRaw !== '' && inStockRaw !== '0' && !inStockRaw.toLowerCase().includes('non-stock');

      return {
        id: p.MouserPartNumber ?? p.ManufacturerPartNumber ?? '',
        slug: (p.MouserPartNumber ?? p.ManufacturerPartNumber ?? '').toLowerCase(),
        source: 'mouser',
        name: p.Description ?? p.ManufacturerPartNumber ?? '',
        brand: p.Manufacturer,
        partNumber: p.ManufacturerPartNumber,
        description: p.Description,
        url: p.ProductDetailUrl ? sanitizeExternalUrl(p.ProductDetailUrl) : undefined,
        image: p.ImagePath,
        in_stock: inStock,
        availability_label: inStock ? 'in-stock' : 'on-order',
        live: true,
        price: Number.isFinite(rawPrice) ? rawPrice : undefined
      };
    });

    return { source: 'mouser', query, results, fromLocalFallback: false };
  } catch {
    return empty();
  }
}
