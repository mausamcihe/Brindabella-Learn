import { SelectField, TextField } from '../../ui/Field';
import { Button } from '../../ui/Button';
import { Icon } from '../../ui/Icon';

/**
 * Search, filter and sort controls for the catalogue.
 *
 * The component is fully controlled by the page above it. The page owns
 * the filter state because it also owns the URL query string, and keeping
 * one source of truth is what makes a filtered catalogue shareable as a
 * link and survivable across a browser refresh.
 */
export function CatalogueToolbar({
  filters,
  onChange,
  onReset,
  categories,
  levels,
  modes,
  resultCount,
  totalCount,
}) {
  const set = (key) => (event) => onChange(key, event.target.value);

  const toggleLevel = (level) => {
    const next = filters.levels.includes(level)
      ? filters.levels.filter((item) => item !== level)
      : [...filters.levels, level];
    onChange('levels', next);
  };

  const hasFilters =
    filters.query || filters.category !== 'all' || filters.mode !== 'all' || filters.levels.length;

  return (
    <section className="toolbar" aria-labelledby="filter-heading">
      <h2 id="filter-heading" className="sr-only">
        Filter courses
      </h2>

      <div className="toolbar__row toolbar__row--split">
        <div className="search-field">
          <Icon name="search" size={18} className="search-field__icon" />
          <TextField
            label="Search courses"
            type="search"
            placeholder="Try 'accessibility' or 'SQL'"
            value={filters.query}
            onChange={set('query')}
          />
        </div>

        <SelectField
          label="Stream"
          value={filters.category}
          onChange={set('category')}
          options={[
            { value: 'all', label: 'All streams' },
            ...categories.map((c) => ({ value: c, label: c })),
          ]}
        />

        <SelectField
          label="Study mode"
          value={filters.mode}
          onChange={set('mode')}
          options={[
            { value: 'all', label: 'Any mode' },
            ...modes.map((m) => ({ value: m, label: m })),
          ]}
        />
      </div>

      <div>
        <p className="field__label" id="level-label">
          Level
        </p>
        <div className="toolbar__chips" role="group" aria-labelledby="level-label">
          {levels.map((level) => (
            <button
              key={level}
              type="button"
              className="chip"
              aria-pressed={filters.levels.includes(level)}
              onClick={() => toggleLevel(level)}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar__summary">
        <p aria-live="polite">
          Showing {resultCount} of {totalCount} courses
        </p>
        <div className="cluster">
          <label className="field__label" htmlFor="sort-select" style={{ marginBottom: 0 }}>
            Sort by
          </label>
          <select
            id="sort-select"
            className="field__control"
            style={{ width: 'auto' }}
            value={filters.sort}
            onChange={set('sort')}
          >
            <option value="relevance">Course title</option>
            <option value="rating">Highest rated</option>
            <option value="soonest">Starting soonest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
          {hasFilters ? (
            <Button variant="ghost" size="sm" onClick={onReset}>
              Clear filters
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
