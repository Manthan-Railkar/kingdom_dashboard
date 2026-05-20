import React from 'react';
import { useApp } from '../context/AppContext';
import { useAdmin } from '../context/AdminContext';
import { useTimer } from '../hooks/useTimer';
import { Settings } from 'lucide-react';
import './Header.css';

export default function Header() {
  const { currentRound } = useApp();
  const { isAdmin, setShowLoginModal } = useAdmin();
  const timer = useTimer(currentRound);

  return (
    <header className="site-header">
      <div className="header-castle-bg" />
      
      {/* 
        The brand text and overlays are removed because the new header-banner.png 
        image has the exact logo, text, and perfect lighting baked into it. 
      */}
    </header>
  );
}
