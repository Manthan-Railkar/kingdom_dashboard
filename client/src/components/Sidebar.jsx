import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { 
  Home, Trophy, TrendingUp, Newspaper, Users, Calendar, 
  Target, SlidersHorizontal, Image as ImageIcon, Settings, 
  Activity, UserCog, LogOut, CheckSquare
} from 'lucide-react';
import './Sidebar.css';

const NAV = [
  { id: 'overview',   icon: Home, label: 'OVERVIEW', adminOnly: false },
  { id: 'leaderboard',icon: Trophy, label: 'LEADERBOARD', adminOnly: false },
  { id: 'trends',     icon: TrendingUp, label: 'TRENDS', adminOnly: false },
  { id: 'news',       icon: Newspaper, label: 'NEWS & UPDATES', adminOnly: false },
  { id: 'teams',      icon: Users, label: 'TEAMS', adminOnly: false },
  { id: 'events',     icon: Calendar, label: 'EVENTS', adminOnly: false },
  { id: 'gallery',    icon: ImageIcon, label: 'MEDIA & GALLERY', adminOnly: false },
  { id: 'round_mgmt', icon: Target, label: 'ROUND MANAGEMENT', adminOnly: true },
  { id: 'points_mgmt',icon: SlidersHorizontal, label: 'POINTS MANAGEMENT', adminOnly: true },
  { id: 'settings',   icon: Settings, label: 'SETTINGS', adminOnly: true },
  { id: 'activity',   icon: Activity, label: 'ACTIVITY LOGS', adminOnly: true },
  { id: 'admin_users',icon: UserCog, label: 'ADMIN USERS', adminOnly: true },
  { id: 'logout',     icon: LogOut, label: 'LOGOUT', adminOnly: true },
];

export default function Sidebar({ active, onSelect }) {
  const { isAdmin, logout } = useAdmin();

  const handleSelect = (id) => {
    if (id === 'logout') {
      logout();
      onSelect('overview');
      return;
    }
    onSelect(id);
  };

  const visibleNav = NAV.filter(item => !item.adminOnly || isAdmin);

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sb-logo">
        <div className="sb-emblem">
          <span className="sb-crown-top"></span>
          <div className="sb-shield">
            <span className="sb-q">Q</span>
          </div>
        </div>
        <div className="sb-brand">
          <span className="sb-title">QUANTUM 26</span>
          <span className="sb-tagline">{isAdmin ? 'ADMIN MODE' : 'Unite. Compete. Reign.'}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sb-nav">
        {visibleNav.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`sb-nav-item ${active === item.id ? 'active' : ''}`}
              onClick={() => handleSelect(item.id)}
              data-label={item.label}
            >
              {active === item.id && <span className="sb-active-bar" />}
              <span className="sb-nav-icon">
                <Icon size={16} strokeWidth={2} />
              </span>
              <span className="sb-nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Admin Status */}
      {isAdmin && (
        <div className="sb-admin-status-box">
          <div className="sb-admin-status-header">
            <CheckSquare size={16} className="sb-admin-status-icon" color="#4caf50" />
            <span>ADMIN STATUS</span>
          </div>
          <div className="sb-admin-status-content">
            <p className="sb-logged-in-text">You are logged in as</p>
            <p className="sb-admin-role">Super Admin</p>
            <p className="sb-last-login">Last Login: Today, 09:15 AM</p>
          </div>
        </div>
      )}

      {/* Copyright */}
      <div className="sb-copyright">
        © Quantum 26 | All Rights Reserved
      </div>
    </aside>
  );
}
