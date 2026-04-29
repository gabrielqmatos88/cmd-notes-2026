// ShareLinkImport Component
// Modal for importing commands from shareable links

import { useState, useEffect, useCallback } from 'react';
import { parseUrlForImport, clearUrlImportData } from '../../utils/urlEncoder';
import './ShareLinkImport.scss';

function ShareLinkImport({ isOpen, onClose, onImport }) {
  const [importData, setImportData] = useState(null);
  const [parseError, setParseError] = useState('');
  const [imported, setImported] = useState(false);

  // Check URL for import data on mount
  useEffect(() => {
    if (isOpen && !importData && !parseError) {
      const data = parseUrlForImport();

      if (!data) {
        setParseError('No valid import data found in URL');
        return;
      }

      // Validate the data structure
      if (!data.name || !data.template) {
        setParseError('Invalid command data: missing name or template');
        return;
      }

      setImportData(data);
    }
  }, [isOpen, importData, parseError]);

  const handleImport = useCallback(() => {
    if (!importData) return;

    try {
      onImport(importData);
      setImported(true);

      // Clear URL parameters
      clearUrlImportData();

      // Close modal after short delay
      setTimeout(() => {
        onClose();
        setImported(false);
        setImportData(null);
        setParseError('');
      }, 1500);
    } catch (error) {
      setParseError(`Import failed: ${error.message}`);
    }
  }, [importData, onImport, onClose]);

  const handleCancel = useCallback(() => {
    // Clear URL parameters even on cancel
    clearUrlImportData();
    setImportData(null);
    setParseError('');
    setImported(false);
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleCancel()}>
      <div className="modal modal--lg share-link-import">
        <div className="modal__header">
          <h3 className="modal__title">
            {imported ? (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="share-link-import__success-icon">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Command Imported!
              </>
            ) : (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="share-link-import__icon">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                Import Shared Command
              </>
            )}
          </h3>
          {!imported && (
            <button className="share-link-import__close" onClick={handleCancel}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <div className="modal__body">
          {imported ? (
            <div className="share-link-import__success">
              <div className="share-link-import__success-content">
                <div className="share-link-import__success-icon-wrapper">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="share-link-import__success-text">
                  "{importData?.name}" has been successfully imported!
                </p>
                <p className="share-link-import__success-hint">
                  You can now use this command from your command list.
                </p>
              </div>
            </div>
          ) : parseError ? (
            <div className="share-link-import__error">
              <div className="share-link-import__error-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <p className="share-link-import__error-text">{parseError}</p>
              <p className="share-link-import__error-hint">
                The shared link may be invalid or corrupted. Please ask the sender for a new link.
              </p>
            </div>
          ) : importData ? (
            <>
              <div className="share-link-import__preview">
                <div className="share-link-import__command-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <div className="share-link-import__command-details">
                  <h4 className="share-link-import__command-name">{importData.name}</h4>
                  {importData.description && (
                    <p className="share-link-import__command-desc">{importData.description}</p>
                  )}
                </div>
              </div>

              <div className="share-link-import__info">
                <div className="share-link-import__info-section">
                  <label className="share-link-import__info-label">Template</label>
                  <code className="share-link-import__template">{importData.template}</code>
                </div>

                {importData.variables && importData.variables.length > 0 && (
                  <div className="share-link-import__info-section">
                    <label className="share-link-import__info-label">
                      Variables ({importData.variables.length})
                    </label>
                    <ul className="share-link-import__variables">
                      {importData.variables.map((variable, index) => (
                        <li key={index} className="share-link-import__variable">
                          <span className="share-link-import__variable-name">#{variable.name}#</span>
                          <span className="share-link-import__variable-type">{variable.inputType}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="share-link-import__note">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>
                  This command will be added to your command list. You can edit or delete it at any time.
                </span>
              </div>
            </>
          ) : null}
        </div>

        {!imported && !parseError && importData && (
          <div className="modal__footer">
            <button className="btn btn--secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn btn--primary" onClick={handleImport}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Import Command
            </button>
          </div>
        )}

        {!imported && parseError && (
          <div className="modal__footer">
            <button className="btn btn--secondary" onClick={handleCancel}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShareLinkImport;
