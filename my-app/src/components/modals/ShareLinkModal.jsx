// ShareLinkModal Component
// Modal for generating shareable links for commands

import { useState, useMemo, useCallback } from 'react';
import { generateShareableUrl, checkUrlLength } from '../../utils/urlEncoder';
import './ShareLinkModal.scss';

function ShareLinkModal({ isOpen, onClose, command }) {
  const [copied, setCopied] = useState(false);
  const [jsonCopied, setJsonCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (!command) return '';
    return generateShareableUrl(command);
  }, [command]);

  const urlInfo = useMemo(() => {
    if (!command) return null;
    return checkUrlLength(command);
  }, [command]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [shareUrl]);

  const handleExportJson = useCallback(() => {
    if (!command) return;

    // Format command for JSON export
    const exportData = {
      version: 1,
      exportedAt: Date.now(),
      commands: [command],
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cmd-${command.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [command]);

  const exportJson = useMemo(() => {
    if (!command) return '';
    return JSON.stringify({
      version: 1,
      commands: [command],
    }, null, 2);
  }, [command]);

  const handleCopyJson = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(exportJson);
      setJsonCopied(true);
      setTimeout(() => setJsonCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy JSON:', err);
    }
  }, [exportJson]);

  if (!isOpen || !command) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal--lg share-link-modal">
        <div className="modal__header">
          <h3 className="modal__title">Share Command</h3>
          <button className="share-link-modal__close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal__body">
          <div className="share-link-modal__command-info">
            <div className="share-link-modal__command-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <div className="share-link-modal__command-details">
              <span className="share-link-modal__command-name">{command.name}</span>
              <span className="share-link-modal__command-template">{command.template}</span>
            </div>
          </div>

          <div className="share-link-modal__url-section">
            <label className="share-link-modal__label">Shareable Link</label>
            <div className="share-link-modal__url-box">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="share-link-modal__url-input"
              />
              <button
                className={`share-link-modal__copy-btn ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
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
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {urlInfo && (
            <div className={`share-link-modal__length-warning ${urlInfo.isExceeded ? 'warning' : 'ok'}`}>
              <div className="share-link-modal__length-bar">
                <div
                  className="share-link-modal__length-fill"
                  style={{ width: `${Math.min(urlInfo.percentage, 100)}%` }}
                />
              </div>
              <div className="share-link-modal__length-info">
                {urlInfo.isExceeded ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <span>URL length ({urlInfo.estimatedLength} chars) exceeds recommended limit ({urlInfo.maxLength} chars). Some browsers may not handle this link.</span>
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span>URL length is OK ({urlInfo.estimatedLength}/{urlInfo.maxLength} chars - {urlInfo.percentage}%)</span>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="share-link-modal__json-section">
            <div className="share-link-modal__json-header">
              <label className="share-link-modal__label">Export as JSON</label>
              <div className="share-link-modal__json-buttons">
                <button
                  className={`share-link-modal__json-btn ${jsonCopied ? 'copied' : ''}`}
                  onClick={handleCopyJson}
                >
                  {jsonCopied ? (
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
                      Copy JSON
                    </>
                  )}
                </button>
                <button
                  className="share-link-modal__json-btn share-link-modal__json-btn--download"
                  onClick={handleExportJson}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
            <pre className="share-link-modal__json-preview">{exportJson}</pre>
          </div>
        </div>

        <div className="modal__footer">
          <button className="btn btn--secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShareLinkModal;