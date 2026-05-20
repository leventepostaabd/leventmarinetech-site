import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { readProducts, readServices } from '@/lib/content';
import { knowledgeSlugs } from './knowledge/_lib';

/**
 * sitemap.ts — Y4 SEO requirement.
 *
 * Includes:
 *  - top-level routes (/, /services, /supply, etc.)
 *  - all 19 (or current count of) service system slugs
 *  - region landing pages
 *  - supply product pages
 *  - supply category pages (umbrella + individual)
 *  - /knowledge landing + every published article
 *  - legal pages (privacy / terms / cookie / accessibility)
 *
 * /admin, /portal, /login, /auth are explicitly excluded — see robots.ts.
 */

// 3 umbrella categories from decision T4 (Marine Electric → General Electric → General Marine)
const SUPPLY_UMBRELLA_CATEGORIES = [
  'marine-electric',
  'general-electric',
  'general-marine'
] as const;

// Detailed product-category routes derived from content/products.json
const SUPPLY_DETAIL_CATEGORIES = [
  'alarm-monitoring',
  'automation-control',
  'batteries-ups',
  'breakers-contactors',
  'cables-glands',
  'electrical-spares',
  'engine-room-consumables',
  'motors-fans',
  'navigation-lights',
  'plc-hmi',
  'safety-lsa',
  'sensors-transmitters',
  'solenoid-valves',
  'test-instruments'
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (p: string) => `${SITE.url}${p}`;
  const products = readProducts();
  const knowledge = knowledgeSlugs();
  const services20 = readServices();

  const top = [
    { url: url('/'),                              lastModified: now, changeFrequency: 'weekly'  as const, priority: 1.0  },
    { url: url('/services'),                      lastModified: now, changeFrequency: 'weekly'  as const, priority: 0.9  },
    { url: url('/supply'),                        lastModified: now, changeFrequency: 'weekly'  as const, priority: 0.95 },
    { url: url('/supply/categories'),             lastModified: now, changeFrequency: 'weekly'  as const, priority: 0.85 },
    { url: url('/supply-wizard'),                 lastModified: now, changeFrequency: 'monthly' as const, priority: 0.9  },
    { url: url('/service-wizard'),                lastModified: now, changeFrequency: 'monthly' as const, priority: 0.9  },
    { url: url('/supply/equivalent-part-finder'), lastModified: now, changeFrequency: 'monthly' as const, priority: 0.85 },
    { url: url('/supply/unlisted-request'),       lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8  },
    { url: url('/about'),                         lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7  },
    { url: url('/contact'),                       lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7  },
    { url: url('/knowledge'),                     lastModified: now, changeFrequency: 'weekly'  as const, priority: 0.75 }
  ];

  const services = services20.map((s) => ({
    url: url(`/services/${s.slug}`),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7
  }));

  const productPages = products.map((p) => ({
    url: url(`/supply/product/${p.slug}`),
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6
  }));

  const supplyCategoryUmbrella = SUPPLY_UMBRELLA_CATEGORIES.map((slug) => ({
    url: url(`/supply/category/${slug}`),
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85
  }));

  const supplyCategoryDetail = SUPPLY_DETAIL_CATEGORIES.map((slug) => ({
    url: url(`/supply/category/${slug}`),
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7
  }));

  const knowledgePages = knowledge.map((slug) => ({
    url: url(`/knowledge/${slug}`),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.65
  }));

  const legal = ['privacy', 'terms', 'cookie-policy', 'accessibility-statement'].map((s) => ({
    url: url(`/${s}`),
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.3
  }));

  return [
    ...top,
    ...services,
    ...productPages,
    ...supplyCategoryUmbrella,
    ...supplyCategoryDetail,
    ...knowledgePages,
    ...legal
  ];
}
