import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { APP_ROUTES } from '../utils/constants';

/**
 * PUBLIC_INTERFACE
 * Dashboard: Giant Anteater overview page
 * - DateRangePicker (preset + custom)
 * - Behavior Count bar chart stub
 * - Duration chart stub
 * - 24h Heatmap stub
 * - Clicks route to Timeline with applied filters (behavior or time)
 */
export default function Dashboard() {
  const { state, actions } = useApp();
  const navigate = useNavigate();

  const presets = ['Last 24h', 'Last 7d', 'Last 30d'];
  const [from, setFrom] = React.useState(state.dateRange.from || '');
  const [to, setTo] = React.useState(state.dateRange.to || '');
  const [preset, setPreset] = React.useState(state.dateRange.preset || 'Last 24h');

  const applyRange = () => {
    actions.setDateRange({
      preset,
      from: from || null,
      to: to || null,
    });
  };

  const gotoTimeline = (filterPayload) => {
    // Merge filters into global filters slice so Timeline can read them
    if (filterPayload) {
      actions.setFilters(filterPayload);
    }
    navigate(APP_ROUTES.timeline);
  };

  return (
    <div className="page">
      <h1>Giant Anteater Dashboard</h1>
      <p className="page-desc">Overview of habitat signals, AI detections, and behavior summaries.</p>

      {/* Date Range Picker */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'end', flexWrap: 'wrap' }}>
          <div className="field">
            <label htmlFor="preset">Preset</label>
            <select
              id="preset"
              value={preset}
              onChange={(e) => setPreset(e.target.value)}
              className="daterange"
              style={{ height: 40 }}
            >
              {presets.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="from">From</label>
            <input
              id="from"
              type="datetime-local"
              value={from || ''}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="to">To</label>
            <input
              id="to"
              type="datetime-local"
              value={to || ''}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <button
            className="btn-primary"
            style={{ height: 40, padding: '0 14px' }}
            onClick={applyRange}
            aria-label="Apply date range"
          >
            Apply
          </button>
          <div style={{ color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
            Active: {state.dateRange.preset}
            {state.dateRange.from ? ` • ${state.dateRange.from}` : ''}
            {state.dateRange.to ? ` → ${state.dateRange.to}` : ''}
          </div>
        </div>
      </div>

      {/* Top data/nav tabs */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn-secondary" style={{ height: 36, padding: '0 10px' }} aria-current="page">Dashboard</button>
          <button className="btn-secondary" style={{ height: 36, padding: '0 10px' }} onClick={() => navigate(APP_ROUTES.timeline)}>Timeline</button>
          <button className="btn-secondary" style={{ height: 36, padding: '0 10px' }} onClick={() => navigate(APP_ROUTES.reports)}>Reports</button>
          <button className="btn-secondary" style={{ height: 36, padding: '0 10px' }} onClick={() => navigate(APP_ROUTES.chat)}>Chat</button>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, alignItems: 'stretch' }}>
        {/* Behavior Count Bar Chart Stub */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <h3 style={{ margin: 0 }}>Behavior Counts</h3>
              <div className="page-desc">Click a behavior to drill into Timeline.</div>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            {[
              { key: 'curiosity', label: 'Curiosity', color: 'var(--behavior-curiosity)', value: 42 },
              { key: 'calm', label: 'Calm', color: 'var(--behavior-calm)', value: 68 },
              { key: 'caution', label: 'Caution', color: 'var(--behavior-caution)', value: 14 },
              { key: 'explore', label: 'Explore', color: 'var(--behavior-explore)', value: 27 },
            ].map((b) => (
              <button
                key={b.key}
                className="btn-secondary"
                onClick={() => gotoTimeline({ behavior: b.key })}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr 60px',
                  alignItems: 'center',
                  gap: 8,
                  height: 44,
                  borderRadius: 10,
                  textAlign: 'left',
                }}
                title={`View ${b.label} events in Timeline`}
              >
                <span style={{ fontWeight: 700 }}>{b.label}</span>
                <span
                  aria-hidden="true"
                  style={{
                    display: 'block',
                    height: 10,
                    background: `linear-gradient(90deg, ${b.color}, transparent)`,
                    borderRadius: 999,
                  }}
                />
                <span style={{ textAlign: 'right', color: 'var(--color-text-muted)' }}>{b.value}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Duration Chart Stub */}
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Average Duration by Behavior</h3>
          <div className="page-desc">Stub visualization; click bars to filter Timeline.</div>
          <div style={{ display: 'grid', gap: 10, marginTop: 8 }}>
            {[
              { key: 'curiosity', label: 'Curiosity', minutes: 3.2, color: 'var(--behavior-curiosity)' },
              { key: 'calm', label: 'Calm', minutes: 12.7, color: 'var(--behavior-calm)' },
              { key: 'caution', label: 'Caution', minutes: 1.1, color: 'var(--behavior-caution)' },
              { key: 'explore', label: 'Explore', minutes: 4.5, color: 'var(--behavior-explore)' },
            ].map((d) => (
              <button
                key={d.key}
                className="btn-secondary"
                onClick={() => gotoTimeline({ behavior: d.key })}
                style={{ height: 36, borderRadius: 10, position: 'relative', overflow: 'hidden' }}
                title={`Filter Timeline: ${d.label}`}
              >
                <span style={{ position: 'absolute', inset: 0, display: 'block', background: 'var(--color-surface-2)' }} />
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: '0 40% 0 0',
                    background: d.color,
                    opacity: 0.3,
                  }}
                />
                <span style={{ position: 'relative', padding: '0 10px', fontWeight: 700 }}>
                  {d.label}
                </span>
                <span style={{ position: 'relative', float: 'right', paddingRight: 10, color: 'var(--color-text-muted)' }}>
                  {d.minutes}m
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 24h Heatmap Stub */}
      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <h3 style={{ margin: 0 }}>24h Activity Heatmap</h3>
            <div className="page-desc">Click a cell to view events near that time in Timeline.</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24, minmax(10px, 1fr))', gap: 4 }}>
          {Array.from({ length: 24 }).map((_, hour) => {
            const intensity = Math.abs(Math.sin((hour / 24) * Math.PI * 2)) * 0.75 + 0.2;
            return (
              <button
                key={hour}
                className="btn-secondary"
                onClick={() => gotoTimeline({ hour })}
                style={{
                  height: 28,
                  background: `rgba(16,185,129,${intensity.toFixed(2)})`,
                  borderColor: 'rgba(16,185,129,0.25)',
                  padding: 0,
                  borderRadius: 8,
                }}
                aria-label={`Jump to hour ${hour}:00 in Timeline`}
                title={`Jump to hour ${hour}:00 in Timeline`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
