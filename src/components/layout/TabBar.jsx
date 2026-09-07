import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './navItems';
import { Icon } from '../ui/Icon';

/**
 * Mobile navigation. A bottom tab bar rather than a hamburger menu: the
 * destinations stay visible, they are reachable one-handed, and it needs
 * no open/close state to manage.
 */
export function TabBar() {
  return (
    <nav className="tabbar" aria-label="Main">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end} className="tabbar__link">
          <Icon name={item.icon} size={22} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
