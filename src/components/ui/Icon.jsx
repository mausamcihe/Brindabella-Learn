/**
 * A small hand-rolled icon set.
 *
 * We use eleven icons in total, so pulling in an icon library would add
 * far more to the bundle than it saves in code. Icons are decorative by
 * default (aria-hidden) because every one of them sits beside a visible
 * text label; pass a `title` only where an icon has to stand alone.
 */
const PATHS = {
  dashboard: 'M3 3h7v7H3zM14 3h7v4h-7zM14 10h7v11h-7zM3 13h7v8H3z',
  catalogue: 'M4 4h7v16H4zM13 4h7v16h-7M13 9h7',
  learning: 'M12 3 2 8l10 5 10-5zM6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5',
  profile: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 3.6-6 8-6s8 2 8 6',
  support: 'M12 2a9 9 0 0 0-9 9v5a3 3 0 0 0 3 3h1v-8H5v0M21 19v-8a9 9 0 0 0-9-9M21 16v3a3 3 0 0 1-3 3h-4',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  check: 'M4 12.5 9 17.5 20 6.5',
  close: 'M5 5l14 14M19 5 5 19',
  alert: 'M12 3 1.5 21h21zM12 9v5M12 17.5v.5',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5.2l3.4 2',
  arrow: 'M4 12h15M13 6l6 6-6 6',
  star: 'M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9-5.3-2.9-5.3 2.9 1.1-5.9L3.5 9.7l5.9-.8z',
  pin: 'M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
};

export function Icon({ name, size = 20, title, className, strokeWidth = 1.75 }) {
  const path = PATHS[name];
  if (!path) return null;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <path d={path} />
    </svg>
  );
}
