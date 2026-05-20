import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useApp } from '../../context/AppContext';
import { postNews } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Activity } from 'lucide-react';
import { isImagePath, resolveImageUrl } from '../../utils/imageHelpers';
import './Panels.css';

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function LiveUpdates() {
  const { isAdmin } = useAdmin();
  const { news } = useApp();
  const { addToast } = useToast();
  const [newsText, setNewsText] = useState('');
  const [mode, setMode] = useState('news'); // 'news' | 'announcement'
  const [showForm, setShowForm] = useState(false);

  const handlePost = async () => {
    if (!newsText.trim()) return;
    try {
      await postNews({ text: newsText.trim(), type: mode, kingdomEmblem: mode === 'announcement' ? '' : '' });
      setNewsText('');
      setShowForm(false);
      addToast('Posted successfully!', 'success');
    } catch {
      addToast('Failed to post', 'error');
    }
  };

  return (
    <section className="panel live-updates-panel">
      <div className="panel-header">
        <div className="panel-title-group">
          <Activity size={14} className="panel-icon" color="#B87333" />
          <h2 className="panel-title">LIVE UPDATES</h2>
          {isAdmin && <span className="admin-control-badge">(ADMIN CONTROL)</span>}
        </div>
      </div>

      {isAdmin && (
        <div className="lu-actions">
          <button className="btn-purple lu-btn" onClick={() => { setMode('news'); setShowForm(true); }}>
             ADD NEWS
          </button>
          <button className="btn-primary lu-btn" onClick={() => { setMode('announcement'); setShowForm(true); }}>
             ANNOUNCEMENT
          </button>
        </div>
      )}

      {showForm && isAdmin && (
        <div className="lu-form">
          <textarea
            className="lu-textarea"
            placeholder={mode === 'announcement' ? 'Write announcement...' : 'Write news item...'}
            value={newsText}
            onChange={(e) => setNewsText(e.target.value)}
            rows={2}
          />
          <div className="lu-form-actions">
            <button className="btn-primary lu-post-btn" onClick={handlePost}>POST</button>
            <button className="btn-outline" onClick={() => setShowForm(false)}>CANCEL</button>
          </div>
        </div>
      )}

      <div className="lu-feed">
        {news.slice(0, 5).map((item, i) => (
          <div key={item._id} className="lu-item animate-entrance" style={{ '--delay': `${i * 0.06}s` }}>
            <div className="lu-emblem">{isImagePath(item.kingdomEmblem) ? <img src={resolveImageUrl(item.kingdomEmblem)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : (item.kingdomEmblem || '')}</div>
            <div className="lu-text-block">
              <p className="lu-text">{item.text}</p>
              <span className="lu-time">{timeAgo(item.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
