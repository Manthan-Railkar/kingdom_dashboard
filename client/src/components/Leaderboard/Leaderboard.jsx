import React from 'react';
import { useApp } from '../../context/AppContext';
import { Crown } from 'lucide-react';
import MiniKingdomCard from './MiniKingdomCard';
import './Leaderboard.css';

export default function Leaderboard() {
  const { kingdoms } = useApp();

  return (
    <section className="lb-panel panel">
      {/* Header */}
      <div className="lb-header panel-header">
        <Crown size={16} className="panel-crown" />
        <h2 className="panel-title">LEADERBOARD</h2>
        <span className="lb-scroll-hint-txt">All Kingdoms</span>
      </div>

      {/* Unified grid — all 10 kingdoms, same card size */}
      <div className="lb-unified-grid">
        {kingdoms.map((k, i) => (
          <MiniKingdomCard key={k._id} kingdom={k} rank={i + 1} delay={i * 0.05} />
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
