import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../utils/constants';
import { useApp } from '../state/AppContext';

/**
 * PUBLIC_INTERFACE
 * Animals: Selection page to choose monitored species.
 * - Giant Anteater is active and navigates to Dashboard.
 * - Other animals show a "Coming Soon" tooltip.
 * - Includes search filter and counts.
 */
export default function Animals() {
  const navigate = useNavigate();
  const { actions } = useApp();
  const [query, setQuery] = useState('');

  const animals = useMemo(
    () => [
      { id: 'anteater', name: 'Giant Anteater', emoji: '🐜', status: 'active' },
      { id: 'tiger', name: 'Siberian Tiger', emoji: '🐯', status: 'soon' },
      { id: 'panda', name: 'Giant Panda', emoji: '🐼', status: 'soon' },
      { id: 'elephant', name: 'African Elephant', emoji: '🐘', status: 'soon' },
      { id: 'gorilla', name: 'Gorilla', emoji: '🦍', status: 'soon' },
      { id: 'penguin', name: 'Emperor Penguin', emoji: '🐧', status: 'soon' },
    ],
    []
  );

  const filtered = animals.filter(a =>
    a.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  const onChoose = (a) => {
    if (a.status === 'active') {
      // After Species Selection, proceed to Dashboard
      navigate(APP_ROUTES.dashboard);
    } else {
      actions.openModal({
        title: `${a.name}`,
        content: (
          <div className="card" style={{ background: 'transparent', borderStyle: 'dashed' }}>
            <strong>Coming soon.</strong> {a.name} monitoring is not enabled yet.
          </div>
        ),
      });
    }
  };

  return (
    <div className="page">
      <h1>Choose an Animal</h1>
      <p className="page-desc">Select a species to view its dashboard and live feed.</p>

      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: 'grid', gap: 12 }}>
          <div className="field">
            <label htmlFor="animal-search">Search animals</label>
            <input
              id="animal-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to filter e.g., Anteater"
            />
          </div>
          <div style={{ color: 'var(--color-text-muted)' }}>
            Showing {filtered.length} of {animals.length}
          </div>
        </div>
      </div>

      <div className="animal-grid">
        {filtered.map((a) => (
          <button
            key={a.id}
            className={`animal-card ${a.status === 'active' ? 'active' : 'soon'}`}
            onClick={() => onChoose(a)}
            aria-label={`${a.name} ${a.status === 'active' ? 'available' : 'coming soon'}`}
            title={a.status === 'active' ? 'Open Dashboard' : 'Coming soon'}
          >
            <div className="animal-emoji" aria-hidden="true">{a.emoji}</div>
            <div className="animal-name">{a.name}</div>
            {a.status === 'soon' ? (
              <span className="soon-tag">Coming Soon</span>
            ) : (
              <span className="active-tag">Active</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
