/**
 * Social profiles shown as icons in the footer. To publish one, paste its
 * full https URL below (e.g. instagram: 'https://www.instagram.com/<handle>/').
 * Only networks with a URL are rendered, so with every value empty the footer
 * shows no icons and nothing broken. social.test.ts checks each URL is https
 * on that network's domain.
 *
 * Layout check without real URLs: build or run with SOCIAL_PREVIEW=1, which
 * renders all six icons linked to each network's home page. Never set it in
 * production.
 */
export const SOCIAL_NETWORKS = ['instagram', 'tiktok', 'facebook', 'youtube', 'x', 'linkedin'] as const;
export type SocialNetwork = (typeof SOCIAL_NETWORKS)[number];

export const SOCIAL_URLS: Record<SocialNetwork, string> = {
  instagram: '',
  tiktok: '',
  facebook: '',
  youtube: '',
  x: '',
  linkedin: '',
};

/** Each network's domains (for validation) and home page (for the preview). */
export const SOCIAL_DOMAINS: Record<SocialNetwork, { hosts: string[]; home: string }> = {
  instagram: { hosts: ['instagram.com', 'www.instagram.com'], home: 'https://www.instagram.com/' },
  tiktok: { hosts: ['tiktok.com', 'www.tiktok.com'], home: 'https://www.tiktok.com/' },
  facebook: { hosts: ['facebook.com', 'www.facebook.com'], home: 'https://www.facebook.com/' },
  youtube: { hosts: ['youtube.com', 'www.youtube.com'], home: 'https://www.youtube.com/' },
  x: { hosts: ['x.com', 'twitter.com'], home: 'https://x.com/' },
  linkedin: { hosts: ['linkedin.com', 'www.linkedin.com'], home: 'https://www.linkedin.com/' },
};

/** The networks to render, in order: those with a URL, or all six (home pages) in preview. */
export function socialLinks(urls: Record<SocialNetwork, string> = SOCIAL_URLS, preview = false): { network: SocialNetwork; href: string }[] {
  return SOCIAL_NETWORKS
    .map((network) => ({ network, href: preview ? SOCIAL_DOMAINS[network].home : urls[network].trim() }))
    .filter((l) => l.href !== '');
}
