import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import './Admin.css'; // Reusing admin styles

export default function CaptainLogin() {
  const [username, setUsername] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const { login, loginError, isLoading } = useAdmin();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(username, accessKey);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="admin-modal-overlay" style={{ display: 'flex', position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(5,3,2,0.9)' }}>
      <div className="modal-box admin-login-box" style={{ margin: 'auto' }}>
        <div className="al-header">
          <h2 className="al-title">CAPTAIN LOGIN</h2>
          <div className="al-subtitle">ENTER KINGDOM CREDENTIALS</div>
        </div>

        <form onSubmit={handleLogin} className="al-form">
          <input
            type="text"
            className="admin-input"
            placeholder="USERNAME"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className="admin-input"
            placeholder="ACCESS KEY (PIN)"
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
            required
          />
          
          {loginError && <div className="al-error">{loginError}</div>}

          <button type="submit" className="btn-gold al-btn" disabled={isLoading}>
            {isLoading ? 'AUTHENTICATING...' : 'ACCESS DASHBOARD'}
          </button>
        </form>
      </div>
    </div>
  );
}
