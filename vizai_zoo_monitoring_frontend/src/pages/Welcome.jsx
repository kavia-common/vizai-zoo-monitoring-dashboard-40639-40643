import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Welcome.css';
import { APP_ROUTES } from '../utils/constants';

// PUBLIC_INTERFACE
export default function Welcome() {
  /** Landing screen for authentication flow.
   * Buttons: Register -> /register, Login -> /login
   * Footer links: Terms, Privacy (placeholders)
   */
  const navigate = useNavigate();
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="brand-badge" aria-label="VIZAI brand">VIZAI<span className="dot">•</span></div>
        <h1 className="auth-title">Welcome to VIZAI</h1>
        <p className="auth-subtitle">Monitor, analyze, and protect your zoo habitats with AI-assisted insights.</p>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <details className="user-menu" style={{ marginBottom: 8 }}>
            <summary className="btn-secondary" style={{ padding: '6px 10px', listStyle: 'none' }}>
              User
            </summary>
            <div className="card" style={{ position: 'absolute', right: 24, marginTop: 8 }}>
              <button
                className="btn-secondary"
                style={{ height: 36, padding: '0 10px' }}
                onClick={() => navigate('/welcome')}
                aria-label="Logout"
                title="Logout"
              >
                Logout
              </button>
            </div>
          </details>
        </div>
        <div className="actions">
          <button className="btn-primary" onClick={() => navigate('/register')} aria-label="Go to registration">Create account</button>
          <button className="btn-secondary" onClick={() => navigate('/login')} aria-label="Go to login">I already have an account</button>
        </div>

        <div className="auth-footer">
          <span className="muted">By continuing you agree to our</span>
          <div className="links">
            <Link to="#" aria-disabled="true" onClick={(e)=>e.preventDefault()}>Terms of Service</Link>
            <span>•</span>
            <Link to="#" aria-disabled="true" onClick={(e)=>e.preventDefault()}>Privacy Policy</Link>
          </div>
          <div className="alt">
            <span>Ready to continue?</span> <Link to="/login">Login</Link> or <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
