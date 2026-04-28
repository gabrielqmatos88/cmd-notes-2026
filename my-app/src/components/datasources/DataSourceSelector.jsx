// DataSourceSelector Component
// Select and link a data source to a variable

import './DataSourceSelector.scss';

function DataSourceSelector({
  dataSources = [],
  selectedDataSourceId = null,
  onSelect,
  onClear,
  disabled = false,
}) {
  if (disabled) {
    return null;
  }

  return (
    <div className="datasource-selector">
      <div className="datasource-selector__header">
        <span className="datasource-selector__label">Link to Data Source</span>
        {selectedDataSourceId && (
          <button
            className="datasource-selector__clear"
            onClick={onClear}
            type="button"
          >
            Clear selection
          </button>
        )}
      </div>

      {dataSources.length === 0 ? (
        <div className="datasource-selector__empty">
          <span className="datasource-selector__empty-text">
            No data sources available. Create one first.
          </span>
        </div>
      ) : (
        <div className="datasource-selector__list">
          {dataSources.map((ds) => (
            <label
              key={ds.id}
              className={`datasource-selector__option ${selectedDataSourceId === ds.id ? 'datasource-selector__option--selected' : ''
                }`}
            >
              <input
                type="radio"
                name="datasource-selector"
                value={ds.id}
                checked={selectedDataSourceId === ds.id}
                onChange={() => onSelect(ds.id)}
              />
              <div className="datasource-selector__option-content">
                <span className="datasource-selector__option-name">{ds.name}</span>
                <span className="datasource-selector__option-count">
                  {ds.values.length} values
                </span>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default DataSourceSelector;