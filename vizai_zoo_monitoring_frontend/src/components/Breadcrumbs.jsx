import React, { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { routeToCrumbs } from '../utils/constants';

// PUBLIC_INTERFACE
export default function Breadcrumbs() {
  const { state, actions } = useApp();
  const location = useLocation();

  const crumbs = useMemo(() => routeToCrumbs(location.pathname), [location.pathname]);

  useEffect(() => {
    actions.setBreadcrumbs(crumbs);
  }, [actions, crumbs]);

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {crumbs.map((c, idx) => {
        const isLast = idx === crumbs.length - 1;
        return (
          <span key={c.to} className={`crumb ${isLast ? 'current' : ''}`}>
            {isLast ? (
              c.label
            ) : (
              <Link to={c.to}>{c.label}</Link>
            )}
            {!isLast && <span className="separator">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
