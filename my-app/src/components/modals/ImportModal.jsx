// ImportModal Component
// Modal for importing commands and data sources from JSON

import { useState, useCallback, useRef } from 'react';
import './ImportModal.scss';

function ImportModal({ isOpen, onClose, onImport }) {
  const [inputMode, setInputMode] = useState('file'); // 'file' | 'paste'
  const [jsonText, setJsonText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [parseError, setParseError] = useState('');
  const [mergeMode, setMergeMode] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const validateAndParse = useCallback((jsonString) => {
    if (!jsonString.trim()) {
      setParsedData(null);
      setParseError('');
      return;
    }

    try {
      const data = JSON.parse(jsonString);

      // Validate structure
      if (!data.version) {
        setParseError('Invalid format: missing version field');
        setParsedData(null);
        return;
      }

      const hasCommands = data.commands && Array.isArray(data.commands);
      const hasDataSources = data.dataSources && Array.isArray(data.dataSources);

      if (!hasCommands && !hasDataSources) {
        setParseError('Invalid format: no commands or data sources found');
        setParsedData(null);
        return;
      }

      setParsedData({
        hasCommands,
        hasDataSources,
        commandsCount: hasCommands ? data.commands.length : 0,
        dataSourcesCount: hasDataSources ? data.dataSources.length : 0,
        rawData: data,
      });
      setParseError('');
    } catch (e) {
      setParseError(`JSON parse error: ${e.message}`);
      setParsedData(null);
    }
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setJsonText(content);
      validateAndParse(content);
    };
    reader.onerror = () => {
      setParseError('Failed to read file');
      setParsedData(null);
    };
    reader.readAsText(file);
  }, [validateAndParse]);

  const handleTextChange = useCallback((e) => {
    const text = e.target.value;
    setJsonText(text);
    validateAndParse(text);
  }, [validateAndParse]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file || !file.name.endsWith('.json')) {
      setParseError('Please drop a JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setJsonText(content);
      validateAndParse(content);
    };
    reader.onerror = () => {
      setParseError('Failed to read file');
      setParsedData(null);
    };
    reader.readAsText(file);
  }, [validateAndParse]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resetModal = () => {
    setJsonText('');
    setParsedData(null);
    setParseError('');
    setMergeMode(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImport = useCallback(() => {
    if (!parsedData) return;

    try {
      onImport(parsedData.rawData, mergeMode);
      resetModal();
      onClose();
    } catch (error) {
      setParseError(`Import failed: ${error.message}`);
    }
  }, [parsedData, mergeMode, onImport, onClose]);

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal modal--lg import-modal">
        <div className="modal__header">
          <h3 className="modal__title">Import Data</h3>
          <button className="import-modal__close" onClick={handleClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal__body">
          <div className="import-modal__tabs">
            <button
              className={`import-modal__tab ${inputMode === 'file' ? 'active' : ''}`}
              onClick={() => setInputMode('file')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              File Upload
            </button>
            <button
              className={`import-modal__tab ${inputMode === 'paste' ? 'active' : ''}`}
              onClick={() => setInputMode('paste')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              </svg>
              Paste JSON
            </button>
          </div>

          {inputMode === 'file' ? (
            <div
              className={`import-modal__dropzone ${isDragging ? 'dragging' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                style={{ display: 'none' }}
              />
              <div className="import-modal__dropzone-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p className="import-modal__dropzone-text">
                Drop a JSON file here or click to browse
              </p>
              <p className="import-modal__dropzone-hint">
                Supports CMD-Notes export files
              </p>
            </div>
          ) : (
            <div className="import-modal__text-input">
              <textarea
                value={jsonText}
                onChange={handleTextChange}
                placeholder='Paste your JSON data here...'
                rows={10}
              />
            </div>
          )}

          {parseError && (
            <div className="import-modal__error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {parseError}
            </div>
          )}

          {parsedData && (
            <>
              <div className="import-modal__preview">
                <h4 className="import-modal__preview-title">Import Preview</h4>
                <div className="import-modal__preview-items">
                  {parsedData.hasCommands && (
                    <div className="import-modal__preview-item">
                      <span className="import-modal__preview-count">{parsedData.commandsCount}</span>
                      <span className="import-modal__preview-label">command(s)</span>
                    </div>
                  )}
                  {parsedData.hasDataSources && (
                    <div className="import-modal__preview-item">
                      <span className="import-modal__preview-count">{parsedData.dataSourcesCount}</span>
                      <span className="import-modal__preview-label">data source(s)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="import-modal__merge-option">
                <label className="import-modal__merge-label">
                  <input
                    type="radio"
                    name="mergeMode"
                    value="merge"
                    checked={mergeMode}
                    onChange={() => setMergeMode(true)}
                  />
                  <div>
                    <span className="import-modal__merge-title">Merge</span>
                    <span className="import-modal__merge-desc">Add new items, skip duplicates</span>
                  </div>
                </label>
                <label className="import-modal__merge-label">
                  <input
                    type="radio"
                    name="mergeMode"
                    value="replace"
                    checked={!mergeMode}
                    onChange={() => setMergeMode(false)}
                  />
                  <div>
                    <span className="import-modal__merge-title">Replace</span>
                    <span className="import-modal__merge-desc">Remove existing, add all imported</span>
                  </div>
                </label>
              </div>
            </>
          )}
        </div>

        <div className="modal__footer">
          <button className="btn btn--secondary" onClick={handleClose}>
            Cancel
          </button>
          <button
            className="btn btn--primary"
            onClick={handleImport}
            disabled={!parsedData}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Import Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImportModal;