import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Runs an async function and exposes the three states any real data
 * fetch has: loading, error and data. Requests are aborted when the
 * component unmounts or when the request is retried, which prevents
 * both state updates on unmounted components and race conditions
 * between a slow first request and a fast second one.
 *
 * `asyncFn` must be stable (wrap it in useCallback at the call site).
 */
export function useAsync(asyncFn, { immediate = true } = {}) {
  const [state, setState] = useState({
    data: null,
    error: null,
    status: immediate ? 'loading' : 'idle',
  });

  const controllerRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      controllerRef.current?.abort();
    };
  }, []);

  const run = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setState((prev) => ({ ...prev, status: 'loading', error: null }));

    try {
      const data = await asyncFn({ signal: controller.signal });
      if (!mountedRef.current || controller.signal.aborted) return;
      setState({ data, error: null, status: 'success' });
    } catch (error) {
      if (error.name === 'AbortError' || !mountedRef.current) return;
      setState({ data: null, error, status: 'error' });
    }
  }, [asyncFn]);

  useEffect(() => {
    if (immediate) run();
  }, [immediate, run]);

  return {
    ...state,
    isLoading: state.status === 'loading',
    isError: state.status === 'error',
    isSuccess: state.status === 'success',
    retry: run,
  };
}
