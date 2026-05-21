import React, { useState, Suspense, useEffect } from 'react';
import { ToastProvider } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import Leaderboard from '../components/Leaderboard/Leaderboard';
import LeaderboardPage from '../components/Leaderboard/LeaderboardPage';
import TrendsPage from '../components/Trends/TrendsPage';
import TeamsPage from '../components/Teams/TeamsPage';
import CaptainTeams from '../components/captain/CaptainTeams';
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
import EventsPage from '../components/Events/EventsPage';
import ManageAdmins from '../components/admin/ManageAdmins';
import ManageSettings from '../components/admin/ManageSettings';
import KingdomProfile from '../components/admin/KingdomProfile';
import RoundManagement from '../components/panels/RoundManagement';
import Gallery from '../components/panels/Gallery';
import NewsPopup from '../components/common/NewsPopup';
import { useAdmin } from '../context/AdminContext';
import { useSettings } from '../context/SettingsContext';
const KnowYourKingdomPortal = React.lazy(() => import('../components/KnowYourKingdoms/KnowYourKingdomPortal'));

export default function Dashboard() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { isAdmin, isSuperAdmin, isKingdomAdmin, isInitializing } = useAdmin();
  const { settings } = useSettings();
  const isNormalUser = !isSuperAdmin && !isKingdomAdmin;
  const [active, setActive] = useState(isNormalUser ? 'know_kingdoms' : 'overview');

  useEffect(() => {
    if (!isNormalUser && active === 'know_kingdoms') {
      setActive('overview');
    }
  }, [isNormalUser, active]);

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
    if (isSuperAdmin && active === 'points_mgmt') {
      return (
        <div className="leaderboard-col" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <ManagePoints />
        </div>
      );
    }
    
    if (isSuperAdmin && active === 'round_mgmt') {
      return (
        <div className="leaderboard-col" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <RoundManagement />
        </div>
      );
    }

    if (isSuperAdmin && active === 'manage_news') {
      return (
        <div className="leaderboard-col" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <ManageNews />
        </div>
      );
    }

    if (isSuperAdmin && active === 'manage_gallery') {
      return (
        <div className="leaderboard-col" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Gallery />
        </div>
      );
    }

    if (active === 'teams') {
      if (isSuperAdmin) {
        return (
          <div className="leaderboard-col" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <ManageTeams />
          </div>
        );
      }
      if (isKingdomAdmin) {
        return (
          <div className="leaderboard-col" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <CaptainTeams />
          </div>
        );
      }
      return <TeamsPage />;
    }

    if (active === 'events') {
      if (isSuperAdmin) {
        return (
          <div className="leaderboard-col" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <ManageEvents />
          </div>
        );
      }
      return <EventsPage />;
    }

    if (isSuperAdmin && active === 'admin_users') {
      return (
        <div className="leaderboard-col" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <ManageAdmins />
        </div>
      );
    }

    if (isSuperAdmin && active === 'settings') {
      return (
        <div className="leaderboard-col" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <ManageSettings />
        </div>
      );
    }

    if (isKingdomAdmin && active === 'kingdom_profile') {
      return (
        <div className="leaderboard-col" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <KingdomProfile />
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

    if (active === 'know_kingdoms') {
      return (
        <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'rgba(130,160,220,0.4)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em' }}>LOADING PORTAL...</div>}>
          <KnowYourKingdomPortal />
        </Suspense>
      );
    }

    if (active === 'leaderboard') {
      return <LeaderboardPage />;
    }

    if (active === 'trends') {
      return <TrendsPage />;
    }

    if (active === 'news') {
      if (isSuperAdmin) {
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
      <NewsPopup />
      <PageTransition isVisible={isTransitioning} />

      {isInitializing ? (
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'rgba(150,110,60,0.4)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', letterSpacing: '0.1em' }}>
          LOADING REALM...
        </div>
      ) : (
        <div className={`app-root ${isNormalUser ? 'app-root--top-nav' : ''}`}>
          {isNormalUser ? (
            <TopNavbar active={active} onSelect={handleTabChange} />
          ) : (
            <Sidebar active={active} onSelect={handleTabChange} />
          )}

          <main className={`main-area ${isNormalUser ? 'main-area--top-nav' : ''}`}>
            <div className={['leaderboard', 'news', 'gallery', 'trends', 'teams', 'events', 'know_kingdoms'].includes(active) ? "content-area content-area--full" : "content-area"}>
              {renderContent()}
            </div>
          </main>
        </div>
      )}
    </ToastProvider>
  );
}
