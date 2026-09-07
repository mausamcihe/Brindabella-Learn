export function Badge({ tone = 'neutral', children }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

/** Maps an enrolment status to a consistent colour across the whole app. */
export function StatusBadge({ status }) {
  const tone =
    status === 'Completed' ? 'accent' : status === 'In progress' ? 'brand' : 'neutral';
  return <Badge tone={tone}>{status}</Badge>;
}
