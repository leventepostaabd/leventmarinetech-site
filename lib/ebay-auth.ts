/**
 * eBay Browse API authentication helper.
 *
 * eBay's Browse API requires an application-level OAuth access token
 * obtained via the client_credentials grant. The token lives ~2 hours.
 * This module exchanges EBAY_APP_ID + EBAY_CERT_ID for a token and
 * caches it in module memory until close to expiry.
 *
 * Required env (set in Vercel → Project → Settings → Environment Variables):
 *   - EBAY_APP_ID            — Production Client ID (public, OK to share)
 *   - EBAY_CERT_ID           — Production Client Secret (SECRET, never log)
 *   - EBAY_MARKETPLACE_ID    — optional, defaults to EBAY_US
 *   - EBAY_ENV               — optional, 'production' (default) or 'sandbox'
 *
 * If credentials are absent the helper returns `null` and callers
 * fall back to the local seed catalog.
 */

type CachedToken = { value: string; expiresAt: number };

let cached: CachedToken | null = null;

function endpoints(env: 'production' | 'sandbox') {
  if (env === 'sandbox') {
    return {
      oauth: 'https://api.sandbox.ebay.com/identity/v1/oauth2/token',
      browse: 'https://api.sandbox.ebay.com/buy/browse/v1'
    };
  }
  return {
    oauth: 'https://api.ebay.com/identity/v1/oauth2/token',
    browse: 'https://api.ebay.com/buy/browse/v1'
  };
}

export type EbayEnv = {
  marketplaceId: string;
  browseBase: string;
};

/**
 * Returns a usable application access token, or null if env vars are
 * missing / the exchange fails. Tokens are cached in memory and refreshed
 * 60 seconds before expiry.
 */
export async function getEbayAccessToken(): Promise<{ token: string; env: EbayEnv } | null> {
  const appId = process.env.EBAY_APP_ID;
  const certId = process.env.EBAY_CERT_ID;
  if (!appId || !certId) return null;

  const envMode = (process.env.EBAY_ENV === 'sandbox' ? 'sandbox' : 'production') as 'production' | 'sandbox';
  const ep = endpoints(envMode);
  const marketplaceId = process.env.EBAY_MARKETPLACE_ID ?? 'EBAY_US';
  const env: EbayEnv = { marketplaceId, browseBase: ep.browse };

  // Serve cached if still valid (with 60-second safety margin)
  if (cached && cached.expiresAt - Date.now() > 60_000) {
    return { token: cached.value, env };
  }

  const basic = Buffer.from(`${appId}:${certId}`).toString('base64');
  const body = new URLSearchParams();
  body.set('grant_type', 'client_credentials');
  body.set('scope', 'https://api.ebay.com/oauth/api_scope');

  try {
    const res = await fetch(ep.oauth, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
      },
      body: body.toString(),
      // Browse API is read-only; the token is sensitive — do not cache the
      // fetch itself, we cache the token in module scope above.
      cache: 'no-store'
    });

    if (!res.ok) return null;
    const json = (await res.json()) as { access_token?: string; expires_in?: number };
    if (!json.access_token || !json.expires_in) return null;

    cached = {
      value: json.access_token,
      expiresAt: Date.now() + json.expires_in * 1000
    };
    return { token: cached.value, env };
  } catch {
    return null;
  }
}
