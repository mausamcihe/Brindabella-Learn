import { useState } from 'react';
import { useCatalogue } from '../context/CatalogueContext';
import { useToast } from '../context/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { PageHeader } from '../components/layout/PageHeader';
import { SelectField, TextArea, TextField } from '../components/ui/Field';
import { Button } from '../components/ui/Button';
import { submitSupportRequest } from '../services/api';
import { email, maxLength, minLength, required, validate } from '../utils/validation';

const SCHEMA = {
  name: [required('your name')],
  email: [required('your email address'), email()],
  topic: [required('a topic')],
  message: [
    required('a message'),
    minLength(20, 'Message'),
    maxLength(1000, 'Message'),
  ],
};

const TOPICS = [
  { value: '', label: 'Choose a topic' },
  { value: 'enrolment', label: 'Enrolment or withdrawal' },
  { value: 'waitlist', label: 'Joining a waitlist' },
  { value: 'access', label: 'Accessibility adjustment' },
  { value: 'fees', label: 'Fees and invoices' },
  { value: 'technical', label: 'Something is not working' },
];

/**
 * Support request form.
 *
 * This is the one form that posts to the API layer, so it carries the
 * full asynchronous lifecycle: a disabled submitting state, a server
 * error surfaced in the form rather than only as a toast, and a success
 * view with a reference number the learner can quote.
 */
export function SupportPage() {
  useDocumentTitle('Support');

  const catalogue = useCatalogue();
  const { push } = useToast();

  const [values, setValues] = useState({
    name: '',
    email: '',
    topic: '',
    courseId: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSending, setSending] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [receipt, setReceipt] = useState(null);

  const setField = (key) => (event) => {
    const { value } = event.target;
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

  async function handleSubmit(event) {
    event.preventDefault();
    setHasSubmitted(true);
    setServerError(null);

    const found = validate(values, SCHEMA);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      document.getElementById('support-errors')?.focus();
      return;
    }

    setSending(true);
    try {
      const result = await submitSupportRequest(values);
      setReceipt(result);
      push('Your message has been sent.');
    } catch (error) {
      setServerError(error.message);
      push(error.message, 'error');
    } finally {
      setSending(false);
    }
  }

  if (receipt) {
    return (
      <>
        <PageHeader title="Support" />
        <div className="card">
          <h2 className="card__title">Message sent</h2>
          <p>
            Your reference is <strong>{receipt.reference}</strong>. Support replies within two
            business days, to {receipt.email}.
          </p>
          <p style={{ marginTop: '1.5rem' }}>
            <Button
              variant="secondary"
              onClick={() => {
                setReceipt(null);
                setValues({ name: '', email: '', topic: '', courseId: '', message: '' });
                setHasSubmitted(false);
                setTouched({});
              }}
            >
              Send another message
            </Button>
          </p>
        </div>
      </>
    );
  }

  const errorList = Object.entries(errors);

  return (
    <>
      <PageHeader
        title="Support"
        lede="Questions about enrolments, fees, access adjustments or anything that is not working."
      />

      <div className="detail">
        <form className="card" onSubmit={handleSubmit} noValidate>
          <div className="form-note">
            <p>
              Need an adjustment to study — captions, extra time, a printed workbook? Tell us in
              the message and the course coordinator will arrange it before your first week.
            </p>
          </div>

          {hasSubmitted && errorList.length > 0 ? (
            <div className="error-summary" id="support-errors" tabIndex={-1} role="alert">
              <h2>
                There {errorList.length === 1 ? 'is 1 problem' : `are ${errorList.length} problems`}{' '}
                with this form
              </h2>
              <ul>
                {errorList.map(([field, message]) => (
                  <li key={field}>{message}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {serverError ? (
            <div className="error-summary" role="alert">
              <h2>Your message was not sent</h2>
              <p style={{ color: 'var(--clay-700)' }}>{serverError}</p>
            </div>
          ) : null}

          <TextField
            label="Your name"
            value={values.name}
            onChange={setField('name')}
            onBlur={handleBlur('name')}
            error={errorFor('name')}
            autoComplete="name"
          />

          <TextField
            label="Email address"
            type="email"
            value={values.email}
            onChange={setField('email')}
            onBlur={handleBlur('email')}
            error={errorFor('email')}
            autoComplete="email"
          />

          <SelectField
            label="Topic"
            value={values.topic}
            onChange={setField('topic')}
            onBlur={handleBlur('topic')}
            error={errorFor('topic')}
            options={TOPICS}
          />

          <SelectField
            label="Related course"
            optional
            value={values.courseId}
            onChange={setField('courseId')}
            options={[
              { value: '', label: 'Not about a specific course' },
              ...catalogue.courses.map((course) => ({ value: course.id, label: course.title })),
            ]}
          />

          <TextArea
            label="Message"
            hint="At least 20 characters. Include dates or a course code if they help."
            value={values.message}
            onChange={setField('message')}
            onBlur={handleBlur('message')}
            error={errorFor('message')}
          />

          <Button type="submit" disabled={isSending}>
            {isSending ? 'Sending…' : 'Send message'}
          </Button>
        </form>

        <aside className="detail__aside">
          <div className="card">
            <h2 className="card__title">Other ways to reach us</h2>
            <dl className="detail__facts">
              <div className="detail__fact">
                <dt>Phone</dt>
                <dd>(02) 6100 4400</dd>
            </div>
              <div className="detail__fact">
                <dt>Hours</dt>
                <dd>Mon–Fri, 9am–5pm</dd>
              </div>
              <div className="detail__fact">
                <dt>Campus</dt>
                <dd>Lonsdale St, Braddon</dd>
              </div>
            </dl>
          </div>

          <div className="card">
            <h2 className="card__title">Before you write</h2>
            <p className="course-card__summary">
              Withdrawals and enrolment changes can be made yourself from My learning, and take
              effect immediately.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
