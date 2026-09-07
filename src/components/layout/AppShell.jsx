import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { NavRail } from './NavRail';
import { TabBar } from './TabBar';
import { BrandMark } from './BrandMark';
import { SiteFooter } from './SiteFooter';
import { ToastRegion } from '../ui/ToastRegion';
import { useLearner } from '../../context/LearnerContext';

/**
 * The layout every route renders inside: navigation, the main landmark,
 * the footer and the toast region.
 *
 * On a client-side route change the browser does not move focus or reset
 * scroll the way a full page load does, so we do both here. Without it a
 * keyboard user lands on a new page with focus still on the link they
 * activated in the navigation.
 */
export function AppShell() {
  const location = useLocation();
  const mainRef = useRef(null);
  const isFirstRender = useRef(true);
  const { learner } = useLearner();

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
    mainRef.current?.focus();
  }, [location.pathname]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>

      <div className="shell">
        <NavRail />

        <div className="main">
          <div className="topbar">
            <BrandMark withSubtitle={false} />
            {learner ? (
              <span className="badge badge--accent">
                {learner.firstName}
                <span className="sr-only"> is signed in</span>
              </span>
            ) : null}
          </div>

          <main className="main__inner" id="main" ref={mainRef} tabIndex={-1}>
            <Outlet />
          </main>

          <SiteFooter />
          <TabBar />
        </div>
      </div>

      <ToastRegion />
    </>
  );
}
