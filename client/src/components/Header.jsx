import React from 'react';
import { useApp } from '../context/AppContext';
import { useAdmin } from '../context/AdminContext';
import { useTimer } from '../hooks/useTimer';
import './Header.css';

export default function Header() {
  const { currentRound } = useApp();
  const { isAdmin, setShowLoginModal } = useAdmin();
  const timer = useTimer(currentRound);

  return (
    <header className="site-header">
      <div className="header-castle-bg" />
      <div className="header-overlay" />

      {/* Center Brand */}
      <div className="header-brand">
        <div className="header-ornament-row">
          <span className="hdr-line">━━━</span>
          <span className="hdr-deco">◈</span>
          <h1 className="hdr-title">QUANTUM 26</h1>
          <span className="hdr-deco">◈</span>
          <span className="hdr-line">━━━</span>
        </div>
        <p className="hdr-subtitle">BATTLE. EARN. CONQUER.</p>
      </div>

      {/* Right: Round Info + Actions */}
      <div className="header-right">
        <div className="round-info-box">
          <div className="rib-top">
            <div className="rib-badge">
              <span className="rib-icon">⚔</span>
              <span className="rib-round-num">ROUND 3</span>
            </div>
            <div className="rib-live">
              <span className="live-dot" />
              <span className="live-text">LIVE</span>
            </div>
          </div>
          <div className="rib-label">CURRENT ROUND</div>
          <div className="rib-name">{currentRound?.name || 'Coding Clash'}</div>
          <div className="rib-timer">
            <div className="rib-timer-block">
              <span className="rib-t-val">{timer.hrs}</span>
              <span className="rib-t-unit">HRS</span>
            </div>
            <span className="rib-t-sep">:</span>
            <div className="rib-timer-block">
              <span className="rib-t-val">{timer.mins}</span>
              <span className="rib-t-unit">MINS</span>
            </div>
            <span className="rib-t-sep">:</span>
            <div className="rib-timer-block">
              <span className="rib-t-val">{timer.secs}</span>
              <span className="rib-t-unit">SECS</span>
            </div>
          </div>
          <button className="rib-details-btn">ROUND DETAILS →</button>
        </div>

        <div className="header-action-buttons">
          <button className="hdr-action-btn notif-btn" onClick={() => setShowLoginModal(true)}>
            <span>🔔</span>
            <span className="notif-badge">3</span>
          </button>
          <button className="hdr-action-btn">
            <span className="help-q">?</span>
          </button>
        </div>
      </div>

      {/* Decorative red banner flags */}
      <div className="hdr-banners">
        <div className="hdr-banner banner-1" />
        <div className="hdr-banner banner-2" />
      </div>
    </header>
  );
}
