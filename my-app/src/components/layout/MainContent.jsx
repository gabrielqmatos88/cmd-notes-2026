// MainContent Component
// Dynamic content area for different views

import './MainContent.scss';

function MainContent({ children, title, subtitle, actions }) {
  return (
    <main className="main-content">
      {(title || actions) && (
        <div className="main-content__header">
          <div className="main-content__header-text">
            {title && <h2 className="main-content__title">{title}</h2>}
            {subtitle && <p className="main-content__subtitle">{subtitle}</p>}
          </div>
          {actions && (
            <div className="main-content__actions">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className="main-content__body">
        {children}
      </div>
    </main>
  );
}

export default MainContent;
