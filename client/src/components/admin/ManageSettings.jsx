import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';
import { Check, X } from 'lucide-react';
import './Admin.css';

export default function ManageSettings() {
  const { settings, updateSettings } = useSettings();
  const { token } = useAdmin();
  const { addToast } = useToast();
  const [localSettings, setLocalSettings] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (key) => {
    setLocalSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const success = await updateSettings(localSettings, token);
    if (success) {
      addToast('Settings saved successfully', 'success');
    } else {
      addToast('Failed to save settings', 'error');
    }
    setIsSaving(false);
  };

  const SETTING_ITEMS = [
    { key: 'showLeaderboard', label: 'Show Leaderboard' },
    { key: 'showTrends', label: 'Show Trends' },
    { key: 'showNews', label: 'Show News & Updates' },
    { key: 'showTeams', label: 'Show Teams' },
    { key: 'showEvents', label: 'Show Events' },
    { key: 'showGallery', label: 'Show Media & Gallery' },
  ];

  return (
    <section className="admin-panel">
      <div className="al-header">
        <h2 className="al-title">GLOBAL SETTINGS</h2>
        <div className="al-subtitle">MANAGE PUBLIC DASHBOARD VISIBILITY</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        {SETTING_ITEMS.map(item => (
          <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(184,115,51,0.2)' }}>
            <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
              {item.label}
            </span>
            <button 
              onClick={() => handleToggle(item.key)}
              style={{
                background: localSettings[item.key] ? 'rgba(68,221,136,0.1)' : 'rgba(255,68,68,0.1)',
                border: `1px solid ${localSettings[item.key] ? 'rgba(68,221,136,0.4)' : 'rgba(255,68,68,0.4)'}`,
                color: localSettings[item.key] ? '#44dd88' : '#ff4444',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem'
              }}
            >
              {localSettings[item.key] ? <Check size={14} /> : <X size={14} />}
              {localSettings[item.key] ? 'VISIBLE' : 'HIDDEN'}
            </button>
          </div>
        ))}

        <button 
          className="btn-gold" 
          onClick={handleSave} 
          disabled={isSaving}
          style={{ marginTop: '20px', padding: '12px' }}
        >
          {isSaving ? 'SAVING...' : 'SAVE SETTINGS'}
        </button>
      </div>
    </section>
  );
}
