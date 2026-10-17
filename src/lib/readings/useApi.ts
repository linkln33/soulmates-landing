'use client';

/** Load an API result in the browser with loading, error and retry states. */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ApiError, ApiResult } from './api';

export type LoadState<T> =
  | { status: 'loading' }
  | { status: 'ok'; data: T }
  | { status: 'error'; error: ApiError };

export function useApi<T>(load: (() => Promise<ApiResult<T>>) | null, deps: unknown[]) {
  const [state, setState] = useState<LoadState<T>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const loadRef = useRef(load);
  loadRef.current = load;

  useEffect(() => {
    const run = loadRef.current;
    if (!run) return;
    let live = true;
    setState({ status: 'loading' });
    run().then((result) => {
      if (!live) return;
      setState(result.ok ? { status: 'ok', data: result.data } : { status: 'error', error: result.error });
    });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { state, retry };
}
