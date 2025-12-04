import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

// PUBLIC_INTERFACE
export default function Register() {
  /**
   * Registration screen. Stubbed validation:
   * - required fields
   * - password >= 8 and matches confirm
   * On success navigate -> /login.
   * Footer "Login" link -> /login
   */
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email.trim())) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    if (form.password && form.password.length < 8) e.password = 'Use at least 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // Stub: Normally call API. For now, redirect to login per spec.
    navigate('/login', { replace: true });
  };

  return (
    <div className="auth-shell">
      <div className="auth-form-card">
        <div className="brand-badge">VIZAI<span className="dot">•</span></div>
        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">Join VIZAI to access monitoring dashboards and alerts.</p>

        <form className="form" onSubmit={onSubmit} noValidate>
          <div className={`field ${errors.name ? 'error' : ''}`}>
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" value={form.name} onChange={onChange} placeholder="Jane Doe" />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>
          <div className={`field ${errors.email ? 'error' : ''}`}>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" value={form.email} onChange={onChange} placeholder="jane@zoo.org" />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>
          <div className={`field ${errors.password ? 'error' : ''}`}>
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={form.password} onChange={onChange} placeholder="••••••••" />
            {errors.password && <div className="error-text">{errors.password}</div>}
          </div>
          <div className={`field ${errors.confirm ? 'error' : ''}`}>
            <label htmlFor="confirm">Confirm password</label>
            <input id="confirm" name="confirm" type="password" value={form.confirm} onChange={onChange} placeholder="••••••••" />
            {errors.confirm && <div className="error-text">{errors.confirm}</div>}
          </div>

          <button type="submit" className="btn-primary wide" aria-label="Register">Create account</button>
        </form>

        <div className="auth-footer">
          <div className="alt">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
