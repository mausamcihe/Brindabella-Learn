import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCatalogue } from '../context/CatalogueContext';
import { useLearner } from '../context/LearnerContext';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { PageHeader } from '../components/layout/PageHeader';
import { CatalogueToolbar } from '../components/features/catalog/CatalogueToolbar';
import { CourseGrid } from '../components/features/catalog/CourseGrid';
import { Button } from '../components/ui/Button';
import {
  CourseGridSkeleton,
  EmptyState,
  ErrorState,
  LoadingAnnouncement,
} from '../components/ui/States';

/**
 * The catalogue.
 *
 * Filter state lives in the URL query string rather than in component
 * state. That makes a filtered view shareable, survivable across a
 * refresh, and navigable with the browser's back button, which is what
 * people expect of a search results page. The search text is mirrored in
 * local state so typing stays responsive, then debounced before it
 * reaches the URL and the filtering work.
 */
const DEFAULTS = { query: '', category: 'all', mode: 'all', levels: [], sort: 'relevance' };

export function CataloguePage() {
  useDocumentTitle('Courses');

  const catalogue = useCatalogue();
  const { learner } = useLearner();
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryDraft, setQueryDraft] = useState(searchParams.get('q') ?? '');
  const debouncedQuery = useDebouncedValue(queryDraft, 250);

  const filters = useMemo(
    () => ({
      query: debouncedQuery,
      category: searchParams.get('stream') ?? DEFAULTS.category,
      mode: searchParams.get('mode') ?? DEFAULTS.mode,
      levels: searchParams.get('level')?.split(',').filter(Boolean) ?? DEFAULTS.levels,
      sort: searchParams.get('sort') ?? DEFAULTS.sort,
    }),
    [searchParams, debouncedQuery]
  );

  const handleChange = useCallback(
    (key, value) => {
      if (key === 'query') {
        setQueryDraft(value);
        return;
      }
      setSearchParams(
        (params) => {
          const next = new URLSearchParams(params);
          const paramName = { category: 'stream', mode: 'mode', levels: 'level', sort: 'sort' }[key];
          const encoded = Array.isArray(value) ? value.join(',') : value;
          if (!encoded || encoded === 'all' || encoded === DEFAULTS.sort) {
            next.delete(paramName);
          } else {
            next.set(paramName, encoded);
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const handleReset = useCallback(() => {
    setQueryDraft('');
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const enrolmentsByCourseId = useMemo(() => {
    const map = {};
    for (const enrolment of learner?.enrolments ?? []) {
      map[enrolment.courseId] = enrolment;
    }
    return map;
  }, [learner]);

  /**
   * Filtering and sorting are memoised because the catalogue re-renders on
   * every keystroke in the search box, and there is no reason to walk the
   * whole list again when only an unrelated piece of state changed.
   */
  const results = useMemo(() => {
    const needle = filters.query.trim().toLowerCase();

    const matched = catalogue.courses.filter((course) => {
      if (filters.category !== 'all' && course.category !== filters.category) return false;
      if (filters.mode !== 'all' && course.mode !== filters.mode) return false;
      if (filters.levels.length && !filters.levels.includes(course.level)) return false;
      if (!needle) return true;

      const haystack = [course.title, course.summary, course.category, ...course.tags]
        .join(' ')
        .toLowerCase();
      return haystack.includes(needle);
    });

    const comparators = {
      relevance: (a, b) => a.title.localeCompare(b.title),
      rating: (a, b) => b.rating - a.rating,
      soonest: (a, b) => a.startDate.localeCompare(b.startDate),
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
    };

    return [...matched].sort(comparators[filters.sort] ?? comparators.relevance);
  }, [catalogue.courses, filters]);

  if (catalogue.isError) {
    return (
      <>
        <PageHeader title="Courses" />
        <ErrorState body="The course list could not be loaded." onRetry={catalogue.retry} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Courses"
        lede="Short, practical courses for people working in and around the ACT public and technology sectors."
      />

      {catalogue.isLoading ? (
        <>
          <LoadingAnnouncement>Loading courses</LoadingAnnouncement>
          <CourseGridSkeleton />
        </>
      ) : (
        <>
          <CatalogueToolbar
            filters={{ ...filters, query: queryDraft }}
            onChange={handleChange}
            onReset={handleReset}
            categories={catalogue.categories}
            levels={catalogue.levels}
            modes={catalogue.modes}
            resultCount={results.length}
            totalCount={catalogue.courses.length}
          />

          {results.length === 0 ? (
            <EmptyState
              title="No courses match those filters"
              body="Widen the level or stream, or clear the search box to see everything on offer."
              action={<Button onClick={handleReset}>Clear filters</Button>}
            />
          ) : (
            <CourseGrid
              courses={results}
              enrolmentsByCourseId={enrolmentsByCourseId}
              label="Course results"
            />
          )}
        </>
      )}
    </>
  );
}
