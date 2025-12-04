import React from 'react';
import { useApp } from '../state/AppContext';

// PUBLIC_INTERFACE
export default function ModalHost() {
  const { state, actions } = useApp();
  const { modal } = state;
  if (!modal.isOpen) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={modal.title || 'Modal'}>
      <div className="modal">
        <div className="modal-header">
          <h4>{modal.title}</h4>
          <button className="icon-btn" aria-label="Close modal" onClick={actions.closeModal}>✕</button>
        </div>
        <div className="modal-content">
          {modal.content || <div>Placeholder content</div>}
        </div>
      </div>
    </div>
  );
}
