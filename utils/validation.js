/**
 * Small validation helpers used by every form in the app.
 *
 * Rules are plain functions returning either an error message or null, so a
 * field's rules read as a list and are trivial to unit test. Messages say
 * what to do rather than restating that something is wrong.
 */

export const required = (label) => (value) =>
  value == null || String(value).trim() === '' ? `Enter ${label}.` : null;

export const minLength = (n, label) => (value) =>
  value && value.trim().length < n ? `${label} needs at least ${n} characters.` : null;

export const maxLength = (n, label) => (value) =>
  value && value.trim().length > n ? `${label} must be ${n} characters or fewer.` : null;

export const email = () => (value) =>
  value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
    ? 'Enter an email address in the form name@example.com.'
    : null;

/** Accepts Australian mobile and landline formats, spaces optional. */
export const auPhone = () => (value) => {
  if (!value) return null;
  const digits = value.replace(/[\s()-]/g, '');
  return /^(\+?61|0)[2-478]\d{8}$/.test(digits)
    ? null
    : 'Enter an Australian phone number, for example 0412 345 678.';
};

export const numberInRange = (min, max, label) => (value) => {
  if (value === '' || value == null) return null;
  const n = Number(value);
  if (Number.isNaN(n)) return `${label} must be a number.`;
  if (n < min || n > max) return `${label} must be between ${min} and ${max}.`;
  return null;
};

export const mustBeChecked = (message) => (value) => (value ? null : message);

/**
 * Runs a schema of the shape { fieldName: [rule, rule] } against a values
 * object and returns { fieldName: 'first error message' } for failures only.
 */
export function validate(values, schema) {
  const errors = {};
  for (const [field, rules] of Object.entries(schema)) {
    for (const rule of rules) {
      const message = rule(values[field]);
      if (message) {
        errors[field] = message;
        break;
      }
    }
  }
  return errors;
}
