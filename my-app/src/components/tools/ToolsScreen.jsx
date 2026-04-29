// ToolsScreen Component
// Container for built-in utility tools

import { useState } from 'react';
import HashGenerator from './HashGenerator';
import './ToolsScreen.scss';

function ToolsScreen() {
  const [activeTab, setActiveTab] = useState('hash');

  const tabs = [
    { id: 'hash', label: 'Hash Generators', icon: 'hash' },
  ];

  const renderIcon = (iconName, size = 16) => {
    const icons = {
      hash: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="9" x2="20" y2="9" />
          <line x1="4" y1="15" x2="20" y2="15" />
          <line x1="10" y1="3" x2="8" y2="21" />
          <line x1="16" y1="3" x2="14" y2="21" />
        </svg>
      ),
    };
    return icons[iconName] || null;
  };

  return (
    <div className="tools-screen">
      <div className="tools-screen__header">
        <h2 className="tools-screen__title">Built-in Tools</h2>
        <p className="tools-screen__description">
          Utility tools to help with common tasks like generating hash values.
        </p>
      </div>

      <div className="tools-screen__tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tools-screen__tab ${activeTab === tab.id ? 'tools-screen__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {renderIcon(tab.icon)}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tools-screen__content">
        {activeTab === 'hash' && <HashGenerator />}
      </div>
    </div>
  );
}

export default ToolsScreen;
