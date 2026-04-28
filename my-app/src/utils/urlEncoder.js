// URL Encoder Utility
// Handles encoding/decoding for shareable links

/**
 * Encode data for URL-safe sharing
 * @param {Object} data - Data to encode (typically a single command)
 * @returns {string} Base64-encoded, URL-safe string
 * 
 * @example
 * const data = { name: "Git Commit", template: "git commit -m '#msg#'" };
 * const encoded = encodeForUrl(data);
 * // Returns URL-safe base64 string
 */
export const encodeForUrl = (data) => {
  if (!data) return '';

  try {
    // Convert to JSON string
    const jsonString = JSON.stringify(data);
    
    // Use base64 encoding
    // For browser environments, use btoa with encoding handling
    const utf8Bytes = new TextEncoder().encode(jsonString);
    const binaryString = Array.from(utf8Bytes, (byte) => String.fromCharCode(byte)).join('');
    const base64 = btoa(binaryString);
    
    // Make URL-safe by replacing +/= with alternative characters
    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (error) {
    console.error('Error encoding data for URL:', error);
    return '';
  }
};

/**
 * Decode data from URL-safe string
 * @param {string} encoded - Base64-encoded string (URL-safe)
 * @returns {Object|null} Decoded data object or null if invalid
 * 
 * @example
 * const encoded = "eyJuYW1lIjoiR2l0IENvbW1pdCJ9...";
 * const data = decodeFromUrl(encoded);
 * // Returns: { name: "Git Commit", ... }
 */
export const decodeFromUrl = (encoded) => {
  if (!encoded) return null;

  try {
    // Restore base64 characters
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding if necessary
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    
    // Decode base64
    const binaryString = atob(base64);
    
    // Convert binary string to Uint8Array
    const bytes = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
    
    // Decode UTF-8 bytes to string
    const jsonString = new TextDecoder().decode(bytes);
    
    // Parse JSON
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error decoding data from URL:', error);
    return null;
  }
};

/**
 * Generate a shareable URL for a command
 * @param {Object} command - Command object to share
 * @returns {string} Full URL with encoded command data
 * 
 * @example
 * const url = generateShareableUrl(command);
 * // Returns: "https://example.com/import?data=eyJuYW1l..."
 */
export const generateShareableUrl = (command) => {
  const baseUrl = window.location.origin + window.location.pathname;
  const encoded = encodeForUrl(command);
  
  if (!encoded) return '';
  
  return `${baseUrl}?import=true&data=${encoded}`;
};

/**
 * Check if current URL contains importable data
 * @returns {Object|null} Decoded data or null
 */
export const parseUrlForImport = () => {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('data');
  
  if (!encoded) return null;
  
  return decodeFromUrl(encoded);
};

/**
 * Check if the data size exceeds URL length limits
 * @param {Object} data - Data to check
 * @returns {Object} Result with isExceeded and estimatedLength
 */
export const checkUrlLength = (data) => {
  const encoded = encodeForUrl(data);
  const estimatedLength = encoded.length;
  
  // Most browsers support URLs up to ~2000 characters
  const MAX_URL_LENGTH = 2000;
  
  return {
    isExceeded: estimatedLength > MAX_URL_LENGTH,
    estimatedLength,
    maxLength: MAX_URL_LENGTH,
    percentage: Math.round((estimatedLength / MAX_URL_LENGTH) * 100),
  };
};

/**
 * Clear import data from URL without reloading
 */
export const clearUrlImportData = () => {
  const url = new URL(window.location.href);
  url.searchParams.delete('import');
  url.searchParams.delete('data');
  window.history.replaceState({}, '', url.toString());
};
