import { Link } from 'react-router-dom';

/** The wordmark: a ridge line with a rising sun, for the Brindabellas. */
export function BrandMark({ withSubtitle = true }) {
  return (
    <Link to="/" className="brand">
      <svg className="brand__mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <rect width="32" height="32" rx="7" fill="#2E6650" />
        <path d="M5 22 L11 12 L15 18 L20 8 L27 22 Z" fill="#E0A521" />
        <circle cx="20" cy="8" r="2.4" fill="#F3F6F4" />
      </svg>
      <span>
        Brindabella Learn
        {withSubtitle ? <span className="brand__sub">Canberra Institute</span> : null}
      </span>
    </Link>
  );
}
