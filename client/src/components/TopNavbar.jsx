import React from 'react';
import { 
  Home, Trophy, TrendingUp, Newspaper, Users, Calendar, 
  Sparkles, Image as ImageIcon, UserCircle
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import './TopNavbar.css';
import './Sidebar.css';

export default function TopNavbar({ active, onSelect }) {
  const { setShowLoginModal } = useAdmin();

  const navItems = [
    { id: 'know_kingdoms', label: 'KNOW YOUR KINGDOM', icon: Sparkles },
    { id: 'overview', label: 'OVERVIEW', icon: Home },
    { id: 'leaderboard', label: 'LEADERBOARD', icon: Trophy },
    { id: 'trends', label: 'TRENDS', icon: TrendingUp },
    { id: 'news', label: 'NEWS & UPDATES', icon: Newspaper },
    { id: 'teams', label: 'TEAMS', icon: Users },
    { id: 'events', label: 'EVENTS', icon: Calendar },
    { id: 'gallery', label: 'GALLERY', icon: ImageIcon }
  ];

  return (
    <nav className="top-navbar">
      {/* Left: Brand */}
      <div className="tn-brand">
        <div className="sb-emblem" style={{ margin: 0, transform: 'scale(0.7)', transformOrigin: 'center' }}>
          <span className="sb-crown-top"></span>
          <div className="sb-shield" style={{ overflow: 'hidden' }}>
            <img src="/quantum_logo.png" alt="Quantum 26" style={{ width: '110%', height: '110%', objectFit: 'cover' }} />
          </div>
        </div>
        <div className="tn-title-wrap">
          <span className="tn-title">QUANTUM 26</span>
          <span className="tn-tagline">Unite. Compete. Reign.</span>
        </div>
      </div>

      {/* Center: Navigation Tabs */}
      <div className="tn-links">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`tn-item ${active === item.id ? 'active' : ''}`}
              onClick={() => onSelect(item.id)}
            >
              <span className="tn-icon"><Icon size={14} strokeWidth={2} /></span>
              <span className="tn-label">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right: Admin Login */}
      <button 
        className="tn-item tn-login-btn"
        onClick={() => setShowLoginModal(true)}
      >
        <span className="tn-icon"><UserCircle size={14} strokeWidth={2} /></span>
        <span className="tn-label">ADMIN LOGIN</span>
      </button>
    </nav>
  );
}
