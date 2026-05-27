import 'server-only';
import { createServiceSupabase } from '@/lib/supabase/server';
import type { ProductContent, ProductSource } from '@/lib/content';

/**
 * Supabase-backed product catalog (single source of truth).
 *
 * The /supply grid, category pages, product detail pages and the admin
 * dashboard all read through here. products.json stays in the repo only as
 * the seed-of-record (used once to populate the table). Reads use the
 * service-role client so unpublished drafts are visible to admin queries;
 * public callers must pass `publishedOnly: true`.
 */

type Row = {
  id: string;
  slug: string;
  name: string;
  name_tr: string | null;
  brand: string | null;
  part_number: string | null;
  category: string;
  subcategory: string | null;
  short_description: string | null;
  short_description_tr: string | null;
  long_description: string | null;
  specs: Record<string, string> | null;
  applications: string[] | null;
  compatible_systems: string[] | null;
  availability: ProductContent['availability'];
  delivery_estimate: string | null;
  datasheet_url: string | null;
  image_url: string | null;
  image_hint: string | null;
  tags: string[] | null;
  disclaimer: string | null;
  sku: string | null;
  source: string | null;
  source_url: string | null;
  cost_usd: number | null;
  price_usd: number | null;
  alternative_part_numbers: string[] | null;
  equivalents: string[] | null;
  published: boolean;
};

const COLS =
  'id, slug, name, name_tr, brand, part_number, category, subcategory, short_description, short_description_tr, long_description, specs, applications, compatible_systems, availability, delivery_estimate, datasheet_url, image_url, image_hint, tags, disclaimer, sku, source, source_url, cost_usd, price_usd, alternative_part_numbers, equivalents, published';

function mapRow(r: Row): ProductContent & { published: boolean } {
  return {
    id: r.id,
    slug: r.slug,
    sku: r.sku ?? undefined,
    name: r.name,
    name_en: r.name,
    name_tr: r.name_tr ?? undefined,
    brand: r.brand ?? '',
    partNumber: r.part_number ?? '',
    alternativePartNumbers: r.alternative_part_numbers ?? [],
    // Legacy `category` field carries the sub-category slug (matches the JSON
    // era so productsBySubcategory / detail back-links keep working).
    category: r.subcategory ?? r.category,
    category_slug: r.category,
    subcategory_slug: r.subcategory ?? undefined,
    shortDescription: r.short_description ?? '',
    description_en: r.short_description ?? undefined,
    description_tr: r.short_description_tr ?? undefined,
    longDescription: r.long_description ?? '',
    image: r.image_url ?? undefined,
    specs: r.specs ?? {},
    applications: r.applications ?? [],
    compatibleSystems: r.compatible_systems ?? [],
    availability: r.availability,
    in_stock: r.availability === 'in-stock',
    source: (r.source as ProductSource) ?? undefined,
    source_url: r.source_url ?? undefined,
    price: r.price_usd,
    cost: r.cost_usd,
    equivalents: r.equivalents ?? [],
    deliveryEstimate: r.delivery_estimate ?? '',
    datasheetUrl: r.datasheet_url ?? undefined,
    imageHint: r.image_hint ?? undefined,
    tags: r.tags ?? [],
    disclaimer: r.disclaimer ?? '',
    published: r.published
  };
}

async function fetchProducts(opts: { publishedOnly: boolean }): Promise<(ProductContent & { published: boolean })[]> {
  const db = createServiceSupabase();
  let q = db.from('products').select(COLS).order('name', { ascending: true });
  if (opts.publishedOnly) q = q.eq('published', true);
  const { data, error } = await q;
  if (error || !data) return [];
  return (data as unknown as Row[]).map(mapRow);
}

/** Published catalog — public pages. */
export async function getProducts(): Promise<ProductContent[]> {
  return fetchProducts({ publishedOnly: true });
}

/** Every product incl. unpublished drafts — admin only. */
export async function getAllProductsAdmin(): Promise<(ProductContent & { published: boolean })[]> {
  return fetchProducts({ publishedOnly: false });
}

export async function getProductBySlug(slug: string): Promise<ProductContent | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}

export async function getProductsBySubcategory(slug: string): Promise<ProductContent[]> {
  return (await getProducts()).filter((p) => (p.subcategory_slug ?? p.category) === slug);
}

export async function getProductsByTopCategory(slug: string): Promise<ProductContent[]> {
  return (await getProducts()).filter((p) => p.category_slug === slug);
}
