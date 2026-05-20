# Levent Marine — Platform v1

Next.js 14 (App Router) + Supabase + Vercel. Replaces the static v4.x site that
lives in `legacy/` for reference.

## Stack

- **Next.js 14** App Router, TypeScript, server components.
- **Tailwind CSS** with a custom marine palette (navy / amber / ink).
- **Supabase**: Postgres (RFQ + service requests + products + supplier sources),
  Auth (magic link), Storage (uploads & test reports — configured manually).
- **Resend** for transactional notifications (optional — silently no-ops without `RESEND_API_KEY`).
- **Vercel** for hosting + edge middleware + serverless functions.

## Local dev

```bash
npm install
cp .env.example .env.local      # fill in Supabase + Resend keys
npm run dev                      # http://localhost:3000
```

The catalog and page content load from `content/*.json` at build/request time.
RFQ submissions, login, and admin require Supabase env vars.

## Supabase setup

1. Create a new Supabase project at https://supabase.com.
2. SQL editor → paste `supabase/migrations/0001_init.sql` → run.
3. Storage → create buckets:
   - `product-images` — public
   - `attachments`    — private
   - `reports`        — private
4. Auth → enable Email (magic link). Site URL = your production URL.
5. Settings → API → copy `URL`, `anon`, `service_role` into Vercel env vars.

## Vercel deploy

1. New project → Import this repo, branch `platform-migration` for preview.
2. Add environment variables (see `.env.example`).
3. Deploy. Preview URL = `<project>.vercel.app`. Test wizards + login + admin.
4. When ready: merge `platform-migration` → `main`, point DNS (CNAME) to Vercel,
   disable GitHub Pages.

## Make yourself admin

After your first login (magic link), in Supabase SQL editor:

```sql
update profiles set role = 'admin' where email = 'you@yourcompany.com';
```

## Routes — public

| Path | Purpose |
|---|---|
| `/`                                   | Landing — dual CTA (Service / Supply) |
| `/services`                           | Service category index (11 lanes) |
| `/services/[slug]`                    | Service detail (symptoms → tools → case → related supply) |
| `/supply`                             | Catalog landing |
| `/supply/categories`                  | Full category index |
| `/supply/category/[slug]`             | Category listing |
| `/supply/product/[slug]`              | Product detail + RFQ CTAs |
| `/supply/unlisted-request`            | Unlisted-part intake |
| `/supply/equivalent-part-finder`      | Cross-reference desk |
| `/service-wizard`                     | Multi-step service intake (7 steps) |
| `/supply-wizard`                      | Multi-step supply intake (6 steps) |
| `/usa`                                | USA index |
| `/usa/[slug]`                         | Regional pages (Houston, NY/NJ, Long Beach) |
| `/about`, `/contact`                  | Company info |
| `/privacy`, `/terms`, `/cookie-policy`, `/accessibility-statement` | Compliance |

## Routes — internal

| Path | Purpose |
|---|---|
| `/login`              | Magic-link sign-in |
| `/admin`              | Operations dashboard (auth required, role=admin) |
| `/admin/rfqs`         | RFQ list (supply / equivalent / unlisted) |
| `/admin/service`      | Service request list |
| `/admin/products`     | Catalog overview |

## API (POST)

| Path | Purpose |
|---|---|
| `/api/service-request` | Service wizard endpoint — writes to `service_requests` |
| `/api/quote-request`   | Supply / equivalent / unlisted endpoint — writes to `rfq_requests` |

## Content authoring

JSON files in `content/`:

- `services.json` — 11 services (symptoms, root causes, tools, case, supply)
- `regions.json`  — 3 USA regional pages (port lists, scenarios, logistics)
- `products.json` — 30 seed products (catalog + RFQ targets)

Edit JSON, redeploy. Admin product editor will move to Supabase in a follow-up.

## Business rules baked in

- **No prices on customer-facing pages.** Every product has Request Quote.
- **Supplier sources are admin-only.** RLS policy denies non-admin reads of `supplier_sources`.
- **Equivalent finder always returns with an engineering note.** Disclaimer surfaced on every product page and the equivalent-finder form.
- **AOG path is highlighted.** Urgent + AOG marked with amber/red across admin + customer UI; WhatsApp shortcuts in mobile bar and floating rail.

## What's intentionally not yet implemented (Wave 2 candidates)

- OCR from nameplate photos (hook ready, OpenAI Vision integration planned)
- Live supplier-API integration (Amazon Business / Grainger / Radwell etc) — admin candidate fields exist, no auto-quote
- AI chat widget (architecture-ready; no widget mounted)
- Customer portal beyond basic auth (vessel-file area, RFQ history page) — scaffolded routes only
- Email automation beyond `notifyAdmin` (no Resend templates yet)
- Move products from JSON to Supabase + admin CRUD
- Photo upload UI in wizards (Supabase storage already provisioned)

## Legacy

The previous static site is preserved at `legacy/`. Not bundled, not deployed — kept for reference only.
