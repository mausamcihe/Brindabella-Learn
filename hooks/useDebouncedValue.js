import { useEffect, useState } from 'react';

/**
 * Delays a rapidly changing value. Used by the catalogue search box so
 * filtering runs once the learner stops typing rather than on every
 * keystroke, which keeps the results list from re-rendering 30 times a
 * second on a long query.
 */
export function useDebouncedValue(value, delayMs = 250) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
