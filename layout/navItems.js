/**
 * Single source of truth for the primary destinations. The desktop rail
 * and the mobile tab bar both read from this list, so a route can never
 * appear in one navigation and be missing from the other.
 */
export const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/courses', label: 'Courses', icon: 'catalogue' },
  { to: '/my-learning', label: 'My learning', icon: 'learning', showsEnrolmentCount: true },
  { to: '/profile', label: 'Profile', icon: 'profile' },
  { to: '/support', label: 'Support', icon: 'support' },
];
