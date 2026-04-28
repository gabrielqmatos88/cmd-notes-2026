// Validators Utility
// Additional validation functions for data integrity

/**
 * Validate command name
 * @param {string} name - Command name
 * @returns {Object} Validation result
 */
export const validateCommandName = (name) => {
  const errors = [];

  if (!name || typeof name !== 'string') {
    errors.push('Command name is required');
    return { isValid: false, errors };
  }

  const trimmed = name.trim();
  
  if (trimmed.length === 0) {
    errors.push('Command name cannot be empty');
  }

  if (trimmed.length > 100) {
    errors.push('Command name is too long (max 100 characters)');
  }

  if (trimmed.length < 2) {
    errors.push('Command name is too short (min 2 characters)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: trimmed,
  };
};

/**
 * Validate command template
 * @param {string} template - Command template
 * @returns {Object} Validation result
 */
export const validateCommandTemplate = (template) => {
  const errors = [];

  if (!template || typeof template !== 'string') {
    errors.push('Command template is required');
    return { isValid: false, errors };
  }

  const trimmed = template.trim();
  
  if (trimmed.length === 0) {
    errors.push('Command template cannot be empty');
  }

  // Check if template contains at least one variable
  const hasVariable = /#[^#]+#/.test(trimmed);
  if (!hasVariable) {
    errors.push('Command template should contain at least one variable (#variable#)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: trimmed,
  };
};

/**
 * Validate data source name
 * @param {string} name - Data source name
 * @returns {Object} Validation result
 */
export const validateDataSourceName = (name) => {
  const errors = [];

  if (!name || typeof name !== 'string') {
    errors.push('Data source name is required');
    return { isValid: false, errors };
  }

  const trimmed = name.trim();
  
  if (trimmed.length === 0) {
    errors.push('Data source name cannot be empty');
  }

  if (trimmed.length > 50) {
    errors.push('Data source name is too long (max 50 characters)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: trimmed,
  };
};

/**
 * Validate data source values (CSV format)
 * @param {string} valuesString - Comma or semicolon separated values
 * @returns {Object} Validation result
 */
export const validateDataSourceValues = (valuesString) => {
  const errors = [];

  if (!valuesString || typeof valuesString !== 'string') {
    errors.push('At least one value is required');
    return { isValid: false, errors };
  }

  // Split by comma or semicolon
  const values = valuesString
    .split(/[,;]/)
    .map((v) => v.trim())
    .filter((v) => v.length > 0);

  if (values.length === 0) {
    errors.push('At least one value is required');
    return { isValid: false, errors };
  }

  if (values.length > 100) {
    errors.push('Too many values (max 100)');
  }

  // Check for duplicate values
  const uniqueValues = [...new Set(values)];
  if (uniqueValues.length !== values.length) {
    errors.push('Duplicate values found');
  }

  return {
    isValid: errors.length === 0,
    errors,
    values,
    value: values.join(', '),
  };
};

/**
 * Validate import JSON data
 * @param {string} jsonString - JSON string to validate
 * @returns {Object} Validation result with parsed data
 */
export const validateImportData = (jsonString) => {
  const errors = [];

  if (!jsonString || typeof jsonString !== 'string') {
    errors.push('Import data is required');
    return { isValid: false, errors, data: null };
  }

  let data;
  try {
    data = JSON.parse(jsonString);
  } catch {
    errors.push('Invalid JSON format');
    return { isValid: false, errors, data: null };
  }

  // Check for required structure
  if (data.version !== 1) {
    errors.push('Unsupported import version');
  }

  if (!data.commands && !data.dataSources) {
    errors.push('Import data must contain commands or data sources');
  }

  // Validate command structure if present
  if (data.commands) {
    if (!Array.isArray(data.commands)) {
      errors.push('Commands must be an array');
    } else {
      data.commands.forEach((cmd, index) => {
        if (!cmd.name) {
          errors.push(`Command at index ${index} is missing a name`);
        }
        if (!cmd.template) {
          errors.push(`Command "${cmd.name || index}" is missing a template`);
        }
      });
    }
  }

  // Validate data source structure if present
  if (data.dataSources) {
    if (!Array.isArray(data.dataSources)) {
      errors.push('Data sources must be an array');
    } else {
      data.dataSources.forEach((ds, index) => {
        if (!ds.name) {
          errors.push(`Data source at index ${index} is missing a name`);
        }
        if (!ds.values || !Array.isArray(ds.values)) {
          errors.push(`Data source "${ds.name || index}" is missing values array`);
        }
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    data,
  };
};

/**
 * Validate inline values for dropdown variable
 * @param {string} valuesString - Semicolon or comma separated values
 * @returns {Object} Validation result
 */
export const validateInlineValues = (valuesString) => {
  const errors = [];

  if (!valuesString || typeof valuesString !== 'string') {
    errors.push('At least one value is required');
    return { isValid: false, errors };
  }

  const values = valuesString
    .split(/[;,]/)
    .map((v) => v.trim())
    .filter((v) => v.length > 0);

  if (values.length === 0) {
    errors.push('At least one value is required');
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors,
    values,
  };
};

/**
 * Sanitize string input to prevent XSS
 * @param {string} input - Input string
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
};
