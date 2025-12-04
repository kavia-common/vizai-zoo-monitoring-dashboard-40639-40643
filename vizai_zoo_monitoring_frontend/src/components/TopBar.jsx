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
        <Link to={APP_ROUTES.animals} className="brand" title="Go to Animal Selection">
          VIZAI
          <span className="brand-accent">•</span>
        </Link>
      </div>
      <div className="center">
        <span className="daterange" role="button" tabIndex={0} aria-label="Date range selector placeholder">
          {state.dateRange.preset}
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
          aria-label="Open alerts"
          title="Open alerts"
        >
          🔔
          {state.alerts.unreadCount ? <span className="badge-dot" /> : null}
        </button>
      </div>
    </header>
  );
}
