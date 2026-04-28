# CMD-Notes Development Plan

## Project Overview

**CMD-Notes** is a command line snippet manager tool that allows users to create, manage, and use command templates with dynamic variable substitution.

### Key Features
- Create command templates with `#variable#` syntax
- Configure input types (text, number, dropdown) for each variable
- Support global and embedded data sources for dropdown options
- Generate commands by filling in variable values
- Copy generated commands to clipboard
- Store history of last 5 generated commands (configurable)
- Import/Export commands as JSON files
- Share commands via shareable links (URL-encoded)
- Built-in tools: MD5 and SHA-256 hash generators

### Tech Stack
- **Frontend**: React with Vite
- **Styling**: Sass/SCSS
- **Storage**: LocalStorage
- **No mobile optimization** (desktop-first, responsive design)

---

## Development Phases

---

### Phase 1: Project Foundation

#### 1.1 Project Setup
- [x] Initialize Vite React project
- [x] Install and configure Sass/SCSS
- [x] Setup ESLint and Prettier
- [x] Create folder structure:
  ```
  src/
  ├── components/
  │   ├── layout/
  │   ├── commands/
  │   ├── inputs/
  │   └── common/
  ├── services/
  ├── hooks/
  ├── types/
  ├── utils/
  └── styles/
  ```

#### 1.2 Design System
- [x] Define color palette (primary, secondary, accent, background, text)
- [x] Create typography system (fonts, sizes, weights)
- [x] Define spacing scale and layout constants
- [x] Create common utility classes
- [x] Setup responsive breakpoints

---

### Phase 2: Core Infrastructure

#### 2.1 Type Definitions
- [x] Define `Variable` interface (name, inputType, defaultValue, dataSource)
- [x] Define `DataSource` interface (id, name, values[])
- [x] Define `Command` interface (id, name, description, template, variables[], createdAt, updatedAt)
- [x] Define `CommandHistory` interface (id, commandId, generatedCommand, timestamp)
- [x] Define `AppSettings` interface (historyEnabled, maxHistoryItems)

#### 2.2 LocalStorage Service
- [x] Create storage keys constants
- [x] Implement `StorageService` class with methods:
  - `getCommands()`: Get all commands
  - `saveCommand(command)`: Create or update command
  - `deleteCommand(id)`: Remove command
  - `getDataSources()`: Get all data sources
  - `saveDataSource(source)`: Create or update data source
  - `deleteDataSource(id)`: Remove data source
  - `getHistory()`: Get command generation history
  - `addToHistory(entry)`: Add history entry
  - `clearHistory()`: Clear all history
  - `getSettings()`: Get app settings
  - `saveSettings(settings)`: Update settings

#### 2.3 Utility Functions
- [x] Implement `parseVariables(template)`: Extract #variable# names from template
- [x] Implement `replaceVariables(template, values)`: Substitute variables with values
- [x] Implement `encodeForUrl(data)`: Base64 encode for shareable links
- [x] Implement `decodeFromUrl(encoded)`: Decode shareable link data
- [x] Implement `validateTemplate(template)`: Check for malformed variables

#### 2.4 Basic Layout Components
- [x] Create `Header` component (app title, navigation)
- [x] Create `Sidebar` component (commands list, data sources, tools)
- [x] Create `MainContent` component (dynamic content area)
- [x] Create `AppLayout` wrapper component

---

### Phase 3: Command Management

#### 3.1 Command List View
- [ ] Create `CommandList` component
- [ ] Display all commands in sidebar/list
- [ ] Add search/filter functionality
- [ ] Add sorting options (recent, alphabetical)
- [ ] Implement delete command with confirmation

#### 3.2 Create/Edit Command Screen
- [ ] Create `CommandForm` component
- [ ] Fields: command name, description, template
- [ ] Add "Setup Command" button
- [ ] Implement form validation

#### 3.3 Variable Configuration Screen
- [ ] Auto-detect variables when "Setup Command" is clicked
- [ ] Create `VariableConfig` component for each variable
- [ ] Configure per-variable options:
  - Input type selection (text, number, dropdown)
  - Default value input
  - Data source assignment
- [ ] Support inline values for dropdowns (`value1;value2;value3`)
- [ ] Link to global data sources or create embedded sources
- [ ] Show live preview of generated command

#### 3.4 Command Execution View
- [ ] Create `CommandExecutor` component
- [ ] Render dynamic form based on variable configuration
- [ ] Implement input components per type:
  - `TextInput` for text type
  - `NumberInput` for number type
  - `DropdownSelect` for dropdown type
- [ ] Show generated command in real-time
- [ ] Add "Copy" button with clipboard API
- [ ] Store generated command in history

---

### Phase 4: Data Sources Management

#### 4.1 Data Sources CRUD
- [ ] Create `DataSourceList` component
- [ ] Create/Edit/Delete data sources
- [ ] Data source fields: name, values (CSV format)
- [ ] Parse CSV values (comma or sem-colon separated)

#### 4.2 Data Source Assignment
- [ ] Allow linking variables to global data sources
- [ ] Show available data sources in variable configuration
- [ ] Handle missing/deleted data sources gracefully

#### 4.3 Data Source Import/Export
- [ ] Export data sources as JSON
- [ ] Import data sources from JSON

---

### Phase 5: Command History

#### 5.1 History Management
- [ ] Create `CommandHistory` component
- [ ] Store last 5 generated commands (configurable)
- [ ] Display history entries with timestamp
- [ ] Add "Copy" option for history entries
- [ ] Add "Use Again" option (reopen command with previous values)

#### 5.2 History Settings
- [ ] Add toggle to enable/disable history
- [ ] Add "Clear History" button
- [ ] Persist settings in localStorage

---

### Phase 6: Import/Export & Sharing

#### 6.1 JSON Export
- [ ] Create `ExportModal` component
- [ ] Export single command
- [ ] Export multiple selected commands
- [ ] Export all commands with data sources (no history)
- [ ] Export data sources only
- [ ] Generate downloadable JSON file

#### 6.2 JSON Import
- [ ] Create `ImportModal` component
- [ ] Support file drag & drop
- [ ] Support file picker
- [ ] Support copy/paste JSON
- [ ] Validate imported data structure
- [ ] Handle conflicts (duplicate names/IDs)
- [ ] Merge or replace options

#### 6.3 Shareable Links
- [ ] Create `ShareLinkModal` component
- [ ] Encode single command to URL-safe string
- [ ] Handle URL length limitations (>2000 chars warning)
- [ ] Copy shareable link to clipboard
- [ ] Create import page to parse shareable links

---

### Phase 7: Built-in Tools

#### 7.1 Hash Generators
- [ ] Create `Tools` section in sidebar
- [ ] Create `MD5Generator` component
- [ ] Create `SHA256Generator` component
- [ ] Add text input with hash output
- [ ] Add copy button for hash results

---

### Phase 8: Polish & Edge Cases

#### 8.1 UI/UX Improvements
- [ ] Responsive design refinement
- [ ] Loading states for async operations
- [ ] Empty states with helpful messages
- [ ] Success/error notifications (toast messages)

#### 8.2 Error Handling
- [ ] Validate template syntax
- [ ] Handle localStorage quota exceeded
- [ ] Handle invalid JSON imports
- [ ] Handle corrupted data gracefully

#### 8.3 Keyboard Shortcuts
- [ ] Add copy shortcut (Ctrl+C when command selected)
- [ ] Add search focus shortcut (Ctrl+K or /)
- [ ] Add escape to close modals

#### 8.4 Documentation
- [ ] Add inline help tooltips
- [ ] Create README with usage instructions
- [ ] Document variable syntax

---

## File Structure (Target)

```
d:\cmd-notes\
├── feature_plan\
│   ├── requirements.txt
│   └── plan.md
├── my-app\
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── src\
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── components\
│   │   │   ├── layout\
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── AppLayout.jsx
│   │   │   ├── commands\
│   │   │   │   ├── CommandList.jsx
│   │   │   │   ├── CommandForm.jsx
│   │   │   │   ├── CommandExecutor.jsx
│   │   │   │   └── VariableConfig.jsx
│   │   │   ├── datasources\
│   │   │   │   ├── DataSourceList.jsx
│   │   │   │   └── DataSourceForm.jsx
│   │   │   ├── inputs\
│   │   │   │   ├── TextInput.jsx
│   │   │   │   ├── NumberInput.jsx
│   │   │   │   └── DropdownSelect.jsx
│   │   │   ├── tools\
│   │   │   │   ├── MD5Generator.jsx
│   │   │   │   └── SHA256Generator.jsx
│   │   │   ├── history\
│   │   │   │   └── CommandHistory.jsx
│   │   │   ├── modals\
│   │   │   │   ├── ExportModal.jsx
│   │   │   │   ├── ImportModal.jsx
│   │   │   │   └── ShareLinkModal.jsx
│   │   │   └── common\
│   │   │       ├── Button.jsx
│   │   │       ├── Modal.jsx
│   │   │       ├── Toast.jsx
│   │   │       └── EmptyState.jsx
│   │   ├── services\
│   │   │   ├── storageService.js
│   │   │   └── hashService.js
│   │   ├── hooks\
│   │   │   ├── useCommands.js
│   │   │   ├── useDataSources.js
│   │   │   └── useHistory.js
│   │   ├── utils\
│   │   │   ├── variableParser.js
│   │   │   ├── urlEncoder.js
│   │   │   └── validators.js
│   │   ├── types\
│   │   │   └── index.js
│   │   └── styles\
│   │       ├── _variables.scss
│   │       ├── _mixins.scss
│   │       ├── _typography.scss
│   │       ├── _components.scss
│   │       └── main.scss
│   └── public\
```

---

## Data Models

### Command
```javascript
{
  id: string,           // UUID
  name: string,         // Display name
  description: string,  // Optional description
  template: string,    // Command template with #variables#
  variables: Variable[],// Variable configurations
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Variable
```javascript
{
  name: string,              // Variable name (without #)
  inputType: 'text' | 'number' | 'dropdown',
  defaultValue: string | number,
  dataSourceId: string | null,  // Reference to global data source
  inlineValues: string[] | null  // For dropdown type
}
```

### DataSource
```javascript
{
  id: string,      // UUID
  name: string,    // Display name
  values: string[] // List of values for dropdown
}
```

### CommandHistory
```javascript
{
  id: string,              // UUID
  commandId: string,       // Reference to command
  values: object,           // Variable values used
  generatedCommand: string, // Final generated command
  timestamp: timestamp
}
```

### AppSettings
```javascript
{
  historyEnabled: boolean,
  maxHistoryItems: number   // Default: 5
}
```

---

## Implementation Order Summary

1. **Phase 1**: Project setup, design system, folder structure
2. **Phase 2**: Type definitions, localStorage service, utilities, basic layout
3. **Phase 3**: Command CRUD, variable configuration, command execution
4. **Phase 4**: Data sources management
5. **Phase 5**: Command history with settings
6. **Phase 6**: Import/Export and sharing features
7. **Phase 7**: Built-in hash tools
8. **Phase 8**: Polish, error handling, documentation

---

*Plan created: 2026-04-27*