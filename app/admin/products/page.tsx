import { getAllProductsAdmin } from '@/lib/products-db';
import { readCategories } from '@/lib/content';
import ProductAdminClient, { type AdminProduct, type CategoryOption } from './ProductAdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminProducts() {
  const products = await getAllProductsAdmin();
  const categories: CategoryOption[] = readCategories()
    .sort((a, b) => a.order - b.order)
    .map((c) => ({
      slug: c.slug,
      name: c.name_en,
      subcategories: c.subcategories.map((s) => ({ slug: s.slug, name: s.name_en }))
    }));

  const rows: AdminProduct[] = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    name_tr: p.name_tr ?? '',
    brand: p.brand ?? '',
    part_number: p.partNumber ?? '',
    category: p.category_slug ?? '',
    subcategory: p.subcategory_slug ?? '',
    short_description: p.shortDescription ?? '',
    short_description_tr: p.description_tr ?? '',
    long_description: p.longDescription ?? '',
    availability: p.availability,
    delivery_estimate: p.deliveryEstimate ?? '',
    image_url: p.image ?? '',
    price_usd: p.price ?? null,
    cost_usd: p.cost ?? null,
    source: p.source ?? '',
    source_url: p.source_url ?? '',
    tags: p.tags ?? [],
    published: p.published
  }));

  return <ProductAdminClient initialProducts={rows} categories={categories} />;
}
