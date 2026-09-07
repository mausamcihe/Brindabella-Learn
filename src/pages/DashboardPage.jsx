import { useMemo } from 'react';
import { useCatalogue } from '../context/CatalogueContext';
import { useLearner } from '../context/LearnerContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { PageHeader } from '../components/layout/PageHeader';
import { ResumePanel } from '../components/features/dashboard/ResumePanel';
import { StatRow } from '../components/features/dashboard/StatRow';
import { ActivityChart } from '../components/features/dashboard/ActivityChart';
import { CourseGrid } from '../components/features/catalog/CourseGrid';
import { Button } from '../components/ui/Button';
import { BlockSkeleton, EmptyState, ErrorState, LoadingAnnouncement } from '../components/ui/States';
import { progressPercent } from '../utils/format';

/**
 * The landing route. Answers, in order: where was I, how am I tracking,
 * and what should I look at next.
 */
export function DashboardPage() {
  useDocumentTitle('Dashboard');

  const catalogue = useCatalogue();
  const { learner, isLoading: learnerLoading, isError: learnerError, retry } = useLearner();

  const isLoading = catalogue.isLoading || learnerLoading;
  const isError = catalogue.isError || learnerError;

  const view = useMemo(() => {
    if (!learner || catalogue.courses.length === 0) return null;

    const enrolled = learner.enrolments
      .map((enrolment) => ({ enrolment, course: catalogue.findById(enrolment.courseId) }))
      .filter((item) => item.course);

    const inProgress = enrolled
      .filter((item) => item.enrolment.status === 'In progress')
      .sort((a, b) => (b.enrolment.lastActivity ?? '').localeCompare(a.enrolment.lastActivity ?? ''));

    const completed = enrolled.filter((item) => item.enrolment.status === 'Completed');

    const totalPercent = enrolled.length
      ? Math.round(
          enrolled.reduce((sum, item) => sum + progressPercent(item.course, item.enrolment), 0) /
            enrolled.length
        )
      : 0;

    const enrolledIds = new Set(enrolled.map((item) => item.course.id));
    const suggested = catalogue.courses
      .filter((course) => !enrolledIds.has(course.id) && course.seatsRemaining > 0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);

    const hoursThisWeek = learner.weeklyHours.at(-1)?.hours ?? 0;

    return { enrolled, inProgress, completed, totalPercent, suggested, hoursThisWeek };
  }, [learner, catalogue]);

  if (isError) {
    return (
      <>
        <PageHeader title="Dashboard" />
        <ErrorState
          body="Your enrolments and the course list could not be loaded."
          onRetry={() => {
            catalogue.retry();
            retry();
          }}
        />
      </>
    );
  }

  if (isLoading || !view) {
    return (
      <>
        <PageHeader title="Dashboard" />
        <LoadingAnnouncement>Loading your dashboard</LoadingAnnouncement>
        <div className="stack">
          <BlockSkeleton height="11rem" />
          <BlockSkeleton height="6rem" />
          <BlockSkeleton height="14rem" />
        </div>
      </>
    );
  }

  const current = view.inProgress[0];

  return (
    <>
      <PageHeader
        title={`Good to see you, ${learner.firstName}`}
        lede={learner.goal}
        action={<Button to="/courses">Browse courses</Button>}
      />

      <div className="stack">
        {current ? (
          <ResumePanel course={current.course} enrolment={current.enrolment} />
        ) : (
          <EmptyState
            title="Nothing on the go right now"
            body="Pick a course and it will show up here with everything you have finished so far."
            action={<Button to="/courses">Browse the catalogue</Button>}
          />
        )}

        <StatRow
          items={[
            { label: 'Active enrolments', value: view.inProgress.length },
            { label: 'Courses completed', value: view.completed.length },
            { label: 'Average progress', value: `${view.totalPercent}%` },
            { label: 'Hours last week', value: view.hoursThisWeek },
          ]}
        />

        <section className="card" aria-labelledby="activity-heading">
          <h2 className="card__title" id="activity-heading">
            Study hours over the last seven weeks
          </h2>
          <p className="course-card__summary">
            Your target is {learner.weeklyStudyTarget} hours a week. You can change it on your
            profile.
          </p>
          <ActivityChart weeks={learner.weeklyHours} target={learner.weeklyStudyTarget} />
        </section>

        {view.suggested.length > 0 ? (
          <section aria-labelledby="suggested-heading">
            <h2 id="suggested-heading" style={{ marginBottom: '1rem' }}>
              Rated highly by learners on your streams
            </h2>
            <CourseGrid courses={view.suggested} label="Suggested courses" />
          </section>
        ) : null}
      </div>
    </>
  );
}
