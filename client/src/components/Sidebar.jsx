import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { useSettings } from '../context/SettingsContext';
import { 
  Home, Trophy, TrendingUp, Newspaper, Users, Calendar, 
  Target, SlidersHorizontal, Image as ImageIcon, Settings, 
  Activity, UserCog, LogOut, CheckSquare
} from 'lucide-react';
import './Sidebar.css';

const NAV = [
  { id: 'overview',   icon: Home, label: 'OVERVIEW', adminOnly: false, settingKey: null },
  { id: 'leaderboard',icon: Trophy, label: 'LEADERBOARD', adminOnly: false, settingKey: 'showLeaderboard' },
  { id: 'trends',     icon: TrendingUp, label: 'TRENDS', adminOnly: false, settingKey: 'showTrends' },
  { id: 'news',       icon: Newspaper, label: 'NEWS & UPDATES', adminOnly: false, settingKey: 'showNews' },
  { id: 'teams',      icon: Users, label: 'TEAMS', adminOnly: false, settingKey: 'showTeams' },
  { id: 'events',     icon: Calendar, label: 'EVENTS', adminOnly: false, settingKey: 'showEvents' },
  { id: 'gallery',    icon: ImageIcon, label: 'MEDIA & GALLERY', adminOnly: false, settingKey: 'showGallery' },
  { id: 'round_mgmt', icon: Target, label: 'ROUND MANAGEMENT', superAdminOnly: true },
  { id: 'points_mgmt',icon: SlidersHorizontal, label: 'POINTS MANAGEMENT', superAdminOnly: true },
  { id: 'settings',   icon: Settings, label: 'SETTINGS', superAdminOnly: true },
  { id: 'activity',   icon: Activity, label: 'ACTIVITY LOGS', superAdminOnly: true },
  { id: 'admin_users',icon: UserCog, label: 'ADMIN USERS', superAdminOnly: true },
  { id: 'kingdom_profile', icon: Target, label: 'MY KINGDOM', kingdomAdminOnly: true, adminOnly: true },
  { id: 'logout',     icon: LogOut, label: 'LOGOUT', adminOnly: true },
];

export default function Sidebar({ active, onSelect }) {
  const { admin, isAdmin, isSuperAdmin, isKingdomAdmin, logout } = useAdmin();
  const { settings } = useSettings();

  const handleSelect = (id) => {
    if (id === 'logout') {
      logout();
      onSelect('overview');
      return;
    }
    onSelect(id);
  };

  const visibleNav = NAV.filter(item => {
    // 1. Check SuperAdmin strict restrictions
    if (item.superAdminOnly && !isSuperAdmin) return false;
    // 2. Check KingdomAdmin strict restrictions
    if (item.kingdomAdminOnly && !isKingdomAdmin) return false;
    // 3. Check Admin restrictions
    if (item.adminOnly && !isAdmin) return false;
    // 4. Check Settings (only hide for non-admins)
    if (!isAdmin && item.settingKey && settings[item.settingKey] === false) return false;
    
    return true;
  });

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
          <span className="sb-tagline">{isSuperAdmin ? 'SUPER ADMIN' : (isKingdomAdmin ? 'CAPTAIN MODE' : 'Unite. Compete. Reign.')}</span>
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
            <span>{isSuperAdmin ? 'SUPER ADMIN' : 'CAPTAIN'}</span>
          </div>
          <div className="sb-admin-status-content">
            <p className="sb-logged-in-text">Logged in as</p>
            <p className="sb-admin-role">{admin?.displayName || admin?.username}</p>
            {isKingdomAdmin && admin?.kingdomId?.name && (
              <p className="sb-last-login">Kingdom: {admin.kingdomId.name}</p>
            )}
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
