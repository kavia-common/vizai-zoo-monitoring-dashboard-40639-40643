import React from 'react';
import './App.css';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import { useApp } from './state/AppContext';

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

// Gate to protect post-login routes: requires remembered auth or session email
function RequireAuth({ children }) {
  const navigate = useNavigate();
  React.useEffect(() => {
    const remembered = JSON.parse(localStorage.getItem('vizai_auth_remember') || 'false');
    const email = localStorage.getItem('vizai_auth_email');
    // If not authenticated, send to login
    if (!remembered && !email) {
      navigate(APP_ROUTES.login, { replace: true });
    }
  }, [navigate]);
  return <>{children}</>;
}

// Floating Chat launcher on post-login pages (bottom-right)
function ChatLauncher() {
  const { actions } = useApp();
  const location = useLocation();
  const postLoginPaths = [
    APP_ROUTES.animals,
    APP_ROUTES.dashboard,
    APP_ROUTES.timeline,
    APP_ROUTES.reports,
    APP_ROUTES.chat,
  ];
  const show = postLoginPaths.includes(location.pathname);

  if (!show) return null;
  // Positioned to avoid core controls; with aria and title
  return (
    <button
      className="chat-launcher"
      aria-label="Open Chat Assistant"
      title="Chat"
      onClick={() => {
        actions.setFilters({}); // no-op; ensure context active
        // Navigate to chat via anchor element to avoid obstructing overlays
        const a = document.createElement('a');
        a.href = APP_ROUTES.chat;
        a.click();
      }}
    >
      💬
    </button>
  );
}

function AppChrome({ children }) {
  // Hide topbar/sidebar/breadcrumbs on auth routes
  const location = useLocation();
  const authPaths = [APP_ROUTES.welcome, APP_ROUTES.login, APP_ROUTES.register];
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
      <ChatLauncher />
      <ModalHost />
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  return (
    <AppChrome>
      <Routes>
        {/* Start at Welcome for first-time users; after login we go to Animals */}
        <Route path="/" element={<Navigate to={APP_ROUTES.welcome} replace />} />

        {/* Auth routes */}
        <Route path={APP_ROUTES.welcome} element={<Welcome />} />
        <Route path={APP_ROUTES.register} element={<Register />} />
        <Route path={APP_ROUTES.login} element={<Login />} />

        {/* Species selection (first step after login) */}
        <Route
          path={APP_ROUTES.animals}
          element={
            <RequireAuth>
              <Animals />
            </RequireAuth>
          }
        />

        {/* App routes (protected) */}
        <Route
          path={APP_ROUTES.dashboard}
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path={APP_ROUTES.timeline}
          element={
            <RequireAuth>
              <Timeline />
            </RequireAuth>
          }
        />
        <Route
          path={APP_ROUTES.reports}
          element={
            <RequireAuth>
              <Reports />
            </RequireAuth>
          }
        />
        <Route
          path={APP_ROUTES.chat}
          element={
            <RequireAuth>
              <Chat />
            </RequireAuth>
          }
        />

        {/* Keep other global navigation items (protected placeholders) */}
        <Route
          path={APP_ROUTES.liveFeed}
          element={
            <RequireAuth>
              <Page title="Live Feed" description="Real-time streams and detections." />
            </RequireAuth>
          }
        />
        <Route
          path={APP_ROUTES.alerts}
          element={
            <RequireAuth>
              <Page title="Alerts" description="Alert summaries and events." />
            </RequireAuth>
          }
        />
        <Route
          path={APP_ROUTES.history}
          element={
            <RequireAuth>
              <Page title="History" description="Historical trends and events." />
            </RequireAuth>
          }
        />
        <Route
          path={APP_ROUTES.settings}
          element={
            <RequireAuth>
              <Page title="Settings" description="Application preferences." />
            </RequireAuth>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={APP_ROUTES.login} replace />} />
      </Routes>
    </AppChrome>
  );
}

export default App;
