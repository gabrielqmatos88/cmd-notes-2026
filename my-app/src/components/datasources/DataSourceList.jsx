// DataSourceList Component
// Display and manage all data sources with CRUD operations

import { useState, useEffect } from 'react';
import DataSourceForm from './DataSourceForm';
import ConfirmModal from '../common/ConfirmModal';
import './DataSourceList.scss';

function DataSourceList({
  dataSources = [],
  onSave,
  onDelete,
  onExport,
  startCreating = false,
  onCreatingHandled,
}) {
  const [selectedDataSource, setSelectedDataSource] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Handle startCreating prop - show creation form when triggered from sidebar
  useEffect(() => {
    if (startCreating) {
      setIsCreating(true);
      setIsEditing(false);
      setSelectedDataSource(null);
      if (onCreatingHandled) {
        onCreatingHandled();
      }
    }
  }, [startCreating, onCreatingHandled]);

  const handleEdit = (ds) => {
    setSelectedDataSource(ds);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleDelete = (ds) => {
    setDeleteTarget(ds);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const handleSave = (data) => {
    onSave(data);
    setIsEditing(false);
    setIsCreating(false);
    setSelectedDataSource(null);
  };

  const handleCancelForm = () => {
    setIsEditing(false);
    setIsCreating(false);
    setSelectedDataSource(null);
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
    }
  };

  // Show form if creating or editing
  if (isCreating || isEditing) {
    return (
      <div className="datasource-list">
        <DataSourceForm
          dataSource={isEditing ? selectedDataSource : null}
          onSave={handleSave}
          onCancel={handleCancelForm}
          existingDataSources={dataSources}
        />
      </div>
    );
  }

  return (
    <div className="datasource-list">
      <div className="datasource-list__header">
        <h2 className="datasource-list__title">Data Sources</h2>
        <div className="datasource-list__actions">
          <button
            className="btn btn--secondary btn--sm"
            onClick={handleExport}
            disabled={dataSources.length === 0}
            title="Export data sources"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
          <button
            className="btn btn--primary btn--sm"
            onClick={() => setIsCreating(true)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Data Source
          </button>
        </div>
      </div>

      {dataSources.length === 0 ? (
        <div className="datasource-list__empty">
          <div className="datasource-list__empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
          </div>
          <h3 className="datasource-list__empty-title">No Data Sources Yet</h3>
          <p className="datasource-list__empty-desc">
            Create data sources to provide dropdown options for your command variables.
          </p>
          <button
            className="btn btn--primary"
            onClick={() => setIsCreating(true)}
          >
            Create Your First Data Source
          </button>
        </div>
      ) : (
        <div className="datasource-list__grid">
          {dataSources.map((ds) => (
            <div key={ds.id} className="datasource-card">
              <div className="datasource-card__header">
                <h3 className="datasource-card__name">{ds.name}</h3>
                <div className="datasource-card__actions">
                  <button
                    className="datasource-card__action-btn"
                    onClick={() => handleEdit(ds)}
                    title="Edit data source"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    className="datasource-card__action-btn datasource-card__action-btn--danger"
                    onClick={() => handleDelete(ds)}
                    title="Delete data source"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="datasource-card__count">
                {ds.values.length} {ds.values.length === 1 ? 'value' : 'values'}
              </div>
              <div className="datasource-card__values">
                {ds.values.slice(0, 5).map((v, i) => (
                  <span key={i} className="datasource-card__value-tag">{v}</span>
                ))}
                {ds.values.length > 5 && (
                  <span className="datasource-card__more">+{ds.values.length - 5} more</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={!!deleteTarget}
          title="Delete Data Source"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`}
          confirmText="Delete"
          confirmVariant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

export default DataSourceList;