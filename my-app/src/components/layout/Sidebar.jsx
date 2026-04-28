// Sidebar Component
// Navigation sidebar with commands, data sources, and tools

import { useState } from 'react';
import './Sidebar.scss';

function Sidebar({
  commands = [],
  dataSources = [],
  selectedView = 'commands',
  onSelectView,
  onSelectCommand,
  onNewCommand,
  onNewDataSource,
  onDeleteCommand,
  selectedCommand,
  isOpen = true,
  onClose
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'alphabetical'

  // Sort and filter commands
  const sortedCommands = [...commands]
    .filter(cmd =>
      cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'alphabetical') {
        return a.name.localeCompare(b.name);
      }
      // Default: recent (by updatedAt)
      return (b.updatedAt || 0) - (a.updatedAt || 0);
    });

  const navItems = [
    { id: 'commands', label: 'Commands', icon: 'terminal' },
    { id: 'dataSources', label: 'Data Sources', icon: 'database' },
    { id: 'history', label: 'History', icon: 'clock' },
    { id: 'tools', label: 'Tools', icon: 'tool' },
  ];

  const renderIcon = (iconName) => {
    const icons = {
      terminal: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      ),
      database: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      ),
      clock: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      tool: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      ),
      plus: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      ),
      search: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
      close: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      ),
      trash: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      ),
      arrowUp: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      ),
      arrowDown: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <polyline points="19 12 12 19 5 12" />
        </svg>
      ),
      sort: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="6" x2="16" y2="6" />
          <line x1="4" y1="12" x2="12" y2="12" />
          <line x1="4" y1="18" x2="8" y2="18" />
        </svg>
      ),
    };
    return icons[iconName] || null;
  };

  const handleDeleteCommand = (e, cmd) => {
    e.stopPropagation();
    if (onDeleteCommand) {
      onDeleteCommand(cmd);
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      <div className="sidebar__header">
        <button className="sidebar__close-btn" onClick={onClose}>
          {renderIcon('close')}
        </button>
      </div>

      <nav className="sidebar__nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`sidebar__nav-item ${selectedView === item.id ? 'sidebar__nav-item--active' : ''}`}
            onClick={() => onSelectView(item.id)}
          >
            {renderIcon(item.icon)}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar__divider" />

      {(selectedView === 'commands' || selectedView === 'dataSources') && (
        <>
          <div className="sidebar__search">
            <div className="sidebar__search-icon">
              {renderIcon('search')}
            </div>
            <input
              type="text"
              className="sidebar__search-input"
              placeholder={`Search ${selectedView === 'commands' ? 'commands' : 'data sources'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="sidebar__section">
            <div className="sidebar__section-header">
              <span className="sidebar__section-title">
                {selectedView === 'commands' ? 'Commands' : 'Data Sources'}
              </span>
              <div className="sidebar__section-actions">
                {selectedView === 'commands' && commands.length > 1 && (
                  <select
                    className="sidebar__sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    title="Sort by"
                  >
                    <option value="recent">Recent</option>
                    <option value="alphabetical">A-Z</option>
                  </select>
                )}
                <button
                  className="sidebar__add-btn"
                  onClick={selectedView === 'commands' ? onNewCommand : onNewDataSource}
                  title={`Add ${selectedView === 'commands' ? 'command' : 'data source'}`}
                >
                  {renderIcon('plus')}
                </button>
              </div>
            </div>

            <div className="sidebar__list scrollable">
              {selectedView === 'commands' ? (
                sortedCommands.length > 0 ? (
                  sortedCommands.map(cmd => (
                    <div
                      key={cmd.id}
                      className={`sidebar__list-item ${selectedCommand?.id === cmd.id ? 'sidebar__list-item--selected' : ''}`}
                      onClick={() => onSelectCommand(cmd)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectCommand(cmd);
                        }
                      }}
                    >
                      <span className="sidebar__list-item-name">{cmd.name}</span>
                      {cmd.description && (
                        <span className="sidebar__list-item-desc">{cmd.description}</span>
                      )}
                      <button
                        className="sidebar__list-item-delete"
                        onClick={(e) => handleDeleteCommand(e, cmd)}
                        title="Delete command"
                      >
                        {renderIcon('trash')}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="sidebar__empty">
                    <span>No commands yet</span>
                  </div>
                )
              ) : (
                dataSources.length > 0 ? (
                  dataSources.map(ds => (
                    <button
                      key={ds.id}
                      className="sidebar__list-item"
                      onClick={() => onSelectView('dataSources')}
                    >
                      <span className="sidebar__list-item-name">{ds.name}</span>
                      <span className="sidebar__list-item-count">{ds.values.length} values</span>
                    </button>
                  ))
                ) : (
                  <div className="sidebar__empty">
                    <span>No data sources yet</span>
                  </div>
                )
              )}
            </div>
          </div>
        </>
      )}
    </aside>
  );
}

export default Sidebar;
