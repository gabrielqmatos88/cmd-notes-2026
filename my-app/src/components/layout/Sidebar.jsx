import React from 'react';
import './Sidebar.scss';

const Sidebar = () => {
  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-brand">
        <h1>CMD-Notes</h1>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className="active"><a href="#">Commands</a></li>
          <li><a href="#">Data Sources</a></li>
          <li><a href="#">MD5 Tool</a></li>
          <li><a href="#">SHA-256 Tool</a></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
