import React from 'react';
import './MiniKingdomCard.css';

export default function MiniKingdomCard({ kingdom, delay = 0 }) {
  const isPos = kingdom.pointsDelta >= 0;
  return (
    <div
      className="mcard animate-entrance"
      style={{ '--delay': `${delay}s`, '--mc': kingdom.color || '#c9a227' }}
    >
      <div className="mcard-rank">{kingdom.rank}</div>
      <div className="mcard-emblem">{kingdom.emblem}</div>
      <div className="mcard-body">
        <span className="mcard-name">{kingdom.name}</span>
        <span className="mcard-pts">{kingdom.points.toLocaleString()}</span>
        <span className="mcard-pts-lbl">POINTS</span>
        <span className={`mcard-delta ${isPos ? 'pos' : 'neg'}`}>
          {isPos ? '▲' : '▼'} {isPos ? '+' : ''}{kingdom.pointsDelta}
        </span>
      </div>
      <div className="mcard-top-bar" />
    </div>
  );
}
