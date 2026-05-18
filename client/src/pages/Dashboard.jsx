import React, { useState } from 'react';
import { ToastProvider } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Leaderboard from '../components/Leaderboard/Leaderboard';
import LiveTrends from '../components/panels/LiveTrends';
import KingdomNews from '../components/panels/KingdomNews';
import UpcomingEvents from '../components/panels/UpcomingEvents';
import AdminLogin from '../components/admin/AdminLogin';
import EmberParticles from '../components/common/EmberParticles';

export default function Dashboard() {
  const [active, setActive] = useState('overview');

  return (
    <ToastProvider>
      {/* Atmospheric background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'linear-gradient(180deg, #08060f 0%, #06050a 40%, #050408 100%)',
      }} />
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px)',
      }} />

      <EmberParticles />
      <AdminLogin />

      <div className="app-root">
        <Sidebar active={active} onSelect={setActive} />

        <main className="main-area">
          <Header />

          <div className="content-area">
            {/* Left — Leaderboard */}
            <div className="leaderboard-col">
              <Leaderboard />
            </div>

            {/* Right — 3 stacked panels */}
            <div className="right-col">
              <LiveTrends />
              <KingdomNews />
              <UpcomingEvents />
            </div>
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
