// DataSourceForm Component
// Create/Edit form for data sources

import { useState, useEffect } from 'react';
import './DataSourceForm.scss';

function DataSourceForm({
  dataSource = null, // null for new data source, object for edit
  onSave,
  onCancel,
  existingDataSources = [],
}) {
  const [formData, setFormData] = useState({
    name: '',
    values: '',
  });
  const [errors, setErrors] = useState({});

  const isEditMode = !!dataSource;

  // Initialize form with existing data source data
  useEffect(() => {
    if (dataSource) {
      setFormData({
        name: dataSource.name || '',
        values: (dataSource.values || []).join('; '),
      });
    } else {
      setFormData({ name: '', values: '' });
    }
  }, [dataSource]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const parseValues = (input) => {
    if (!input.trim()) return [];

    // Support both comma and semicolon separators
    // Clean up whitespace and remove empty values
    const values = input
      .split(/[,;]/)
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    return [...new Set(values)]; // Remove duplicates while preserving order
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Data source name is required';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Name must be 50 characters or less';
    } else {
      // Check for duplicate names (excluding current if editing)
      const duplicate = existingDataSources.find(
        (ds) =>
          ds.name.toLowerCase() === formData.name.trim().toLowerCase() &&
          (!isEditMode || ds.id !== dataSource?.id)
      );
      if (duplicate) {
        newErrors.name = 'A data source with this name already exists';
      }
    }

    const parsedValues = parseValues(formData.values);
    if (parsedValues.length === 0) {
      newErrors.values = 'At least one value is required';
    } else if (parsedValues.length > 100) {
      newErrors.values = 'Maximum 100 values allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSave({
      ...formData,
      id: dataSource?.id,
      values: parseValues(formData.values),
    });
  };

  return (
    <div className="datasource-form">
      <div className="datasource-form__header">
        <h2 className="datasource-form__title">
          {isEditMode ? 'Edit Data Source' : 'Create New Data Source'}
        </h2>
      </div>

      <form className="datasource-form__form" onSubmit={handleSubmit}>
        <div className="datasource-form__field">
          <label className="datasource-form__label" htmlFor="ds-name">
            Name <span className="datasource-form__required">*</span>
          </label>
          <input
            type="text"
            id="ds-name"
            className={`datasource-form__input ${errors.name ? 'datasource-form__input--error' : ''}`}
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Environment Types"
            maxLength={50}
          />
          {errors.name && <span className="datasource-form__error">{errors.name}</span>}
        </div>

        <div className="datasource-form__field">
          <label className="datasource-form__label" htmlFor="ds-values">
            Values <span className="datasource-form__required">*</span>
          </label>
          <textarea
            id="ds-values"
            className={`datasource-form__textarea ${errors.values ? 'datasource-form__input--error' : ''}`}
            value={formData.values}
            onChange={(e) => handleChange('values', e.target.value)}
            placeholder="e.g., development; staging; production"
            rows={4}
          />
          {errors.values && <span className="datasource-form__error">{errors.values}</span>}
          <span className="datasource-form__hint">
            Separate values with commas or semicolons. Duplicates will be removed.
          </span>
          {parseValues(formData.values).length > 0 && (
            <div className="datasource-form__preview">
              <span className="datasource-form__preview-label">Preview ({parseValues(formData.values).length} values):</span>
              <div className="datasource-form__preview-tags">
                {parseValues(formData.values).map((v, i) => (
                  <span key={i} className="datasource-form__preview-tag">{v}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="datasource-form__actions">
          <button type="button" className="btn btn--secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            {isEditMode ? 'Save Changes' : 'Create Data Source'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DataSourceForm;