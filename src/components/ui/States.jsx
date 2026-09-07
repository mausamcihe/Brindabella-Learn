import { Button } from './Button';
import { Icon } from './Icon';

/**
 * The three things a data-driven view can be other than "showing data".
 *
 * Skeletons mirror the shape of the content that is coming so the layout
 * does not jump when it arrives. Error and empty states both say what
 * happened and offer the next action, rather than apologising.
 */
export function CourseGridSkeleton({ count = 6 }) {
  return (
    <div className="course-grid" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="course-card">
          <div className="course-card__band skeleton" />
          <div className="course-card__body stack">
            <div className="skeleton" style={{ height: '0.75rem', width: '45%' }} />
            <div className="skeleton" style={{ height: '1.4rem', width: '85%' }} />
            <div className="skeleton" style={{ height: '3rem' }} />
            <div className="skeleton" style={{ height: '1.5rem', width: '60%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BlockSkeleton({ height = '10rem' }) {
  return <div className="skeleton" style={{ height }} aria-hidden="true" />;
}

/** Announces loading to screen readers while skeletons show visually. */
export function LoadingAnnouncement({ children = 'Loading' }) {
  return (
    <p className="sr-only" role="status">
      {children}
    </p>
  );
}

export function ErrorState({
  title = 'That did not load',
  body,
  onRetry,
  retryLabel = 'Try again',
}) {
  return (
    <div className="state state--error" role="alert">
      <Icon name="alert" size={28} className="state__icon" />
      <h2 className="state__title">{title}</h2>
      <p className="state__body">
        {body ?? 'The connection dropped before the data arrived.'}
      </p>
      {onRetry ? (
        <Button variant="danger" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}

export function EmptyState({ title, body, action }) {
  return (
    <div className="state">
      <h2 className="state__title">{title}</h2>
      {body ? <p className="state__body">{body}</p> : null}
      {action}
    </div>
  );
}
