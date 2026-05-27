'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabase, createServiceSupabase } from '@/lib/supabase/server';

async function requireAdmin() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const service = createServiceSupabase();
  const { data: profile } = await service
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') throw new Error('Not admin');
  return user;
}

export type ProductInput = {
  id?: string;
  slug?: string;
  name: string;
  name_tr?: string;
  brand?: string;
  part_number?: string;
  category: string;
  subcategory?: string;
  short_description?: string;
  short_description_tr?: string;
  long_description?: string;
  availability?: 'in-stock' | 'available-supplier' | 'rfq-required';
  delivery_estimate?: string;
  image_url?: string;
  /** Optional public price — shown to the customer when set. */
  price_usd?: number | null;
  /** Internal cost — never shown to customers. */
  cost_usd?: number | null;
  source?: string;
  source_url?: string;
  tags?: string[];
  published?: boolean;
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

function toRow(input: ProductInput) {
  const num = (v: number | null | undefined) =>
    v === null || v === undefined || Number.isNaN(v) ? null : Number(v);
  return {
    name: input.name.trim(),
    name_tr: input.name_tr?.trim() || null,
    brand: input.brand?.trim() || null,
    part_number: input.part_number?.trim() || null,
    category: input.category,
    subcategory: input.subcategory?.trim() || null,
    short_description: input.short_description?.trim() || null,
    short_description_tr: input.short_description_tr?.trim() || null,
    long_description: input.long_description?.trim() || null,
    availability: input.availability ?? 'rfq-required',
    delivery_estimate: input.delivery_estimate?.trim() || null,
    image_url: input.image_url?.trim() || null,
    price_usd: num(input.price_usd),
    cost_usd: num(input.cost_usd),
    source: input.source?.trim() || null,
    source_url: input.source_url?.trim() || null,
    tags: input.tags ?? [],
    published: input.published ?? true,
    updated_at: new Date().toISOString()
  };
}

function bumpCaches(slug?: string) {
  revalidatePath('/admin/products');
  revalidatePath('/supply');
  revalidatePath('/supply/categories');
  if (slug) revalidatePath(`/supply/product/${slug}`);
}

export async function createProduct(input: ProductInput) {
  await requireAdmin();
  if (!input.name?.trim()) throw new Error('Ad zorunlu');
  if (!input.category?.trim()) throw new Error('Kategori zorunlu');
  const supabase = createServiceSupabase();

  const baseSlug = (input.slug?.trim() && slugify(input.slug)) || slugify(input.name);
  // Ensure slug + id uniqueness with a short suffix if needed.
  let slug = baseSlug || `product-${Date.now()}`;
  const { data: clash } = await supabase.from('products').select('id').eq('slug', slug).maybeSingle();
  if (clash) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  const id = slug;

  const { error } = await supabase
    .from('products')
    .insert({ id, slug, ...toRow(input), created_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
  bumpCaches(slug);
  return { id, slug };
}

export async function updateProduct(id: string, input: ProductInput) {
  await requireAdmin();
  if (!input.name?.trim()) throw new Error('Ad zorunlu');
  if (!input.category?.trim()) throw new Error('Kategori zorunlu');
  const supabase = createServiceSupabase();
  const { data: row } = await supabase.from('products').select('slug').eq('id', id).single();
  const { error } = await supabase.from('products').update(toRow(input)).eq('id', id);
  if (error) throw new Error(error.message);
  bumpCaches(row?.slug);
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const supabase = createServiceSupabase();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);
  bumpCaches();
}

/** Upload a product photo to the public `product-images` bucket; returns the
    public URL to store in `image_url`. */
export async function uploadProductImage(formData: FormData): Promise<{ url: string }> {
  await requireAdmin();
  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) throw new Error('Dosya yok');
  if (file.size > 8 * 1024 * 1024) throw new Error('Görsel çok büyük (en fazla 8MB)');
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `catalog/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const supabase = createServiceSupabase();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, bytes, { contentType: file.type || 'image/jpeg', upsert: false });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return { url: data.publicUrl };
}
