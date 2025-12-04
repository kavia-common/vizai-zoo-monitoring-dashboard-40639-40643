import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import Breadcrumbs from './components/Breadcrumbs';
import AlertPanel from './components/AlertPanel';
import ModalHost from './components/Modal';
import { APP_ROUTES } from './utils/constants';

// Simple placeholder pages
function Page({ title, description }) {
  return (
    <div className="page">
      <h1>{title}</h1>
      {description ? <p className="page-desc">{description}</p> : null}
      <div className="card">
        <p>This is a placeholder for the {title} screen.</p>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  return (
    <div className="app-root">
      <TopBar />
      <div className="layout">
        <Sidebar />
        <main className="content">
          <Breadcrumbs />
          <div className="content-inner">
            <Routes>
              <Route path={APP_ROUTES.dashboard} element={<Page title="Dashboard" description="Overview of monitored habitats and AI insights." />} />
              <Route path={APP_ROUTES.liveFeed} element={<Page title="Live Feed" description="Real-time streams and detections." />} />
              <Route path={APP_ROUTES.alerts} element={<Page title="Alerts" description="Alert summaries and triage." />} />
              <Route path={APP_ROUTES.history} element={<Page title="History" description="Historical trends and events." />} />
              <Route path={APP_ROUTES.settings} element={<Page title="Settings" description="Application preferences." />} />
            </Routes>
          </div>
        </main>
      </div>
      <AlertPanel />
      <ModalHost />
    </div>
  );
}

export default App;
