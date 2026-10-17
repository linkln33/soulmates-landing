/**
 * Browser calls to the production API's public readings
 * (backend src/routes/publicReadings.js). Called from the visitor's browser,
 * never the website server, so the API rate-limits each visitor by their own
 * IP. Responses carry keys and numbers only; text comes from src/content.
 */
import { API_BASE } from '@/lib/site/config';
import type { HoroscopePart, PeriodKey, PhaseKey } from '@/content/horoscope';
import type { SignKey } from '@/content/signs';
import type { TarotOrientation } from '@/content/tarotKeys';

export interface MoonState {
  phase: PhaseKey;
  illumination: number;
  sign: SignKey;
  enteredAt: string;
  leavesAt: string | null;
  nextSign: SignKey;
  nextPhase: { phase: PhaseKey; at: string };
}

export type IndicatorKey = 'energy' | 'connection' | 'focus' | 'communication' | 'balance';
export interface Unavailable { status: 'unavailable'; reason: string }
export interface Indicators { status: 'ok'; items: { key: IndicatorKey; level: 1 | 2 | 3 | 4 }[] }

export interface HoroscopeResponse {
  sign: SignKey;
  period: PeriodKey;
  date: string;
  timezone: string;
  method: string;
  reading: Unavailable | {
    status: 'ok';
    range: { from: string; to: string };
    parts: HoroscopePart[];
    facts?: { moonSignChanges?: { at: string; sign: SignKey; house: number }[]; mercuryRetrograde?: boolean };
  };
  indicators: Indicators | Unavailable;
  sky: { moon: MoonState };
}

export type MoonEvent = { type: 'sign'; sign: SignKey; at: string } | { type: 'phase'; phase: PhaseKey; at: string };
export interface MoonCalendarResponse { timezone: string; from: string; days: number; moon: MoonState; events: MoonEvent[] }

export interface NumbersResponse {
  date: string;
  timezone: string;
  rules: string;
  reading: { lifePath: { number: number; parts: number[]; total: number }; personalYear: number; personalMonth: number; personalDay: number };
}

export interface TarotCardPick { index: number; key: string; orientation: TarotOrientation }
export interface TarotDailyResponse { date: string; timezone: string; card: TarotCardPick & { deck: string; version: number } }
export type DrawPosition = 'card' | 'situation' | 'challenge' | 'guidance';
export interface TarotDrawResponse {
  drawnAt: string;
  reading: { deck: string; rule: string; count: 1 | 3; cards: (TarotCardPick & { position: DrawPosition })[] };
}

export type ApiError = { kind: 'rate_limited' } | { kind: 'invalid'; fields: Record<string, string> } | { kind: 'error' } | { kind: 'network' };
export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError };

const TIMEOUT_MS = 15_000;

async function call<T>(path: string, init?: { method: 'POST'; body: unknown }): Promise<ApiResult<T>> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/public/readings${path}`, {
      method: init?.method ?? 'GET',
      headers: init ? { 'content-type': 'application/json', accept: 'application/json' } : { accept: 'application/json' },
      body: init ? JSON.stringify(init.body) : undefined,
      cache: 'no-store',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    return { ok: false, error: { kind: 'network' } };
  }
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  if (res.ok && body && typeof body === 'object') return { ok: true, data: body as T };
  if (res.status === 429) return { ok: false, error: { kind: 'rate_limited' } };
  if (res.status === 400) {
    const fields = (body as { fields?: Record<string, string> } | null)?.fields ?? {};
    return { ok: false, error: { kind: 'invalid', fields } };
  }
  return { ok: false, error: { kind: 'error' } };
}

/** The visitor's IANA time zone, or UTC when the browser doesn't say. */
export function visitorZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export const fetchHoroscope = (sign: SignKey, period: PeriodKey, tz: string) =>
  call<HoroscopeResponse>(`/horoscope?${new URLSearchParams({ sign, period, tz })}`);

export const fetchMoonCalendar = (tz: string, days = 30) =>
  call<MoonCalendarResponse>(`/moon-calendar?${new URLSearchParams({ days: String(days), tz })}`);

/** Birth date travels in the body, never in the URL. */
export const fetchNumbers = (birthDate: string, tz: string) =>
  call<NumbersResponse>('/numbers', { method: 'POST', body: { birthDate, tz } });

export const fetchDailyCard = (visitorId: string, tz: string) =>
  call<TarotDailyResponse>('/tarot/daily', { method: 'POST', body: { visitorId, tz } });

export const drawCards = (count: 1 | 3) => call<TarotDrawResponse>('/tarot/draw', { method: 'POST', body: { count } });
