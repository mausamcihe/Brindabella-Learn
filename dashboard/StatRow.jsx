/**
 * Summary figures presented as an inline row rather than four identical
 * tiles, so they read as supporting detail under the resume panel instead
 * of competing with it for attention.
 */
export function StatRow({ items }) {
  return (
    <dl className="stats">
      {items.map((item) => (
        <div key={item.label}>
          <dd className="stat__value">{item.value}</dd>
          <dt className="stat__label">{item.label}</dt>
        </div>
      ))}
    </dl>
  );
}
