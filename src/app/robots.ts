import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site/config';

/**
 * Crawl the portal. Quiz and deletion pages are not disallowed on purpose:
 * crawlers must be able to read their `noindex` (page metadata and the
 * X-Robots-Tag header in next.config.ts), which a disallow would hide.
 * /internal/ (component review pages) is a 404 in production and disallowed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/internal/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
