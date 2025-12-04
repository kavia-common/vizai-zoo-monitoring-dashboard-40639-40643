import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

// PUBLIC_INTERFACE
export default function Register() {
  /**
   * Registration screen. Stubbed validation:
   * - required fields
   * - password >= 8 and matches confirm
   * - Role dropdown required
   * - Terms checkbox must be accepted
   * On success navigate -> /login.
   * Footer "Login" link -> /login
   */
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    role: '',
    terms: false,
  });
  const [errors, setErrors] = useState({});

  const onChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (!/^[^@]+@[^@]+\.[^@]+$/.test((form.email || '').trim())) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    if (form.password && form.password.length < 8) e.password = 'Use at least 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    if (!form.role) e.role = 'Please select a role';
    if (!form.terms) e.terms = 'You must accept Terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // Stub: Normally call API. For now, redirect to login per spec.
    navigate('/login', { replace: true });
  };

  const roleFieldClass = (key) => (errors[key] ? 'field error' : 'field');

  return (
    <div className="auth-shell">
      <div className="auth-form-card">
        <div className="brand-badge">VIZAI<span className="dot">•</span></div>
        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">Join VIZAI to access monitoring dashboards and alerts.</p>

        <form className="form" onSubmit={onSubmit} noValidate>
          <div className={errors.name ? 'field error' : 'field'}>
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" value={form.name} onChange={onChange} placeholder="Jane Doe" />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>

          <div className={errors.email ? 'field error' : 'field'}>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" value={form.email} onChange={onChange} placeholder="jane@zoo.org" />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <div className={errors.password ? 'field error' : 'field'}>
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={form.password} onChange={onChange} placeholder="••••••••" />
            {errors.password && <div className="error-text">{errors.password}</div>}
          </div>

          <div className={errors.confirm ? 'field error' : 'field'}>
            <label htmlFor="confirm">Confirm password</label>
            <input id="confirm" name="confirm" type="password" value={form.confirm} onChange={onChange} placeholder="••••••••" />
            {errors.confirm && <div className="error-text">{errors.confirm}</div>}
          </div>

          <div className={roleFieldClass('role')}>
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={form.role} onChange={onChange} aria-required="true" aria-invalid={errors.role ? 'true' : 'false'}>
              <option value="">Select a role…</option>
              <option value="zookeeper">Zookeeper</option>
              <option value="vet">Veterinarian</option>
              <option value="analyst">Analyst</option>
              <option value="admin">Administrator</option>
            </select>
            {errors.role && <div className="error-text">{errors.role}</div>}
          </div>

          <div className={errors.terms ? 'field error' : 'field'}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" id="terms" name="terms" checked={form.terms} onChange={onChange} />
              I agree to the Terms of Service and Privacy Policy
            </label>
            {errors.terms && <div className="error-text">{errors.terms}</div>}
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
