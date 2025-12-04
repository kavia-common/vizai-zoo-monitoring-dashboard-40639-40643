import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { APP_ROUTES } from '../utils/constants';
import VideoModal from '../components/VideoModal';

/**
 * PUBLIC_INTERFACE
 * Timeline: Shows events with filter controls and supports opening a Video Modal.
 * - Filters: behavior, duration range, time-of-day, date range (read from global dateRange)
 * - Preserves filters and scroll position when opening/closing the video modal
 * - Clear Filters button resets local and global filters relevant to Timeline
 */
export default function Timeline() {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const listRef = React.useRef(null);

  // Local timeline filter UI state (synced with global filters on mount)
  const [behavior, setBehavior] = React.useState(state.filters.behavior || '');
  const [durationMin, setDurationMin] = React.useState(state.filters.durationMin ?? '');
  const [durationMax, setDurationMax] = React.useState(state.filters.durationMax ?? '');
  const [timeOfDay, setTimeOfDay] = React.useState(state.filters.timeOfDay || '');
  const [hour, setHour] = React.useState(
    state.filters.hour !== undefined && state.filters.hour !== null ? String(state.filters.hour) : ''
  );

  // Preserve and restore scroll position across modal open/close
  React.useEffect(() => {
    const saved = sessionStorage.getItem('timeline_scroll_top');
    if (saved) {
      requestAnimationFrame(() => window.scrollTo(0, Number(saved)));
    }
    return () => {
      sessionStorage.setItem('timeline_scroll_top', String(window.scrollY || 0));
    };
  }, []);

  const applyFilters = () => {
    const payload = {
      behavior: behavior || undefined,
      durationMin: durationMin !== '' ? Number(durationMin) : undefined,
      durationMax: durationMax !== '' ? Number(durationMax) : undefined,
      timeOfDay: timeOfDay || undefined,
      hour: hour !== '' ? Number(hour) : undefined,
    };
    actions.setFilters(payload);
  };

  const clearAll = () => {
    setBehavior('');
    setDurationMin('');
    setDurationMax('');
    setTimeOfDay('');
    setHour('');
    actions.setFilters({
      behavior: undefined,
      durationMin: undefined,
      durationMax: undefined,
      timeOfDay: undefined,
      hour: undefined,
    });
  };

  // Sample data for timeline items (would come from API in real app)
  const items = React.useMemo(() => {
    const sample = [
      {
        id: 'ev1',
        timestamp: '2025-05-15 10:03',
        behavior: 'curiosity',
        duration: 14,
        timeOfDay: 'morning',
        hour: 10,
        thumb: 'https://placehold.co/160x90?text=Curiosity',
        src: 'https://www.w3schools.com/html/mov_bbb.mp4',
        notes: 'Anteater investigated a new enrichment log.',
      },
      {
        id: 'ev2',
        timestamp: '2025-05-15 11:21',
        behavior: 'explore',
        duration: 33,
        timeOfDay: 'noon',
        hour: 11,
        thumb: 'https://placehold.co/160x90?text=Explore',
        src: 'https://www.w3schools.com/html/mov_bbb.mp4',
        notes: 'Roamed the western habitat perimeter.',
      },
      {
        id: 'ev3',
        timestamp: '2025-05-15 15:44',
        behavior: 'calm',
        duration: 120,
        timeOfDay: 'afternoon',
        hour: 15,
        thumb: 'https://placehold.co/160x90?text=Calm',
        src: 'https://www.w3schools.com/html/mov_bbb.mp4',
        notes: 'Rest period under shade near pond.',
      },
      {
        id: 'ev4',
        timestamp: '2025-05-15 20:10',
        behavior: 'caution',
        duration: 18,
        timeOfDay: 'night',
        hour: 20,
        thumb: 'https://placehold.co/160x90?text=Caution',
        src: 'https://www.w3schools.com/html/mov_bbb.mp4',
        notes: 'Heightened vigilance after loud external noise.',
      },
    ];

    // Apply global filters first (set via Dashboard drilldown or local apply)
    const f = state.filters || {};
    return sample.filter((e) => {
      if (f.behavior && e.behavior !== f.behavior) return false;
      if (f.hour !== undefined && f.hour !== null && e.hour !== f.hour) return false;
      if (f.timeOfDay && e.timeOfDay !== f.timeOfDay) return false;
      if (f.durationMin !== undefined && e.duration < f.durationMin) return false;
      if (f.durationMax !== undefined && e.duration > f.durationMax) return false;
      return true;
    });
  }, [state.filters]);

  const openVideo = (ev) => {
    // Save scroll before opening modal
    sessionStorage.setItem('timeline_scroll_top', String(window.scrollY || 0));
    actions.openModal({
      title: `Event • ${ev.behavior} • ${ev.timestamp}`,
      content: <VideoModal src={ev.src} poster={ev.thumb} details={ev} />,
    });
  };

  return (
    <div className="page">
      <h1>Giant Anteater Timeline</h1>
      <p className="page-desc">
        DateRange: {state.dateRange.preset}
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
            Click a card to open video. Filters persist across pages.
          </span>
        </div>
      </div>

      {/* Filters Row */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(120px, 1fr))', gap: 12 }}>
          <div className="field">
            <label htmlFor="behavior">Behavior</label>
            <select id="behavior" value={behavior} onChange={(e) => setBehavior(e.target.value)}>
              <option value="">Any</option>
              <option value="curiosity">Curiosity</option>
              <option value="calm">Calm</option>
              <option value="caution">Caution</option>
              <option value="explore">Explore</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="durationMin">Min duration (sec)</label>
            <input id="durationMin" type="number" min="0" value={durationMin} onChange={(e) => setDurationMin(e.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="durationMax">Max duration (sec)</label>
            <input id="durationMax" type="number" min="0" value={durationMax} onChange={(e) => setDurationMax(e.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="timeOfDay">Time of day</label>
            <select id="timeOfDay" value={timeOfDay} onChange={(e) => setTimeOfDay(e.target.value)}>
              <option value="">Any</option>
              <option value="morning">Morning</option>
              <option value="noon">Noon</option>
              <option value="afternoon">Afternoon</option>
              <option value="night">Night</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="hour">Hour</label>
            <input id="hour" type="number" min="0" max="23" value={hour} onChange={(e) => setHour(e.target.value)} />
          </div>

          <div className="field" style={{ alignSelf: 'end', display: 'flex', gap: 8 }}>
            <button className="btn-primary" style={{ height: 40, padding: '0 12px' }} onClick={applyFilters}>Apply</button>
            <button className="btn-secondary" style={{ height: 40, padding: '0 12px' }} onClick={clearAll}>Clear</button>
          </div>
        </div>
      </div>

      {/* Event Feed */}
      <div ref={listRef} className="card">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <strong>Event List</strong>
          {(state.filters.behavior ||
            state.filters.hour !== undefined ||
            state.filters.timeOfDay ||
            state.filters.durationMin !== undefined ||
            state.filters.durationMax !== undefined) && (
            <button className="btn-secondary" style={{ height: 30, padding: '0 10px' }} onClick={clearAll}>
              Clear filters
            </button>
          )}
          <span style={{ marginLeft: 'auto', color: 'var(--color-text-muted)' }}>
            Showing {items.length} event{items.length === 1 ? '' : 's'}
          </span>
        </div>

        <div style={{ display: 'grid', gap: 10 }}>
          {items.map((ev) => (
            <button
              key={ev.id}
              className="btn-secondary"
              style={{
                display: 'grid',
                gridTemplateColumns: '160px 1fr',
                gap: 12,
                textAlign: 'left',
                padding: 8,
                borderRadius: 12,
                alignItems: 'center',
              }}
              onClick={() => openVideo(ev)}
              title="Open video"
              aria-label={`Open video for ${ev.behavior} at ${ev.timestamp}`}
            >
              <img
                src={ev.thumb}
                alt={`${ev.behavior} thumbnail`}
                style={{ width: 160, height: 90, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--color-border)' }}
              />
              <div style={{ display: 'grid', gap: 4 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: 16, textTransform: 'capitalize' }}>{ev.behavior}</span>
                  <span className="page-desc">{ev.timestamp}</span>
                </div>
                <div style={{ color: 'var(--color-text-muted)' }}>
                  Duration: {ev.duration}s • Hour: {ev.hour}:00 • {ev.timeOfDay}
                </div>
                {ev.notes ? <div className="page-desc">{ev.notes}</div> : null}
              </div>
            </button>
          ))}
          {items.length === 0 ? (
            <div className="card" style={{ background: 'transparent', borderStyle: 'dashed' }}>
              No events match your current filters.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
