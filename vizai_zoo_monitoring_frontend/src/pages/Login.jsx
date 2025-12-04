import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import PasswordRecoveryModal from '../components/PasswordRecoveryModal';
import { useApp } from '../state/AppContext';

/**
 * PUBLIC_INTERFACE
 * Login screen per spec:
 * - Mandatory Role dropdown (must select non-placeholder)
 * - Remember Me checkbox (persists minimal flag locally)
 * - Enter-to-submit supported by form submit
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
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: '',        // required selection
    remember: false, // remember me flag
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const DEMO_EMAIL = 'demo@vizai.ai';
  const DEMO_PASSWORD = 'demo1234';

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (error) setError('');
  };

  const isValidEmail = (value) => /^[^@]+@[^@]+\.[^@]+$/.test(String(value || '').trim());

  // derived validation state to block submit
  const validationState = (() => {
    const email = String(form.email || '').trim();
    const password = String(form.password || '');
    const roleValid = !!form.role;
    const emailOk = !!email && isValidEmail(email);
    const passOk = !!password;
    return { emailOk, passOk, roleValid };
  })();

  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // check required fields incl. role
    const email = String(form.email || '').trim();
    const password = String(form.password || '');
    if (!email || !password || !form.role) {
      setError('Please enter email, password, and select your role.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }

    setSubmitting(true);

    // Stubbed authentication: accept only the specific demo account
    const isDemoAccount = email.toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;

    if (isDemoAccount) {
      setError('');

      // Persist "remember me" choice (stub; no tokens)
      try {
        localStorage.setItem('vizai_auth_remember', JSON.stringify(!!form.remember));
        localStorage.setItem('vizai_auth_role', form.role);
        localStorage.setItem('vizai_auth_email', email);
      } catch {
        // ignore quota
      }

      // On successful login, enforce flow to Species Selection (/animals)
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

          <div className="field">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={onChange}
              aria-required="true"
              aria-invalid={!validationState.roleValid ? 'true' : 'false'}
            >
              <option value="">Select a role…</option>
              <option value="zookeeper">Zookeeper</option>
              <option value="vet">Veterinarian</option>
              <option value="analyst">Analyst</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {error ? <div className="error-banner" role="alert">{error}</div> : null}

          <div className="row-between" style={{ justifyContent: 'space-between' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                id="remember"
                name="remember"
                checked={form.remember}
                onChange={onChange}
              />
              Remember me
            </label>
            <button type="button" className="linklike" onClick={openForgotModal}>Forgot password?</button>
          </div>

          <button
            type="submit"
            className="btn-primary wide"
            aria-label="Login"
            disabled={submitting || !validationState.emailOk || !validationState.passOk || !validationState.roleValid}
            title={!validationState.roleValid ? 'Please select your role' : undefined}
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
