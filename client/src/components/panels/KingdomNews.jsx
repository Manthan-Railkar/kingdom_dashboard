import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScrollText, X } from 'lucide-react';
import { isImagePath, resolveImageUrl } from '../../utils/imageHelpers';
import './RightPanels.css';

function timeAgo(d) {
  const s = (Date.now() - new Date(d).getTime()) / 1000;
  if (s < 60) return `${Math.floor(s)}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

const isLong = (text) => text.trim().split(/\s+/).length > 20;

const getDisplayText = (item) => {
  if (item.heading && item.heading.trim()) return item.heading.trim();
  const words = item.text.trim().split(/\s+/);
  return words.slice(0, 6).join(' ') + '...';
};

export default function KingdomNews() {
  const { news } = useApp();
  const items = news.slice(0, 5);
  const [expandedItem, setExpandedItem] = useState(null);

  return (
    <>
      <section className="panel rp-panel news-panel">
        <div className="panel-header">
          <ScrollText size={16} className="panel-crown" />
          <h2 className="panel-title">KINGDOM NEWS</h2>
          <button className="view-all-btn">VIEW ALL</button>
        </div>
        <div className="kn-list">
          {items.map((item, i) => {
            const long = isLong(item.text);
            return (
              <div
                key={item._id}
                className={`kn-item animate-entrance ${long ? 'kn-item--expandable' : ''}`}
                style={{ '--delay': `${i * 0.07}s` }}
                onClick={long ? () => setExpandedItem(item) : undefined}
              >
                <div className="kn-emblem">
                  {isImagePath(item.kingdomEmblem)
                    ? <img src={resolveImageUrl(item.kingdomEmblem)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    : (item.kingdomEmblem || '')}
                </div>
                <div className="kn-content">
                  <p className="kn-text">
                    {long ? getDisplayText(item) : item.text}
                  </p>
                  {long && <span className="kn-read-more">Tap to read full</span>}
                  <span className="kn-time">{timeAgo(item.createdAt)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Inline Modal */}
      {expandedItem && (
        <div className="kn-modal-overlay" onClick={() => setExpandedItem(null)}>
          <div className="kn-modal" onClick={e => e.stopPropagation()}>
            <button className="kn-modal-close" onClick={() => setExpandedItem(null)} aria-label="Close modal">
              <X size={16} strokeWidth={2} />
            </button>
            <h3 className="kn-modal-heading">
              {expandedItem.heading && expandedItem.heading.trim() ? expandedItem.heading : "ROYAL DISPATCH"}
            </h3>
            <p className="kn-modal-body">{expandedItem.text}</p>
            <span className="kn-modal-time">{timeAgo(expandedItem.createdAt)}</span>
          </div>
        </div>
      )}
    </>
  );
}

