'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  type ProductInput
} from './_actions';

export type CategoryOption = {
  slug: string;
  name: string;
  subcategories: { slug: string; name: string }[];
};

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  name_tr: string;
  brand: string;
  part_number: string;
  category: string;
  subcategory: string;
  short_description: string;
  short_description_tr: string;
  long_description: string;
  availability: 'in-stock' | 'available-supplier' | 'rfq-required';
  delivery_estimate: string;
  image_url: string;
  price_usd: number | null;
  cost_usd: number | null;
  source: string;
  source_url: string;
  tags: string[];
  published: boolean;
};

type FormState = Omit<AdminProduct, 'price_usd' | 'cost_usd' | 'tags'> & {
  price_usd: string;
  cost_usd: string;
  tags: string;
};

function emptyForm(categories: CategoryOption[]): FormState {
  return {
    id: '',
    slug: '',
    name: '',
    name_tr: '',
    brand: '',
    part_number: '',
    category: categories[0]?.slug ?? '',
    subcategory: '',
    short_description: '',
    short_description_tr: '',
    long_description: '',
    availability: 'rfq-required',
    delivery_estimate: '',
    image_url: '',
    price_usd: '',
    cost_usd: '',
    source: '',
    source_url: '',
    tags: '',
    published: true
  };
}

function toForm(p: AdminProduct): FormState {
  return {
    ...p,
    price_usd: p.price_usd === null ? '' : String(p.price_usd),
    cost_usd: p.cost_usd === null ? '' : String(p.cost_usd),
    tags: p.tags.join(', ')
  };
}

export default function ProductAdminClient({
  initialProducts,
  categories
}: {
  initialProducts: AdminProduct[];
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm(categories));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialProducts;
    return initialProducts.filter((p) =>
      `${p.name} ${p.brand} ${p.part_number} ${p.category} ${p.subcategory}`.toLowerCase().includes(q)
    );
  }, [initialProducts, query]);

  const subOptions = useMemo(
    () => categories.find((c) => c.slug === form.category)?.subcategories ?? [],
    [categories, form.category]
  );

  function openNew() {
    setForm(emptyForm(categories));
    setEditingId(null);
    setError(null);
    setOpen(true);
  }

  function openEdit(p: AdminProduct) {
    setForm(toForm(p));
    setEditingId(p.id);
    setError(null);
    setOpen(true);
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { url } = await uploadProductImage(fd);
      set('image_url', url);
    } catch (err: any) {
      setError(err?.message ?? 'Yükleme başarısız');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const input: ProductInput = {
      name: form.name,
      name_tr: form.name_tr,
      brand: form.brand,
      part_number: form.part_number,
      category: form.category,
      subcategory: form.subcategory,
      short_description: form.short_description,
      short_description_tr: form.short_description_tr,
      long_description: form.long_description,
      availability: form.availability,
      delivery_estimate: form.delivery_estimate,
      image_url: form.image_url,
      price_usd: form.price_usd.trim() === '' ? null : Number(form.price_usd),
      cost_usd: form.cost_usd.trim() === '' ? null : Number(form.cost_usd),
      source: form.source,
      source_url: form.source_url,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      published: form.published
    };
    try {
      if (editingId) await updateProduct(editingId, input);
      else await createProduct(input);
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? 'Kaydetme başarısız');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(p: AdminProduct) {
    if (!window.confirm(`"${p.name}" silinsin mi? Bu işlem geri alınamaz.`)) return;
    try {
      await deleteProduct(p.id);
      router.refresh();
    } catch (err: any) {
      window.alert(err?.message ?? 'Silme başarısız');
    }
  }

  const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <div>
          <h2>Ürünler</h2>
          <p className="text-[13px] text-ink-muted">
            Supabase kataloğunda {initialProducts.length} öğe. Ekle, düzenle veya kaldır — değişiklikler
            canlı sitede anında görünür. Maliyet yalnızca dahilidir; fiyat müşteriye yalnızca girildiğinde
            gösterilir.
          </p>
        </div>
        <button type="button" onClick={openNew} className="btn-accent btn-md">
          + Ürün Ekle
        </button>
      </div>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ada, markaya, parçaya, kategoriye göre filtrele…"
        className="w-full mb-4 rounded-md border border-line bg-white px-3 py-2 text-[13px] focus:border-amber focus:ring-2 focus:ring-amber/30 focus:outline-none"
      />

      <div className="overflow-x-auto card !p-0">
        <table className="w-full text-[13px]">
          <thead className="bg-navy-50 text-left">
            <tr>
              {['', 'Ad', 'Marka', 'Parça No', 'Kategori', 'Fiyat', 'Maliyet', 'Yayında', ''].map((h, i) => (
                <th key={i} className="px-3 py-2 font-mono text-[10.5px] uppercase tracking-wider text-ink-subtle">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-line hover:bg-navy-50">
                <td className="px-3 py-2">
                  {p.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image_url} alt="" className="h-9 w-9 rounded object-cover bg-navy-50" />
                  ) : (
                    <div className="h-9 w-9 rounded bg-navy-50" />
                  )}
                </td>
                <td className="px-3 py-2 max-w-[260px]">
                  <div className="text-ink truncate">{p.name}</div>
                  <div className="font-mono text-[10.5px] text-ink-subtle">{p.subcategory || p.category}</div>
                </td>
                <td className="px-3 py-2">{p.brand}</td>
                <td className="px-3 py-2 font-mono text-[11.5px]">{p.part_number}</td>
                <td className="px-3 py-2 text-ink-muted">{catName(p.category)}</td>
                <td className="px-3 py-2 font-mono">{p.price_usd === null ? <span className="text-ink-subtle">Teklif al</span> : `$${p.price_usd.toFixed(2)}`}</td>
                <td className="px-3 py-2 font-mono text-ink-subtle">{p.cost_usd === null ? '—' : `$${p.cost_usd.toFixed(2)}`}</td>
                <td className="px-3 py-2">
                  <span className={`font-mono text-[10px] uppercase ${p.published ? 'text-green-700' : 'text-ink-subtle'}`}>
                    {p.published ? '● yayında' : 'gizli'}
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-right">
                  <button type="button" onClick={() => openEdit(p)} className="text-amber-600 hover:text-amber mr-3">Düzenle</button>
                  <button type="button" onClick={() => onDelete(p)} className="text-red-600 hover:text-red-700">Sil</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="px-3 py-8 text-center text-ink-muted">Eşleşen ürün yok.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/40 p-4">
          <form
            onSubmit={onSubmit}
            className="my-8 w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[18px] font-bold">{editingId ? 'Ürünü Düzenle' : 'Ürün Ekle'}</h3>
              <button type="button" onClick={() => setOpen(false)} className="text-ink-subtle hover:text-ink text-[20px] leading-none">✕</button>
            </div>

            {error && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">{error}</div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Ad (EN) *" full>
                <input required value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Ad (TR)" full>
                <input value={form.name_tr} onChange={(e) => set('name_tr', e.target.value)} className={inputCls} />
              </Field>

              <Field label="Marka">
                <input value={form.brand} onChange={(e) => set('brand', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Parça No">
                <input value={form.part_number} onChange={(e) => set('part_number', e.target.value)} className={inputCls} />
              </Field>

              <Field label="Kategori *">
                <select
                  value={form.category}
                  onChange={(e) => { set('category', e.target.value); set('subcategory', ''); }}
                  className={inputCls}
                >
                  {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Alt Kategori">
                <select value={form.subcategory} onChange={(e) => set('subcategory', e.target.value)} className={inputCls}>
                  <option value="">— yok —</option>
                  {subOptions.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
                </select>
              </Field>

              <Field label="Kısa Açıklama (EN)" full>
                <textarea value={form.short_description} onChange={(e) => set('short_description', e.target.value)} rows={2} className={inputCls} />
              </Field>
              <Field label="Kısa Açıklama (TR)" full>
                <textarea value={form.short_description_tr} onChange={(e) => set('short_description_tr', e.target.value)} rows={2} className={inputCls} />
              </Field>
              <Field label="Uzun Açıklama" full>
                <textarea value={form.long_description} onChange={(e) => set('long_description', e.target.value)} rows={3} className={inputCls} />
              </Field>

              <Field label="Fiyat (USD) — girilirse müşteriye gösterilir">
                <input type="number" step="0.01" min="0" value={form.price_usd} onChange={(e) => set('price_usd', e.target.value)} placeholder="boş = Teklif al" className={inputCls} />
              </Field>
              <Field label="Maliyet (USD) — dahili, gizli">
                <input type="number" step="0.01" min="0" value={form.cost_usd} onChange={(e) => set('cost_usd', e.target.value)} placeholder="bizim ödediğimiz" className={inputCls} />
              </Field>

              <Field label="Stok Durumu">
                <select value={form.availability} onChange={(e) => set('availability', e.target.value as FormState['availability'])} className={inputCls}>
                  <option value="in-stock">Stokta</option>
                  <option value="available-supplier">Tedarikçiden temin edilebilir</option>
                  <option value="rfq-required">Teklif Gerekli</option>
                </select>
              </Field>
              <Field label="Tahmini Teslimat">
                <input value={form.delivery_estimate} onChange={(e) => set('delivery_estimate', e.target.value)} className={inputCls} />
              </Field>

              <Field label="Kaynak (dahili not, örn. Amazon/eBay)">
                <input value={form.source} onChange={(e) => set('source', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Kaynak URL (dahili)">
                <input value={form.source_url} onChange={(e) => set('source_url', e.target.value)} className={inputCls} />
              </Field>

              <Field label="Etiketler (virgülle ayrılmış)" full>
                <input value={form.tags} onChange={(e) => set('tags', e.target.value)} className={inputCls} />
              </Field>

              <Field label="Ürün Görseli" full>
                <div className="flex items-center gap-3">
                  {form.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={form.image_url} alt="" className="h-16 w-16 rounded object-cover bg-navy-50 border border-line" />
                  )}
                  <input ref={fileRef} type="file" accept="image/*" onChange={onPickImage} className="text-[12px]" />
                  {uploading && <span className="text-[12px] text-ink-subtle">Yükleniyor…</span>}
                  {form.image_url && (
                    <button type="button" onClick={() => set('image_url', '')} className="text-[12px] text-red-600">kaldır</button>
                  )}
                </div>
              </Field>

              <Field label="" full>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} className="rounded border-line-strong text-amber focus:ring-amber" />
                  <span className="text-[13px]">Yayında (sitede görünür)</span>
                </label>
              </Field>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="btn-ghost btn-md">İptal</button>
              <button type="submit" disabled={saving || uploading} className="btn-accent btn-md disabled:opacity-50">
                {saving ? 'Kaydediliyor…' : editingId ? 'Değişiklikleri Kaydet' : 'Ürün Oluştur'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const inputCls =
  'w-full rounded-md border border-line bg-white px-3 py-2 text-[13px] focus:border-amber focus:ring-2 focus:ring-amber/30 focus:outline-none';

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
      {label && <span className="mb-1 block font-mono text-[10.5px] uppercase tracking-wider text-ink-subtle">{label}</span>}
      {children}
    </label>
  );
}
