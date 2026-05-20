import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { ClipboardList, Users, UploadCloud, MonitorCheck, Home } from 'lucide-react';
import './Panels.css';

const ACTIONS = [
  { icon: ClipboardList, label: 'MANAGE POINTS' },
  { icon: Users, label: 'MANAGE TEAMS' },
  { icon: UploadCloud, label: 'UPLOAD MEDIA' },
  { icon: MonitorCheck, label: 'VIEW LOGS' },
];

export default function AdminQuickActions() {
  const { isAdmin } = useAdmin();
  if (!isAdmin) return null;

  return (
    <section className="panel admin-actions-panel">
      <div className="panel-header">
        <div className="panel-title-group">
          <Home size={14} className="panel-icon" color="#B87333" />
          <h2 className="panel-title">ADMIN QUICK ACTIONS</h2>
        </div>
      </div>
      <div className="aqa-grid">
        {ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <button key={a.label} className="aqa-btn">
              <span className="aqa-icon"><Icon size={20} color="#B87333" /></span>
              <span className="aqa-label">{a.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
