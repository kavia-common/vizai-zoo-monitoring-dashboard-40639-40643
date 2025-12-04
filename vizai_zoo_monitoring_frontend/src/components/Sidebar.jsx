import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { NAV_ITEMS } from '../utils/constants';

// PUBLIC_INTERFACE
export default function Sidebar() {
  const { state } = useApp();

  return (
    <aside className={`sidebar ${state.navigation.sidebarOpen ? 'open' : 'closed'}`} aria-label="Main navigation">
      <nav>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="icon" aria-hidden="true">{item.icon}</span>
            <span className="label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
