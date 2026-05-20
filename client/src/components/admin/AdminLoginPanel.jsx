import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';
import './Admin.css';

export default function AdminLoginPanel() {
  const { login, isLoading, loginError, setLoginError, setShowLoginModal } = useAdmin();
  const { addToast } = useToast();
  const [key, setKey] = useState('');

  const handleLogin = async () => {
    if (!key.trim()) return;
    const success = await login(key.trim());
    if (success) { setKey(''); addToast('Welcome, Admin! ', 'success'); }
  };

  return (
    <section className="panel admin-login-panel">
      <div className="panel-header">
        <div className="panel-title-group">
          <span className="panel-icon"></span>
          <h2 className="panel-title">ADMIN LOGIN</h2>
        </div>
      </div>
      <div className="alp-body">
        <span className="alp-lock"></span>
        <p className="alp-title">Secure Admin Login</p>
        <p className="alp-subtitle">Enter Admin Key</p>
        <input
          type="password"
          className="input-field alp-input"
          placeholder="Enter 4-digit Key"
          value={key}
          onChange={(e) => { setKey(e.target.value); setLoginError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          maxLength={10}
        />
        {loginError && <p className="alp-error">{loginError}</p>}
        <button className="btn-primary alp-submit" onClick={handleLogin} disabled={isLoading || !key.trim()}>
          {isLoading ? 'VERIFYING...' : 'LOGIN'}
        </button>
        <p className="alp-hint">Default Key: <kbd>Ctrl + Q + 2 + 6</kbd></p>
      </div>
    </section>
  );
}
