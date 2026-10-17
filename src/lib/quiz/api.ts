/**
 * "Are you my soulmate?" quiz (Lexicon): API base, response types and the
 * browser/server calls used by /quiz/[code] and /quiz/answer/delete.
 */

import { API_BASE } from '../site/config.ts';

/** API base, without a trailing slash (configured in src/lib/site/config.ts). */
export const API = API_BASE;

/** Quiz codes the API accepts; anything else is a 404 without a request. */
export const QUIZ_CODE_RE = /^[A-Za-z0-9_-]{4,32}$/;

export const CARD_STYLES = ['cosmic', 'mystic', 'flame', 'ocean', 'aurora'] as const;
export type CardStyle = (typeof CARD_STYLES)[number];

export function cardStyleOf(value: unknown): CardStyle {
  return CARD_STYLES.includes(value as CardStyle) ? (value as CardStyle) : 'cosmic';
}

export interface QuizOption {
  id: string;
  emoji?: string;
  text: { en: { label: string; description?: string } };
}

export interface QuizQuestion {
  id: string;
  type: 'single' | 'multiple';
  min?: number;
  emoji: string;
  text: { en: { question: string; subtitle?: string } };
  options: QuizOption[];
}

export interface CustomQuestion {
  id: string;
  question: string;
  emoji?: string;
}

export interface PublicQuiz {
  quiz: { code: string; title?: string; creatorName: string; cardStyle?: string };
  questions: { version?: string; questions: QuizQuestion[] };
  customQuestions: CustomQuestion[];
  consent: { version: string; retentionDays?: number };
  /** False while new public answers are paused (backend LEXICON_PUBLIC_SUBMISSIONS). */
  acceptingAnswers?: boolean;
}

export type QuizLoad =
  | { status: 'ok'; data: PublicQuiz }
  | { status: 'not_found' }
  | { status: 'gone' }
  | { status: 'error' };

function isPublicQuiz(body: unknown): body is PublicQuiz {
  const b = body as PublicQuiz | null;
  return Boolean(
    b &&
      b.quiz &&
      typeof b.quiz.creatorName === 'string' &&
      b.questions &&
      Array.isArray(b.questions.questions) &&
      b.consent &&
      typeof b.consent.version === 'string',
  );
}

/**
 * Browser: load a quiz. Called from the visitor's browser (never the website
 * server) so the API rate-limits each visitor by their own IP.
 */
export async function loadQuiz(code: string): Promise<QuizLoad> {
  if (!QUIZ_CODE_RE.test(code)) return { status: 'not_found' };
  try {
    const res = await fetch(`${API}/public/quiz/${encodeURIComponent(code)}`, {
      cache: 'no-store',
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(10_000),
    });
    if (res.status === 404) return { status: 'not_found' };
    if (res.status === 410) return { status: 'gone' };
    if (!res.ok) return { status: 'error' };
    const body: unknown = await res.json();
    if (!isPublicQuiz(body)) return { status: 'error' };
    return { status: 'ok', data: { ...body, customQuestions: Array.isArray(body.customQuestions) ? body.customQuestions : [] } };
  } catch {
    return { status: 'error' };
  }
}

export interface SubmitBody {
  respondentName: string;
  answers: Record<string, string | string[]>;
  customAnswers?: { questionId: string; answer: string }[];
  birthDate?: string;
  consent: { version: string };
  locale: 'en' | 'bg';
  website: string;
}

export type SubmitOutcome =
  | { kind: 'sent'; creatorName: string; deletionUrl: string | null }
  | { kind: 'invalid' }
  | { kind: 'full' }
  | { kind: 'paused' }
  | { kind: 'answers_paused' }
  | { kind: 'not_found' }
  | { kind: 'rate_limited' }
  | { kind: 'error'; correlationId: string | null; network: boolean };

async function jsonOrNull(res: Response): Promise<Record<string, unknown> | null> {
  try {
    const body: unknown = await res.json();
    return body && typeof body === 'object' ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function correlationIdOf(body: Record<string, unknown> | null): string | null {
  const id = body?.correlationId;
  return typeof id === 'string' && id ? id : null;
}

/** Browser: send the friend's answers. */
export async function submitAnswers(code: string, payload: SubmitBody): Promise<SubmitOutcome> {
  let res: Response;
  try {
    res = await fetch(`${API}/public/quiz/${encodeURIComponent(code)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    return { kind: 'error', correlationId: null, network: true };
  }
  const body = await jsonOrNull(res);
  if (res.status === 201 || res.status === 200) {
    const result = (body?.result ?? {}) as { creatorName?: unknown };
    const deletion = (body?.deletion ?? null) as { url?: unknown } | null;
    return {
      kind: 'sent',
      creatorName: typeof result.creatorName === 'string' ? result.creatorName : '',
      deletionUrl: deletion && typeof deletion.url === 'string' && deletion.url ? deletion.url : null,
    };
  }
  if (res.status === 400) return { kind: 'invalid' };
  if (res.status === 404) return { kind: 'not_found' };
  if (res.status === 410) {
    if (body?.error === 'quiz_full') return { kind: 'full' };
    if (body?.error === 'submissions_paused') return { kind: 'answers_paused' };
    return { kind: 'paused' };
  }
  if (res.status === 429) return { kind: 'rate_limited' };
  return { kind: 'error', correlationId: correlationIdOf(body), network: false };
}

export type DeleteOutcome =
  | { kind: 'deleted' }
  | { kind: 'not_found' }
  | { kind: 'rate_limited' }
  | { kind: 'error'; correlationId: string | null };

/** Browser: delete a friend's answers with the one-time token. */
export async function deleteAnswers(token: string): Promise<DeleteOutcome> {
  let res: Response;
  try {
    res = await fetch(`${API}/public/quiz-answers/delete`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ token }),
    });
  } catch {
    return { kind: 'error', correlationId: null };
  }
  if (res.ok) return { kind: 'deleted' };
  if (res.status === 404) return { kind: 'not_found' };
  if (res.status === 429) return { kind: 'rate_limited' };
  return { kind: 'error', correlationId: correlationIdOf(await jsonOrNull(res)) };
}
