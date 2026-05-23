/**
 * Grainger Business API integration — placeholder stub.
 *
 * Grainger is the US's largest industrial supply distributor — ideal for
 * marine-rated motors, contactors, breakers, panel hardware, fan blades,
 * deck hardware, shop tools. Pricing is single-source (Grainger sells it,
 * no third-party sellers).
 *
 * Required env (Vercel → Project → Settings → Environment Variables):
 *   - GRAINGER_API_KEY   — supplied after KeepStock or B2B approval
 *   - GRAINGER_ACCOUNT   — your Grainger business account number
 *
 * NOTE — Grainger's public-facing API access is account-based; we ship
 * this adapter as a working stub. Once Grainger approves the business
 * account and issues credentials, this file is the only one to update;
 * the rest of the supply-search aggregator already picks up its results.
 *
 * Setup steps for the owner:
 *  1. Open a Grainger business account: https://www.grainger.com/business
 *  2. Apply for KeepStock or B2B API access via your account manager.
 *  3. Drop the API key + account number into Vercel env vars and redeploy.
 *  4. Confirm searches return Grainger results via /api/sources-status.
 */

import type { ExternalProduct, SupplySearchOptions, SupplySearchResult } from './ebay-amazon';
import { sanitizeExternalUrl } from './ebay-amazon';

const ENDPOINT = 'https://api.grainger.com/v1/products/search';

export async function searchGrainger(
  query: string,
  opts?: SupplySearchOptions
): Promise<SupplySearchResult> {
  const empty = (): SupplySearchResult => ({
    source: 'grainger',
    query,
    results: [],
    fromLocalFallback: true
  });

  const apiKey = process.env.GRAINGER_API_KEY;
  const account = process.env.GRAINGER_ACCOUNT;
  if (!apiKey || !account || !query.trim()) return empty();

  try {
    const limit = Math.min(opts?.limit ?? 12, 25);
    const url = new URL(ENDPOINT);
    url.searchParams.set('searchTerm', query.slice(0, 100));
    url.searchParams.set('pageSize', String(limit));

    const res = await fetch(url.toString(), {
      headers: {
        'X-API-KEY': apiKey,
        'X-Customer-Account': account,
        Accept: 'application/json'
      },
      next: { revalidate: 60 }
    });
    if (!res.ok) return empty();

    // Grainger's actual response schema is documented in the developer
    // portal post-approval; the shape below matches the public catalog
    // example payloads. Adjust field names once we receive a sample
    // response on our specific account.
    const json = (await res.json()) as {
      products?: Array<{
        itemNumber?: string;
        manufacturerModelNumber?: string;
        brandName?: string;
        productName?: string;
        productDescription?: string;
        productUrl?: string;
        primaryImageUrl?: string;
        price?: { value?: number };
        availability?: { inStock?: boolean };
      }>;
    };

    const products = json.products ?? [];
    const results: ExternalProduct[] = products.slice(0, limit).map((p) => ({
      id: p.itemNumber ?? p.manufacturerModelNumber ?? '',
      slug: (p.itemNumber ?? p.manufacturerModelNumber ?? '').toLowerCase(),
      source: 'grainger',
      name: p.productName ?? p.productDescription ?? p.manufacturerModelNumber ?? '',
      brand: p.brandName,
      partNumber: p.manufacturerModelNumber,
      description: p.productDescription,
      url: p.productUrl ? sanitizeExternalUrl(p.productUrl) : undefined,
      image: p.primaryImageUrl,
      in_stock: p.availability?.inStock !== false,
      availability_label: p.availability?.inStock !== false ? 'in-stock' : 'on-order',
      live: true,
      price: typeof p.price?.value === 'number' ? p.price.value : undefined
    }));

    return { source: 'grainger', query, results, fromLocalFallback: false };
  } catch {
    return empty();
  }
}
