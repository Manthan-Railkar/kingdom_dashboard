import React from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp } from 'lucide-react';
import SparklineCanvas from '../common/SparklineCanvas';
import './RightPanels.css';

export default function LiveTrends() {
  const { kingdoms } = useApp();
  const top5 = kingdoms.slice(0, 5);

  return (
    <section className="panel rp-panel trends-panel">
      <div className="panel-header">
        <TrendingUp size={16} className="panel-crown" />
        <h2 className="panel-title">LIVE TRENDS</h2>
        <button className="view-all-btn">VIEW ALL</button>
      </div>
      <div className="trends-list">
        {top5.map((k, i) => (
          <div key={k._id} className="trend-row animate-entrance" style={{ '--delay': `${i * 0.08}s` }}>
            <span className="trend-emblem">{k.emblem}</span>
            <span className="trend-name">{k.name}</span>
            <div className="trend-spark">
              <SparklineCanvas
                data={k.deltaHistory || []}
                color={k.color || '#c9a227'}
                width={88}
                height={24}
              />
            </div>
            <span className={`trend-delta ${k.pointsDelta >= 0 ? 'pos' : 'neg'}`}>
              {k.pointsDelta >= 0 ? '+' : ''}{k.pointsDelta} pts
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
