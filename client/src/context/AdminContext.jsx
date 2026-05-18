import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginAdmin, getMe } from '../api';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('q26_token'));
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginError, setLoginError] = useState('');

  const isAdmin = Boolean(admin);

  // Restore session on mount
  useEffect(() => {
    if (token) {
      getMe(token)
        .then(setAdmin)
        .catch(() => { localStorage.removeItem('q26_token'); setToken(null); });
    }
  }, [token]);

  // Ctrl+Q+2+6 hotkey
  useEffect(() => {
    const keys = new Set();
    const handleKeyDown = (e) => {
      keys.add(e.key.toLowerCase());
      if (
        (keys.has('control') || keys.has('meta')) &&
        keys.has('q') && keys.has('2') && keys.has('6')
      ) {
        e.preventDefault();
        setShowLoginModal(true);
      }
    };
    const handleKeyUp = (e) => keys.delete(e.key.toLowerCase());
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const login = async (accessKey) => {
    setIsLoading(true);
    setLoginError('');
    try {
      const data = await loginAdmin(accessKey);
      localStorage.setItem('q26_token', data.token);
      setToken(data.token);
      setAdmin(data.admin);
      setShowLoginModal(false);
      return true;
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Invalid access key');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('q26_token');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{
      admin, token, isAdmin, isLoading,
      showLoginModal, setShowLoginModal,
      loginError, setLoginError,
      login, logout,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};
