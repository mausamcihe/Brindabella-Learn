import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { BlockSkeleton, LoadingAnnouncement } from './components/ui/States';

/**
 * Route table.
 *
 * The dashboard is the landing route and is bundled with the shell so the
 * first paint needs one request. Every other route is split out with
 * React.lazy, so a learner who only ever visits the catalogue never
 * downloads the profile form or the support page. Suspense renders the
 * same skeleton treatment used for data loading, which keeps the waiting
 * experience consistent whatever is being waited on.
 */
const CataloguePage = lazy(() =>
  import('./pages/CataloguePage').then((m) => ({ default: m.CataloguePage }))
);
const CourseDetailPage = lazy(() =>
  import('./pages/CourseDetailPage').then((m) => ({ default: m.CourseDetailPage }))
);
const MyLearningPage = lazy(() =>
  import('./pages/MyLearningPage').then((m) => ({ default: m.MyLearningPage }))
);
const ProfilePage = lazy(() =>
  import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);
const SupportPage = lazy(() =>
  import('./pages/SupportPage').then((m) => ({ default: m.SupportPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

function RouteFallback() {
  return (
    <>
      <LoadingAnnouncement>Loading page</LoadingAnnouncement>
      <div className="stack">
        <BlockSkeleton height="3rem" />
        <BlockSkeleton height="18rem" />
      </div>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route
          path="courses"
          element={
            <Suspense fallback={<RouteFallback />}>
              <CataloguePage />
            </Suspense>
          }
        />
        <Route
          path="courses/:slug"
          element={
            <Suspense fallback={<RouteFallback />}>
              <CourseDetailPage />
            </Suspense>
          }
        />
        <Route
          path="my-learning"
          element={
            <Suspense fallback={<RouteFallback />}>
              <MyLearningPage />
            </Suspense>
          }
        />
        <Route
          path="profile"
          element={
            <Suspense fallback={<RouteFallback />}>
              <ProfilePage />
            </Suspense>
          }
        />
        <Route
          path="support"
          element={
            <Suspense fallback={<RouteFallback />}>
              <SupportPage />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<RouteFallback />}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
