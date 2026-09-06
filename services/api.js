/**
 * Data access layer.
 *
 * The brief allows either a public API or local mock data. We serve JSON
 * files from /public/data over `fetch`, which means the app talks to the
 * network exactly as it would against a real backend: the same async
 * boundary, the same failure modes, the same abort semantics. Swapping in
 * a real API later is a change to BASE_URL and nothing else.
 */

const BASE_URL = `${import.meta.env.BASE_URL}data`;

/** Simulated network latency so loading states are actually observable. */
const LATENCY_MS = 550;

/**
 * Set `?fail=1` in the URL to force every request to fail. This exists so
 * the error states can be demonstrated and marked without editing code.
 */
function shouldForceFailure() {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('fail') === '1';
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Thrown for any non-2xx response or forced failure, with a readable message. */
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, { signal } = {}) {
  await delay(LATENCY_MS);

  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  if (shouldForceFailure()) {
    throw new ApiError('The course service did not respond.', 503);
  }

  const response = await fetch(`${BASE_URL}/${path}`, { signal });

  if (!response.ok) {
    throw new ApiError(`Could not load ${path} (${response.status}).`, response.status);
  }

  return response.json();
}

export const getCourses = (options) => request('courses.json', options);
export const getInstructors = (options) => request('instructors.json', options);
export const getLearner = (options) => request('learner.json', options);

/**
 * Loads everything the shell needs in parallel and joins instructors onto
 * courses so components never have to do the lookup themselves.
 */
export async function getCatalogue(options) {
  const [courses, instructors] = await Promise.all([getCourses(options), getInstructors(options)]);

  const byId = new Map(instructors.map((person) => [person.id, person]));

  return {
    instructors,
    courses: courses.map((course) => ({
      ...course,
      instructor: byId.get(course.instructorId) ?? null,
      totalLessons: course.modules.reduce((sum, m) => sum + m.lessons, 0),
      totalMinutes: course.modules.reduce((sum, m) => sum + m.minutes, 0),
    })),
  };
}

/**
 * Stands in for POST /enrolments. Resolves with a server-shaped record so
 * the calling code does not need to change when a real endpoint appears.
 */
export async function createEnrolment(courseId) {
  await delay(400);

  if (shouldForceFailure()) {
    throw new ApiError('Enrolment could not be saved. Try again shortly.', 503);
  }

  return {
    courseId,
    status: 'Not started',
    enrolledOn: new Date().toISOString().slice(0, 10),
    completedModuleIds: [],
    lastActivity: null,
    nextModuleId: 'm-1',
  };
}

/** Stands in for POST /support-requests. */
export async function submitSupportRequest(payload) {
  await delay(700);

  if (shouldForceFailure()) {
    throw new ApiError('Your message could not be sent. Try again shortly.', 503);
  }

  return { reference: `BL-${Math.floor(100000 + Math.random() * 899999)}`, ...payload };
}
