import React from 'react';
import { useCountUp } from '../../hooks/useCountUp';
import SparklineCanvas from '../common/SparklineCanvas';
import './KingdomCard.css';

const RANK_STYLES = {
  1: { bgClass: 'card-gold',  borderColor: '#c9a227', glowColor: 'rgba(201,162,39,0.5)' },
  2: { bgClass: 'card-blue',  borderColor: '#4a82c9', glowColor: 'rgba(74,130,201,0.45)' },
  3: { bgClass: 'card-red',   borderColor: '#c93030', glowColor: 'rgba(201,48,48,0.45)' },
};

export default function KingdomCard({ kingdom, rank, delay = 0 }) {
  const pts = useCountUp(kingdom.points, 1600, delay * 180);
  const { bgClass, borderColor, glowColor } = RANK_STYLES[rank] || RANK_STYLES[3];
  const isPos = kingdom.pointsDelta >= 0;

  return (
    <div
      className={`kcard animate-entrance ${bgClass}`}
      style={{ '--delay': `${delay * 0.18}s`, '--border-c': borderColor, '--glow-c': glowColor }}
    >
      {/* Outer glow */}
      <div className="kcard-glow-ring" />

      {/* Top rank badge (shield shape) */}
      <div className="kcard-rank-wrap">
        <div className="kcard-rank-shield">
          <span className="kcard-rank-num">{rank}</span>
        </div>
      </div>

      {/* Decorative top dividers */}
      <div className="kcard-dividers">
        <div className="kcard-div-line" />
        <div className="kcard-div-dots"><span /><span /><span /></div>
        <div className="kcard-div-line" />
      </div>

      {/* Kingdom emblem */}
      <div className="kcard-emblem-wrap">
        <div className="kcard-emblem-bg" />
        <span className="kcard-emblem">{kingdom.emblem}</span>
      </div>

      {/* Side decorative pillars */}
      <div className="kcard-pillar left" />
      <div className="kcard-pillar right" />

      {/* Info */}
      <div className="kcard-info">
        <h3 className="kcard-name">{kingdom.name}</h3>
        <div className="kcard-points">
          <span className="kcard-pts-val">{pts.toLocaleString()}</span>
          <span className="kcard-pts-label">POINTS</span>
        </div>
        <div className={`kcard-delta ${isPos ? 'pos' : 'neg'}`}>
          <span>{isPos ? '▲' : '▼'}</span>
          <span>{isPos ? '+' : ''}{kingdom.pointsDelta}</span>
        </div>
      </div>

      {/* Bottom tip */}
      <div className="kcard-bottom-tip" />

      {/* Shine sweep */}
      <div className="kcard-shine" />
    </div>
  );
}
