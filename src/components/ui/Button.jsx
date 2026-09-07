import { Link } from 'react-router-dom';

/**
 * One button component covering the three things a button can be in this
 * app: a real button, an internal route link, or an external anchor. All
 * three share the same visual variants so a "Browse courses" link and a
 * "Save changes" button never drift apart.
 */
export function Button({
  variant = 'primary',
  size,
  block = false,
  to,
  href,
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size === 'sm' ? 'btn--sm' : '',
    block ? 'btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} rel="noreferrer" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
