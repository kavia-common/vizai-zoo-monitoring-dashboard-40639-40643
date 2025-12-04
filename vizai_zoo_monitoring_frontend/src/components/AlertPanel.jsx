import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { APP_ROUTES } from '../utils/constants';
import VideoModal from './VideoModal';

// PUBLIC_INTERFACE
export default function AlertPanel() {
  const { state, actions } = useApp();
  const navigate = useNavigate();

  const onViewVideo = (alert) => {
    // Close panel but persist context; open video modal at timestamp (stubbed)
    actions.openModal({
      title: `Alert • ${alert.behavior || alert.level || 'event'} • ${alert.time || ''}`,
      content: (
        <VideoModal
          src={alert.src || 'https://www.w3schools.com/html/mov_bbb.mp4'}
          poster={alert.thumb || 'https://placehold.co/160x90?text=Alert'}
          details={{
            timestamp: alert.time,
            behavior: alert.behavior || alert.level,
            duration: alert.duration || undefined,
            timeOfDay: alert.timeOfDay || undefined,
            notes: alert.message || alert.title,
          }}
        />
      )
    });
  };

  const onViewTimeline = (alert) => {
    // Pre-filter Timeline based on alert's time/behavior (hour, behavior)
    const hour = alert.hour ?? (alert.time ? parseInt(String(alert.time).slice(11, 13), 10) : undefined);
    actions.setFilters({
      behavior: alert.behavior || undefined,
      hour: Number.isFinite(hour) ? hour : undefined,
      timeOfDay: alert.timeOfDay || undefined,
    });
    navigate(APP_ROUTES.timeline);
  };

  const onAcknowledge = (alert) => {
    // Stub: mark acknowledged in UI (non-destructive)
    actions.openModal({
      title: 'Alert acknowledged',
      content: (
        <div className="card" style={{ background: 'transparent', borderStyle: 'dashed' }}>
          You acknowledged: <strong>{alert.title || 'Alert'}</strong>
        </div>
      ),
    });
  };

  const onMute = (alert) => {
    // Stub: pretend to mute this type/behavior
    actions.openModal({
      title: 'Muted similar alerts',
      content: (
        <div className="card" style={{ background: 'transparent', borderStyle: 'dashed' }}>
          Future alerts of type <strong>{alert.behavior || alert.level || 'general'}</strong> will be muted (stub).
        </div>
      ),
    });
  };

  return (
    <div className={`alert-panel ${state.alerts.panelOpen ? 'open' : ''}`} role="complementary" aria-label="Alerts panel">
      <div className="alert-panel-header">
        <h3>Alerts</h3>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {state.alerts.unreadCount ? (
            <span className="btn-secondary" style={{ height: 28, borderRadius: 999, padding: '0 8px', display: 'inline-grid', placeItems: 'center', fontSize: 12 }}>
              Unread: {state.alerts.unreadCount}
            </span>
          ) : null}
          <button className="icon-btn" onClick={actions.closeAlerts} aria-label="Close alerts">✕</button>
        </div>
      </div>
      <div className="alert-list">
        {state.alerts.list.length === 0 ? (
          <div className="card" style={{ background: 'transparent', borderStyle: 'dashed' }}>No alerts</div>
        ) : (
          state.alerts.list.map((a, idx) => (
            <div key={idx} className={`alert-card level-${a.level || 'info'}`}>
              <div className="title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span>{a.title || 'Alert'}</span>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{a.time || ''}</span>
              </div>
              <div className="desc">{a.message || ''}</div>
              <div className="meta">
                {a.behavior ? <span>Behavior: {a.behavior}</span> : null}
                {a.duration ? <span style={{ marginLeft: 10 }}>Duration: {a.duration}s</span> : null}
                {a.timeOfDay ? <span style={{ marginLeft: 10 }}>Time of day: {a.timeOfDay}</span> : null}
              </div>

              <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                <button className="btn-primary" style={{ height: 32, padding: '0 10px' }} onClick={() => onViewVideo(a)}>
                  View Video
                </button>
                <button className="btn-secondary" style={{ height: 32, padding: '0 10px' }} onClick={() => onViewTimeline(a)}>
                  View Timeline
                </button>
                <span style={{ marginLeft: 'auto', display: 'inline-flex', gap: 6 }}>
                  <button className="btn-secondary" style={{ height: 30, padding: '0 10px' }} onClick={() => onAcknowledge(a)} title="Acknowledge (stub)">
                    Acknowledge
                  </button>
                  <button className="btn-secondary" style={{ height: 30, padding: '0 10px' }} onClick={() => onMute(a)} title="Mute similar (stub)">
                    Mute
                  </button>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
