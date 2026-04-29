// ExportModal Component
// Modal for exporting commands and data sources as JSON

import { useState, useMemo } from 'react';
import './ExportModal.scss';

function ExportModal({ isOpen, onClose, commands, dataSources }) {
  const [exportType, setExportType] = useState('all'); // 'all' | 'commands' | 'datasources' | 'single'
  const [selectedCommands, setSelectedCommands] = useState([]);

  const handleExport = () => {
    let data;
    let filename;

    switch (exportType) {
      case 'all':
        data = {
          version: 1,
          exportedAt: Date.now(),
          commands: commands,
          dataSources: dataSources,
        };
        filename = `cmd-notes-export-${Date.now()}.json`;
        break;

      case 'commands':
        data = {
          version: 1,
          type: 'commands',
          exportedAt: Date.now(),
          commands: commands,
        };
        filename = `commands-${Date.now()}.json`;
        break;

      case 'datasources':
        data = {
          version: 1,
          type: 'dataSources',
          exportedAt: Date.now(),
          dataSources: dataSources,
        };
        filename = `datasources-${Date.now()}.json`;
        break;

      case 'single': {
        const selectedCmd = commands.find((c) => c.id === selectedCommands[0]);
        if (!selectedCmd) return;
        data = {
          version: 1,
          type: 'command',
          exportedAt: Date.now(),
          commands: [selectedCmd],
        };
        filename = `${selectedCmd.name.replace(/[^a-z0-9]/gi, '-')}-${Date.now()}.json`;
        break;
      }

      default:
        return;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onClose();
  };

  const canExport = useMemo(() => {
    switch (exportType) {
      case 'all':
        return commands.length > 0 || dataSources.length > 0;
      case 'commands':
        return commands.length > 0;
      case 'datasources':
        return dataSources.length > 0;
      case 'single':
        return selectedCommands.length === 1;
      default:
        return false;
    }
  }, [exportType, commands, dataSources, selectedCommands]);

  const getExportPreview = () => {
    switch (exportType) {
      case 'all':
        return `${commands.length} command(s) and ${dataSources.length} data source(s)`;
      case 'commands':
        return `${commands.length} command(s)`;
      case 'datasources':
        return `${dataSources.length} data source(s)`;
      case 'single': {
        const cmd = commands.find((c) => c.id === selectedCommands[0]);
        return cmd ? `"${cmd.name}"` : 'No command selected';
      }
      default:
        return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal--lg export-modal">
        <div className="modal__header">
          <h3 className="modal__title">Export Data</h3>
          <button className="export-modal__close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal__body">
          <div className="export-modal__options">
            <label className="export-modal__option">
              <input
                type="radio"
                name="exportType"
                value="all"
                checked={exportType === 'all'}
                onChange={() => setExportType('all')}
              />
              <div className="export-modal__option-content">
                <span className="export-modal__option-title">Export All</span>
                <span className="export-modal__option-desc">Commands and data sources</span>
              </div>
            </label>

            <label className="export-modal__option">
              <input
                type="radio"
                name="exportType"
                value="commands"
                checked={exportType === 'commands'}
                onChange={() => setExportType('commands')}
              />
              <div className="export-modal__option-content">
                <span className="export-modal__option-title">Export Commands</span>
                <span className="export-modal__option-desc">All commands only</span>
              </div>
            </label>

            <label className="export-modal__option">
              <input
                type="radio"
                name="exportType"
                value="datasources"
                checked={exportType === 'datasources'}
                onChange={() => setExportType('datasources')}
              />
              <div className="export-modal__option-content">
                <span className="export-modal__option-title">Export Data Sources</span>
                <span className="export-modal__option-desc">All data sources only</span>
              </div>
            </label>

            <label className="export-modal__option">
              <input
                type="radio"
                name="exportType"
                value="single"
                checked={exportType === 'single'}
                onChange={() => setExportType('single')}
              />
              <div className="export-modal__option-content">
                <span className="export-modal__option-title">Export Single Command</span>
                <span className="export-modal__option-desc">Select one command to export</span>
              </div>
            </label>
          </div>

          {exportType === 'single' && (
            <div className="export-modal__command-select">
              <div className="export-modal__command-list-header">
                <span className="export-modal__header-text">Select a command</span>
              </div>
              <div className="export-modal__command-list">
                {commands.map((command) => (
                  <label key={command.id} className="export-modal__command-item">
                    <input
                      type="radio"
                      name="singleCommand"
                      checked={selectedCommands.includes(command.id)}
                      onChange={() => setSelectedCommands([command.id])}
                    />
                    <span className="export-modal__command-name">{command.name}</span>
                    <span className="export-modal__command-vars">
                      {command.variables?.length || 0} vars
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="export-modal__preview">
            <span className="export-modal__preview-label">Export Preview:</span>
            <code className="export-modal__preview-content">{getExportPreview()}</code>
          </div>
        </div>

        <div className="modal__footer">
          <button className="btn btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn--primary" onClick={handleExport} disabled={!canExport}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download JSON
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExportModal;