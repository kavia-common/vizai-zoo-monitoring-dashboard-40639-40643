import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { APP_ROUTES } from '../utils/constants';

/**
 * PUBLIC_INTERFACE
 * Chat: Placeholder for AI assistant chat related to the animal/time range.
 */
export default function Chat() {
  const { state } = useApp();
  const navigate = useNavigate();

  return (
    <div className="page">
      <h1>Giant Anteater Chat</h1>
      <p className="page-desc">
        Context preserves date range: {state.dateRange.preset}
        {state.dateRange.from ? ` • ${state.dateRange.from}` : ''}
        {state.dateRange.to ? ` → ${state.dateRange.to}` : ''}
      </p>

      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn-secondary" style={{ height: 36, padding: '0 10px' }} onClick={() => navigate(APP_ROUTES.dashboard)}>Dashboard</button>
          <button className="btn-secondary" style={{ height: 36, padding: '0 10px' }} onClick={() => navigate(APP_ROUTES.timeline)}>Timeline</button>
          <button className="btn-secondary" style={{ height: 36, padding: '0 10px' }} onClick={() => navigate(APP_ROUTES.reports)}>Reports</button>
          <button className="btn-secondary" style={{ height: 36, padding: '0 10px' }} aria-current="page">Chat</button>
        </div>
      </div>

      <div className="card">
        <strong>Chat placeholder</strong>
        <p className="page-desc">Ask the AI about behavior patterns or anomalies in the selected range.</p>
      </div>
    </div>
  );
}
