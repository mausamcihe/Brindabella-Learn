import { useEffect, useState } from 'react';
import { useLearner } from '../context/LearnerContext';
import { useToast } from '../context/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { PageHeader } from '../components/layout/PageHeader';
import { CheckboxField, SelectField, TextArea, TextField } from '../components/ui/Field';
import { Button } from '../components/ui/Button';
import { BlockSkeleton, ErrorState, LoadingAnnouncement } from '../components/ui/States';
import { formatDate } from '../utils/format';
import {
  auPhone,
  email,
  maxLength,
  mustBeChecked,
  numberInRange,
  required,
  validate,
} from '../utils/validation';

const SCHEMA = {
  firstName: [required('your first name'), maxLength(40, 'First name')],
  lastName: [required('your last name'), maxLength(40, 'Last name')],
  email: [required('your email address'), email()],
  phone: [auPhone()],
  suburb: [required('your suburb')],
  weeklyStudyTarget: [
    required('a weekly study target'),
    numberInRange(1, 40, 'Weekly study target'),
  ],
  goal: [maxLength(220, 'Study goal')],
  confirmed: [mustBeChecked('Confirm these details are correct before saving.')],
};

const STATES = ['ACT', 'NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT'];

/**
 * Profile editing.
 *
 * Fields validate on blur once touched and again on submit, so a learner
 * is not shouted at while they are still typing their email address. On
 * a failed submit, focus moves to an error summary listing every problem,
 * which is the pattern the Australian Government Design System and WCAG
 * 3.3.1 both point at.
 */
export function ProfilePage() {
  useDocumentTitle('Profile');

  const { learner, isLoading, isError, retry, updateProfile, resetProgress } = useLearner();
  const { push } = useToast();

  const [values, setValues] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (!learner || values) return;
    setValues({
      firstName: learner.firstName,
      lastName: learner.lastName,
      email: learner.email,
      phone: learner.phone,
      suburb: learner.suburb,
      state: learner.state,
      goal: learner.goal,
      weeklyStudyTarget: String(learner.weeklyStudyTarget),
      confirmed: false,
    });
  }, [learner, values]);

  if (isError) {
    return (
      <>
        <PageHeader title="Profile" />
        <ErrorState body="Your profile could not be loaded." onRetry={retry} />
      </>
    );
  }

  if (isLoading || !values) {
    return (
      <>
        <PageHeader title="Profile" />
        <LoadingAnnouncement>Loading your profile</LoadingAnnouncement>
        <BlockSkeleton height="24rem" />
      </>
    );
  }

  const setField = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setValues((current) => ({ ...current, [key]: value }));
    if (hasSubmitted || touched[key]) {
      setErrors(validate({ ...values, [key]: value }, SCHEMA));
    }
  };

  const handleBlur = (key) => () => {
    setTouched((current) => ({ ...current, [key]: true }));
    setErrors(validate(values, SCHEMA));
  };

  const errorFor = (key) => (touched[key] || hasSubmitted ? errors[key] : undefined);

  function handleSubmit(event) {
    event.preventDefault();
    setHasSubmitted(true);

    const found = validate(values, SCHEMA);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      document.getElementById('profile-errors')?.focus();
      return;
    }

    updateProfile({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      suburb: values.suburb.trim(),
      state: values.state,
      goal: values.goal.trim(),
      weeklyStudyTarget: Number(values.weeklyStudyTarget),
    });

    setValues((current) => ({ ...current, confirmed: false }));
    setHasSubmitted(false);
    setTouched({});
    push('Your profile has been saved.');
  }

  const errorList = Object.entries(errors);

  return (
    <>
      <PageHeader title="Profile" lede={`Member since ${formatDate(learner.joinedOn)}.`} />

      <div className="detail">
        <form className="card" onSubmit={handleSubmit} noValidate>
          {hasSubmitted && errorList.length > 0 ? (
            <div className="error-summary" id="profile-errors" tabIndex={-1} role="alert">
              <h2>There {errorList.length === 1 ? 'is 1 problem' : `are ${errorList.length} problems`} with this form</h2>
              <ul>
                {errorList.map(([field, message]) => (
                  <li key={field}>{message}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="form-grid form-grid--two">
            <TextField
              label="First name"
              value={values.firstName}
              onChange={setField('firstName')}
              onBlur={handleBlur('firstName')}
              error={errorFor('firstName')}
              autoComplete="given-name"
            />
            <TextField
              label="Last name"
              value={values.lastName}
              onChange={setField('lastName')}
              onBlur={handleBlur('lastName')}
              error={errorFor('lastName')}
              autoComplete="family-name"
            />
          </div>

          <TextField
            label="Email address"
            type="email"
            hint="Course reminders and results are sent here."
            value={values.email}
            onChange={setField('email')}
            onBlur={handleBlur('email')}
            error={errorFor('email')}
            autoComplete="email"
          />

          <TextField
            label="Phone"
            type="tel"
            optional
            value={values.phone}
            onChange={setField('phone')}
            onBlur={handleBlur('phone')}
            error={errorFor('phone')}
            autoComplete="tel"
          />

          <div className="form-grid form-grid--two">
            <TextField
              label="Suburb"
              value={values.suburb}
              onChange={setField('suburb')}
              onBlur={handleBlur('suburb')}
              error={errorFor('suburb')}
              autoComplete="address-level2"
            />
            <SelectField
              label="State or territory"
              value={values.state}
              onChange={setField('state')}
              options={STATES.map((code) => ({ value: code, label: code }))}
            />
          </div>

          <TextField
            label="Weekly study target (hours)"
            type="number"
            min="1"
            max="40"
            hint="Used to set the target line on your dashboard chart."
            value={values.weeklyStudyTarget}
            onChange={setField('weeklyStudyTarget')}
            onBlur={handleBlur('weeklyStudyTarget')}
            error={errorFor('weeklyStudyTarget')}
          />

          <TextArea
            label="What are you working towards?"
            optional
            hint="Shown at the top of your dashboard. 220 characters or fewer."
            value={values.goal}
            onChange={setField('goal')}
            onBlur={handleBlur('goal')}
            error={errorFor('goal')}
          />

          <CheckboxField
            label="These details are correct."
            checked={values.confirmed}
            onChange={setField('confirmed')}
            error={errorFor('confirmed')}
          />

          <div className="cluster">
            <Button type="submit">Save changes</Button>
          </div>
        </form>

        <aside className="detail__aside">
          <div className="card">
            <div className="person" style={{ marginBottom: '1rem' }}>
              <span className="avatar avatar--lg" aria-hidden="true">
                {learner.initials}
              </span>
              <div>
                <p style={{ fontWeight: 600 }}>
                  {learner.firstName} {learner.lastName}
                </p>
                <p className="stat__label">
                  {learner.suburb}, {learner.state}
                </p>
              </div>
            </div>
            <p className="course-card__summary">
              {learner.enrolments.length} enrolments · target{' '}
              {learner.weeklyStudyTarget} hours a week
            </p>
          </div>

          <div className="card">
            <h2 className="card__title">Demonstration data</h2>
            <p className="course-card__summary" style={{ marginBottom: '1rem' }}>
              Enrolments and profile edits are kept in this browser only. Resetting restores the
              original sample record.
            </p>
            <Button
              variant="danger"
              block
              onClick={() => {
                resetProgress();
                setValues(null);
                push('Sample data restored.');
              }}
            >
              Reset to sample data
            </Button>
          </div>
        </aside>
      </div>
    </>
  );
}
