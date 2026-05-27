-- 0003 — admin-managed catalog fields (decisions S9 / S10).
-- The products table becomes the single source of truth for the supply
-- catalog (seeded from content/products.json). These columns carry the
-- bilingual + sourcing + pricing data the admin product editor manages.
--
-- category (existing) = top-level category slug; subcategory = finer slug.
-- cost_usd is internal-only (never sent to the public). price_usd is the
-- optional public selling price (shown when set; otherwise "Get quote").

alter table products
  add column if not exists name_tr               text,
  add column if not exists short_description_tr  text,
  add column if not exists subcategory           text,
  add column if not exists sku                   text,
  add column if not exists source                text,
  add column if not exists source_url            text,
  add column if not exists cost_usd              numeric,
  add column if not exists price_usd             numeric,
  add column if not exists alternative_part_numbers text[] default '{}',
  add column if not exists equivalents           text[] default '{}';

create index if not exists products_subcategory_idx on products (subcategory) where published = true;
