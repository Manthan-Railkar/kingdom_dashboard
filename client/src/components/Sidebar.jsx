import React from 'react';
import { useAdmin } from '../context/AdminContext';
import './Sidebar.css';

const NAV = [
  { id: 'overview',   icon: '⊞',  label: 'OVERVIEW' },
  { id: 'leaderboard',icon: '🏆', label: 'LEADERBOARD' },
  { id: 'trends',     icon: '📈', label: 'TRENDS' },
  { id: 'news',       icon: '📜', label: 'NEWS & UPDATES' },
  { id: 'teams',      icon: '⚔',  label: 'TEAMS' },
  { id: 'events',     icon: '🗓', label: 'EVENTS' },
  { id: 'gallery',    icon: '🖼', label: 'GALLERY' },
];

export default function Sidebar({ active, onSelect }) {
  const { isAdmin, setShowLoginModal } = useAdmin();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sb-logo">
        <div className="sb-emblem">
          <span className="sb-crown-top">♛</span>
          <div className="sb-shield">
            <span className="sb-q">Q</span>
          </div>
        </div>
        <div className="sb-brand">
          <span className="sb-title">QUANTUM 26</span>
          <span className="sb-tagline">Unite. Compete. Reign.</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sb-nav">
        {NAV.map((item) => (
          <button
            key={item.id}
            className={`sb-nav-item ${active === item.id ? 'active' : ''}`}
            onClick={() => onSelect(item.id)}
          >
            {active === item.id && <span className="sb-active-bar" />}
            <span className="sb-nav-icon">{item.icon}</span>
            <span className="sb-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Admin Footer */}
      <div className="sb-footer">
        <div className="sb-torches">
          <div className="sb-torch left"><div className="torch-flame" /><div className="torch-base" /></div>
          <div className="sb-torch right"><div className="torch-flame" /><div className="torch-base" /></div>
        </div>
        <button className="sb-admin-area" onClick={() => setShowLoginModal(true)}>
          <span className="sb-admin-title">ADMIN MODE</span>
          <span className="sb-admin-sub">Press and hold</span>
          <div className="sb-admin-keys">
            <kbd>CTRL</kbd><span>+</span><kbd>SHIFT</kbd><span>+</span><kbd>Q</kbd>
          </div>
          <span className="sb-admin-sub">to unlock admin login</span>
        </button>
      </div>
    </aside>
  );
}
