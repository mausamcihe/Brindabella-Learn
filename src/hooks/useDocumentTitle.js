import { useEffect } from 'react';

/**
 * Keeps the browser tab title in step with the route. Screen reader users
 * rely on the title to know a client-side navigation actually happened,
 * because unlike a full page load nothing else announces it.
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Brindabella Learn` : 'Brindabella Learn';
  }, [title]);
}
