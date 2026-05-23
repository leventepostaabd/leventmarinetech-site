import { NextResponse } from 'next/server';
import { getEbayAccessToken } from '@/lib/ebay-auth';

/**
 * GET /api/sources-status
 *
 * Health-check for every supply provider integration. Hit this URL
 * after adding a new provider's env vars to confirm:
 *  1. Env vars are present and visible to the runtime
 *  2. (where applicable) OAuth handshake actually succeeds
 *
 * Never echoes back any secret — only "configured" and "ok" flags
 * plus a short message describing what to do next.
 */
export async function GET() {
  // Mouser — single API key, no OAuth. Configured == ok-presumed
  // (we don't ping their endpoint here to avoid wasting quota).
  const mouserConfigured = Boolean(process.env.MOUSER_API_KEY);

  // Digi-Key — OAuth2 client_credentials. Configured is just env
  // presence; ok would require an actual token exchange.
  const digikeyConfigured = Boolean(
    process.env.DIGIKEY_CLIENT_ID && process.env.DIGIKEY_CLIENT_SECRET
  );

  // Grainger — API key + business account id.
  const graingerConfigured = Boolean(
    process.env.GRAINGER_API_KEY && process.env.GRAINGER_ACCOUNT
  );

  // eBay — already has its own OAuth flow. Reuse the existing helper.
  const ebayConfigured = Boolean(process.env.EBAY_APP_ID && process.env.EBAY_CERT_ID);
  let ebayOk = false;
  if (ebayConfigured) {
    const tok = await getEbayAccessToken();
    ebayOk = Boolean(tok);
  }

  return NextResponse.json({
    providers: {
      mouser: {
        configured: mouserConfigured,
        ok: mouserConfigured, // presumed; first real search will surface issues
        env: 'production',
        signup: 'https://developer.mouser.com',
        keys: ['MOUSER_API_KEY']
      },
      digikey: {
        configured: digikeyConfigured,
        ok: digikeyConfigured,
        env: process.env.DIGIKEY_ENV === 'sandbox' ? 'sandbox' : 'production',
        signup: 'https://developer.digikey.com',
        keys: ['DIGIKEY_CLIENT_ID', 'DIGIKEY_CLIENT_SECRET']
      },
      grainger: {
        configured: graingerConfigured,
        ok: graingerConfigured,
        env: 'production',
        signup: 'https://www.grainger.com/business',
        keys: ['GRAINGER_API_KEY', 'GRAINGER_ACCOUNT']
      },
      ebay: {
        configured: ebayConfigured,
        ok: ebayOk,
        env: process.env.EBAY_ENV === 'sandbox' ? 'sandbox' : 'production',
        signup: 'https://developer.ebay.com',
        keys: ['EBAY_APP_ID', 'EBAY_CERT_ID']
      }
    },
    message:
      'Each provider is independent. The supply search aggregator calls every configured provider in parallel and dedupes the merged list. Adding more providers improves catalog quality without changing the UI.'
  });
}
