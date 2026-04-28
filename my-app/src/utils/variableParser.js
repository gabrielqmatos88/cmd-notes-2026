// Variable Parser Utility
// Handles extraction and replacement of #variables# in command templates

/**
 * Regular expression to match #variable# patterns
 * Captures the variable name without the # delimiters
 */
const VARIABLE_PATTERN = /#([^#]+)#/g;

/**
 * Regular expression to validate proper variable syntax
 * Ensures no nested # characters or empty variables
 */
// Reserved for future validation patterns
// const VALID_VARIABLE_PATTERN = /^(?!#)([^#]*)#([^#]+)#(?!#)$/;

/**
 * Extract all variable names from a template string
 * @param {string} template - Command template with #variables#
 * @returns {string[]} Array of unique variable names (without #)
 * 
 * @example
 * parseVariables("git commit -m '#message#' --author '#author#'")
 * // Returns: ['message', 'author']
 */
export const parseVariables = (template) => {
  if (!template || typeof template !== 'string') {
    return [];
  }

  const matches = template.match(VARIABLE_PATTERN);
  if (!matches) {
    return [];
  }

  // Extract names and remove duplicates
  const uniqueNames = [...new Set(matches.map((match) => match.slice(1, -1)))];
  return uniqueNames;
};

/**
 * Replace variables in a template with provided values
 * @param {string} template - Command template with #variables#
 * @param {Object<string, string | number>} values - Object mapping variable names to values
 * @returns {string} Template with variables replaced
 * 
 * @example
 * replaceVariables("git commit -m '#message#'", { message: "Initial commit" })
 * // Returns: "git commit -m 'Initial commit'"
 */
export const replaceVariables = (template, values) => {
  if (!template || typeof template !== 'string') {
    return template;
  }

  return template.replace(VARIABLE_PATTERN, (match, varName) => {
    const value = values[varName];
    if (value === undefined || value === null) {
      // Return original placeholder if no value provided
      return match;
    }
    return String(value);
  });
};

/**
 * Validate a template for malformed variable syntax
 * @param {string} template - Template string to validate
 * @returns {Object} Validation result with isValid and errors
 * 
 * @example
 * validateTemplate("git #branch# commit") // { isValid: true, errors: [] }
 * validateTemplate("git # branch# commit") // { isValid: false, errors: ['Malformed variable at position 4'] }
 */
export const validateTemplate = (template) => {
  const errors = [];

  if (!template || typeof template !== 'string') {
    return { isValid: false, errors: ['Template is required'] };
  }

  // Check for unclosed variable delimiters
  const hashCount = (template.match(/#/g) || []).length;
  
  // Count should be even (pairs of #)
  if (hashCount % 2 !== 0) {
    errors.push('Unclosed variable delimiter (#) found');
  }

  // Check for empty variable names
  const emptyVars = template.match(/##/g);
  if (emptyVars) {
    errors.push(`Empty variable name found (${emptyVars.length} occurrence(s))`);
  }

  // Check for invalid characters in variable names
  const variableMatches = template.match(VARIABLE_PATTERN);
  if (variableMatches) {
    variableMatches.forEach((match) => {
      const varName = match.slice(1, -1);
      // Variable name should not be empty and should be reasonably short
      if (varName.length > 100) {
        errors.push(`Variable name too long: "${varName}" (max 100 characters)`);
      }
    });
  }

  // Check for hash characters that are not part of variables
  // This is a simple heuristic - # followed by space or at end of string might be accidental
  const lines = template.split('\n');
  lines.forEach((line, index) => {
    // Check for lone # at end of line
    if (line.trim().endsWith('#') && !line.trim().endsWith('##')) {
      errors.push(`Line ${index + 1}: Lone # at end of line may be accidental`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get positions of variables in a template (useful for highlighting)
 * @param {string} template - Command template
 * @returns {Array<{name: string, start: number, end: number}>} Variable positions
 */
export const getVariablePositions = (template) => {
  if (!template || typeof template !== 'string') {
    return [];
  }

  const positions = [];
  let match;
  const regex = new RegExp(VARIABLE_PATTERN.source, 'g');

  while ((match = regex.exec(template)) !== null) {
    positions.push({
      name: match[1],
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return positions;
};

/**
 * Create a default variable configuration from a parsed variable name
 * @param {string} name - Variable name
 * @returns {Object} Default variable configuration
 */
export const createDefaultVariable = (name) => {
  return {
    name,
    inputType: 'text',
    defaultValue: '',
    dataSourceId: null,
    inlineValues: null,
  };
};

/**
 * Detect variable types based on common naming patterns
 * @param {string} name - Variable name
 * @returns {string} Suggested input type
 */
export const detectVariableType = (name) => {
  const lowerName = name.toLowerCase();
  
  // Check for number-related patterns
  if (lowerName.includes('port') || 
      lowerName.includes('count') || 
      lowerName.includes('number') ||
      lowerName.includes('id') ||
      lowerName.includes('num') ||
      lowerName.includes('index')) {
    return 'number';
  }
  
  // Check for dropdown-related patterns
  if (lowerName.includes('env') || 
      lowerName.includes('type') || 
      lowerName.includes('mode') ||
      lowerName.includes('option') ||
      lowerName.includes('status') ||
      lowerName.includes('flag')) {
    return 'dropdown';
  }
  
  return 'text';
};

/**
 * Format a variable name into a user-friendly label
 * Splits on underscores and capitalizes each word
 * @param {string} name - Variable name (e.g., 'output_file')
 * @returns {string} Formatted label (e.g., 'Output File:')
 * 
 * @example
 * formatVariableLabel('output_file') // Returns: 'Output File:'
 * formatVariableLabel('userName') // Returns: 'UserName:'
 * formatVariableLabel('port_number') // Returns: 'Port Number:'
 */
export const formatVariableLabel = (name) => {
  if (!name || typeof name !== 'string') {
    return '';
  }
  
  // Split on underscores and capitalize first letter of each word
  const formatted = name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  return `${formatted}:`;
};
