import { Button } from '../../ui/Button';
import { ProgressRing } from '../../ui/Progress';
import { progressPercent } from '../../../utils/format';

/**
 * The dashboard hero.
 *
 * A learner returning to a portal has one question: where was I. So the
 * page opens with the answer rather than with a row of summary tiles.
 * This is the one place in the interface that uses a saturated background
 * and the progress ring; everything below it stays deliberately quiet.
 */
export function ResumePanel({ course, enrolment }) {
  const percent = progressPercent(course, enrolment);
  const nextModule = course.modules.find((m) => m.id === enrolment.nextModuleId);
  const position = course.modules.findIndex((m) => m.id === enrolment.nextModuleId) + 1;

  return (
    <section className="resume" aria-labelledby="resume-heading">
      <ProgressRing value={percent} size={116} stroke={10} label={`${course.title} progress`} />

      <div className="resume__body">
        <p className="resume__kicker">Where you left off</p>
        <h2 className="resume__title" id="resume-heading">
          {course.title}
        </h2>
        <p className="resume__next">
          {nextModule
            ? `Next up: module ${position}, ${nextModule.title}.`
            : 'Every module is finished. Your certificate is ready to download.'}
        </p>
        <div className="resume__actions">
          <Button variant="primary" to={`/courses/${course.slug}`}>
            {nextModule ? 'Continue this course' : 'Review the course'}
          </Button>
          <Button variant="secondary" to="/my-learning">
            See all enrolments
          </Button>
        </div>
      </div>
    </section>
  );
}
