import React, { useState } from 'react';
import { ToastProvider } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import Leaderboard from '../components/Leaderboard/Leaderboard';
import LeaderboardPage from '../components/Leaderboard/LeaderboardPage';
import TrendsPage from '../components/Trends/TrendsPage';
import TeamsPage from '../components/Teams/TeamsPage';
import NewsPage from '../components/News/NewsPage';
import ManageNews from '../components/admin/ManageNews';
import LiveTrends from '../components/panels/LiveTrends';
import KingdomNews from '../components/panels/KingdomNews';
import UpcomingEvents from '../components/panels/UpcomingEvents';
import AdminLogin from '../components/admin/AdminLogin';
import EmberParticles from '../components/common/EmberParticles';
import PageTransition from '../components/common/PageTransition';
import ManagePoints from '../components/admin/ManagePoints';
import ManageTeams from '../components/admin/ManageTeams';
import ManageEvents from '../components/admin/ManageEvents';
import ManageAdmins from '../components/admin/ManageAdmins';
import RoundManagement from '../components/panels/RoundManagement';
import Gallery from '../components/panels/Gallery';
import { useAdmin } from '../context/AdminContext';

export default function Dashboard() {
  const [active, setActive] = useState('overview');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { isAdmin } = useAdmin();

  const handleTabChange = (newTab) => {
    if (newTab === active) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActive(newTab);
    }, 200); // Wait for fade in
    setTimeout(() => {
      setIsTransitioning(false);
    }, 700); // Complete animation duration
  };

  const renderContent = () => {
    if (isAdmin && active === 'points_mgmt') {
      return (
        <div className="leaderboard-col" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <ManagePoints />
        </div>
      );
    }
    
    if (isAdmin && active === 'round_mgmt') {
      return (
        <div className="leaderboard-col" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <RoundManagement />
        </div>
      );
    }

    if (active === 'teams') {
      if (isAdmin) {
        return (
          <div className="leaderboard-col" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <ManageTeams />
          </div>
        );
      }
      return <TeamsPage />;
    }

    if (isAdmin && active === 'events') {
      return (
        <div className="leaderboard-col" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <ManageEvents />
        </div>
      );
    }

    if (isAdmin && active === 'admin_users') {
      return (
        <div className="leaderboard-col" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <ManageAdmins />
        </div>
      );
    }

    if (active === 'gallery') {
      return (
        <div className="leaderboard-col" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Gallery />
        </div>
      );
    }

    if (active === 'leaderboard') {
      return <LeaderboardPage />;
    }

    if (active === 'trends') {
      return <TrendsPage />;
    }

    if (active === 'news') {
      if (isAdmin) {
        return (
          <div className="leaderboard-col" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <ManageNews />
          </div>
        );
      }
      return <NewsPage />;
    }

    // Default View (Overview, Leaderboard, etc.)
    return (
      <>
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
      </>
    );
  };

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
      <PageTransition isVisible={isTransitioning} />

      <div className="app-root">
        <Sidebar active={active} onSelect={handleTabChange} />

        <main className="main-area">
          <div className={active === 'leaderboard' ? "content-area content-area--full" : "content-area"}>
            {renderContent()}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
