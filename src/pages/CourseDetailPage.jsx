import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useCatalogue } from '../context/CatalogueContext';
import { useLearner } from '../context/LearnerContext';
import { useToast } from '../context/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { PageHeader } from '../components/layout/PageHeader';
import { ModuleSpine } from '../components/features/learning/ModuleSpine';
import { Button } from '../components/ui/Button';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';
import { Modal } from '../components/ui/Modal';
import { ProgressBar } from '../components/ui/Progress';
import { BlockSkeleton, ErrorState, LoadingAnnouncement } from '../components/ui/States';
import { formatDate, formatDuration, formatPrice, pluralise, progressPercent } from '../utils/format';

/**
 * A single course: what it covers, who teaches it, and either an enrol
 * action or the learner's progress through it.
 */
export function CourseDetailPage() {
  const { slug } = useParams();
  const catalogue = useCatalogue();
  const { learner, isEnrolled, enrol, completeModule } = useLearner();
  const { push } = useToast();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  const course = catalogue.findBySlug(slug);
  useDocumentTitle(course?.title);

  if (catalogue.isError) {
    return <ErrorState body="This course could not be loaded." onRetry={catalogue.retry} />;
  }

  if (catalogue.isLoading) {
    return (
      <>
        <LoadingAnnouncement>Loading course</LoadingAnnouncement>
        <div className="stack">
          <BlockSkeleton height="4rem" />
          <BlockSkeleton height="20rem" />
        </div>
      </>
    );
  }

  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  const enrolment = learner?.enrolments.find((item) => item.courseId === course.id) ?? null;
  const percent = progressPercent(course, enrolment);
  const isFull = course.seatsRemaining === 0;

  async function handleEnrol() {
    setSubmitting(true);
    try {
      await enrol(course.id);
      setDialogOpen(false);
      push(`You are enrolled in ${course.title}.`);
    } catch (error) {
      push(error.message, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  function handleComplete(moduleId) {
    completeModule(
      course.id,
      moduleId,
      course.modules.map((m) => m.id)
    );
    push('Module marked complete.');
  }

  return (
    <>
      <PageHeader
        title={course.title}
        lede={course.summary}
        crumbs={[
          { label: 'Courses', to: '/courses' },
          { label: course.category, to: `/courses?stream=${encodeURIComponent(course.category)}` },
          { label: course.title },
        ]}
      />

      <div className="cluster" style={{ marginBottom: '1.5rem' }}>
        <Badge tone="brand">{course.level}</Badge>
        <Badge tone="neutral">{course.mode}</Badge>
        {course.tags.map((tag) => (
          <Badge key={tag} tone="neutral">
            {tag}
          </Badge>
        ))}
        {enrolment ? <StatusBadge status={enrolment.status} /> : null}
      </div>

      <div className="detail">
        <div className="stack">
          {enrolment ? (
            <section className="card" aria-labelledby="progress-heading">
              <h2 className="card__title" id="progress-heading">
                Your progress
              </h2>
              <ProgressBar value={percent} label={`${course.title} progress`} />
              <p className="course-card__meta" style={{ marginTop: '0.75rem' }}>
                {enrolment.completedModuleIds.length} of{' '}
                {pluralise(course.modules.length, 'module')} finished · enrolled{' '}
                {formatDate(enrolment.enrolledOn)}
              </p>
            </section>
          ) : null}

          <section className="card" aria-labelledby="outcomes-heading">
            <h2 className="card__title" id="outcomes-heading">
              What you will be able to do
            </h2>
            <ul className="outcomes">
              {course.outcomes.map((outcome) => (
                <li key={outcome}>
                  <Icon name="check" size={18} strokeWidth={2.25} />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="card" aria-labelledby="modules-heading">
            <h2 className="card__title" id="modules-heading">
              Course structure
            </h2>
            <p className="course-card__summary" style={{ marginBottom: '1.5rem' }}>
              {pluralise(course.modules.length, 'module')} ·{' '}
              {pluralise(course.totalLessons, 'lesson')} ·{' '}
              {formatDuration(course.totalMinutes)} of guided content
            </p>
            <ModuleSpine course={course} enrolment={enrolment} onComplete={handleComplete} />
          </section>
        </div>

        <aside className="detail__aside">
          <div className="card">
            <p className="course-card__price" style={{ fontSize: '1.75rem' }}>
              {formatPrice(course.price)}
            </p>
            <p className="course-card__summary" style={{ marginBottom: '1rem' }}>
              Fee includes assessment and one reattempt.
            </p>

            {enrolment ? (
              <Button variant="secondary" block to="/my-learning">
                Manage this enrolment
              </Button>
            ) : (
              <Button
                block
                onClick={() => setDialogOpen(true)}
                disabled={isFull}
                aria-disabled={isFull}
              >
                {isFull ? 'Waitlist is open' : 'Enrol in this course'}
              </Button>
            )}

            {isFull && !enrolment ? (
              <p className="field__hint" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
                This intake is full. Contact support to join the waitlist for the next one.
              </p>
            ) : null}

            <dl className="detail__facts" style={{ marginTop: '1.5rem' }}>
              <div className="detail__fact">
                <dt>Starts</dt>
                <dd>{formatDate(course.startDate)}</dd>
              </div>
              <div className="detail__fact">
                <dt>Length</dt>
                <dd>{course.durationWeeks} weeks</dd>
              </div>
              <div className="detail__fact">
                <dt>Commitment</dt>
                <dd>{course.hoursPerWeek} hrs a week</dd>
              </div>
              <div className="detail__fact">
                <dt>Delivery</dt>
                <dd>
                  {course.mode}, {course.campus}
                </dd>
              </div>
              <div className="detail__fact">
                <dt>Rating</dt>
                <dd>
                  {course.rating} from {course.reviewCount}
                </dd>
              </div>
              <div className="detail__fact">
                <dt>Places left</dt>
                <dd>{isFull ? 'None' : course.seatsRemaining}</dd>
              </div>
            </dl>
          </div>

          {course.instructor ? (
            <div className="card">
              <h2 className="card__title">Taught by</h2>
              <div className="person" style={{ marginBottom: '1rem' }}>
                <span className="avatar" aria-hidden="true">
                  {course.instructor.initials}
                </span>
                <div>
                  <p style={{ fontWeight: 600 }}>{course.instructor.name}</p>
                  <p className="stat__label">{course.instructor.role}</p>
                </div>
              </div>
              <p className="course-card__summary">{course.instructor.bio}</p>
            </div>
          ) : null}
        </aside>
      </div>

      <Modal
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        title={`Enrol in ${course.title}?`}
        description={`The intake starts ${formatDate(course.startDate)} and runs for ${course.durationWeeks} weeks at about ${course.hoursPerWeek} hours a week.`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
              Not now
            </Button>
            <Button onClick={handleEnrol} disabled={isSubmitting}>
              {isSubmitting ? 'Enrolling…' : 'Confirm enrolment'}
            </Button>
          </>
        }
      >
        <p>
          Nothing is charged in this demonstration build. Your enrolment will appear under My
          learning and you can withdraw at any time.
        </p>
      </Modal>
    </>
  );
}
