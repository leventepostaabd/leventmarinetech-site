import fs from 'node:fs';
import path from 'node:path';

export type ServiceContent = {
  slug: string;
  title: string;
  kicker: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  symptoms: string[];
  rootCauses: string[];
  whatWeCheck: string[];
  tools: string[];
  exampleCase: {
    vesselType: string;
    port: string;
    year: string;
    headline: string;
    summary: string;
  };
  relatedSupply: string[];
  ctaService: string;
  ctaSupply: string;
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

export type ProductContent = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  partNumber: string;
  alternativePartNumbers: string[];
  category: string;
  shortDescription: string;
  longDescription: string;
  specs: Record<string, string>;
  applications: string[];
  compatibleSystems: string[];
  availability: 'in-stock' | 'available-supplier' | 'rfq-required';
  deliveryEstimate: string;
  datasheetUrl?: string;
  imageHint?: string;
  tags: string[];
  disclaimer: string;
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

/** Services keyed by slug. */
export function readServices(): Record<string, ServiceContent> {
  const arr = readJson<ServiceContent[] | Record<string, ServiceContent>>('services.json', []);
  if (Array.isArray(arr)) return Object.fromEntries(arr.map((s) => [s.slug, s]));
  return arr;
}

export function readRegions(): Record<string, RegionContent> {
  const arr = readJson<RegionContent[] | Record<string, RegionContent>>('regions.json', []);
  if (Array.isArray(arr)) return Object.fromEntries(arr.map((r) => [r.slug, r]));
  return arr;
}

export function readProducts(): ProductContent[] {
  const data = readJson<ProductContent[] | { products: ProductContent[] }>('products.json', []);
  if (Array.isArray(data)) return data;
  return (data as { products: ProductContent[] }).products ?? [];
}

export function productBySlug(slug: string): ProductContent | undefined {
  return readProducts().find((p) => p.slug === slug);
}

export function productsByCategory(cat: string): ProductContent[] {
  return readProducts().filter((p) => p.category === cat);
}
