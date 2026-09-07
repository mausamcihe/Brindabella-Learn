import { Link } from 'react-router-dom';
import { Button } from '../../ui/Button';
import { StatusBadge } from '../../ui/Badge';
import { ProgressRing } from '../../ui/Progress';
import { formatDate, progressPercent, pluralise } from '../../../utils/format';

export function EnrolmentRow({ course, enrolment, onWithdraw }) {
  const percent = progressPercent(course, enrolment);
  const done = enrolment.completedModuleIds.length;

  return (
    <li className="enrolment">
      <ProgressRing value={percent} size={68} stroke={7} label={`${course.title} progress`} />

      <div className="enrolment__body">
        <h3 className="enrolment__title">
          <Link to={`/courses/${course.slug}`}>{course.title}</Link>
        </h3>
        <p className="course-card__meta">
          <StatusBadge status={enrolment.status} />
          <span>
            {done} of {pluralise(course.modules.length, 'module')} finished
          </span>
          <span aria-hidden="true">·</span>
          <span>Last opened {formatDate(enrolment.lastActivity)}</span>
        </p>
      </div>

      <div className="enrolment__actions">
        <Button size="sm" variant="secondary" to={`/courses/${course.slug}`}>
          Open
        </Button>
        <Button size="sm" variant="danger" onClick={() => onWithdraw(course)}>
          Withdraw
        </Button>
      </div>
    </li>
  );
}
