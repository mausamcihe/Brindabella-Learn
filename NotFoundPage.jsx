import { useLocation } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  useDocumentTitle('Page not found');
  const location = useLocation();

  return (
    <>
      <PageHeader title="That page is not here" />
      <div className="card">
        <p>
          Nothing matches <code>{location.pathname}</code>. The course may have been retired, or
          the link may have a typo in it.
        </p>
        <div className="cluster" style={{ marginTop: '1.5rem' }}>
          <Button to="/">Go to the dashboard</Button>
          <Button variant="secondary" to="/courses">
            Browse courses
          </Button>
        </div>
      </div>
    </>
  );
}
