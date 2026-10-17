/** Tarot keys and paths without the card texts (safe for small client bundles). */

export type TarotGroup = 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';
export const TAROT_GROUPS: TarotGroup[] = ['major', 'wands', 'cups', 'swords', 'pentacles'];
export type TarotOrientation = 'upright' | 'reversed';

export interface TarotCardText {
  name: string;
  keywords: string[];
  imagery: string;
  upright: string;
  reversed: string;
  love: string;
  work: string;
  advice: string;
}

export interface TarotCardView {
  key: string;
  group: TarotGroup;
  index: number;
  text: TarotCardText;
}

/** URL slug for a card page: 'high_priestess' → 'high-priestess'. */
export const cardSlug = (key: string) => key.replace(/_/g, '-');
export const cardKeyFromSlug = (slug: string) => slug.replace(/-/g, '_');

/** Published path of the card's artwork (synced from the app's deck). */
export const tarotImage = (key: string) => `/app-content/tarot/${key}.webp`;
