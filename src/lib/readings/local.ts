/**
 * What the website keeps in the visitor's browser (localStorage only; no
 * cookies, nothing sent anywhere unless a tool says so): the Tarot keys
 * described in ./tarotStorage.ts, each with a schema version and an expiry
 * (visitor id 365 days after last use, today's card until local midnight,
 * the last draw 30 days).
 * Every access is guarded: storage can be missing or throw (private windows,
 * blocked site data), and the tools still work without it.
 */
import {
  clearDraw as clearDrawIn,
  readDaily as readDailyIn,
  readDraw as readDrawIn,
  saveDaily as saveDailyIn,
  saveDraw as saveDrawIn,
  sweepTarotStorage,
  takeVisitorId,
  type KeyValueStore,
} from './tarotStorage.ts';

export { localDay } from './tarotStorage.ts';

/** localStorage, or a no-op store when the browser blocks it. */
function store(): KeyValueStore {
  try {
    const s = window.localStorage;
    if (s) return s;
  } catch {
    // fall through
  }
  return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
}

/** This browser's random visitor identifier for the card of the day; refreshes its last use. */
export const visitorId = (): string => takeVisitorId(store());

export const readDaily = <T,>(tz: string, isData: (d: unknown) => d is T) => readDailyIn(store(), tz, isData);
export const saveDaily = <T,>(id: string, day: string, tz: string, data: T) => saveDailyIn(store(), id, day, tz, data);
export const readDraw = <T,>(count: 1 | 3, isData: (d: unknown) => d is T) => readDrawIn(store(), count, isData);
export const saveDraw = <T,>(count: 1 | 3, question: string, data: T) => saveDrawIn(store(), count, question, data);
export const clearDraw = (count: 1 | 3) => clearDrawIn(store(), count);

/** Shape checks shared by the Tarot tools and the page-load sweep. */
export const isDailyShape = (d: unknown): boolean =>
  typeof d === 'object' && d !== null && typeof (d as { date?: unknown }).date === 'string' &&
  typeof (d as { card?: { key?: unknown } }).card?.key === 'string';
export const isDrawShape = (count: 1 | 3) => (d: unknown): boolean =>
  Array.isArray((d as { reading?: { cards?: unknown } } | null)?.reading?.cards) &&
  (d as { reading: { cards: unknown[] } }).reading.cards.length === count;

/** Expire or clear invalid Tarot keys once per page load, wherever the visitor lands. */
export const sweepTarot = (tz: string) => sweepTarotStorage(store(), tz, isDailyShape, isDrawShape);
