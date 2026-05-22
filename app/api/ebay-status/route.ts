import { NextResponse } from 'next/server';
import { getEbayAccessToken } from '@/lib/ebay-auth';

/**
 * GET /api/ebay-status
 *
 * Health-check for the eBay Browse API integration. Use this after
 * setting EBAY_APP_ID + EBAY_CERT_ID in Vercel to confirm:
 *  1. The env vars are visible to the deployed runtime.
 *  2. eBay accepts the credentials and returns an access token.
 *
 * Response shape (no secrets are ever echoed back):
 *   { configured: boolean, ok: boolean, env: 'production'|'sandbox',
 *     marketplace: string, message: string }
 *
 * Safe to expose publicly — only reveals whether the auth call worked,
 * never the token itself.
 */
export async function GET() {
  const configured = Boolean(process.env.EBAY_APP_ID && process.env.EBAY_CERT_ID);
  const envMode = process.env.EBAY_ENV === 'sandbox' ? 'sandbox' : 'production';
  const marketplace = process.env.EBAY_MARKETPLACE_ID ?? 'EBAY_US';

  if (!configured) {
    return NextResponse.json({
      configured: false,
      ok: false,
      env: envMode,
      marketplace,
      message: 'EBAY_APP_ID or EBAY_CERT_ID is not set. Add them in Vercel → Settings → Environment Variables, then redeploy.'
    });
  }

  const auth = await getEbayAccessToken();
  if (!auth) {
    return NextResponse.json({
      configured: true,
      ok: false,
      env: envMode,
      marketplace,
      message: 'Credentials are set but the OAuth exchange with eBay failed. Verify the Cert ID is correct and that production access is enabled on this keyset.'
    });
  }

  return NextResponse.json({
    configured: true,
    ok: true,
    env: envMode,
    marketplace,
    message: 'eBay Browse API is live. /api/supply-search returns live results merged with the local catalog.'
  });
}
