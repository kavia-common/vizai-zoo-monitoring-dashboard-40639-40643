import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { APP_ROUTES } from '../utils/constants';

/**
 * PUBLIC_INTERFACE
 * Reports: Interactive report builder with preview and export stubs (PDF/Excel/PPTX), plus schedule modal stub.
 * - Preserves global date range via AppContext
 * - Top navigation tabs wired to other pages
 * - Builder controls on the left; live preview on the right
 * - Export buttons show success toasts via modal
 * - "Schedule" button opens a scheduling popup stub that collects cadence/email
 */
export default function Reports() {
  const { state, actions } = useApp();
  const navigate = useNavigate();

  // Builder state (local to page). These selections are reflected in the preview.
  const [title, setTitle] = React.useState('Weekly Anteater Activity');
  const [layout, setLayout] = React.useState('summary'); // 'summary' | 'detailed'
  const [sections, setSections] = React.useState({
    overview: true,
    behaviorTrends: true,
    anomalies: true,
    heatmap: false
  });
  const [format, setFormat] = React.useState('pdf'); // 'pdf' | 'xlsx' | 'pptx'
  const [notes, setNotes] = React.useState('');

  const toggleSection = (key) => setSections((s) => ({ ...s, [key]: !s[key] }));

  const exportReport = (fmt) => {
    // Stub for export - in real app, call API to generate and download
    actions.openModal({
      title: 'Export started',
      content: (
        <div className="card" style={{ background: 'transparent', borderStyle: 'dashed' }}>
          Your {fmt.toUpperCase()} export has been queued.
          <div className="page-desc">Report: {title}</div>
          <div className="page-desc">Date Range: {state.dateRange.preset}
            {state.dateRange.from ? ` • ${state.dateRange.from}` : ''}
            {state.dateRange.to ? ` → ${state.dateRange.to}` : ''}
          </div>
        </div>
      ),
    });
  };

  const openSchedule = () => {
    actions.openModal({
      title: 'Schedule report (stub)',
      content: <ScheduleForm defaultTitle={title} />
    });
  };

  const activeSections = React.useMemo(() => Object.entries(sections).filter(([, v]) => v).map(([k]) => k), [sections]);

  return (
    <div className="page">
      <h1>Giant Anteater Reports</h1>
      <p className="page-desc">
        DateRange: {state.dateRange.preset}
        {state.dateRange.from ? ` • ${state.dateRange.from}` : ''}
        {state.dateRange.to ? ` → ${state.dateRange.to}` : ''}
      </p>

      {/* Nav tabs */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn-secondary" style={{ height: 36, padding: '0 10px' }} onClick={() => navigate(APP_ROUTES.dashboard)}>Dashboard</button>
          <button className="btn-secondary" style={{ height: 36, padding: '0 10px' }} onClick={() => navigate(APP_ROUTES.timeline)}>Timeline</button>
          <button className="btn-secondary" style={{ height: 36, padding: '0 10px' }} aria-current="page">Reports</button>
          <button className="btn-secondary" style={{ height: 36, padding: '0 10px' }} onClick={() => navigate(APP_ROUTES.chat)}>Chat</button>
          <span style={{ marginLeft: 'auto', color: 'var(--color-text-muted)' }}>
            Builder updates preview instantly.
          </span>
        </div>
      </div>

      {/* Builder + Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.9fr', gap: 12 }}>
        {/* Builder */}
        <div className="card" aria-label="Report builder">
          <div style={{ display: 'grid', gap: 12 }}>
            <div className="field">
              <label htmlFor="r-title">Report title</label>
              <input id="r-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter report title" />
            </div>

            <div className="field">
              <label htmlFor="r-layout">Layout</label>
              <select id="r-layout" value={layout} onChange={(e) => setLayout(e.target.value)}>
                <option value="summary">Summary (1-2 pages)</option>
                <option value="detailed">Detailed (multi-page)</option>
              </select>
            </div>

            <div className="field">
              <label>Sections</label>
              <div style={{ display: 'grid', gap: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={sections.overview} onChange={() => toggleSection('overview')} />
                  Overview
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={sections.behaviorTrends} onChange={() => toggleSection('behaviorTrends')} />
                  Behavior trends
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={sections.anomalies} onChange={() => toggleSection('anomalies')} />
                  Anomalies
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={sections.heatmap} onChange={() => toggleSection('heatmap')} />
                  24h heatmap
                </label>
              </div>
            </div>

            <div className="field">
              <label htmlFor="r-format">Default export format</label>
              <select id="r-format" value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="pdf">PDF</option>
                <option value="xlsx">Excel (.xlsx)</option>
                <option value="pptx">PowerPoint (.pptx)</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="r-notes">Notes (optional)</label>
              <input id="r-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional context to include" />
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                className="btn-primary"
                style={{ height: 40, padding: '0 12px' }}
                onClick={() => exportReport(format)}
                aria-label={`Export ${format.toUpperCase()}`}
                title={`Export as ${format.toUpperCase()}`}
              >
                Export {format.toUpperCase()}
              </button>
              <button className="btn-secondary" style={{ height: 40, padding: '0 12px' }} onClick={() => exportReport('pdf')}>
                PDF
              </button>
              <button className="btn-secondary" style={{ height: 40, padding: '0 12px' }} onClick={() => exportReport('xlsx')}>
                Excel
              </button>
              <button className="btn-secondary" style={{ height: 40, padding: '0 12px' }} onClick={() => exportReport('pptx')}>
                PPTX
              </button>
              <button className="btn-secondary" style={{ height: 40, padding: '0 12px', marginLeft: 'auto' }} onClick={openSchedule}>
                Schedule…
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="card" aria-label="Report preview">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <h3 style={{ margin: 0 }}>{title || 'Untitled report'}</h3>
              <div className="page-desc">
                {layout === 'summary' ? 'Summary layout' : 'Detailed layout'} • Sections: {activeSections.length || 0}
                <span style={{ marginLeft: 8, color: 'var(--color-text-muted)' }}>
                  DateRange: {state.dateRange.preset}
                  {state.dateRange.from ? ` • ${state.dateRange.from}` : ''}
                  {state.dateRange.to ? ` → ${state.dateRange.to}` : ''}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
            {sections.overview && (
              <div className="card" style={{ background: 'var(--color-surface-2)' }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>Overview</div>
                <div className="page-desc">High-level counts and KPI tiles summarizing activity.</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(120px, 1fr))', gap: 8, marginTop: 8 }}>
                  {[
                    { label: 'Total events', value: 191 },
                    { label: 'Unique days', value: 7 },
                    { label: 'Peak hour', value: '11:00' },
                    { label: 'Top behavior', value: 'Calm' },
                  ].map((kpi) => (
                    <div key={kpi.label} className="btn-secondary" style={{ height: 72, borderRadius: 12, display: 'grid', alignContent: 'center', padding: 10 }}>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{kpi.label}</div>
                      <div style={{ fontWeight: 900, fontSize: 18 }}>{kpi.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sections.behaviorTrends && (
              <div className="card" style={{ background: 'var(--color-surface-2)' }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>Behavior trends</div>
                <div className="page-desc">Stubbed stacked bars per day for Curiosity, Calm, Caution, Explore.</div>
                <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => {
                    const scale = (n) => Math.max(8, Math.floor(n * 0.9) + 12);
                    const a = scale(22 + (i*7)%18);
                    const b = scale(40 + (i*5)%22);
                    const c = scale(8 + (i*3)%12);
                    const e = scale(14 + (i*4)%16);
                    return (
                      <div key={d} style={{ display: 'grid', gap: 6 }}>
                        <div style={{ fontWeight: 700 }}>{d}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: `${a}fr ${b}fr ${c}fr ${e}fr`, height: 22, overflow: 'hidden', borderRadius: 999 }}>
                          <span style={{ background: 'var(--behavior-curiosity)' }} />
                          <span style={{ background: 'var(--behavior-calm)' }} />
                          <span style={{ background: 'var(--behavior-caution)' }} />
                          <span style={{ background: 'var(--behavior-explore)' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {sections.anomalies && (
              <div className="card" style={{ background: 'var(--color-surface-2)' }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>Anomalies</div>
                <div className="page-desc">Outlier detections and noteworthy spikes (stub).</div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  <li>Spike in Curiosity on Tue 11:00 (z=2.1)</li>
                  <li>Short Calm periods on Thu evening</li>
                  <li>Elevated Caution on Sat night</li>
                </ul>
              </div>
            )}

            {sections.heatmap && (
              <div className="card" style={{ background: 'var(--color-surface-2)' }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>24h activity heatmap</div>
                <div className="page-desc">Distribution by hour.</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24, minmax(8px,1fr))', gap: 4, marginTop: 8 }}>
                  {Array.from({ length: 24 }).map((_, hour) => {
                    const intensity = Math.abs(Math.sin((hour / 24) * Math.PI * 2)) * 0.75 + 0.2;
                    return (
                      <span
                        key={hour}
                        aria-label={`hour ${hour}`}
                        style={{
                          height: 18,
                          borderRadius: 6,
                          background: `rgba(16,185,129,${intensity.toFixed(2)})`,
                          border: '1px solid rgba(16,185,129,0.25)'
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {notes ? (
              <div className="card" style={{ background: 'transparent', borderStyle: 'dashed' }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Notes</div>
                <div className="page-desc">{notes}</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * ScheduleForm: stub shown in modal to capture schedule cadence and email.
 */
function ScheduleForm({ defaultTitle }) {
  const { actions } = useApp();
  const [title, setTitle] = React.useState(defaultTitle || 'Scheduled Report');
  const [cadence, setCadence] = React.useState('weekly'); // daily | weekly | monthly
  const [email, setEmail] = React.useState('');

  const save = (e) => {
    e.preventDefault();
    actions.openModal({
      title: 'Schedule saved',
      content: (
        <div className="card" style={{ background: 'transparent', borderStyle: 'dashed' }}>
          <div><strong>{title}</strong> will be emailed <em>{cadence}</em> to {email || '(no email provided)'}.</div>
          <div className="page-desc">Stub only. Integrate backend to persist schedules.</div>
        </div>
      )
    });
    // Auto-close after a short delay
    setTimeout(() => actions.closeModal(), 1200);
  };

  return (
    <form className="form" onSubmit={save}>
      <div className="field">
        <label htmlFor="s-title">Report title</label>
        <input id="s-title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="s-cadence">Cadence</label>
        <select id="s-cadence" value={cadence} onChange={(e) => setCadence(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly (Mon)</option>
          <option value="monthly">Monthly (1st)</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="s-email">Email recipients</label>
        <input id="s-email" type="email" placeholder="team@zoo.org" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" className="btn-primary" style={{ height: 40, padding: '0 12px' }}>Save</button>
        <button type="button" className="btn-secondary" style={{ height: 40, padding: '0 12px' }} onClick={actions.closeModal}>Cancel</button>
      </div>
    </form>
  );
}
