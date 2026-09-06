import { useCallback, useState } from 'react';

/**
 * Reads and writes a JSON value in localStorage with the same API as
 * useState. Enrolment changes and profile edits survive a page refresh,
 * which is what a learner expects from a portal even though there is no
 * backend behind this build.
 *
 * Storage access is wrapped because it throws in private browsing modes
 * on some browsers; failing to persist should never break the interface.
 */
export function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      setStored((prev) => {
        const next = typeof value === 'function' ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          /* Storage unavailable: keep the value in memory for this session. */
        }
        return next;
      });
    },
    [key]
  );

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* no-op */
    }
    setStored(initialValue);
  }, [key, initialValue]);

  return [stored, setValue, clear];
}
