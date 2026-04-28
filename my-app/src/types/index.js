// Type Definitions for CMD-Notes

/**
 * Input types for command variables
 * @typedef {'text' | 'number' | 'dropdown'} InputType
 */

/**
 * Variable configuration for a command
 * @typedef {Object} Variable
 * @property {string} name - Variable name (without #)
 * @property {InputType} inputType - Type of input field
 * @property {string | number} defaultValue - Default value for the variable
 * @property {string | null} dataSourceId - Reference to global data source
 * @property {string[] | null} inlineValues - Inline values for dropdown type
 */

/**
 * Global data source for dropdown options
 * @typedef {Object} DataSource
 * @property {string} id - Unique identifier (UUID)
 * @property {string} name - Display name
 * @property {string[]} values - List of values for dropdown
 */

/**
 * Command template with variables
 * @typedef {Object} Command
 * @property {string} id - Unique identifier (UUID)
 * @property {string} name - Display name
 * @property {string} description - Optional description
 * @property {string} template - Command template with #variables#
 * @property {Variable[]} variables - Variable configurations
 * @property {number} createdAt - Creation timestamp
 * @property {number} updatedAt - Last update timestamp
 */

/**
 * History entry for generated commands
 * @typedef {Object} CommandHistory
 * @property {string} id - Unique identifier (UUID)
 * @property {string} commandId - Reference to command
 * @property {Object<string, string | number>} values - Variable values used
 * @property {string} generatedCommand - Final generated command
 * @property {number} timestamp - Generation timestamp
 */

/**
 * Application settings
 * @typedef {Object} AppSettings
 * @property {boolean} historyEnabled - Whether history is enabled
 * @property {number} maxHistoryItems - Maximum number of history entries (default: 5)
 */

// Export as empty objects (JSDoc-only file for type hints)
// The actual implementation uses these as TypeScript-style interfaces

export const InputTypes = {
  TEXT: 'text',
  NUMBER: 'number',
  DROPDOWN: 'dropdown',
};

export const StorageKeys = {
  COMMANDS: 'cmdnotes_commands',
  DATA_SOURCES: 'cmdnotes_datasources',
  HISTORY: 'cmdnotes_history',
  SETTINGS: 'cmdnotes_settings',
};

export const DefaultSettings = {
  historyEnabled: true,
  maxHistoryItems: 5,
};
