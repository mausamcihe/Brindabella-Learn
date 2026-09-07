import { useId } from 'react';
import { Icon } from './Icon';

/**
 * Form field wrappers.
 *
 * Each control gets a real <label for>, hint and error text wired through
 * aria-describedby, and aria-invalid when it fails validation. Errors are
 * announced politely rather than assertively so a screen reader finishes
 * reading the field before the message interrupts.
 */
function FieldShell({ label, hint, error, optional, id, children }) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
        {optional ? <span className="field__optional"> (optional)</span> : null}
      </label>
      {hint ? (
        <p className="field__hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      {children({ hintId, errorId })}
      {error ? (
        <p className="field__error" id={errorId} role="alert">
          <Icon name="alert" size={16} />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

function describedBy(hint, error, hintId, errorId) {
  return [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;
}

export function TextField({ label, hint, error, optional, type = 'text', ...rest }) {
  const id = useId();
  return (
    <FieldShell label={label} hint={hint} error={error} optional={optional} id={id}>
      {({ hintId, errorId }) => (
        <input
          id={id}
          type={type}
          className="field__control"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy(hint, error, hintId, errorId)}
          {...rest}
        />
      )}
    </FieldShell>
  );
}

export function TextArea({ label, hint, error, optional, ...rest }) {
  const id = useId();
  return (
    <FieldShell label={label} hint={hint} error={error} optional={optional} id={id}>
      {({ hintId, errorId }) => (
        <textarea
          id={id}
          className="field__control"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy(hint, error, hintId, errorId)}
          {...rest}
        />
      )}
    </FieldShell>
  );
}

export function SelectField({ label, hint, error, options, optional, ...rest }) {
  const id = useId();
  return (
    <FieldShell label={label} hint={hint} error={error} optional={optional} id={id}>
      {({ hintId, errorId }) => (
        <select
          id={id}
          className="field__control"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy(hint, error, hintId, errorId)}
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  );
}

export function CheckboxField({ label, error, ...rest }) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="field">
      <div className="checkbox">
        <input
          id={id}
          type="checkbox"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        />
        <label htmlFor={id}>{label}</label>
      </div>
      {error ? (
        <p className="field__error" id={errorId} role="alert">
          <Icon name="alert" size={16} />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}
