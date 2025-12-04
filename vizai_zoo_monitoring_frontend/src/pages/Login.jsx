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
  const [submitting, setSubmitting] = useState(false);

  const DEMO_EMAIL = 'demo@vizai.ai';
  const DEMO_PASSWORD = 'demo1234';

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    // Clear error as user edits inputs
    if (error) setError('');
  };

  const isValidEmail = (value) => /^[^@]+@[^@]+\.[^@]+$/.test(String(value || '').trim());

  const submit = async (e) => {
    e.preventDefault();

    if (submitting) return;
    setSubmitting(true);

    // Basic required validation + email format
    const email = String(form.email || '').trim();
    const password = String(form.password || '');

    if (!email || !password) {
      setError('Please enter email and password.');
      setSubmitting(false);
      return;
    }
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      setSubmitting(false);
      return;
    }

    // Stubbed authentication: accept only the specific demo account
    const isDemoAccount = email.toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;

    if (isDemoAccount) {
      setError('');
      // In a real app, you might set auth state/tokens here.
      navigate('/animals', { replace: true });
      setSubmitting(false);
      return;
    }

    // Only show error when inputs were valid but credentials failed
    setError('Incorrect email or password.');
    setSubmitting(false);
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
              aria-invalid={!!error && !isValidEmail(form.email) ? 'true' : 'false'}
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
          <button
            type="submit"
            className="btn-primary wide"
            aria-label="Login"
            disabled={submitting}
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
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
