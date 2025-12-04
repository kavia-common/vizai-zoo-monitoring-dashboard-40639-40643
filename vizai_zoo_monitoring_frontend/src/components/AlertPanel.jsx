import React from 'react';
import { useApp } from '../state/AppContext';

// PUBLIC_INTERFACE
export default function AlertPanel() {
  const { state, actions } = useApp();

  return (
    <div className={`alert-panel ${state.alerts.panelOpen ? 'open' : ''}`} role="complementary" aria-label="Alerts panel">
      <div className="alert-panel-header">
        <h3>Alerts</h3>
        <button className="icon-btn" onClick={actions.closeAlerts} aria-label="Close alerts">✕</button>
      </div>
      <div className="alert-list">
        {state.alerts.list.length === 0 ? (
          <div className="empty">No alerts</div>
        ) : (
          state.alerts.list.map((a, idx) => (
            <div key={idx} className={`alert-card level-${a.level || 'info'}`}>
              <div className="title">{a.title || 'Alert'}</div>
              <div className="desc">{a.message || ''}</div>
              <div className="meta">{a.time || ''}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
