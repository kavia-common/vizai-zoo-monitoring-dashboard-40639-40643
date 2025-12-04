import React, { useState } from 'react';
import { useApp } from '../state/AppContext';

/**
 * PUBLIC_INTERFACE
 * PasswordRecoveryModal renders inside the global ModalHost.
 * Accepts optional emailPrefill to hint the user's email.
 */
export default function PasswordRecoveryModal({ emailPrefill = '' }) {
  const { actions } = useApp();
  const [email, setEmail] = useState(emailPrefill || '');
  const [sent, setSent] = useState(false);

  const send = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Stub: Here we'd call backend to send a reset link.
    setSent(true);
    setTimeout(() => actions.closeModal(), 1200);
  };

  return (
    <div>
      {!sent ? (
        <>
          <p>Enter your account email. We will send a link to reset your password.</p>
          <form onSubmit={send} className="form" style={{ marginTop: 8 }}>
            <div className="field">
              <label htmlFor="reset-email">Email</label>
              <input id="reset-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@zoo.org" />
            </div>
            <button type="submit" className="btn-primary" style={{ height: 40, padding: '0 14px' }}>Send reset link</button>
          </form>
        </>
      ) : (
        <div className="card" style={{ background: 'transparent', border: '1px dashed var(--color-border)' }}>
          <strong>Check your inbox.</strong> If an account exists for {email}, a reset link has been sent.
        </div>
      )}
    </div>
  );
}
