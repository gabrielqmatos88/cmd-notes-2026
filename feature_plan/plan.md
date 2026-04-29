# CMD-Notes Development Plan

Based on the requirements, here is a structured, multi-stage development plan for CMD-Notes. This plan is designed to build the application incrementally, starting from the core foundation and moving towards advanced features.

## Tech Stack Summary
- **Frontend Framework:** React
- **Styling:** SASS/SCSS
- **Storage:** Browser LocalStorage
- **Data Format:** JSON (for import/export)

---

## Stage 1: Project Setup & Core Foundation
**Goal:** Initialize the project repository, configure the development environment, and set up the basic layout and local storage service.

* **Tasks:**
  - [x] Initialize a new React project (using Vite or Create React App).
  - [x] Configure SASS/SCSS support.
  - [x] Define the global design tokens (colors, typography, spacing) in SCSS.
  - [x] Create the base layout component (Header, Sidebar/Navigation, Main Content Area).
  - [x] Implement a `StorageService` utility to handle reading and writing to the browser's Local Storage (abstracting `localStorage.getItem` and `setItem`).

## Stage 2: State Management & Data Models
**Goal:** Define the data structures for commands, variables, and data sources, and set up the global state.

* **Tasks:**
  - [ ] Define core data structures (interfaces/types if using TypeScript, or documented object structures):
    - [ ] `Command`: ID, title, description, raw syntax (e.g., `curl -L -o #output_file# #url#`), variables configuration.
    - [ ] `Variable`: name, type (text, number, dropdown), defaultValue, options (for dropdown).
    - [ ] `DataSource`: ID, name, items (array of strings).
  - [ ] Set up State Management (React Context API, Zustand, or Redux) to manage the list of commands and data sources.

## Stage 3: Command Creation & Parsing Engine
**Goal:** Allow users to create and edit command templates, including parsing the raw syntax to identify dynamic variables.

* **Tasks:**
  - [ ] Build the Command Form (Add/Edit screens).
  - [ ] Implement the **Variable Parser**: A utility function that takes a raw command string and uses Regex to extract all variables enclosed in `#` (e.g., extracting `output_file` and `url` from `#output_file#`).
  - [ ] Build the Variable Configuration UI: Once variables are parsed, display a configuration section where the user can select the input type (Text, Number, Dropdown) and set default values for each variable.
  - [ ] Implement Dropdown configuration: Allow users to input CSV/semicolon-separated values for manual dropdown options.
  - [ ] Integrate with `StorageService` to save the new/edited command.

## Stage 4: Command Execution & Code Generation
**Goal:** The core user experience—browsing commands, filling out inputs, and generating the final command line string.

* **Tasks:**
  - [ ] Build the Command List UI with search filtering capabilities.
  - [ ] Build the Command Detail/Execution UI.
  - [ ] **Dynamic Form Rendering:** Render the appropriate input fields (text inputs, number inputs, HTML selects) based on the command's variable configuration.
  - [ ] **Command Generator:** Implement the logic to replace the `#variable#` placeholders in the raw syntax with the actual values provided by the user in the dynamic form.
  - [ ] Implement a robust "Copy to Clipboard" button for the generated output.

## Stage 5: Data Sources Management
**Goal:** Implement the ability for users to create reusable lists of values (IPs, server names) to be used in command dropdowns.

* **Tasks:**
  - [ ] Build the Data Sources management UI (List, Create, Edit, Delete).
  - [ ] Allow users to add items to a data source list.
  - [ ] Update the Command Creation/Editing UI (Stage 3): When configuring a variable as a "Dropdown", allow the user to select an existing Data Source as the origin of the options instead of manual CSV input.
  - [ ] Update Dynamic Form Rendering (Stage 4) to pull options from the linked Data Source.

## Stage 6: Import, Export & Sharing
**Goal:** Allow users to backup their data, move it between devices, and share specific commands.

* **Tasks:**
  - [ ] **Export:** Implement a feature to bundle all LocalStorage data (Commands and Data Sources) into a JSON object and trigger a `.json` file download.
  - [ ] **Import:** Implement a file upload input that reads a `.json` file, validates its structure, and merges or overwrites the current LocalStorage data.
  - [ ] **Share Command:** Implement a feature to export a single command as a JSON snippet or a base64 encoded string that another user can easily import.

## Stage 7: Built-in Utility Tools
**Goal:** Add the requested default developer tools to the application sidebar/navigation.

* **Tasks:**
  - [ ] Build the MD5 hash generator UI and logic.
  - [ ] Build the SHA-256 hash generator UI and logic (using standard Web Crypto API or a library like `crypto-js`).
  - [ ] Integrate these tools as separate views within the main application layout.

## Stage 8: UI/UX Polish & Final Review
**Goal:** Refine the user interface, ensure responsiveness, and fix edge cases.

* **Tasks:**
  - [ ] Refine SASS styling to ensure a clean, modern, and developer-friendly UI (e.g., dark mode support).
  - [ ] Add form validations and user feedback (toast notifications for "Copied!", "Saved!", "Import successful!").
  - [ ] Ensure the application is responsive and usable on smaller screens.
  - [ ] Comprehensive testing of variable parsing edge cases (e.g., missing variables, special characters in default values).
