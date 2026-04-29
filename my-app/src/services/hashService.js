// Hash Service
// Service for generating cryptographic hashes

/**
 * Generate MD5 hash of a string
 * Uses the Web Crypto API for SHA-256 and a simple implementation for MD5
 * Note: MD5 is cryptographically broken, use only for non-security purposes
 * 
 * @param {string} text - The text to hash
 * @returns {Promise<string>} The MD5 hash as a hex string
 */
export async function generateMD5(text) {
  if (!text) return '';
  
  // Use a simple MD5 implementation since Web Crypto API doesn't support MD5
  // This is a pure JS implementation for compatibility
  const md5 = await import('js-md5').then(module => module.default || module);
  return md5(text);
}

/**
 * Generate SHA-256 hash of a string using Web Crypto API
 * 
 * @param {string} text - The text to hash
 * @returns {Promise<string>} The SHA-256 hash as a hex string
 */
export async function generateSHA256(text) {
  if (!text) return '';
  
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Generate both MD5 and SHA-256 hashes
 * 
 * @param {string} text - The text to hash
 * @returns {Promise<{md5: string, sha256: string}>} Object containing both hashes
 */
export async function generateHashes(text) {
  const [md5, sha256] = await Promise.all([
    generateMD5(text),
    generateSHA256(text),
  ]);
  
  return { md5, sha256 };
}
