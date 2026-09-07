import { formatDuration } from '../../../utils/format';

/**
 * Weekly study hours against the learner's own target.
 *
 * Drawn with plain elements rather than a charting library: seven bars do
 * not justify shipping a dependency, and a table fallback in the same
 * markup gives screen reader users the actual numbers instead of an
 * unreadable canvas.
 */
export function ActivityChart({ weeks, target }) {
  const ceiling = Math.max(target, ...weeks.map((w) => w.hours));

  return (
    <div>
      <div className="activity" aria-hidden="true">
        {weeks.map((week) => (
          <div className="activity__col" key={week.week}>
            <div
              className={`activity__bar${week.hours >= target ? ' activity__bar--target' : ''}`}
              style={{ height: `${Math.round((week.hours / ceiling) * 100)}%` }}
            />
            <span className="activity__label">{week.week}</span>
          </div>
        ))}
      </div>

      <div className="legend" aria-hidden="true">
        <span>
          <span
            className="legend__swatch"
            style={{ background: 'var(--eucalypt-100)', border: '1px solid var(--eucalypt-600)' }}
          />
          Below your {target} hour target
        </span>
        <span>
          <span
            className="legend__swatch"
            style={{ background: 'var(--wattle-100)', border: '1px solid var(--wattle-500)' }}
          />
          Target met
        </span>
      </div>

      <table className="sr-only">
        <caption>Study hours by week, against a target of {target} hours</caption>
        <thead>
          <tr>
            <th scope="col">Week beginning</th>
            <th scope="col">Hours studied</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week.week}>
              <th scope="row">{week.week}</th>
              <td>{formatDuration(Math.round(week.hours * 60))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
