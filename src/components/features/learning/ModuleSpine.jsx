import { Button } from '../../ui/Button';
import { Icon } from '../../ui/Icon';
import { formatDuration, pluralise } from '../../../utils/format';

/**
 * The module list for a course, drawn as a vertical timeline.
 *
 * Numbered markers are used here because modules genuinely are a
 * sequence: module four assumes module three. They are not used anywhere
 * else in the interface, where numbering would only be decoration.
 */
export function ModuleSpine({ course, enrolment, onComplete }) {
  const completed = new Set(enrolment?.completedModuleIds ?? []);

  return (
    <ol className="spine">
      {course.modules.map((module, index) => {
        const isDone = completed.has(module.id);
        const isCurrent = enrolment?.nextModuleId === module.id;

        return (
          <li className="spine__item" key={module.id}>
            <span
              className={`spine__node${isDone ? ' spine__node--done' : ''}${
                isCurrent ? ' spine__node--current' : ''
              }`}
            >
              {isDone ? <Icon name="check" size={16} strokeWidth={2.5} /> : index + 1}
            </span>

            <div>
              <h3 className="spine__title">
                {module.title}
                {isDone ? <span className="sr-only"> (completed)</span> : null}
                {isCurrent ? (
                  <>
                    {' '}
                    <span className="badge badge--accent">Up next</span>
                  </>
                ) : null}
              </h3>
              <p className="spine__meta">
                {pluralise(module.lessons, 'lesson')} · {formatDuration(module.minutes)}
              </p>

              {enrolment && !isDone && isCurrent ? (
                <p style={{ marginTop: '0.75rem' }}>
                  <Button size="sm" onClick={() => onComplete(module.id)}>
                    Mark module complete
                  </Button>
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
