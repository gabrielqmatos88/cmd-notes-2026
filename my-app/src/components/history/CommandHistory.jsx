// CommandHistory Component
// Displays history of generated commands with copy and use again options

import { useState, useEffect } from 'react';
import useHistory from '../../hooks/useHistory';
import ConfirmModal from '../common/ConfirmModal';
import './CommandHistory.scss';

function CommandHistory({ onUseAgain }) {
  const {
    history,
    settings,
    loadHistory,
    clearHistory,
    deleteEntry,
    toggleHistoryEnabled,
    setMaxHistoryItems,
    getCommandForEntry,
    formatTimestamp,
    copyToClipboard,
  } = useHistory();

  const [copiedId, setCopiedId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Reload history when component mounts
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleCopy = async (entry) => {
    const success = await copyToClipboard(entry.generatedCommand);
    if (success) {
      setCopiedId(entry.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleUseAgain = (entry) => {
    const command = getCommandForEntry(entry.commandId);
    if (command && onUseAgain) {
      onUseAgain(command, entry.values);
    }
  };

  const handleConfirmClear = () => {
    clearHistory();
    setShowClearConfirm(false);
  };

  const handleToggleHistory = () => {
    toggleHistoryEnabled();
  };

  const handleMaxItemsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= 50) {
      setMaxHistoryItems(value);
    }
  };

  return (
    <div className="history-view">
      <div className="history-view__header">
        <div className="history-view__title-row">
          <h2 className="history-view__title">Command History</h2>
          <button
            className="history-view__settings-btn"
            onClick={() => setShowSettings(!showSettings)}
            title="History Settings"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>

        {history.length > 0 && (
          <button
            className="history-view__clear-btn"
            onClick={() => setShowClearConfirm(true)}
          >
            Clear History
          </button>
        )}
      </div>

      {showSettings && (
        <div className="history-view__settings-panel">
          <div className="history-view__setting-item">
            <label className="history-view__setting-label">
              <input
                type="checkbox"
                checked={settings.historyEnabled}
                onChange={handleToggleHistory}
              />
              <span>Enable history tracking</span>
            </label>
            <p className="history-view__setting-hint">
              When disabled, commands will not be saved to history
            </p>
          </div>

          <div className="history-view__setting-item">
            <label className="history-view__setting-label">
              <span>Maximum history items:</span>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.maxHistoryItems}
                onChange={handleMaxItemsChange}
                className="history-view__number-input"
              />
            </label>
          </div>
        </div>
      )}

      {history.length === 0 ? (
        <div className="history-view__empty">
          <div className="history-view__empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <h3 className="history-view__empty-title">No history yet</h3>
          <p className="history-view__empty-description">
            Your executed commands will appear here. History is {settings.historyEnabled ? 'enabled' : 'currently disabled'}.
          </p>
        </div>
      ) : (
        <div className="history-view__list">
          {history.map((entry) => {
            const command = getCommandForEntry(entry.commandId);
            return (
              <div key={entry.id} className="history-view__entry">
                <div className="history-view__entry-header">
                  <span className="history-view__entry-command">
                    {command?.name || 'Deleted Command'}
                  </span>
                  <span className="history-view__entry-time">
                    {formatTimestamp(entry.timestamp)}
                  </span>
                </div>

                <div className="history-view__entry-command-output">
                  <code>{entry.generatedCommand}</code>
                </div>

                <div className="history-view__entry-actions">
                  <button
                    className={`history-view__action-btn ${copiedId === entry.id ? 'copied' : ''}`}
                    onClick={() => handleCopy(entry)}
                  >
                    {copiedId === entry.id ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>

                  {command && (
                    <button
                      className="history-view__action-btn history-view__action-btn--secondary"
                      onClick={() => handleUseAgain(entry)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="1 4 1 10 7 10" />
                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                      </svg>
                      Use Again
                    </button>
                  )}

                  <button
                    className="history-view__action-btn history-view__action-btn--danger"
                    onClick={() => deleteEntry(entry.id)}
                    title="Delete entry"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleConfirmClear}
        title="Clear History"
        message="Are you sure you want to clear all history? This action cannot be undone."
        confirmText="Clear All"
        type="danger"
      />
    </div>
  );
}

export default CommandHistory;