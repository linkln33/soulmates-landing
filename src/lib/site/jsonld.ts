/**
 * JSON-LD for portal pages (docs/launch-readiness/seo/structured-data-spec.md):
 * only what the page visibly shows. No ratings, offers, prices or FAQ markup.
 */
import { SITE_URL } from './config.ts';

/** A BreadcrumbList mirroring the page's visible breadcrumb, current page last. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
  // "<" is escaped so the text can never close the script element.
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
