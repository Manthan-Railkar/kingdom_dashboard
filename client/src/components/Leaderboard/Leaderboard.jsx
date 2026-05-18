import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import KingdomCard from './KingdomCard';
import MiniKingdomCard from './MiniKingdomCard';
import './Leaderboard.css';

export default function Leaderboard() {
  const { kingdoms } = useApp();
  const [view, setView] = useState('expanded');
  const top3 = kingdoms.slice(0, 3);
  const rest  = kingdoms.slice(3);

  return (
    <section className="lb-panel panel">
      {/* Header */}
      <div className="lb-header panel-header">
        <span className="panel-crown">♛</span>
        <h2 className="panel-title">LEADERBOARD</h2>
        <div className="lb-toggle">
          <button className={`lb-tog-btn ${view==='expanded'?'lb-tog-active':''}`} onClick={()=>setView('expanded')}>EXPANDED</button>
          <button className={`lb-tog-btn ${view==='contracted'?'lb-tog-active':''}`} onClick={()=>setView('contracted')}>CONTRACTED</button>
        </div>
        <span className="lb-scroll-hint-txt">Scroll to reveal other kingdoms</span>
        <div className="lb-nav-btns">
          <button className="lb-nav-arrow">←</button>
          <button className="lb-nav-arrow">→</button>
        </div>
      </div>

      {/* Top 3 Banner Cards */}
      <div className={`lb-top3 ${view === 'contracted' ? 'contracted' : ''}`}>
        {top3.map((k, i) => (
          <KingdomCard key={k._id} kingdom={k} rank={i+1} delay={i} />
        ))}
      </div>

      {/* Scroll hint bar */}
      <div className="lb-scroll-bar">
        <span className="lb-scroll-arr">↓</span>
        <span>Scroll down to view more kingdoms (4–10)</span>
        <span className="lb-scroll-arr">↓</span>
      </div>

      {/* Mini cards row */}
      <div className="lb-mini-row">
        {rest.map((k, i) => (
          <MiniKingdomCard key={k._id} kingdom={k} delay={0.5 + i * 0.07} />
        ))}
      </div>

      {/* Pagination dots */}
      <div className="lb-dots">
        <span className="lb-dot active" />
        <span className="lb-dot" />
        <span className="lb-dot" />
      </div>
    </section>
  );
}
