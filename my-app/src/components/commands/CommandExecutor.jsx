// CommandExecutor Component
// Execute a command with dynamic variable inputs

import { useState, useMemo, useCallback } from 'react';
import { replaceVariables, formatVariableLabel } from '../../utils/variableParser';
import { InputTypes } from '../../types';
import TextInput from '../inputs/TextInput';
import NumberInput from '../inputs/NumberInput';
import DropdownSelect from '../inputs/DropdownSelect';
import './CommandExecutor.scss';

// Format timestamp for display (same logic as useHistory)
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) return 'Just now';
  if (diff < 3600000) {
    const mins = Math.floor(diff / 60000);
    return `${mins} min${mins > 1 ? 's' : ''} ago`;
  }
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    hour: 'numeric',
    minute: '2-digit',
  });
};

function CommandExecutor({
  command,
  dataSources = [],
  initialValues = null, // Optional pre-filled values from history "Use Again"
  onExecute, // Callback when command is executed (for history)
  onEdit,
  onBack,
  onShare,
  recentHistory = [], // Last 3 history entries for this command
  onUseRecentHistory, // Callback when clicking a recent history entry
}) {
  // Initialize values from variable defaults or provided initial values
  const [values, setValues] = useState(() => {
    if (initialValues) {
      return initialValues;
    }
    const defaultValues = {};
    command.variables?.forEach((variable) => {
      defaultValues[variable.name] = variable.defaultValue ?? '';
    });
    return defaultValues;
  });
  const [copied, setCopied] = useState(false);
  const [copiedRecentId, setCopiedRecentId] = useState(null);

  // Compute generated command using useMemo
  const generatedCommand = useMemo(() => {
    return replaceVariables(command.template, values);
  }, [command.template, values]);

  const handleValueChange = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const getOptions = useCallback((variable) => {
    if (variable.dataSourceId) {
      const ds = dataSources.find((d) => d.id === variable.dataSourceId);
      return ds?.values || [];
    }
    return variable.inlineValues || [];
  }, [dataSources]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [generatedCommand]);

  const handleCopyRecent = useCallback(async (entry) => {
    try {
      await navigator.clipboard.writeText(entry.generatedCommand);
      setCopiedRecentId(entry.id);
      setTimeout(() => setCopiedRecentId(null), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  const handleExecute = useCallback(() => {
    if (onExecute) {
      onExecute({
        commandId: command.id,
        values: { ...values },
        generatedCommand,
      });
    }
    // Auto-copy on execute
    handleCopy();
  }, [onExecute, command.id, values, generatedCommand, handleCopy]);

  return (
    <div className="command-executor">
      <div className="command-executor__header">
        <div className="command-executor__header-content">
          <h2 className="command-executor__title">{command.name}</h2>
          {command.description && (
            <p className="command-executor__description">{command.description}</p>
          )}
        </div>
        <div className="command-executor__header-actions">
          <button className="btn btn--secondary btn--sm" onClick={onEdit}>
            Edit
          </button>
          <button className="btn btn--secondary btn--sm" onClick={() => onShare && onShare(command)}>
            Share
          </button>
          <button className="btn btn--secondary btn--sm" onClick={onBack}>
            Back
          </button>
        </div>
      </div>

      {recentHistory.length > 0 && (
        <div className="command-executor__recent-history">
          <h3 className="command-executor__recent-title">Recent Commands</h3>
          <div className="command-executor__recent-grid">
            {recentHistory.map((entry) => {
              const isCopied = copiedRecentId === entry.id;
              return (
                <button
                  key={entry.id}
                  className={`command-executor__recent-card ${isCopied ? 'copied' : ''}`}
                  onClick={() => handleCopyRecent(entry)}
                  title={entry.generatedCommand}
                >
                  <div className="command-executor__recent-time">
                    {isCopied ? 'Copied!' : formatTimestamp(entry.timestamp)}
                  </div>
                  <code className="command-executor__recent-command">
                    {entry.generatedCommand.length > 50
                      ? entry.generatedCommand.substring(0, 50) + '...'
                      : entry.generatedCommand}
                  </code>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="command-executor__body">
        <div className="command-executor__form">
          {command.variables?.length > 0 ? (
            command.variables.map((variable) => (
              <div key={variable.name} className="command-executor__field">
                {variable.inputType === InputTypes.TEXT && (
                  <TextInput
                    name={variable.name}
                    label={formatVariableLabel(variable.name)}
                    value={values[variable.name] || ''}
                    onChange={(value) => handleValueChange(variable.name, value)}
                    placeholder={`Enter ${variable.name}...`}
                  />
                )}
                {variable.inputType === InputTypes.NUMBER && (
                  <NumberInput
                    name={variable.name}
                    label={formatVariableLabel(variable.name)}
                    value={values[variable.name] || ''}
                    onChange={(value) => handleValueChange(variable.name, value)}
                    placeholder={`Enter ${variable.name}...`}
                  />
                )}
                {variable.inputType === InputTypes.DROPDOWN && (
                  <DropdownSelect
                    name={variable.name}
                    label={formatVariableLabel(variable.name)}
                    value={values[variable.name] || ''}
                    onChange={(value) => handleValueChange(variable.name, value)}
                    options={getOptions(variable)}
                    placeholder={`Select ${variable.name}...`}
                  />
                )}
              </div>
            ))
          ) : (
            <div className="command-executor__no-variables">
              <p>This command has no variables to configure.</p>
            </div>
          )}
        </div>

        <div className="command-executor__preview">
          <div className="command-executor__preview-header">
            <h3 className="command-executor__preview-title">Generated Command</h3>
          </div>
          <div className="command-executor__preview-box">
            <code>{generatedCommand}</code>
          </div>
          <div className="command-executor__preview-actions">
            <button
              className={`btn ${copied ? 'btn--secondary' : 'btn--primary'}`}
              onClick={handleExecute}
            >
              {copied ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy to Clipboard
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommandExecutor;
