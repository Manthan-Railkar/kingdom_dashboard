import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    showLeaderboard: true,
    showTrends: true,
    showNews: true,
    showTeams: true,
    showEvents: true,
    showGallery: true
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/api/settings');
      setSettings(res.data);
    } catch (err) {
      console.error('Failed to fetch settings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings, token) => {
    try {
      const res = await axios.patch('/api/settings', newSettings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(res.data);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, fetchSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
