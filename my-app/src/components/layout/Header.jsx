import React from 'react';
import './Header.scss';

const Header = () => {
  return (
    <header className="header glass-panel">
      <div className="header-search">
        <input type="text" placeholder="Search commands..." />
      </div>
      <div className="header-actions">
        <button className="btn-primary">+ New Command</button>
      </div>
    </header>
  );
};

export default Header;
