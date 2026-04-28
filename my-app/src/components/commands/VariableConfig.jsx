// VariableConfig Component
// Configure variables for a command template

import { useState, useEffect } from 'react';
import { replaceVariables, detectVariableType, formatVariableLabel } from '../../utils/variableParser';
import { InputTypes } from '../../types';
import './VariableConfig.scss';

function VariableConfig({
  commandData,
  existingVariables = [], // Existing variable configs (for edit mode)
  dataSources = [],
  onSave,
  onCancel,
}) {
  const [variables, setVariables] = useState([]);
  const [preview, setPreview] = useState('');

  // Initialize variables from detected or existing
  useEffect(() => {
    const detected = commandData.detectedVariables || [];

    if (existingVariables.length > 0) {
      // Merge existing configs with any new detected variables
      const existingNames = new Set(existingVariables.map((v) => v.name));
      const newVars = detected
        .filter((name) => !existingNames.has(name))
        .map((name) => ({
          name,
          inputType: detectVariableType(name),
          defaultValue: '',
          dataSourceId: null,
          inlineValues: null,
        }));
      setVariables([...existingVariables, ...newVars]);
    } else if (detected.length > 0) {
      // Create default configs for all detected variables
      const defaultVars = detected.map((name) => ({
        name,
        inputType: detectVariableType(name),
        defaultValue: '',
        dataSourceId: null,
        inlineValues: null,
      }));
      setVariables(defaultVars);
    }
  }, [commandData, existingVariables]);

  // Update preview whenever variable values change
  useEffect(() => {
    const values = {};
    variables.forEach((v) => {
      if (v.defaultValue !== '') {
        values[v.name] = v.defaultValue;
      }
    });
    const result = replaceVariables(commandData.template, values);
    setPreview(result);
  }, [variables, commandData.template]);

  const handleVariableChange = (index, field, value) => {
    setVariables((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleInlineValuesChange = (index, value) => {
    // Parse semicolon or comma separated values
    const values = value
      .split(/[;,]/)
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    handleVariableChange(index, 'inlineValues', values.length > 0 ? values : null);
  };

  const handleSave = () => {
    // Save command with variables
    onSave({
      ...commandData,
      variables,
    });
  };

  const getAvailableOptions = (dataSourceId) => {
    if (!dataSourceId) return [];
    const ds = dataSources.find((d) => d.id === dataSourceId);
    return ds?.values || [];
  };

  return (
    <div className="variable-config">
      <div className="variable-config__header">
        <h2 className="variable-config__title">Configure Variables</h2>
        <p className="variable-config__subtitle">
          Set up input types and default values for each variable in your command.
        </p>
      </div>

      <div className="variable-config__body">
        <div className="variable-config__form">
          {variables.length === 0 ? (
            <div className="variable-config__empty">
              <p>No variables detected in the template.</p>
            </div>
          ) : (
            variables.map((variable, index) => (
              <div key={variable.name} className="variable-config__item">
                <div className="variable-config__item-header">
                  <span className="variable-config__item-name">
                    {formatVariableLabel(variable.name)}
                  </span>
                  <span className="variable-config__item-placeholder">
                    #{variable.name}#
                  </span>
                </div>

                <div className="variable-config__item-body">
                  <div className="variable-config__field">
                    <label className="variable-config__label">Input Type</label>
                    <select
                      className="variable-config__select"
                      value={variable.inputType}
                      onChange={(e) =>
                        handleVariableChange(index, 'inputType', e.target.value)
                      }
                    >
                      <option value={InputTypes.TEXT}>Text</option>
                      <option value={InputTypes.NUMBER}>Number</option>
                      <option value={InputTypes.DROPDOWN}>Dropdown</option>
                    </select>
                  </div>

                  {variable.inputType === InputTypes.DROPDOWN && (
                    <>
                      <div className="variable-config__field">
                        <label className="variable-config__label">Data Source</label>
                        <select
                          className="variable-config__select"
                          value={variable.dataSourceId || ''}
                          onChange={(e) =>
                            handleVariableChange(
                              index,
                              'dataSourceId',
                              e.target.value || null
                            )
                          }
                        >
                          <option value="">-- Select Data Source --</option>
                          {dataSources.map((ds) => (
                            <option key={ds.id} value={ds.id}>
                              {ds.name} ({ds.values.length} values)
                            </option>
                          ))}
                        </select>
                      </div>

                      {!variable.dataSourceId && (
                        <div className="variable-config__field">
                          <label className="variable-config__label">
                            Inline Values (semicolon or comma separated)
                          </label>
                          <input
                            type="text"
                            className="variable-config__input"
                            value={
                              variable.inlineValues
                                ? variable.inlineValues.join('; ')
                                : ''
                            }
                            onChange={(e) =>
                              handleInlineValuesChange(index, e.target.value)
                            }
                            placeholder="e.g., Option 1; Option 2; Option 3"
                          />
                        </div>
                      )}

                      {variable.dataSourceId && (
                        <div className="variable-config__field">
                          <label className="variable-config__label">
                            Available Options (from data source)
                          </label>
                          <div className="variable-config__options">
                            {getAvailableOptions(variable.dataSourceId).length > 0 ? (
                              getAvailableOptions(variable.dataSourceId).map(
                                (opt, i) => (
                                  <span key={i} className="variable-config__option">
                                    {opt}
                                  </span>
                                )
                              )
                            ) : (
                              <span className="variable-config__no-options">
                                No values in this data source
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div className="variable-config__field">
                    <label className="variable-config__label">Default Value</label>
                    <input
                      type={variable.inputType === InputTypes.NUMBER ? 'number' : 'text'}
                      className="variable-config__input"
                      value={variable.defaultValue || ''}
                      onChange={(e) =>
                        handleVariableChange(
                          index,
                          'defaultValue',
                          variable.inputType === InputTypes.NUMBER
                            ? Number(e.target.value)
                            : e.target.value
                        )
                      }
                      placeholder="Optional default value"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="variable-config__preview">
          <h3 className="variable-config__preview-title">Preview</h3>
          <div className="variable-config__preview-box">
            <code>{preview || commandData.template}</code>
          </div>
          <p className="variable-config__preview-hint">
            Variables with default values are automatically substituted.
          </p>
        </div>
      </div>

      <div className="variable-config__actions">
        <button type="button" className="btn btn--secondary" onClick={onCancel}>
          Back
        </button>
        <button type="button" className="btn btn--primary" onClick={handleSave}>
          Save Command
        </button>
      </div>
    </div>
  );
}

export default VariableConfig;
