import { createContext, useCallback, useContext, useMemo } from 'react';
import { getCatalogue } from '../services/api';
import { useAsync } from '../hooks/useAsync';

/**
 * Holds the course catalogue for the whole application.
 *
 * The catalogue is read by four different routes. Fetching it once at the
 * top and sharing it through context avoids four independent requests and
 * four independent loading spinners for data that never differs between
 * pages. Learner-specific state deliberately lives in a separate provider
 * so that updating an enrolment does not re-render every course card.
 */
const CatalogueContext = createContext(null);

export function CatalogueProvider({ children }) {
  const fetcher = useCallback((options) => getCatalogue(options), []);
  const { data, isLoading, isError, error, retry } = useAsync(fetcher);

  const value = useMemo(() => {
    const courses = data?.courses ?? [];
    return {
      courses,
      instructors: data?.instructors ?? [],
      categories: [...new Set(courses.map((c) => c.category))].sort(),
      levels: ['Beginner', 'Intermediate', 'Advanced'],
      modes: [...new Set(courses.map((c) => c.mode))].sort(),
      findBySlug: (slug) => courses.find((c) => c.slug === slug) ?? null,
      findById: (id) => courses.find((c) => c.id === id) ?? null,
      isLoading,
      isError,
      error,
      retry,
    };
  }, [data, isLoading, isError, error, retry]);

  return <CatalogueContext.Provider value={value}>{children}</CatalogueContext.Provider>;
}

export function useCatalogue() {
  const context = useContext(CatalogueContext);
  if (!context) {
    throw new Error('useCatalogue must be used inside a CatalogueProvider.');
  }
  return context;
}
