// CommandForm Component
// Create/Edit command form with variable detection

import { useState, useEffect } from 'react';
import { parseVariables, validateTemplate } from '../../utils/variableParser';
import './CommandForm.scss';

function CommandForm({
  command = null, // null for new command, object for edit
  onSave,
  onCancel,
  onSetupVariables,
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    template: '',
  });
  const [errors, setErrors] = useState({});
  const [detectedVariables, setDetectedVariables] = useState([]);
  const [templateValidation, setTemplateValidation] = useState({ isValid: true, errors: [] });

  const isEditMode = !!command;

  // Initialize form with existing command data
  useEffect(() => {
    if (command) {
      setFormData({
        name: command.name || '',
        description: command.description || '',
        template: command.template || '',
      });
      // Parse existing variables
      if (command.template) {
        const vars = parseVariables(command.template);
        setDetectedVariables(vars);
      }
    }
  }, [command]);

  // Auto-detect variables when template changes
  useEffect(() => {
    if (formData.template) {
      const vars = parseVariables(formData.template);
      setDetectedVariables(vars);

      // Validate template
      const validation = validateTemplate(formData.template);
      setTemplateValidation(validation);
    } else {
      setDetectedVariables([]);
      setTemplateValidation({ isValid: true, errors: [] });
    }
  }, [formData.template]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Command name is required';
    }

    if (!formData.template.trim()) {
      newErrors.template = 'Command template is required';
    }

    if (!templateValidation.isValid) {
      newErrors.template = templateValidation.errors[0];
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
      id: command?.id,
      createdAt: command?.createdAt,
    });
  };

  const handleSetupVariables = () => {
    if (detectedVariables.length === 0) {
      setErrors((prev) => ({
        ...prev,
        template: 'No variables detected. Add #variable# syntax to your template.'
      }));
      return;
    }

    onSetupVariables({
      ...formData,
      id: command?.id,
      createdAt: command?.createdAt,
      detectedVariables,
    });
  };

  return (
    <div className="command-form">
      <div className="command-form__header">
        <h2 className="command-form__title">
          {isEditMode ? 'Edit Command' : 'Create New Command'}
        </h2>
      </div>

      <form className="command-form__form" onSubmit={handleSubmit}>
        <div className="command-form__field">
          <label className="command-form__label" htmlFor="name">
            Command Name <span className="command-form__required">*</span>
          </label>
          <input
            type="text"
            id="name"
            className={`command-form__input ${errors.name ? 'command-form__input--error' : ''}`}
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Git Commit"
          />
          {errors.name && <span className="command-form__error">{errors.name}</span>}
        </div>

        <div className="command-form__field">
          <label className="command-form__label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className="command-form__textarea"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Brief description of what this command does..."
            rows={3}
          />
        </div>

        <div className="command-form__field">
          <label className="command-form__label" htmlFor="template">
            Command Template <span className="command-form__required">*</span>
          </label>
          <textarea
            id="template"
            className={`command-form__textarea ${errors.template ? 'command-form__input--error' : ''}`}
            value={formData.template}
            onChange={(e) => handleChange('template', e.target.value)}
            placeholder="e.g., git commit -m '#message#'"
            rows={5}
          />
          {errors.template && (
            <span className="command-form__error">{errors.template}</span>
          )}
          {templateValidation.errors.length > 0 && !errors.template && (
            <div className="command-form__validation">
              {templateValidation.errors.map((err, i) => (
                <span key={i} className="command-form__validation-error">
                  {err}
                </span>
              ))}
            </div>
          )}
          {detectedVariables.length > 0 && (
            <div className="command-form__variables">
              <span className="command-form__variables-label">Detected variables:</span>
              {detectedVariables.map((v) => (
                <span key={v} className="command-form__variable-tag">
                  {v}
                </span>
              ))}
            </div>
          )}
          <span className="command-form__hint">
            Use #variable# syntax for dynamic values
          </span>
        </div>

        <div className="command-form__actions">
          <button type="button" className="btn btn--secondary" onClick={onCancel}>
            Cancel
          </button>
          {detectedVariables.length > 0 && (
            <button
              type="button"
              className="btn btn--secondary"
              onClick={handleSetupVariables}
            >
              Setup Variables
            </button>
          )}
          <button type="submit" className="btn btn--primary">
            {isEditMode ? 'Save Changes' : 'Create Command'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CommandForm;
