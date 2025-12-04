import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { APP_ROUTES } from '../utils/constants';

/**
 * PUBLIC_INTERFACE
 * Timeline: shows events with applied filters.
 * Reads global dateRange and filters from context.
 */
export default function Timeline() {
  const { state, actions } = useApp();
  const navigate = useNavigate();

  const clearBehavior = () => actions.setFilters({ behavior: undefined, hour: undefined });

  return (
    <div className="page">
      <h1>Giant Anteater Timeline</h1>
      <p className="page-desc">
        Filters applied: {state.filters.behavior ? `behavior=${state.filters.behavior} ` : ''}
        {state.filters.hour !== undefined ? `hour=${state.filters.hour}` : ''} | DateRange: {state.dateRange.preset}
        {state.dateRange.from ? ` • ${state.dateRange.from}` : ''}
        {state.dateRange.to ? ` → ${state.dateRange.to}` : ''}
      </p>

      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn-secondary" style={{ height: 36, padding: '0 10px' }} onClick={() => navigate(APP_ROUTES.dashboard)}>Dashboard</button>
          <button className="btn-secondary" style={{ height: 36, padding: '0 10px' }} aria-current="page">Timeline</button>
          <button className="btn-secondary" style={{ height: 36, padding: '0 10px' }} onClick={() => navigate(APP_ROUTES.reports)}>Reports</button>
          <button className="btn-secondary" style={{ height: 36, padding: '0 10px' }} onClick={() => navigate(APP_ROUTES.chat)}>Chat</button>
          <span style={{ marginLeft: 'auto', color: 'var(--color-text-muted)' }}>
            Click a behavior or heatmap cell on Dashboard to filter here.
          </span>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <strong>Event List</strong>
          {(state.filters.behavior || state.filters.hour !== undefined) && (
            <button className="btn-secondary" style={{ height: 30, padding: '0 10px' }} onClick={clearBehavior}>
              Clear filters
            </button>
          )}
        </div>
        <div className="page-desc">This is a placeholder for the timeline feed with infinite scroll and thumbnails.</div>
        <ul>
          <li>10:03 - Behavior: curiosity (sample)</li>
          <li>11:21 - Behavior: explore (sample)</li>
          <li>15:44 - Behavior: calm (sample)</li>
          <li>20:10 - Behavior: caution (sample)</li>
        </ul>
      </div>
    </div>
  );
}
