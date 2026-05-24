import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { readServices, readRegionsList } from '@/lib/content';
import { knowledgeSlugs } from './knowledge/_lib';

/**
 * sitemap.ts — Y4 SEO requirement.
 *
 * Includes:
 *  - top-level routes (/, /services, /supply, etc.)
 *  - all current service system slugs
 *  - /knowledge landing + every published article
 *  - legal pages (privacy / terms / cookie / accessibility)
 *
 * Excluded:
 *  - /supply/category/* and /supply/product/* — supply is presented as a
 *    single live-search experience; per-category and per-product detail
 *    routes still exist for direct linking but are not promoted to crawlers.
 *  - /admin, /portal, /login, /auth — see robots.ts.
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (p: string) => `${SITE.url}${p}`;
  const knowledge = knowledgeSlugs();
  const services20 = readServices();

  const top = [
    { url: url('/'),                              lastModified: now, changeFrequency: 'weekly'  as const, priority: 1.0  },
    { url: url('/services'),                      lastModified: now, changeFrequency: 'weekly'  as const, priority: 0.9  },
    { url: url('/supply'),                        lastModified: now, changeFrequency: 'weekly'  as const, priority: 0.95 },
    { url: url('/supply-wizard'),                 lastModified: now, changeFrequency: 'monthly' as const, priority: 0.9  },
    { url: url('/service-wizard'),                lastModified: now, changeFrequency: 'monthly' as const, priority: 0.9  },
    { url: url('/supply/equivalent-part-finder'), lastModified: now, changeFrequency: 'monthly' as const, priority: 0.85 },
    { url: url('/supply/unlisted-request'),       lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8  },
    { url: url('/about'),                         lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7  },
    { url: url('/contact'),                       lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7  },
    { url: url('/knowledge'),                     lastModified: now, changeFrequency: 'weekly'  as const, priority: 0.75 },
    { url: url('/ports'),                         lastModified: now, changeFrequency: 'monthly' as const, priority: 0.85 }
  ];

  const services = services20.map((s) => ({
    url: url(`/services/${s.slug}`),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7
  }));

  const portPages = readRegionsList().map((r) => ({
    url: url(`/ports/${r.slug}`),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75
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
    ...portPages,
    ...knowledgePages,
    ...legal
  ];
}
