// CMD-Notes Application
// Main application component

import { useState, useCallback, useEffect } from 'react';
import AppLayout from './components/layout/AppLayout';
import CommandForm from './components/commands/CommandForm';
import VariableConfig from './components/commands/VariableConfig';
import CommandExecutor from './components/commands/CommandExecutor';
import DataSourceList from './components/datasources/DataSourceList';
import CommandHistory from './components/history/CommandHistory';
import ConfirmModal from './components/common/ConfirmModal';
import EmptyState from './components/common/EmptyState';
import ExportModal from './components/modals/ExportModal';
import ImportModal from './components/modals/ImportModal';
import ShareLinkModal from './components/modals/ShareLinkModal';
import ShareLinkImport from './components/modals/ShareLinkImport';
import ToolsScreen from './components/tools/ToolsScreen';
import StorageService from './services/storageService';
import { parseUrlForImport } from './utils/urlEncoder';
import './styles/main.scss';

// Screen types
const SCREENS = {
  WELCOME: 'welcome',
  COMMAND_LIST: 'commandList',
  COMMAND_FORM: 'commandForm',
  VARIABLE_CONFIG: 'variableConfig',
  COMMAND_EXECUTOR: 'commandExecutor',
  DATA_SOURCES: 'dataSources',
  HISTORY: 'history',
  TOOLS: 'tools',
};

function App() {
  // Data state - initialize directly from storage
  const [commands, setCommands] = useState(() => StorageService.getCommands());
  const [dataSources, setDataSources] = useState(() => StorageService.getDataSources());
  const [history, setHistory] = useState(() => StorageService.getHistory());

  // UI state
  const [selectedView, setSelectedView] = useState('commands');
  const [currentScreen, setCurrentScreen] = useState(SCREENS.WELCOME);
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [commandToDelete, setCommandToDelete] = useState(null);
  const [tempCommandData, setTempCommandData] = useState(null);
  const [startDataSourceCreating, setStartDataSourceCreating] = useState(false);

  // Modal state
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCommand, setShareCommand] = useState(null);
  const [showShareLinkImport, setShowShareLinkImport] = useState(false);

  // Load data from storage
  const loadData = useCallback(() => {
    const loadedCommands = StorageService.getCommands();
    const loadedDataSources = StorageService.getDataSources();
    const loadedHistory = StorageService.getHistory();
    setCommands(loadedCommands);
    setDataSources(loadedDataSources);
    setHistory(loadedHistory);
  }, []);

  // Get recent history for a specific command (last 3 entries)
  const getRecentHistoryForCommand = useCallback((commandId) => {
    return history
      .filter(entry => entry.commandId === commandId)
      .slice(0, 3);
  }, [history]);

  // Handle use recent history entry
  const handleUseRecentHistory = useCallback((entry) => {
    // Populate form with previous values
    setTempCommandData({ _previousValues: entry.values });
  }, []);

  // Check for shareable link import on app mount
  useEffect(() => {
    const importData = parseUrlForImport();
    if (importData && importData.name && importData.template) {
      setShowShareLinkImport(true);
    }
  }, []);

  // Handle import from shareable link
  const handleImportFromShareLink = useCallback((data) => {
    try {
      const savedCommand = StorageService.importFromShareLink(data);
      loadData();
      setSelectedCommand(savedCommand);
      setCurrentScreen(SCREENS.COMMAND_EXECUTOR);
    } catch (error) {
      alert(`Import failed: ${error.message}`);
    }
  }, [loadData]);

  // Handle view selection
  const handleSelectView = useCallback((view) => {
    setSelectedView(view);
    setTempCommandData(null); // Clear temp data when switching views
    if (view === 'dataSources') {
      setCurrentScreen(SCREENS.DATA_SOURCES);
    } else if (view === 'history') {
      setCurrentScreen(SCREENS.HISTORY);
    } else if (view === 'tools') {
      setCurrentScreen(SCREENS.TOOLS);
    } else {
      setCurrentScreen(SCREENS.WELCOME);
    }
    setSelectedCommand(null);
  }, []);

  // Handle new command
  const handleNewCommand = useCallback(() => {
    setTempCommandData(null); // Clear any stale data
    setSelectedCommand(null);
    setCurrentScreen(SCREENS.COMMAND_FORM);
  }, []);

  // Handle new data source
  const handleNewDataSource = useCallback(() => {
    setStartDataSourceCreating(true);
    setCurrentScreen(SCREENS.DATA_SOURCES);
  }, []);

  // Handle select command (from sidebar)
  const handleSelectCommand = useCallback((command) => {
    setTempCommandData(null); // Clear temp data when selecting command
    setSelectedCommand(command);
    setCurrentScreen(SCREENS.COMMAND_EXECUTOR);
  }, []);

  // Handle back to list
  const handleBackToList = useCallback(() => {
    setTempCommandData(null);
    setSelectedCommand(null);
    setCurrentScreen(SCREENS.WELCOME);
    loadData();
  }, [loadData]);

  // Handle cancel form
  const handleCancelForm = useCallback(() => {
    setTempCommandData(null);
    if (selectedCommand) {
      setCurrentScreen(SCREENS.COMMAND_EXECUTOR);
    } else {
      setCurrentScreen(SCREENS.WELCOME);
    }
  }, [selectedCommand]);

  // Handle save command (from form)
  const handleSaveCommand = useCallback((commandData) => {
    const savedCommand = StorageService.saveCommand({
      ...commandData,
      variables: tempCommandData?.variables || [],
    });
    setTempCommandData(null);
    setSelectedCommand(savedCommand);
    loadData();
    setCurrentScreen(SCREENS.COMMAND_EXECUTOR);
  }, [tempCommandData, loadData]);

  // Handle setup variables (from form)
  const handleSetupVariables = useCallback((commandData) => {
    setTempCommandData(commandData); // This clears and sets new data
    setCurrentScreen(SCREENS.VARIABLE_CONFIG);
  }, []);

  // Handle save with variables (from variable config)
  const handleSaveWithVariables = useCallback((commandData) => {
    const savedCommand = StorageService.saveCommand({
      ...commandData,
      variables: commandData.variables || [],
    });
    setTempCommandData(null);
    setSelectedCommand(savedCommand);
    loadData();
    setCurrentScreen(SCREENS.COMMAND_EXECUTOR);
  }, [loadData]);

  // Handle cancel variable config
  const handleCancelVariableConfig = useCallback(() => {
    setTempCommandData(null); // Clear temp data when cancelling
    setCurrentScreen(SCREENS.COMMAND_FORM);
  }, []);

  // Handle edit command
  const handleEditCommand = useCallback(() => {
    setTempCommandData(null); // Clear temp data when editing
    setCurrentScreen(SCREENS.COMMAND_FORM);
  }, []);

  // Handle delete command
  const handleDeleteCommand = useCallback((command) => {
    setCommandToDelete(command);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (commandToDelete) {
      StorageService.deleteCommand(commandToDelete.id);
      setCommandToDelete(null);
      if (selectedCommand?.id === commandToDelete.id) {
        setSelectedCommand(null);
        setCurrentScreen(SCREENS.WELCOME);
      }
      loadData();
    }
  }, [commandToDelete, selectedCommand, loadData]);

  const handleCloseDeleteModal = useCallback(() => {
    setCommandToDelete(null);
  }, []);

  // Handle command execution (add to history)
  const handleExecuteCommand = useCallback((execution) => {
    StorageService.addToHistory({
      commandId: execution.commandId,
      values: execution.values,
      generatedCommand: execution.generatedCommand,
    });
    // Refresh history so recent commands list updates
    setHistory(StorageService.getHistory());
  }, []);

  // Data Source handlers
  const handleSaveDataSource = useCallback((dataSource) => {
    StorageService.saveDataSource(dataSource);
    loadData();
  }, [loadData]);

  const handleDeleteDataSource = useCallback((dataSourceId) => {
    // Clear references to this data source in commands
    StorageService.clearDataSourceReferences(dataSourceId);
    // Delete the data source
    StorageService.deleteDataSource(dataSourceId);
    loadData();
  }, [loadData]);

  const handleExportDataSources = useCallback(() => {
    const data = StorageService.exportDataSources();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `datasources-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handleImportDataSources = useCallback((data) => {
    try {
      const result = StorageService.importDataSources(data, true);
      loadData();
      alert(`Successfully imported ${result.importedCount} data source(s).`);
    } catch (error) {
      alert(`Import failed: ${error.message}`);
    }
  }, [loadData]);

  // Handle "Use Again" from history
  const handleUseAgain = useCallback((command, previousValues) => {
    setSelectedCommand(command);
    // Store previous values to pre-fill the executor
    setTempCommandData({ _previousValues: previousValues });
    setCurrentScreen(SCREENS.COMMAND_EXECUTOR);
  }, []);

  // Handle share command
  const handleShareCommand = useCallback((command) => {
    setShareCommand(command);
    setShowShareModal(true);
  }, []);

  // Handle import data
  const handleImportData = useCallback((data, merge) => {
    try {
      StorageService.importAll({ ...data, version: 1 }, merge);
      loadData();
      alert('Import successful!');
    } catch (error) {
      alert(`Import failed: ${error.message}`);
    }
  }, [loadData]);

  // Render content based on current screen
  const renderContent = () => {
    switch (currentScreen) {
      case SCREENS.COMMAND_FORM:
        return (
          <CommandForm
            command={selectedCommand}
            onSave={handleSaveCommand}
            onCancel={handleCancelForm}
            onSetupVariables={handleSetupVariables}
          />
        );

      case SCREENS.VARIABLE_CONFIG:
        return (
          <VariableConfig
            commandData={tempCommandData}
            existingVariables={selectedCommand?.variables || []}
            dataSources={dataSources}
            onSave={handleSaveWithVariables}
            onCancel={handleCancelVariableConfig}
          />
        );

      case SCREENS.COMMAND_EXECUTOR:
        return (
          <CommandExecutor
            command={selectedCommand}
            dataSources={dataSources}
            initialValues={tempCommandData?._previousValues}
            onExecute={handleExecuteCommand}
            onEdit={handleEditCommand}
            onBack={handleBackToList}
            onShare={handleShareCommand}
            recentHistory={getRecentHistoryForCommand(selectedCommand?.id)}
            onUseRecentHistory={handleUseRecentHistory}
          />
        );

      case SCREENS.DATA_SOURCES:
        return (
          <DataSourceList
            dataSources={dataSources}
            onSave={handleSaveDataSource}
            onDelete={handleDeleteDataSource}
            onExport={handleExportDataSources}
            onImport={handleImportDataSources}
            startCreating={startDataSourceCreating}
            onCreatingHandled={() => setStartDataSourceCreating(false)}
          />
        );

      case SCREENS.HISTORY:
        return (
          <CommandHistory
            onUseAgain={handleUseAgain}
          />
        );

      case SCREENS.TOOLS:
        return <ToolsScreen />;

      case SCREENS.WELCOME:
      default:
        return (
          <EmptyState
            icon="terminal"
            title="Welcome to CMD-Notes"
            description="Select a command from the sidebar or create a new one to get started."
            action={{
              label: 'Create Command',
              onClick: handleNewCommand,
            }}
          />
        );
    }
  };

  const showWelcome = currentScreen === SCREENS.WELCOME;

  return (
    <>
      <AppLayout
        commands={commands}
        dataSources={dataSources}
        selectedView={selectedView}
        onSelectView={handleSelectView}
        selectedCommand={selectedCommand}
        onSelectCommand={handleSelectCommand}
        onNewCommand={handleNewCommand}
        onNewDataSource={handleNewDataSource}
        onDeleteCommand={handleDeleteCommand}
        onShareCommand={handleShareCommand}
        onExport={() => setShowExportModal(true)}
        onImport={() => setShowImportModal(true)}
        showWelcome={showWelcome}
      >
        {renderContent()}
      </AppLayout>

      <ConfirmModal
        isOpen={!!commandToDelete}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Command"
        message={`Are you sure you want to delete "${commandToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        commands={commands}
        dataSources={dataSources}
      />

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportData}
      />

      <ShareLinkModal
        isOpen={showShareModal}
        onClose={() => {
          setShowShareModal(false);
          setShareCommand(null);
        }}
        command={shareCommand}
      />

      <ShareLinkImport
        isOpen={showShareLinkImport}
        onClose={() => setShowShareLinkImport(false)}
        onImport={handleImportFromShareLink}
      />
    </>
  );
}

export default App;