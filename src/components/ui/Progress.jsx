/**
 * Progress indicators.
 *
 * Both report their value through the progressbar role so the number is
 * available to assistive technology, not only to people who can see the
 * fill. The ring is the one piece of visual flourish in the interface and
 * is reserved for the dashboard and course detail views.
 */
export function ProgressBar({ value, label }) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className="bar"
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className={`bar__fill${clamped === 100 ? ' bar__fill--complete' : ''}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export function ProgressRing({ value, size = 96, stroke = 9, label }) {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg
        className="ring"
        width={size}
        height={size}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <circle
          className="ring__track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
        />
        <circle
          className={`ring__value${clamped === 100 ? ' ring__value--complete' : ''}`}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="ring-wrap__label" aria-hidden="true">
        {clamped}%
      </span>
    </div>
  );
}
