import type { MetadataRoute } from 'next';
import { SITE, SERVICE_SLUGS, REGION_SLUGS } from '@/lib/site';
import { readProducts } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (p: string) => `${SITE.url}${p}`;
  const products = readProducts();

  const top = [
    { url: url('/'),                            lastModified: now, changeFrequency: 'weekly'  as const, priority: 1.0 },
    { url: url('/services'),                    lastModified: now, changeFrequency: 'weekly'  as const, priority: 0.9 },
    { url: url('/supply'),                      lastModified: now, changeFrequency: 'weekly'  as const, priority: 0.95 },
    { url: url('/supply/categories'),           lastModified: now, changeFrequency: 'weekly'  as const, priority: 0.85 },
    { url: url('/supply-wizard'),               lastModified: now, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: url('/service-wizard'),              lastModified: now, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: url('/supply/equivalent-part-finder'), lastModified: now, changeFrequency: 'monthly' as const, priority: 0.85 },
    { url: url('/supply/unlisted-request'),     lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: url('/usa'),                         lastModified: now, changeFrequency: 'weekly'  as const, priority: 0.9 },
    { url: url('/about'),                       lastModified: now, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: url('/contact'),                     lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 }
  ];

  const services = SERVICE_SLUGS.map((slug) => ({
    url: url(`/services/${slug}`),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7
  }));

  const regions = REGION_SLUGS.map((slug) => ({
    url: url(`/usa/${slug}`),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8
  }));

  const productPages = products.map((p) => ({
    url: url(`/supply/product/${p.slug}`),
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6
  }));

  const legal = ['privacy', 'terms', 'cookie-policy', 'accessibility-statement'].map((s) => ({
    url: url(`/${s}`),
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.3
  }));

  return [...top, ...services, ...regions, ...productPages, ...legal];
}
