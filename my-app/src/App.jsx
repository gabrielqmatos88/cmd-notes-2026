// CMD-Notes Application
// Main application component

import { useState, useCallback } from 'react';
import AppLayout from './components/layout/AppLayout';
import CommandForm from './components/commands/CommandForm';
import VariableConfig from './components/commands/VariableConfig';
import CommandExecutor from './components/commands/CommandExecutor';
import DataSourceList from './components/datasources/DataSourceList';
import ConfirmModal from './components/common/ConfirmModal';
import EmptyState from './components/common/EmptyState';
import StorageService from './services/storageService';
import './styles/main.scss';

// Screen types
const SCREENS = {
  WELCOME: 'welcome',
  COMMAND_LIST: 'commandList',
  COMMAND_FORM: 'commandForm',
  VARIABLE_CONFIG: 'variableConfig',
  COMMAND_EXECUTOR: 'commandExecutor',
  DATA_SOURCES: 'dataSources',
};

function App() {
  // Data state - initialize directly from storage
  const [commands, setCommands] = useState(() => StorageService.getCommands());
  const [dataSources, setDataSources] = useState(() => StorageService.getDataSources());

  // UI state
  const [selectedView, setSelectedView] = useState('commands');
  const [currentScreen, setCurrentScreen] = useState(SCREENS.WELCOME);
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [commandToDelete, setCommandToDelete] = useState(null);
  const [tempCommandData, setTempCommandData] = useState(null);

  // Load data from storage
  const loadData = useCallback(() => {
    const loadedCommands = StorageService.getCommands();
    const loadedDataSources = StorageService.getDataSources();
    setCommands(loadedCommands);
    setDataSources(loadedDataSources);
  }, []);

  // Handle view selection
  const handleSelectView = useCallback((view) => {
    setSelectedView(view);
    if (view === 'dataSources') {
      setCurrentScreen(SCREENS.DATA_SOURCES);
    } else {
      setCurrentScreen(SCREENS.WELCOME);
    }
    setSelectedCommand(null);
  }, []);

  // Handle new command
  const handleNewCommand = useCallback(() => {
    setSelectedCommand(null);
    setCurrentScreen(SCREENS.COMMAND_FORM);
  }, []);

  // Handle new data source
  const handleNewDataSource = useCallback(() => {
    setCurrentScreen(SCREENS.DATA_SOURCES);
  }, []);

  // Handle select command (from sidebar)
  const handleSelectCommand = useCallback((command) => {
    setSelectedCommand(command);
    setCurrentScreen(SCREENS.COMMAND_EXECUTOR);
  }, []);

  // Handle back to list
  const handleBackToList = useCallback(() => {
    setSelectedCommand(null);
    setCurrentScreen(SCREENS.COMMAND_LIST);
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
    setTempCommandData(commandData);
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
    setCurrentScreen(SCREENS.COMMAND_FORM);
  }, []);

  // Handle edit command
  const handleEditCommand = useCallback(() => {
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
            onExecute={handleExecuteCommand}
            onEdit={handleEditCommand}
            onBack={handleBackToList}
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
          />
        );

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
    </>
  );
}

export default App;