import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import PasswordRecoveryModal from '../components/PasswordRecoveryModal';
import { useApp } from '../state/AppContext';

// PUBLIC_INTERFACE
export default function Login() {
  /**
   * Login screen per spec:
   * - On success -> /animals (Animal Selection)
   * - On incorrect -> inline error
   * - Footer "Register" link -> /register
   * - "Forgot password" -> open modal
   */
  const navigate = useNavigate();
  const { actions } = useApp();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    // Stub logic: succeed only if password equals "demo1234" for now
    if (!form.email || !form.password) {
      setError('Please enter email and password.');
      return;
    }
    if (form.password === 'demo1234') {
      setError('');
      navigate('/animals', { replace: true });
    } else {
      setError('Incorrect email or password.');
    }
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
            <input id="email" name="email" value={form.email} onChange={onChange} placeholder="you@zoo.org" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={form.password} onChange={onChange} placeholder="••••••••" />
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
      </div>
    </div>
  );
}
