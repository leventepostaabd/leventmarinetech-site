/**
 * Digi-Key Product Information API integration (v4 / Production).
 *
 * Like Mouser: a catalog distributor, single price per part. Different
 * stock from Mouser, sometimes the only place for niche marine semis.
 *
 * Required env (Vercel → Project → Settings → Environment Variables):
 *   - DIGIKEY_CLIENT_ID      — OAuth2 client_id from developer.digikey.com
 *   - DIGIKEY_CLIENT_SECRET  — OAuth2 client_secret
 *   - DIGIKEY_LOCALE         — optional, e.g. 'en,US,USD'
 *   - DIGIKEY_ENV            — optional, 'production' (default) | 'sandbox'
 *
 * OAuth2 client_credentials flow. Token is cached for 9 minutes (DK tokens
 * live 10 minutes); falls back to empty results if anything fails.
 */

import type { ExternalProduct, SupplySearchOptions, SupplySearchResult } from './ebay-amazon';
import { sanitizeExternalUrl } from './ebay-amazon';

type CachedToken = { value: string; expiresAt: number };
let cached: CachedToken | null = null;

function endpoints(env: 'production' | 'sandbox') {
  if (env === 'sandbox') {
    return {
      oauth: 'https://sandbox-api.digikey.com/v1/oauth2/token',
      api: 'https://sandbox-api.digikey.com/products/v4'
    };
  }
  return {
    oauth: 'https://api.digikey.com/v1/oauth2/token',
    api: 'https://api.digikey.com/products/v4'
  };
}

async function getToken(): Promise<{ token: string; api: string } | null> {
  const id = process.env.DIGIKEY_CLIENT_ID;
  const secret = process.env.DIGIKEY_CLIENT_SECRET;
  if (!id || !secret) return null;

  const envMode = process.env.DIGIKEY_ENV === 'sandbox' ? 'sandbox' : 'production';
  const ep = endpoints(envMode);

  if (cached && cached.expiresAt - Date.now() > 60_000) {
    return { token: cached.value, api: ep.api };
  }

  try {
    const body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');
    body.set('client_id', id);
    body.set('client_secret', secret);

    const res = await fetch(ep.oauth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { access_token?: string; expires_in?: number };
    if (!json.access_token || !json.expires_in) return null;
    cached = {
      value: json.access_token,
      expiresAt: Date.now() + json.expires_in * 1000
    };
    return { token: cached.value, api: ep.api };
  } catch {
    return null;
  }
}

export async function searchDigiKey(
  query: string,
  opts?: SupplySearchOptions
): Promise<SupplySearchResult> {
  const empty = (): SupplySearchResult => ({
    source: 'digikey',
    query,
    results: [],
    fromLocalFallback: true
  });

  if (!query.trim()) return empty();
  const auth = await getToken();
  if (!auth) return empty();

  const locale = process.env.DIGIKEY_LOCALE ?? 'en,US,USD';
  const [lang, site, currency] = locale.split(',').map((s) => s.trim());
  const limit = Math.min(opts?.limit ?? 12, 50);

  try {
    const res = await fetch(`${auth.api}/search/keyword`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'X-DIGIKEY-Client-Id': process.env.DIGIKEY_CLIENT_ID!,
        'X-DIGIKEY-Locale-Site': site || 'US',
        'X-DIGIKEY-Locale-Language': lang || 'en',
        'X-DIGIKEY-Locale-Currency': currency || 'USD',
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        Keywords: query.slice(0, 100),
        RecordCount: limit,
        RecordStartPosition: 0,
        Filters: { InStock: true }
      }),
      next: { revalidate: 60 }
    });
    if (!res.ok) return empty();

    const json = (await res.json()) as {
      Products?: Array<{
        DigiKeyProductNumber?: string;
        ManufacturerProductNumber?: string;
        Manufacturer?: { Name?: string };
        Description?: { ProductDescription?: string; DetailedDescription?: string };
        ProductUrl?: string;
        PhotoUrl?: string;
        UnitPrice?: number;
        QuantityAvailable?: number;
      }>;
    };

    const products = json.Products ?? [];
    const results: ExternalProduct[] = products.slice(0, limit).map((p) => ({
      id: p.DigiKeyProductNumber ?? p.ManufacturerProductNumber ?? '',
      slug: (p.DigiKeyProductNumber ?? p.ManufacturerProductNumber ?? '').toLowerCase(),
      source: 'digikey',
      name: p.Description?.ProductDescription ?? p.ManufacturerProductNumber ?? '',
      brand: p.Manufacturer?.Name,
      partNumber: p.ManufacturerProductNumber,
      description: p.Description?.DetailedDescription ?? p.Description?.ProductDescription,
      url: p.ProductUrl ? sanitizeExternalUrl(p.ProductUrl) : undefined,
      image: p.PhotoUrl,
      in_stock: (p.QuantityAvailable ?? 0) > 0,
      availability_label: (p.QuantityAvailable ?? 0) > 0 ? 'in-stock' : 'on-order',
      live: true,
      price: typeof p.UnitPrice === 'number' && Number.isFinite(p.UnitPrice) ? p.UnitPrice : undefined
    }));

    return { source: 'digikey', query, results, fromLocalFallback: false };
  } catch {
    return empty();
  }
}
