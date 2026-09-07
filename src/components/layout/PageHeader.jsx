import { Link } from 'react-router-dom';

/**
 * The h1 for a page, with optional breadcrumbs and a right-hand action.
 * Keeping this in one component means every route has exactly one h1 and
 * the heading order stays predictable for screen reader navigation.
 */
export function PageHeader({ title, lede, crumbs, action }) {
  return (
    <header className="page-head">
      <div>
        {crumbs?.length ? (
          <nav className="crumbs" aria-label="Breadcrumb">
            {crumbs.map((crumb, index) => (
              <span key={crumb.label} className="cluster" style={{ gap: '0.5rem' }}>
                {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span>{crumb.label}</span>}
                {index < crumbs.length - 1 ? <span aria-hidden="true">/</span> : null}
              </span>
            ))}
          </nav>
        ) : null}
        <h1>{title}</h1>
        {lede ? <p className="page-head__lede">{lede}</p> : null}
      </div>
      {action ? <div className="cluster">{action}</div> : null}
    </header>
  );
}
