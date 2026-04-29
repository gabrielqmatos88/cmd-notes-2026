// HashGenerator Component
// Generate MD5 and SHA-256 hashes from text input

import { useState, useCallback, useEffect } from 'react';
import { generateMD5, generateSHA256 } from '../../services/hashService';
import './HashGenerator.scss';

function HashGenerator() {
  const [inputText, setInputText] = useState('');
  const [md5Hash, setMd5Hash] = useState('');
  const [sha256Hash, setSha256Hash] = useState('');
  const [copiedHash, setCopiedHash] = useState(null);
  const [isHashing, setIsHashing] = useState(false);

  // Generate hashes when input changes
  useEffect(() => {
    const generateHashes = async () => {
      if (!inputText.trim()) {
        setMd5Hash('');
        setSha256Hash('');
        return;
      }

      setIsHashing(true);
      try {
        const [md5, sha256] = await Promise.all([
          generateMD5(inputText),
          generateSHA256(inputText),
        ]);
        setMd5Hash(md5);
        setSha256Hash(sha256);
      } catch (error) {
        console.error('Hash generation failed:', error);
        setMd5Hash('');
        setSha256Hash('');
      } finally {
        setIsHashing(false);
      }
    };

    // Debounce hash generation
    const timeoutId = setTimeout(generateHashes, 150);
    return () => clearTimeout(timeoutId);
  }, [inputText]);

  const handleClear = useCallback(() => {
    setInputText('');
    setMd5Hash('');
    setSha256Hash('');
    setCopiedHash(null);
  }, []);

  const handleCopy = useCallback(async (hashType) => {
    const hashToCopy = hashType === 'md5' ? md5Hash : sha256Hash;
    if (!hashToCopy) return;

    try {
      await navigator.clipboard.writeText(hashToCopy);
      setCopiedHash(hashType);
      setTimeout(() => setCopiedHash(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [md5Hash, sha256Hash]);

  const handleCopyInput = useCallback(async () => {
    if (!inputText) return;
    try {
      await navigator.clipboard.writeText(inputText);
    } catch (err) {
      console.error('Failed to copy input:', err);
    }
  }, [inputText]);

  return (
    <div className="hash-generator">
      <div className="hash-generator__input-section">
        <div className="hash-generator__input-header">
          <label className="hash-generator__label" htmlFor="hash-input">
            Input Text
          </label>
          {inputText && (
            <button
              className="hash-generator__copy-btn"
              onClick={handleCopyInput}
              title="Copy input text"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </button>
          )}
        </div>
        <textarea
          id="hash-input"
          className="hash-generator__input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter or paste text to generate hashes..."
          rows={5}
        />
        <div className="hash-generator__input-footer">
          <span className="hash-generator__char-count">
            {inputText.length} character{inputText.length !== 1 ? 's' : ''}
          </span>
          <button
            className="hash-generator__clear-btn"
            onClick={handleClear}
            disabled={!inputText}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="hash-generator__output-section">
        {/* MD5 Hash */}
        <div className="hash-generator__output">
          <div className="hash-generator__output-header">
            <div className="hash-generator__output-title-wrapper">
              <span className="hash-generator__output-title">MD5 Hash</span>
              <span className="hash-generator__output-warning">Not secure</span>
            </div>
            <button
              className={`hash-generator__copy-btn ${copiedHash === 'md5' ? 'copied' : ''}`}
              onClick={() => handleCopy('md5')}
              disabled={!md5Hash}
              title="Copy MD5 hash"
            >
              {copiedHash === 'md5' ? (
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
          </div>
          <div className="hash-generator__output-box">
            {isHashing ? (
              <span className="hash-generator__loading">Generating...</span>
            ) : md5Hash ? (
              <code className="hash-generator__hash">{md5Hash}</code>
            ) : (
              <span className="hash-generator__placeholder">MD5 hash will appear here</span>
            )}
          </div>
        </div>

        {/* SHA-256 Hash */}
        <div className="hash-generator__output">
          <div className="hash-generator__output-header">
            <div className="hash-generator__output-title-wrapper">
              <span className="hash-generator__output-title">SHA-256 Hash</span>
              <span className="hash-generator__output-secure">Recommended</span>
            </div>
            <button
              className={`hash-generator__copy-btn ${copiedHash === 'sha256' ? 'copied' : ''}`}
              onClick={() => handleCopy('sha256')}
              disabled={!sha256Hash}
              title="Copy SHA-256 hash"
            >
              {copiedHash === 'sha256' ? (
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
          </div>
          <div className="hash-generator__output-box">
            {isHashing ? (
              <span className="hash-generator__loading">Generating...</span>
            ) : sha256Hash ? (
              <code className="hash-generator__hash">{sha256Hash}</code>
            ) : (
              <span className="hash-generator__placeholder">SHA-256 hash will appear here</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HashGenerator;
