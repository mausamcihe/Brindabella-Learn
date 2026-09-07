import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './navItems';
import { BrandMark } from './BrandMark';
import { Icon } from '../ui/Icon';
import { useLearner } from '../../context/LearnerContext';

/** Persistent desktop navigation. Hidden below 60rem, where the tab bar takes over. */
export function NavRail() {
  const { learner } = useLearner();
  const enrolmentCount = learner?.enrolments.length ?? 0;

  return (
    <nav className="rail" aria-label="Main">
      <BrandMark />

      <ul className="rail__nav">
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} end={item.end} className="rail__link">
              <Icon name={item.icon} className="rail__icon" />
              <span>{item.label}</span>
              {item.showsEnrolmentCount && enrolmentCount > 0 ? (
                <span className="rail__count">
                  {enrolmentCount}
                  <span className="sr-only"> enrolments</span>
                </span>
              ) : null}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="rail__footer">
        <p>Semester 2, 2026</p>
        <p>Enrolments close two weeks before each start date.</p>
      </div>
    </nav>
  );
}
