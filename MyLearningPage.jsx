import { useMemo, useState } from 'react';
import { useCatalogue } from '../context/CatalogueContext';
import { useLearner } from '../context/LearnerContext';
import { useToast } from '../context/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { PageHeader } from '../components/layout/PageHeader';
import { EnrolmentRow } from '../components/features/learning/EnrolmentRow';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { BlockSkeleton, EmptyState, ErrorState, LoadingAnnouncement } from '../components/ui/States';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'In progress', label: 'In progress' },
  { id: 'Not started', label: 'Not started' },
  { id: 'Completed', label: 'Completed' },
];

/**
 * Every enrolment the learner holds, filtered by status through a tab
 * list. Withdrawing is destructive, so it goes through a confirmation
 * dialog rather than firing on the first click.
 */
export function MyLearningPage() {
  useDocumentTitle('My learning');

  const catalogue = useCatalogue();
  const { learner, isLoading, isError, retry, withdraw } = useLearner();
  const { push } = useToast();

  const [activeTab, setActiveTab] = useState('all');
  const [pendingWithdrawal, setPendingWithdrawal] = useState(null);

  const rows = useMemo(() => {
    if (!learner) return [];
    return learner.enrolments
      .map((enrolment) => ({ enrolment, course: catalogue.findById(enrolment.courseId) }))
      .filter((row) => row.course)
      .filter((row) => activeTab === 'all' || row.enrolment.status === activeTab);
  }, [learner, catalogue, activeTab]);

  if (isError || catalogue.isError) {
    return (
      <>
        <PageHeader title="My learning" />
        <ErrorState
          body="Your enrolments could not be loaded."
          onRetry={() => {
            retry();
            catalogue.retry();
          }}
        />
      </>
    );
  }

  if (isLoading || catalogue.isLoading) {
    return (
      <>
        <PageHeader title="My learning" />
        <LoadingAnnouncement>Loading your enrolments</LoadingAnnouncement>
        <BlockSkeleton height="18rem" />
      </>
    );
  }

  function confirmWithdrawal() {
    withdraw(pendingWithdrawal.id);
    push(`You have withdrawn from ${pendingWithdrawal.title}.`);
    setPendingWithdrawal(null);
  }

  return (
    <>
      <PageHeader
        title="My learning"
        lede="Everything you are enrolled in, and how far through each course you are."
        action={<Button variant="secondary" to="/courses">Find another course</Button>}
      />

      <div className="tabs" role="tablist" aria-label="Filter enrolments by status">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            className="tabs__tab"
            aria-selected={activeTab === tab.id}
            aria-controls="enrolment-panel"
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div id="enrolment-panel" role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
        {rows.length === 0 ? (
          <EmptyState
            title={activeTab === 'all' ? 'No enrolments yet' : `Nothing ${activeTab.toLowerCase()}`}
            body="Courses you enrol in appear here with your progress through each module."
            action={<Button to="/courses">Browse the catalogue</Button>}
          />
        ) : (
          <ul className="enrolment-list">
            {rows.map(({ course, enrolment }) => (
              <EnrolmentRow
                key={course.id}
                course={course}
                enrolment={enrolment}
                onWithdraw={setPendingWithdrawal}
              />
            ))}
          </ul>
        )}
      </div>

      <Modal
        isOpen={Boolean(pendingWithdrawal)}
        onClose={() => setPendingWithdrawal(null)}
        title="Withdraw from this course?"
        description={pendingWithdrawal?.title}
        footer={
          <>
            <Button variant="secondary" onClick={() => setPendingWithdrawal(null)}>
              Keep my enrolment
            </Button>
            <Button variant="danger" onClick={confirmWithdrawal}>
              Withdraw
            </Button>
          </>
        }
      >
        <p>Your progress through this course will be removed. You can enrol again later.</p>
      </Modal>
    </>
  );
}
