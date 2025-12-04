import React from 'react';
import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import Breadcrumbs from './components/Breadcrumbs';
import AlertPanel from './components/AlertPanel';
import ModalHost from './components/Modal';
import { APP_ROUTES } from './utils/constants';
import Welcome from './pages/Welcome';
import Register from './pages/Register';
import Login from './pages/Login';
import Animals from './pages/Animals';
import Dashboard from './pages/Dashboard';
import Timeline from './pages/Timeline';
import Reports from './pages/Reports';
import Chat from './pages/Chat';

// Simple placeholder pages (still used by some routes)
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

function AppChrome({ children }) {
  // Hide topbar/sidebar/breadcrumbs on auth routes
  const location = useLocation();
  const authPaths = ['/welcome', '/login', '/register'];
  const hideChrome = authPaths.includes(location.pathname);
  if (hideChrome) {
    return (
      <div className="app-root">
        {children}
        <ModalHost />
      </div>
    );
  }
  return (
    <div className="app-root">
      <TopBar />
      <div className="layout">
        <Sidebar />
        <main className="content">
          <Breadcrumbs />
          <div className="content-inner">
            {children}
          </div>
        </main>
      </div>
      <AlertPanel />
      <ModalHost />
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  return (
    <AppChrome>
      <Routes>
        {/* Initial route redirect (Species selection is start route) */}
        <Route path="/" element={<Navigate to={APP_ROUTES.animals} replace />} />

        {/* Auth routes */}
        <Route path={APP_ROUTES.welcome} element={<Welcome />} />
        <Route path={APP_ROUTES.register} element={<Register />} />
        <Route path={APP_ROUTES.login} element={<Login />} />

        {/* App routes */}
        <Route path={APP_ROUTES.dashboard} element={<Dashboard />} />
        <Route path={APP_ROUTES.animals} element={<Animals />} />
        <Route path={APP_ROUTES.timeline} element={<Timeline />} />
        <Route path={APP_ROUTES.reports} element={<Reports />} />
        <Route path={APP_ROUTES.chat} element={<Chat />} />

        {/* Keep other global navigation items */}
        <Route path={APP_ROUTES.liveFeed} element={<Page title="Live Feed" description="Real-time streams and detections." />} />
        <Route path={APP_ROUTES.alerts} element={<Page title="Alerts" description="Alert summaries and events." />} />
        <Route path={APP_ROUTES.history} element={<Page title="History" description="Historical trends and events." />} />
        <Route path={APP_ROUTES.settings} element={<Page title="Settings" description="Application preferences." />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={APP_ROUTES.login} replace />} />
      </Routes>
    </AppChrome>
  );
}

export default App;
