import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getLearner, createEnrolment } from '../services/api';
import { useAsync } from '../hooks/useAsync';
import { useLocalStorage } from '../hooks/useLocalStorage';

/**
 * The signed-in learner: their profile and their enrolments.
 *
 * The seed record is fetched from the API layer, then any changes the
 * learner makes in this browser are layered on top and persisted to
 * localStorage. Splitting the two means the mock "server" record stays
 * pristine while the session still behaves like a real portal across
 * refreshes.
 */
const LearnerContext = createContext(null);

const STORAGE_KEY = 'brindabella.learner.v1';

export function LearnerProvider({ children }) {
  const fetcher = useCallback((options) => getLearner(options), []);
  const { data, isLoading, isError, error, retry } = useAsync(fetcher);

  const [overrides, setOverrides, clearOverrides] = useLocalStorage(STORAGE_KEY, null);
  const [learner, setLearner] = useState(null);

  useEffect(() => {
    if (!data) return;
    setLearner(overrides ? { ...data, ...overrides } : data);
    // Overrides are applied once when the seed record arrives; later edits
    // update both pieces of state together through the actions below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const persist = useCallback(
    (updater) => {
      setLearner((current) => {
        if (!current) return current;
        const next = updater(current);
        setOverrides({ enrolments: next.enrolments, ...stripProfile(next) });
        return next;
      });
    },
    [setOverrides]
  );

  const isEnrolled = useCallback(
    (courseId) => Boolean(learner?.enrolments.some((e) => e.courseId === courseId)),
    [learner]
  );

  const enrol = useCallback(
    async (courseId) => {
      const record = await createEnrolment(courseId);
      persist((current) => ({ ...current, enrolments: [...current.enrolments, record] }));
      return record;
    },
    [persist]
  );

  const withdraw = useCallback(
    (courseId) => {
      persist((current) => ({
        ...current,
        enrolments: current.enrolments.filter((e) => e.courseId !== courseId),
      }));
    },
    [persist]
  );

  /** Marks the next module complete and advances the enrolment. */
  const completeModule = useCallback(
    (courseId, moduleId, allModuleIds) => {
      persist((current) => ({
        ...current,
        enrolments: current.enrolments.map((enrolment) => {
          if (enrolment.courseId !== courseId) return enrolment;
          if (enrolment.completedModuleIds.includes(moduleId)) return enrolment;

          const completed = [...enrolment.completedModuleIds, moduleId];
          const remaining = allModuleIds.filter((id) => !completed.includes(id));

          return {
            ...enrolment,
            completedModuleIds: completed,
            status: remaining.length === 0 ? 'Completed' : 'In progress',
            nextModuleId: remaining[0] ?? null,
            lastActivity: new Date().toISOString().slice(0, 10),
          };
        }),
      }));
    },
    [persist]
  );

  const updateProfile = useCallback(
    (fields) => {
      persist((current) => ({ ...current, ...fields }));
    },
    [persist]
  );

  const resetProgress = useCallback(() => {
    clearOverrides();
    if (data) setLearner(data);
  }, [clearOverrides, data]);

  const value = useMemo(
    () => ({
      learner,
      isLoading,
      isError,
      error,
      retry,
      isEnrolled,
      enrol,
      withdraw,
      completeModule,
      updateProfile,
      resetProgress,
    }),
    [
      learner,
      isLoading,
      isError,
      error,
      retry,
      isEnrolled,
      enrol,
      withdraw,
      completeModule,
      updateProfile,
      resetProgress,
    ]
  );

  return <LearnerContext.Provider value={value}>{children}</LearnerContext.Provider>;
}

/** Only the editable profile fields are persisted, not the whole record. */
function stripProfile({ firstName, lastName, email, phone, suburb, state, goal, weeklyStudyTarget }) {
  return { firstName, lastName, email, phone, suburb, state, goal, weeklyStudyTarget };
}

export function useLearner() {
  const context = useContext(LearnerContext);
  if (!context) {
    throw new Error('useLearner must be used inside a LearnerProvider.');
  }
  return context;
}
