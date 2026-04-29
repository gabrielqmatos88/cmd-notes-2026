// useHistory Hook
// Custom hook for managing command history

import { useState, useCallback, useEffect } from 'react';
import StorageService from '../services/storageService';

function useHistory() {
  const [history, setHistory] = useState([]);
  const [settings, setSettings] = useState(() => StorageService.getSettings());

  // Load history from storage
  const loadHistory = useCallback(() => {
    const entries = StorageService.getHistory();
    setHistory(entries);
  }, []);

  // Load settings
  const loadSettings = useCallback(() => {
    const appSettings = StorageService.getSettings();
    setSettings(appSettings);
  }, []);

  // Initial load
  useEffect(() => {
    loadHistory();
    loadSettings();
  }, [loadHistory, loadSettings]);

  // Add new history entry
  const addToHistory = useCallback((entry) => {
    const newEntry = StorageService.addToHistory(entry);
    setHistory(prev => {
      const updated = [newEntry, ...prev];
      return updated.slice(0, settings.maxHistoryItems);
    });
    return newEntry;
  }, [settings.maxHistoryItems]);

  // Clear all history
  const clearHistory = useCallback(() => {
    StorageService.clearHistory();
    setHistory([]);
  }, []);

  // Delete single history entry
  const deleteEntry = useCallback((entryId) => {
    StorageService.deleteHistoryEntry(entryId);
    setHistory(prev => prev.filter(h => h.id !== entryId));
  }, []);

  // Toggle history enabled setting
  const toggleHistoryEnabled = useCallback(() => {
    const newSettings = { ...settings, historyEnabled: !settings.historyEnabled };
    StorageService.saveSettings(newSettings);
    setSettings(newSettings);
    return newSettings.historyEnabled;
  }, [settings]);

  // Set max history items
  const setMaxHistoryItems = useCallback((maxItems) => {
    const newSettings = { ...settings, maxHistoryItems: maxItems };
    StorageService.saveSettings(newSettings);
    setSettings(newSettings);
  }, [settings]);

  // Get command for history entry
  const getCommandForEntry = useCallback((commandId) => {
    return StorageService.getCommandById(commandId);
  }, []);

  // Format timestamp for display
  const formatTimestamp = useCallback((timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // Less than a minute
    if (diff < 60000) {
      return 'Just now';
    }
    
    // Less than an hour
    if (diff < 3600000) {
      const mins = Math.floor(diff / 60000);
      return `${mins} min${mins > 1 ? 's' : ''} ago`;
    }
    
    // Less than a day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    // Less than a week
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    
    // Default to formatted date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: 'numeric',
      minute: '2-digit',
    });
  }, []);

  // Copy to clipboard
  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  }, []);

  return {
    history,
    settings,
    loadHistory,
    addToHistory,
    clearHistory,
    deleteEntry,
    toggleHistoryEnabled,
    setMaxHistoryItems,
    getCommandForEntry,
    formatTimestamp,
    copyToClipboard,
  };
}

export default useHistory;