import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { APP_ROUTES } from '../utils/constants';

// PUBLIC_INTERFACE
export default function TopBar() {
  const { state, actions } = useApp();
  const location = useLocation();

  return (
    <header className="topbar">
      <div className="left">
        <button className="icon-btn" onClick={actions.toggleSidebar} aria-label="Toggle navigation">☰</button>
        <Link to={APP_ROUTES.dashboard} className="brand" title="Go to Dashboard">
          VIZAI
          <span className="brand-accent">•</span>
        </Link>
      </div>
      <div className="center">
        <span className="daterange" role="button" tabIndex={0} aria-label="Date range selector placeholder">
          {state.dateRange.preset}
          {state.dateRange.from ? ` • ${state.dateRange.from}` : ''}
          {state.dateRange.to ? ` → ${state.dateRange.to}` : ''}
        </span>
      </div>
      <div className="right">
        <button
          className="icon-btn"
          onClick={state.theme === 'neon' ? () => actions.setTheme('light') : () => actions.setTheme('neon')}
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {state.theme === 'neon' ? '☀️' : '🟢'}
        </button>
        <button
          className={`icon-btn ${state.alerts.unreadCount ? 'badge' : ''}`}
          onClick={actions.openAlerts}
          aria-label={`Open alerts${state.alerts.unreadCount ? `, ${state.alerts.unreadCount} unread` : ''}`}
          title={`Open alerts${state.alerts.unreadCount ? ` (${state.alerts.unreadCount})` : ''}`}
        >
          🔔
          {state.alerts.unreadCount ? <span className="badge-dot" /> : null}
        </button>
        <details className="user-menu" style={{ marginLeft: 8 }}>
          <summary className="btn-secondary" style={{ height: 30, padding: '0 10px', listStyle: 'none' }}>
            User
          </summary>
          <div className="card" style={{ position: 'absolute', right: 12, marginTop: 6 }}>
            <Link to={APP_ROUTES.dashboard} className="btn-secondary" style={{ display: 'block', padding: '6px 10px', borderRadius: 8 }}>
              Dashboard
            </Link>
            <Link to={APP_ROUTES.timeline} className="btn-secondary" style={{ display: 'block', padding: '6px 10px', borderRadius: 8, marginTop: 6 }}>
              Timeline
            </Link>
            <Link to={APP_ROUTES.reports} className="btn-secondary" style={{ display: 'block', padding: '6px 10px', borderRadius: 8, marginTop: 6 }}>
              Reports
            </Link>
            <Link to={APP_ROUTES.chat} className="btn-secondary" style={{ display: 'block', padding: '6px 10px', borderRadius: 8, marginTop: 6 }}>
              Chat
            </Link>
            <Link to={APP_ROUTES.login} className="btn-secondary" style={{ display: 'block', padding: '6px 10px', borderRadius: 8, marginTop: 6 }}>
              Logout
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}
