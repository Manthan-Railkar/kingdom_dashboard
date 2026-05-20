import React from 'react';
import { useApp } from '../../context/AppContext';
import { ScrollText } from 'lucide-react';
import { isImagePath, resolveImageUrl } from '../../utils/imageHelpers';
import './RightPanels.css';

function timeAgo(d) {
  const s = (Date.now() - new Date(d).getTime()) / 1000;
  if (s < 60) return `${Math.floor(s)}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

export default function KingdomNews() {
  const { news } = useApp();
  const items = news.slice(0, 5);

  return (
    <section className="panel rp-panel news-panel">
      <div className="panel-header">
        <ScrollText size={16} className="panel-crown" />
        <h2 className="panel-title">KINGDOM NEWS</h2>
        <button className="view-all-btn">VIEW ALL</button>
      </div>
      <div className="kn-list">
        {items.map((item, i) => (
          <div key={item._id} className="kn-item animate-entrance" style={{ '--delay': `${i * 0.07}s` }}>
            <div className="kn-emblem">{isImagePath(item.kingdomEmblem) ? <img src={resolveImageUrl(item.kingdomEmblem)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : (item.kingdomEmblem || '')}</div>
            <div className="kn-content">
              <p className="kn-text">{item.text}</p>
              <span className="kn-time">{timeAgo(item.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
