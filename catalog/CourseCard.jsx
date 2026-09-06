import { Link } from 'react-router-dom';
import { Badge } from '../../ui/Badge';
import { ProgressBar } from '../../ui/Progress';
import { Icon } from '../../ui/Icon';
import { formatPrice, pluralise, progressPercent } from '../../../utils/format';

/**
 * One course in the catalogue.
 *
 * The card is presentational: it takes a course and an optional enrolment
 * and renders them. It holds no state and issues no requests, which is
 * what lets the same component appear on the dashboard, the catalogue and
 * the search results without modification.
 */
export function CourseCard({ course, enrolment }) {
  const percent = progressPercent(course, enrolment);
  const isFull = course.seatsRemaining === 0;

  return (
    <article className="course-card">
      <div className={`course-card__band course-card__band--${course.accent}`} />

      <div className="course-card__body">
        <p className="course-card__meta">
          <span>{course.category}</span>
          <span aria-hidden="true">·</span>
          <span>{course.level}</span>
        </p>

        <h3 className="course-card__title">
          <Link to={`/courses/${course.slug}`}>{course.title}</Link>
        </h3>

        <p className="course-card__summary">{course.summary}</p>

        <p className="course-card__meta">
          <Icon name="clock" size={15} />
          <span>
            {course.durationWeeks} weeks, {course.hoursPerWeek} hrs a week
          </span>
          <span aria-hidden="true">·</span>
          <Icon name="pin" size={15} />
          <span>{course.campus}</span>
        </p>

        {enrolment ? (
          <div className="course-card__progress">
            <ProgressBar value={percent} label={`${course.title} progress`} />
            <p className="course-card__meta" style={{ marginTop: '0.5rem' }}>
              {percent}% complete · {pluralise(course.modules.length, 'module')}
            </p>
          </div>
        ) : null}

        <div className="course-card__foot">
          <span className="course-card__price">{formatPrice(course.price)}</span>
          {isFull ? (
            <Badge tone="danger">Waitlist only</Badge>
          ) : course.seatsRemaining <= 5 ? (
            <Badge tone="accent">{course.seatsRemaining} places left</Badge>
          ) : (
            <span className="course-card__meta">
              <Icon name="star" size={14} />
              {course.rating} ({course.reviewCount})
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
