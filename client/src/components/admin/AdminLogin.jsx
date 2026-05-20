import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';
import './Admin.css';

export default function AdminLogin() {
  const { showLoginModal, setShowLoginModal, login, isLoading, loginError, setLoginError } = useAdmin();
  const { addToast } = useToast();
  const [username, setUsername] = useState('');
  const [key, setKey] = useState('');

  if (!showLoginModal) return null;

  const handleLogin = async () => {
    if (!username.trim() || !key.trim()) return;
    const success = await login(username.trim(), key.trim());
    if (success) {
      setKey('');
      setUsername('');
      addToast('Welcome, Admin! ', 'success');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleLogin();
    if (e.key === 'Escape') { setShowLoginModal(false); setKey(''); setUsername(''); setLoginError(''); }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowLoginModal(false)}>
      <div className="modal-box admin-login-modal">
        <button className="modal-close" onClick={() => { setShowLoginModal(false); setKey(''); setLoginError(''); }}></button>

        <div className="al-header">
          <div className="al-lock-icon"></div>
          <h2 className="al-title">ADMIN LOGIN</h2>
          <p className="al-subtitle">Secure Admin Access</p>
        </div>

        <div className="al-body">
          <label className="al-label">Username</label>
          <input
            type="text"
            className={`input-field al-input ${loginError ? 'input-error' : ''}`}
            placeholder="Admin ID"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setLoginError(''); }}
            onKeyDown={handleKeyPress}
            style={{ fontSize: '1rem', letterSpacing: '0.1em', marginBottom: '10px' }}
            autoFocus
          />
          <label className="al-label">Enter Admin Key</label>
          <input
            type="password"
            className={`input-field al-input ${loginError ? 'input-error' : ''}`}
            placeholder="****"
            value={key}
            onChange={(e) => { setKey(e.target.value); setLoginError(''); }}
            onKeyDown={handleKeyPress}
            maxLength={10}
          />
          {loginError && <span className="al-error">{loginError}</span>}

          <button
            className="btn-primary al-submit"
            onClick={handleLogin}
            disabled={isLoading || !key.trim()}
          >
            {isLoading ? 'VERIFYING...' : 'LOGIN →'}
          </button>

          <p className="al-hint">Default Key: <kbd>Ctrl + Q + 2 + 6</kbd></p>
        </div>
      </div>
    </div>
  );
}
