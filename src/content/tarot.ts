/**
 * Tarot content: 78 cards with EN/BG texts (own text based on Waite 1911),
 * synced from the app. The server only picks cards and orientation.
 */
import type { Locale } from '@/i18n/config';
import TAROT_CARDS from '@/content/app/tarotCards.json';
import type { TarotCardText, TarotCardView, TarotGroup } from './tarotKeys';

export * from './tarotKeys';




type TarotEntry = { index: number; group: TarotGroup; number: number; en: TarotCardText; bg: TarotCardText };
const CARDS = TAROT_CARDS as unknown as Record<string, TarotEntry>;

export const TAROT_KEYS: string[] = Object.keys(CARDS).sort((a, b) => CARDS[a].index - CARDS[b].index);

export function isTarotKey(key: unknown): key is string {
  return typeof key === 'string' && Object.prototype.hasOwnProperty.call(CARDS, key);
}


export function tarotCard(key: string, lang: Locale): TarotCardView | null {
  const entry = CARDS[key];
  if (!entry) return null;
  return { key, group: entry.group, index: entry.index, text: entry[lang] ?? entry.en };
}

export function tarotCardsIn(group: TarotGroup): string[] {
  return TAROT_KEYS.filter((key) => CARDS[key].group === group);
}
