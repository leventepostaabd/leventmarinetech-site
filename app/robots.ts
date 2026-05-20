import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

/**
 * robots.ts — Y4 SEO requirement.
 *
 * Allow all crawlers everywhere except admin/auth/portal/api lanes (Y5 —
 * customer login does not exist on the public surface; admin lives behind
 * its own auth and should never be indexed).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/login', '/auth', '/portal']
      }
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url
  };
}
