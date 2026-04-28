// AppLayout Component
// Main application layout wrapper

import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './AppLayout.scss';

function AppLayout({
  commands = [],
  dataSources = [],
  selectedView = 'commands',
  onSelectView,
  selectedCommand,
  onSelectCommand,
  onNewCommand,
  onNewDataSource,
  children,
  showWelcome = false
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-layout">
      <Header onToggleSidebar={toggleSidebar} />
      <div className="app-layout__body">
        <Sidebar
          commands={commands}
          dataSources={dataSources}
          selectedView={selectedView}
          onSelectView={onSelectView}
          selectedCommand={selectedCommand}
          onSelectCommand={onSelectCommand}
          onNewCommand={onNewCommand}
          onNewDataSource={onNewDataSource}
          isOpen={sidebarOpen}
          onClose={closeSidebar}
        />
        <div className="app-layout__content">
          {showWelcome ? (
            <div className="app-layout__welcome">
              <div className="app-layout__welcome-icon">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
              </div>
              <h2 className="app-layout__welcome-title">Welcome to CMD-Notes</h2>
              <p className="app-layout__welcome-text">
                Your command line snippet manager is ready!
              </p>
              <p className="app-layout__welcome-hint">
                Select a command from the sidebar or create a new one to get started.
              </p>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="app-layout__overlay"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
}

export default AppLayout;
