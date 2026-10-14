import type { MetadataRoute } from 'next';
import { INDEXABLE_ROUTES, SITE_URL } from '@/lib/site/config';

export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_ROUTES.map((path) => ({
    url: path === '/' ? SITE_URL : `${SITE_URL}${path}`,
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.5,
  }));
}
