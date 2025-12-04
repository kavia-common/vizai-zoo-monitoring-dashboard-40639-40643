import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { APP_ROUTES } from '../utils/constants';

/**
 * PUBLIC_INTERFACE
 * Reports: Placeholder for generating insights/reports.
 */
export default function Reports() {
  const { state } = useApp();
  const navigate = useNavigate();

  return (
    <div className="page">
      <h1>Giant Anteater Reports</h1>
      <p className="page-desc">
        DateRange: {state.dateRange.preset}
        {state.dateRange.from ? ` • ${state.dateRange.from}` : ''}
        {state.dateRange.to ? ` → ${state.dateRange.to}` : ''}
      </p>

      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn-secondary" style={{ height: 36, padding: '0 10px' }} onClick={() => navigate(APP_ROUTES.dashboard)}>Dashboard</button>
          <button className="btn-secondary" style={{ height: 36, padding: '0 10px' }} onClick={() => navigate(APP_ROUTES.timeline)}>Timeline</button>
          <button className="btn-secondary" style={{ height: 36, padding: '0 10px' }} aria-current="page">Reports</button>
          <button className="btn-secondary" style={{ height: 36, padding: '0 10px' }} onClick={() => navigate(APP_ROUTES.chat)}>Chat</button>
        </div>
      </div>

      <div className="card">
        <strong>Reports placeholder</strong>
        <p className="page-desc">Here you will be able to export PDFs, summaries, and weekly analyses.</p>
      </div>
    </div>
  );
}
