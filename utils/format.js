const AUD = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 0,
});

const LONG_DATE = new Intl.DateTimeFormat('en-AU', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export const formatPrice = (value) => AUD.format(value);

export function formatDate(value) {
  if (!value) return 'Not yet';
  return LONG_DATE.format(new Date(value));
}

export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  if (rest === 0) return `${hours} hr`;
  return `${hours} hr ${rest} min`;
}

export const pluralise = (count, singular, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`;

/** Percentage of a course's modules that have been completed. */
export function progressPercent(course, enrolment) {
  if (!course || !enrolment) return 0;
  const total = course.modules.length;
  if (total === 0) return 0;
  return Math.round((enrolment.completedModuleIds.length / total) * 100);
}

export function initialsOf(first = '', last = '') {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}
