import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp, Trophy } from 'lucide-react';
import SparklineSvg from '../common/SparklineSvg';
import './TrendsPage.css';

export default function TrendsPage() {
  const { kingdoms } = useApp();
  const [mounted, setMounted] = useState(false);
  const [selectedKingdom, setSelectedKingdom] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`trends-page ${mounted ? 'trends-page--entered' : ''}`}>
      {/* Header Banner */}
      <div className="tp-header">
        <div className="tp-header-bg" />
        <div className="tp-header-overlay" />
        <div className="tp-header-content">
          <div className="tp-crest">
            <TrendingUp size={36} strokeWidth={1.5} />
          </div>
          <h1 className="tp-title">LIVE TRENDS</h1>
          <p className="tp-subtitle">PERFORMANCE & GLORY TRAJECTORIES</p>
          <div className="tp-divider">
            <span className="tp-divider-line" />
            <span className="tp-divider-diamond">◆</span>
            <span className="tp-divider-line" />
          </div>
        </div>
      </div>

      {/* Grid of Trends */}
      <div className="tp-grid-wrap">
        <div className="tp-grid">
          {kingdoms.map((k, i) => {
            const baseColor = k.color || '#B87333';
            const isPos = k.pointsDelta >= 0;
            return (
              <div 
                key={k._id}
                className="tp-card"
                style={{ '--delay': `${i * 0.08}s`, '--mc': baseColor }}
                onClick={() => setSelectedKingdom(k)}
              >
                <div className="tp-card-header">
                  <div className="tp-card-emblem">{k.name.split(' ')[1]?.[0] || k.name[0]}</div>
                  <div className="tp-card-info">
                    <h3 className="tp-card-name">{k.name}</h3>
                    <span className="tp-card-rank">Rank {k.rank}</span>
                  </div>
                  <div className={`tp-card-delta ${isPos ? 'pos' : 'neg'}`}>
                    {isPos ? '▲' : '▼'} {isPos ? '+' : ''}{k.pointsDelta}
                  </div>
                </div>
                
                <div className="tp-card-chart">
                  <SparklineSvg
                    data={k.deltaHistory || []}
                    color={baseColor}
                    width={280}
                    height={80}
                    animate={mounted}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedKingdom && (
        <div className="modal-overlay" onClick={() => setSelectedKingdom(null)}>
          <div className="modal-box kingdom-detail-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedKingdom(null)}>✕</button>
            <div className="kd-header">
              <div className="kd-emblem" style={{ borderColor: selectedKingdom.color, color: selectedKingdom.color }}>
                {selectedKingdom.name.split(' ')[1]?.[0] || selectedKingdom.name[0]}
              </div>
              <div>
                <h3 className="kd-name" style={{ color: selectedKingdom.color }}>{selectedKingdom.name}</h3>
                <div className="kd-rank">Rank: {selectedKingdom.rank}</div>
              </div>
            </div>
            <div className="kd-stats">
              <div className="kd-stat-box">
                <div className="kd-stat-lbl">TOTAL POINTS</div>
                <div className="kd-stat-val">{selectedKingdom.points.toLocaleString()}</div>
              </div>
              <div className="kd-stat-box">
                <div className="kd-stat-lbl">RECENT CHANGE</div>
                <div className={`kd-stat-val ${selectedKingdom.pointsDelta >= 0 ? 'pos' : 'neg'}`}>
                  {selectedKingdom.pointsDelta >= 0 ? '+' : ''}{selectedKingdom.pointsDelta}
                </div>
              </div>
            </div>
            <div className="kd-chart-wrap">
              <div className="kd-stat-lbl" style={{ marginBottom: '10px' }}>PERFORMANCE HISTORY</div>
              <SparklineSvg
                data={selectedKingdom.deltaHistory || []}
                color={selectedKingdom.color || '#B87333'}
                width={310}
                height={120}
                animate={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
