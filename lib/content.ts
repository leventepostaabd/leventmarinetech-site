import fs from 'node:fs';
import path from 'node:path';

/**
 * Service system entry — keyed by slug.
 * Backed by content/services.json (Wave 1, Agent B).
 *
 * 19 real marine systems + 1 "other" fallback. Bilingual (EN + TR).
 * No prices, no internal info — customer-facing only.
 */
export type ServiceFaq = {
  question_en: string;
  question_tr: string;
  answer_en: string;
  answer_tr: string;
};

export type ServiceContent = {
  slug: string;
  popular: boolean;
  order: number;
  icon?: string;
  name_en: string;
  name_tr: string;
  kicker_en: string;
  kicker_tr: string;
  summary_en: string;
  summary_tr: string;
  metaTitle: string;
  metaDescription: string;
  seo_keywords: string[];
  symptoms: string[];
  common_causes: string[];
  tools: string[];
  related_supply_categories: string[];
  /** Optional bilingual FAQ block, rendered on the detail page and emitted
      as schema.org FAQPage. Present only for the 8 deck-promoted services
      in the first pass; remaining 14 follow in a later content batch. */
  faqs?: ServiceFaq[];
};

export type ServiceWizardOption = { id: string; en: string; tr: string };

export type ServicesFile = {
  version: number;
  popular: string[];
  wizard: {
    step_port: { en: string; tr: string; hint_en: string; hint_tr: string };
    step_when: { en: string; tr: string; options: ServiceWizardOption[] };
    step_contact: {
      en: string; tr: string;
      name_en: string; name_tr: string;
      email_en: string; email_tr: string;
      phone_en: string; phone_tr: string;
      vessel_en: string; vessel_tr: string;
      imo_en: string; imo_tr: string;
    };
    submit_en: string; submit_tr: string;
    promise_en: string; promise_tr: string;
    received_en: string; received_tr: string;
    ref_en: string; ref_tr: string;
  };
  us_ports: string[];
  ui: Record<string, string>;
  services: ServiceContent[];
};

export type RegionContent = {
  slug: string;
  city: string;
  state: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  logistics: {
    airports: string[];
    freightHubs: string[];
    responseNote: string;
  };
  ports: { name: string; lat: number; lng: number; vesselTypes: string[]; notes: string }[];
  scenarios: { title: string; summary: string }[];
  usdInvoicing: string;
  schemaCity: string;
  schemaServiceArea: string[];
};

export type ProductSource = 'amazon' | 'ebay' | 'manual';

export type ProductContent = {
  id: string;
  slug: string;
  sku?: string;
  name: string;
  name_en?: string;
  name_tr?: string;
  brand: string;
  partNumber: string;
  alternativePartNumbers: string[];
  /** Legacy single-category field (used as subcategory_slug if new schema absent). */
  category: string;
  /** New: top-level category (marine-electric / general-electric / general-marine). */
  category_slug?: string;
  /** New: subcategory under category_slug. */
  subcategory_slug?: string;
  shortDescription: string;
  description_en?: string;
  description_tr?: string;
  longDescription: string;
  /** Optional product image path (public/). */
  image?: string;
  specs: Record<string, string>;
  applications: string[];
  compatibleSystems: string[];
  availability: 'in-stock' | 'available-supplier' | 'rfq-required';
  /** Convenience flag — true if availability === 'in-stock'. */
  in_stock?: boolean;
  /** Origin of the listing — amazon | ebay | manual. */
  source?: ProductSource;
  source_url?: string;
  /** Slugs of equivalent / cross-reference products. */
  equivalents?: string[];
  deliveryEstimate: string;
  datasheetUrl?: string;
  imageHint?: string;
  tags: string[];
  disclaimer: string;
};

export type Subcategory = {
  slug: string;
  name_en: string;
  name_tr: string;
  hint_en?: string;
  hint_tr?: string;
};

export type Category = {
  slug: string;
  order: number;
  name_en: string;
  name_tr: string;
  summary_en: string;
  summary_tr: string;
  icon?: string;
  subcategories: Subcategory[];
};

export type ProductLabels = {
  catalogTitle: string;
  searchPlaceholder: string;
  categoriesHeading: string;
  inStock: string;
  getQuote: string;
  requestEquivalent: string;
  filterBrand: string;
  filterAvailability: string;
  filterAll: string;
  noPrice: string;
  photoCta: string;
};

export type ProductsFile = {
  version?: string;
  generated?: string;
  currency?: string;
  note?: string;
  labels?: Record<'en' | 'tr', ProductLabels>;
  categories?: Category[];
  products: ProductContent[];
};

const CONTENT_DIR = path.join(process.cwd(), 'content');

function readJson<T>(file: string, fallback: T): T {
  try {
    const p = path.join(CONTENT_DIR, file);
    if (!fs.existsSync(p)) return fallback;
    return JSON.parse(fs.readFileSync(p, 'utf8')) as T;
  } catch {
    return fallback;
  }
}

/** Full services.json (wizard config + UI strings + system list). */
export function readServicesFile(): ServicesFile {
  return readJson<ServicesFile>('services.json', {
    version: 2,
    popular: [],
    wizard: {
      step_port: { en: 'Which port?', tr: 'Hangi liman?', hint_en: '', hint_tr: '' },
      step_when: { en: 'When?', tr: 'Ne zaman?', options: [] },
      step_contact: {
        en: 'Contact', tr: 'İletişim',
        name_en: 'Your name', name_tr: 'Adınız',
        email_en: 'Email', email_tr: 'E-posta',
        phone_en: 'Phone', phone_tr: 'Telefon',
        vessel_en: 'Vessel', vessel_tr: 'Gemi',
        imo_en: 'IMO', imo_tr: 'IMO'
      },
      submit_en: 'Submit', submit_tr: 'Gönder',
      promise_en: 'Our next available technician will contact you within 1 hour.',
      promise_tr: 'İlk müsait teknisyenimiz 1 saat içinde sizinle iletişime geçecek.',
      received_en: 'Your request is in.', received_tr: 'Talebiniz alındı.',
      ref_en: 'Reference', ref_tr: 'Referans'
    },
    us_ports: [],
    ui: {},
    services: []
  });
}

/** Services list, sorted by `order`. */
export function readServices(): ServiceContent[] {
  return readServicesFile().services.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/** Map slug → ServiceContent. */
export function readServiceMap(): Record<string, ServiceContent> {
  return Object.fromEntries(readServices().map((s) => [s.slug, s]));
}

/** Popular system slugs (S1 default: Generator · BWTS · Fire Alarm · Bridge Nav · PLC · Crane). */
export function readPopularServices(): ServiceContent[] {
  const file = readServicesFile();
  const map = Object.fromEntries(file.services.map((s) => [s.slug, s]));
  const popular: ServiceContent[] = [];
  for (const slug of file.popular) if (map[slug]) popular.push(map[slug]);
  // fallback if popular list empty — pick first 6 by order
  if (popular.length === 0) {
    return readServices().slice(0, 6);
  }
  return popular;
}

/** Single service by slug. */
export function getService(slug: string): ServiceContent | undefined {
  return readServiceMap()[slug];
}

export function readRegions(): Record<string, RegionContent> {
  const data = readJson<
    { regions: RegionContent[] } | RegionContent[] | Record<string, RegionContent>
  >('regions.json', []);
  if (Array.isArray(data)) return Object.fromEntries(data.map((r) => [r.slug, r]));
  if (data && typeof data === 'object' && 'regions' in data) {
    return Object.fromEntries(
      (data as { regions: RegionContent[] }).regions.map((r) => [r.slug, r])
    );
  }
  return data as Record<string, RegionContent>;
}

export function readRegionsList(): RegionContent[] {
  return Object.values(readRegions()).sort((a, b) => a.city.localeCompare(b.city));
}

export function getRegion(slug: string): RegionContent | undefined {
  return readRegions()[slug];
}

function readProductsFile(): ProductsFile {
  const data = readJson<ProductsFile | ProductContent[]>('products.json', { products: [] } as ProductsFile);
  if (Array.isArray(data)) return { products: data };
  return data as ProductsFile;
}

export function readProducts(): ProductContent[] {
  return readProductsFile().products ?? [];
}

export function readCategories(): Category[] {
  return readProductsFile().categories ?? [];
}

export function readProductLabels(locale: 'en' | 'tr' = 'en'): ProductLabels {
  const labels = readProductsFile().labels;
  if (labels && labels[locale]) return labels[locale];
  // Sensible fallback so pages render even if labels missing.
  return {
    catalogTitle: 'Find any part — paste a model, upload a photo, or browse.',
    searchPlaceholder: 'Search by brand, part number, model, or system',
    categoriesHeading: 'Browse by category',
    inStock: 'In Stock',
    getQuote: 'Get Quote',
    requestEquivalent: 'Request Equivalent',
    filterBrand: 'Brand',
    filterAvailability: 'Availability',
    filterAll: 'All',
    noPrice: 'Prices are quote-only.',
    photoCta: "Don't know the model? Upload a nameplate photo."
  };
}

export function productBySlug(slug: string): ProductContent | undefined {
  return readProducts().find((p) => p.slug === slug);
}

/**
 * Products that belong to a sub-category. Accepts both the new `subcategory_slug`
 * and the legacy `category` field so existing detail/category URLs keep working.
 */
export function productsBySubcategory(slug: string): ProductContent[] {
  return readProducts().filter((p) => (p.subcategory_slug ?? p.category) === slug);
}

/** Products under a top-level category (marine-electric | general-electric | general-marine). */
export function productsByTopCategory(slug: string): ProductContent[] {
  return readProducts().filter((p) => p.category_slug === slug);
}

/** @deprecated — use productsBySubcategory(). Kept for backward-compat. */
export function productsByCategory(cat: string): ProductContent[] {
  return productsBySubcategory(cat);
}

export function categoryBySlug(slug: string): Category | undefined {
  return readCategories().find((c) => c.slug === slug);
}

export function subcategoryBySlug(slug: string): { category: Category; sub: Subcategory } | undefined {
  for (const c of readCategories()) {
    const sub = c.subcategories.find((s) => s.slug === slug);
    if (sub) return { category: c, sub };
  }
  return undefined;
}
