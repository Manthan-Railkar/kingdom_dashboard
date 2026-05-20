import React from 'react';
import { useApp } from '../../context/AppContext';
import SparklineCanvas from '../common/SparklineCanvas';
import './Panels.css';

export default function TrendsPanel() {
  const { kingdoms } = useApp();
  const top5 = kingdoms.slice(0, 5);

  return (
    <section className="panel trends-panel">
      <div className="panel-header">
        <div className="panel-title-group">
          <span className="panel-icon"></span>
          <h2 className="panel-title">LIVE TRENDS</h2>
        </div>
        <button className="view-all-btn">VIEW ANALYTICS</button>
      </div>
      <div className="trends-list">
        {top5.map((k, i) => (
          <div key={k._id} className="trend-row animate-entrance" style={{ '--delay': `${i * 0.08}s` }}>
            <div className="trend-emblem">{k.emblem}</div>
            <span className="trend-name">{k.name}</span>
            <div className="trend-spark">
              <SparklineCanvas data={k.deltaHistory || []} color={k.color || '#B87333'} width={90} height={26} />
            </div>
            <span className={`trend-delta ${k.pointsDelta >= 0 ? 'positive' : 'negative'}`}>
              {k.pointsDelta >= 0 ? '+' : ''}{k.pointsDelta} pts
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
