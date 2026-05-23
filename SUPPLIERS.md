# Supply provider setup

The supply search aggregator (`/api/supply-search`) fans out across every
configured provider in parallel. Each one is independent — adding a new
provider improves catalog coverage without breaking any other. Same code
path, same UI, same RFQ basket.

After each new provider is set up, hit **`/api/sources-status`** to
confirm the runtime sees the env vars.

---

## Current quality ranking

When the same `brand|MPN` appears in multiple providers, the deduper
keeps the cleanest source. Priority order (lower wins):

| # | Provider | Why this rank | Onboarding effort |
|---|---|---|---|
| 1 | **Mouser** | Catalog distributor, 1 price per part, datasheets, instant signup | ~10 min |
| 2 | **Digi-Key** | Same model as Mouser, different stock, OAuth2 | ~30 min |
| 3 | **Grainger** | US industrial, single seller, broad hardware | Account approval (days) |
| 4 | **eBay** | Marketplace — many sellers, used items, noisy. Filtered to NEW + FIXED_PRICE only. | Already live |
| 5 | Amazon (local stub) | Placeholder; no live API yet | — |

---

## Mouser ⭐ (start here — easiest)

**What you get:** sensors, transmitters, PLC modules, relays, contactors,
marine-rated test equipment, semiconductors. Real-time stock, datasheets.

### Setup (10 minutes)

1. Go to https://developer.mouser.com
2. Click **Sign up for an API key** → fill the form (commercial use)
3. Choose the **Search API** plan (free, no rate-limit issues at our scale)
4. They email you the API key — usually instant
5. In Vercel → Project Settings → Environment Variables:
   - `MOUSER_API_KEY` = (the key)
   - Environments: Production + Preview
6. Redeploy
7. Open `/api/sources-status` — `mouser.configured` should read `true`
8. Open `/supply`, search for `level transmitter`, confirm new results

---

## Digi-Key

**What you get:** similar to Mouser; some parts only Digi-Key carries.
Larger catalog of obscure marine semis.

### Setup (~30 min — OAuth2 onboarding)

1. Sign up at https://developer.digikey.com
2. Click **My Apps** → **Create app**
3. Pick **Production** environment + **Product Information v4** API
4. Copy the **Client ID** and **Client Secret**
5. In Vercel env vars:
   - `DIGIKEY_CLIENT_ID` = (Client ID)
   - `DIGIKEY_CLIENT_SECRET` = (Client Secret — SECRET, mark Sensitive)
   - `DIGIKEY_LOCALE` = `en,US,USD` (optional)
   - `DIGIKEY_ENV` = `production`
6. Redeploy
7. Confirm `/api/sources-status` shows `digikey.configured: true`
8. First search triggers an OAuth2 token exchange (cached for ~10 min)

---

## Grainger

**What you get:** marine-rated motors, contactors, breakers, panel
hardware, fan blades, deck tools, shop consumables. Single-seller, no
peer noise. ABD merkez, same-day ship from many hubs.

### Setup (account approval — days)

1. Open a business account at https://www.grainger.com/business
2. Once approved, ask your Grainger account manager for **B2B API access**
   (sometimes called "KeepStock API" or "Punchout API")
3. They issue an `API key` and confirm your `Customer Account Number`
4. Vercel env vars:
   - `GRAINGER_API_KEY` = (the key — SECRET)
   - `GRAINGER_ACCOUNT` = (your account number)
5. Redeploy
6. The exact response schema is documented in their post-approval portal;
   the adapter in `lib/grainger.ts` may need a small field-name tweak
   once you receive a real response payload. The schema there matches
   the public catalog example; minor differences fix in 5 minutes.

---

## eBay (already live)

**What you get:** broad reach, harder-to-find OEM replacements, but a
marketplace with peer sellers. We aggressive-filter to:
- `conditionIds:{1000}` — NEW only (no used/refurbished/parts)
- `buyingOptions:{FIXED_PRICE}` — no auctions
- MPN dedupe — same brand+MPN from multiple sellers → keep the cheapest

### Verify

`/api/sources-status` → `ebay.ok: true` means the OAuth handshake works
and live results are flowing.

---

## When to add what

- **Marine electronic spares request growing?** → Mouser + Digi-Key give
  the cleanest semiconductor / sensor / module coverage.
- **Industrial hardware (motors, switchgear) requests growing?** →
  Grainger is the right next add.
- **OEM-specific marine parts (Furuno radar, Kongsberg PLC, Alfa Laval
  BWTS)?** → these aren't in any public API. They need direct OEM
  dealer accounts, ordered manually. The site captures the RFQ; you
  source from OEM channels.

---

## Architecture note (for Phase 2)

Right now each provider lives in its own module (`lib/mouser.ts`,
`lib/digikey.ts`, `lib/grainger.ts`, `lib/ebay-amazon.ts`). The
aggregator in `lib/ebay-amazon.searchAllSources` calls every one in
parallel. The API route in `app/api/supply-search/route.ts` dedupes by
brand+MPN and prioritises catalog distributors over marketplaces.

Phase 2 additions (when the supplier conversation re-opens):
- SKU normalisation layer (AI) — map "ABB A16-30-10 220V" variants
  across providers
- Redis / Supabase KV cache layer for popular searches
- ShipServ integration for enterprise marine procurement traffic
