// LocalStorage Service for CMD-Notes
// Handles all data persistence operations

import { StorageKeys, DefaultSettings } from '../types';

// Helper function to generate UUID
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Generic storage operations
const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error reading from storage (${key}):`, error);
    return null;
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving to storage (${key}):`, error);
    // Check for quota exceeded
    if (error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Please delete some commands or data sources.', { cause: error });
    }
    return false;
  }
};

/**
 * StorageService class for managing all localStorage operations
 */
class StorageService {
  // ============ Commands ============
  
  /**
   * Get all commands from storage
   * @returns {Array} Array of commands
   */
  static getCommands() {
    return getFromStorage(StorageKeys.COMMANDS) || [];
  }

  /**
   * Save a command (create or update)
   * @param {Object} command - Command object
   * @returns {Object} Saved command with id
   */
  static saveCommand(command) {
    const commands = this.getCommands();
    const now = Date.now();
    
    if (command.id) {
      // Update existing command
      const index = commands.findIndex((c) => c.id === command.id);
      if (index !== -1) {
        const updatedCommand = {
          ...commands[index],
          ...command,
          updatedAt: now,
        };
        commands[index] = updatedCommand;
        saveToStorage(StorageKeys.COMMANDS, commands);
        return updatedCommand;
      }
    }
    
    // Create new command
    const newCommand = {
      ...command,
      id: command.id || generateId(),
      createdAt: command.createdAt || now,
      updatedAt: now,
    };
    commands.push(newCommand);
    saveToStorage(StorageKeys.COMMANDS, commands);
    return newCommand;
  }

  /**
   * Delete a command by id
   * @param {string} id - Command id
   * @returns {boolean} Success status
   */
  static deleteCommand(id) {
    const commands = this.getCommands();
    const filtered = commands.filter((c) => c.id !== id);
    if (filtered.length !== commands.length) {
      saveToStorage(StorageKeys.COMMANDS, filtered);
      return true;
    }
    return false;
  }

  /**
   * Get a single command by id
   * @param {string} id - Command id
   * @returns {Object|null} Command object or null
   */
  static getCommandById(id) {
    const commands = this.getCommands();
    return commands.find((c) => c.id === id) || null;
  }

  // ============ Data Sources ============

  /**
   * Get all data sources from storage
   * @returns {Array} Array of data sources
   */
  static getDataSources() {
    return getFromStorage(StorageKeys.DATA_SOURCES) || [];
  }

  /**
   * Save a data source (create or update)
   * @param {Object} dataSource - Data source object
   * @returns {Object} Saved data source with id
   */
  static saveDataSource(dataSource) {
    const dataSources = this.getDataSources();
    
    if (dataSource.id) {
      // Update existing data source
      const index = dataSources.findIndex((ds) => ds.id === dataSource.id);
      if (index !== -1) {
        const updated = {
          ...dataSources[index],
          ...dataSource,
        };
        dataSources[index] = updated;
        saveToStorage(StorageKeys.DATA_SOURCES, dataSources);
        return updated;
      }
    }
    
    // Create new data source
    const newDataSource = {
      ...dataSource,
      id: dataSource.id || generateId(),
    };
    dataSources.push(newDataSource);
    saveToStorage(StorageKeys.DATA_SOURCES, dataSources);
    return newDataSource;
  }

  /**
   * Delete a data source by id
   * @param {string} id - Data source id
   * @returns {boolean} Success status
   */
  static deleteDataSource(id) {
    const dataSources = this.getDataSources();
    const filtered = dataSources.filter((ds) => ds.id !== id);
    if (filtered.length !== dataSources.length) {
      saveToStorage(StorageKeys.DATA_SOURCES, filtered);
      return true;
    }
    return false;
  }

  /**
   * Get a single data source by id
   * @param {string} id - Data source id
   * @returns {Object|null} Data source object or null
   */
  static getDataSourceById(id) {
    const dataSources = this.getDataSources();
    return dataSources.find((ds) => ds.id === id) || null;
  }

  // ============ History ============

  /**
   * Get command history from storage
   * @returns {Array} Array of history entries
   */
  static getHistory() {
    return getFromStorage(StorageKeys.HISTORY) || [];
  }

  /**
   * Add a new history entry
   * @param {Object} entry - History entry
   * @returns {Object} Added history entry
   */
  static addToHistory(entry) {
    const history = this.getHistory();
    const settings = this.getSettings();
    
    const newEntry = {
      ...entry,
      id: generateId(),
      timestamp: Date.now(),
    };
    
    // Add new entry at the beginning
    history.unshift(newEntry);
    
    // Limit history to max items
    const limitedHistory = history.slice(0, settings.maxHistoryItems);
    saveToStorage(StorageKeys.HISTORY, limitedHistory);
    
    return newEntry;
  }

  /**
   * Clear all history
   * @returns {boolean} Success status
   */
  static clearHistory() {
    saveToStorage(StorageKeys.HISTORY, []);
    return true;
  }

  /**
   * Delete a single history entry
   * @param {string} id - History entry id
   * @returns {boolean} Success status
   */
  static deleteHistoryEntry(id) {
    const history = this.getHistory();
    const filtered = history.filter((h) => h.id !== id);
    if (filtered.length !== history.length) {
      saveToStorage(StorageKeys.HISTORY, filtered);
      return true;
    }
    return false;
  }

  // ============ Settings ============

  /**
   * Get app settings from storage
   * @returns {Object} App settings
   */
  static getSettings() {
    return getFromStorage(StorageKeys.SETTINGS) || DefaultSettings;
  }

  /**
   * Save app settings
   * @param {Object} settings - Settings object
   * @returns {Object} Saved settings
   */
  static saveSettings(settings) {
    const current = this.getSettings();
    const merged = { ...current, ...settings };
    saveToStorage(StorageKeys.SETTINGS, merged);
    return merged;
  }

  // ============ Import/Export ============

  /**
   * Export all data for backup
   * @returns {Object} All data for export
   */
  static exportAll() {
    return {
      version: 1,
      exportedAt: Date.now(),
      commands: this.getCommands(),
      dataSources: this.getDataSources(),
      settings: this.getSettings(),
    };
  }

  /**
   * Import data from backup
   * @param {Object} data - Import data
   * @param {boolean} merge - Whether to merge with existing data
   */
  static importAll(data, merge = false) {
    if (!data || data.version !== 1) {
      throw new Error('Invalid import data format');
    }

    if (merge) {
      // Merge commands (avoid duplicates by id)
      const existingCommands = this.getCommands();
      const existingIds = new Set(existingCommands.map((c) => c.id));
      const newCommands = data.commands.filter((c) => !existingIds.has(c.id));
      saveToStorage(StorageKeys.COMMANDS, [...existingCommands, ...newCommands]);

      // Merge data sources
      const existingDS = this.getDataSources();
      const existingDSIds = new Set(existingDS.map((ds) => ds.id));
      const newDS = data.dataSources.filter((ds) => !existingDSIds.has(ds.id));
      saveToStorage(StorageKeys.DATA_SOURCES, [...existingDS, ...newDS]);
    } else {
      // Replace all data
      if (data.commands) saveToStorage(StorageKeys.COMMANDS, data.commands);
      if (data.dataSources) saveToStorage(StorageKeys.DATA_SOURCES, data.dataSources);
    }

    if (data.settings && !merge) {
      saveToStorage(StorageKeys.SETTINGS, data.settings);
    }
  }

  /**
   * Clear all data (factory reset)
   */
  static clearAll() {
    localStorage.removeItem(StorageKeys.COMMANDS);
    localStorage.removeItem(StorageKeys.DATA_SOURCES);
    localStorage.removeItem(StorageKeys.HISTORY);
    localStorage.removeItem(StorageKeys.SETTINGS);
  }
}

export default StorageService;
