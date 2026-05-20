import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Flame, Mountain, Bird, Wind, Anchor, Star, Zap, Crown, Trophy } from 'lucide-react';
import KingdomDetailsModal from './KingdomDetailsModal';
import './LeaderboardPage.css';

const getKingdomIcon = (name, size = 28) => {
  const n = name.toLowerCase();
  if (n.includes('phoenix') || n.includes('fire')) return <Flame size={size} strokeWidth={1.5} />;
  if (n.includes('titan') || n.includes('stone') || n.includes('mountain')) return <Mountain size={size} strokeWidth={1.5} />;
  if (n.includes('leviathan') || n.includes('water') || n.includes('sea')) return <Anchor size={size} strokeWidth={1.5} />;
  if (n.includes('dragon') || n.includes('sky') || n.includes('wind')) return <Wind size={size} strokeWidth={1.5} />;
  if (n.includes('eagle') || n.includes('raven')) return <Bird size={size} strokeWidth={1.5} />;
  if (n.includes('wolf') || n.includes('lion') || n.includes('guard')) return <Shield size={size} strokeWidth={1.5} />;
  if (n.includes('star') || n.includes('sun')) return <Star size={size} strokeWidth={1.5} />;
  if (n.includes('storm')) return <Zap size={size} strokeWidth={1.5} />;
  return <Crown size={size} strokeWidth={1.5} />;
};

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16) || 200;
  const g = parseInt(hex.slice(3, 5), 16) || 160;
  const b = parseInt(hex.slice(5, 7), 16) || 40;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function LeaderboardPage() {
  const { kingdoms } = useApp();
  const [mounted, setMounted] = useState(false);
  const [selectedKingdom, setSelectedKingdom] = useState(null);

  useEffect(() => {
    // Trigger entrance animation
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`lb-page ${mounted ? 'lb-page--entered' : ''}`}>
      
      {/* ---- Header Banner Area ---- */}
      <div className="lb-page-header">
        <div className="lb-page-header-bg" />
        <div className="lb-page-header-overlay" />
        
        <div className="lb-page-header-content">
          {/* Wings of Freedom crest */}
          <div className="lb-page-crest">
            <Trophy size={36} strokeWidth={1.5} />
          </div>
          <h1 className="lb-page-title">LEADERBOARD</h1>
          <p className="lb-page-subtitle">THE GREATEST KINGDOMS. THE STRONGEST LEGACIES.</p>
          
          {/* Decorative divider */}
          <div className="lb-page-divider">
            <span className="lb-page-divider-line" />
            <span className="lb-page-divider-diamond">◆</span>
            <span className="lb-page-divider-line" />
          </div>
        </div>
      </div>

      {/* ---- Table Container ---- */}
      <div className="lb-table-wrap">
        {/* Table Header */}
        <div className="lb-table-header">
          <span className="lb-th lb-th-rank">RANK</span>
          <span className="lb-th lb-th-kingdom">KINGDOM</span>
          <span className="lb-th lb-th-points">POINTS</span>
          <span className="lb-th lb-th-delta">CHANGE</span>
        </div>

        {/* Table Body — Rows */}
        <div className="lb-table-body">
          {kingdoms.map((k, i) => {
            const rank = i + 1;
            const isTopThree = rank <= 3;
            const baseColor = k.color || '#B87333';
            const glowColor = hexToRgba(baseColor, 0.4);
            const isPos = k.pointsDelta >= 0;

            return (
              <div
                key={k._id}
                className={`lb-row ${isTopThree ? 'lb-row--top' : ''} ${mounted ? 'lb-row--visible' : ''}`}
                style={{
                  '--row-delay': `${i * 0.08}s`,
                  '--row-color': baseColor,
                  '--row-glow': glowColor,
                }}
                onClick={() => setSelectedKingdom(k)}
              >
                {/* Rank Shield */}
                <div className="lb-cell lb-cell-rank">
                  <div className={`lb-rank-shield ${isTopThree ? `lb-rank-shield--${rank}` : ''}`}>
                    <span className="lb-rank-num">{rank}</span>
                  </div>
                </div>

                {/* Kingdom */}
                <div className="lb-cell lb-cell-kingdom">
                  <div className="lb-kingdom-icon" style={{ color: baseColor, filter: `drop-shadow(0 0 6px ${glowColor})` }}>
                    {getKingdomIcon(k.name, 26)}
                  </div>
                  <span className="lb-kingdom-name">{k.name}</span>
                </div>

                {/* Points */}
                <div className="lb-cell lb-cell-points">
                  <span className="lb-points-val" style={{ color: '#e5d39a' }}>
                    {k.points.toLocaleString()}
                  </span>
                </div>

                {/* Delta */}
                <div className="lb-cell lb-cell-delta">
                  {k.pointsDelta !== 0 ? (
                    <span className={`lb-delta-badge ${isPos ? 'lb-delta--pos' : 'lb-delta--neg'}`}>
                      {isPos ? '▲' : '▼'} {isPos ? '+' : ''}{k.pointsDelta}
                    </span>
                  ) : (
                    <span className="lb-delta-badge lb-delta--neutral">—</span>
                  )}
                </div>

                {/* Decorative crest icon on right */}
                <div className="lb-row-crest" style={{ color: baseColor, opacity: 0.25 }}>
                  {getKingdomIcon(k.name, 18)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kingdom Details Modal */}
      <KingdomDetailsModal
        kingdom={selectedKingdom}
        onClose={() => setSelectedKingdom(null)}
      />
    </div>
  );
}
