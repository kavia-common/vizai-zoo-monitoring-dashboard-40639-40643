import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import PasswordRecoveryModal from '../components/PasswordRecoveryModal';
import { useApp } from '../state/AppContext';

/**
 * PUBLIC_INTERFACE
 * Login screen per spec:
 * - On success -> /animals (Animal Selection)
 * - On incorrect -> inline error
 * - Footer "Register" link -> /register
 * - "Forgot password" -> open modal
 *
 * Demo credentials (stubbed):
 *   Email: demo@vizai.ai
 *   Password: demo1234
 */
export default function Login() {
  const navigate = useNavigate();
  const { actions } = useApp();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const DEMO_EMAIL = 'demo@vizai.ai';
  const DEMO_PASSWORD = 'demo1234';

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    // Clear error as user edits inputs
    if (error) setError('');
  };

  const isValidEmail = (value) => /^[^@]+@[^@]+\.[^@]+$/.test(String(value || '').trim());

  const submit = (e) => {
    e.preventDefault();
    // Basic required validation + email format
    const email = String(form.email || '').trim();
    const password = String(form.password || '');

    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }

    // Stubbed authentication: accept a specific demo account OR any email with the known demo password
    const isDemoAccount = email.toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;
    const isDemoPasswordOnly = password === DEMO_PASSWORD;

    if (isDemoAccount || isDemoPasswordOnly) {
      setError('');
      // In a real app, you might set auth state/tokens here.
      navigate('/animals', { replace: true });
      return;
    }

    // Only show error when inputs were valid but credentials failed
    setError('Incorrect email or password.');
  };

  const openForgotModal = () => {
    actions.openModal({
      title: 'Reset your password',
      content: <PasswordRecoveryModal emailPrefill={form.email} />
    });
  };

  return (
    <div className="auth-shell">
      <div className="auth-form-card">
        <div className="brand-badge">VIZAI<span className="dot">•</span></div>
        <h2 className="auth-title">Sign in</h2>
        <p className="auth-subtitle">Enter your credentials to access the dashboard.</p>

        <form className="form" onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@zoo.org"
              autoComplete="username"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          {error ? <div className="error-banner" role="alert">{error}</div> : null}
          <div className="row-between">
            <button type="button" className="linklike" onClick={openForgotModal}>Forgot password?</button>
          </div>
          <button type="submit" className="btn-primary wide" aria-label="Login">Sign in</button>
        </form>

        <div className="auth-footer">
          <div className="alt">
            New here? <Link to="/register">Create an account</Link>
          </div>
        </div>

        {/* Small helper to inform testers of the demo credentials */}
        <div className="auth-footer" style={{ marginTop: 12 }}>
          <div className="page-desc">Demo credentials: demo@vizai.ai / demo1234</div>
        </div>
      </div>
    </div>
  );
}
