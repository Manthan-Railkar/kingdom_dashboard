import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import './Panels.css';

const ACTIONS = [
  { icon: '💎', label: 'MANAGE POINTS' },
  { icon: '⚔', label: 'MANAGE TEAMS' },
  { icon: '🖼', label: 'UPLOAD MEDIA' },
  { icon: '📋', label: 'VIEW LOGS' },
];

export default function AdminQuickActions() {
  const { isAdmin } = useAdmin();
  if (!isAdmin) return null;

  return (
    <section className="panel admin-actions-panel">
      <div className="panel-header">
        <div className="panel-title-group">
          <span className="panel-icon">⚡</span>
          <h2 className="panel-title">ADMIN QUICK ACTIONS</h2>
        </div>
      </div>
      <div className="aqa-grid">
        {ACTIONS.map((a) => (
          <button key={a.label} className="aqa-btn">
            <span className="aqa-icon">{a.icon}</span>
            <span className="aqa-label">{a.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
