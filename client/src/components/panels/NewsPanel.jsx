import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { isImagePath, resolveImageUrl } from '../../utils/imageHelpers';
import './Panels.css';

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NewsPanel() {
  const { news } = useApp();
  const listRef = useRef(null);

  return (
    <section className="panel news-panel">
      <div className="panel-header">
        <div className="panel-title-group">
          <span className="panel-icon"></span>
          <h2 className="panel-title">RECENT ACTIVITY LOGS</h2>
        </div>
        <button className="view-all-btn">VIEW ALL</button>
      </div>
      <div className="news-list" ref={listRef}>
        {news.slice(0, 6).map((item, i) => (
          <div key={item._id} className={`news-item animate-entrance ${item.type === 'announcement' ? 'news-announce' : ''}`} style={{ '--delay': `${i * 0.07}s` }}>
            <div className="news-emblem">{isImagePath(item.kingdomEmblem) ? <img src={resolveImageUrl(item.kingdomEmblem)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : (item.kingdomEmblem || '')}</div>
            <div className="news-content">
              <p className="news-text">{item.text}</p>
              <span className="news-time">{timeAgo(item.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
