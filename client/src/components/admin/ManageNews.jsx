import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { postNews, deleteNews } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2, Newspaper, Bell, AlertTriangle, Trophy } from 'lucide-react';
import './ManageNews.css';

const TYPE_OPTIONS = [
  { value: 'news',         label: 'Realm Report',     Icon: Newspaper },
  { value: 'announcement', label: 'Official Decree',  Icon: Bell },
  { value: 'alert',        label: 'War Warning',      Icon: AlertTriangle },
  { value: 'achievement',  label: 'Glorious Feat',    Icon: Trophy },
];

const getTypeIcon = (type) => {
  const found = TYPE_OPTIONS.find(t => t.value === type);
  if (!found) return <Newspaper size={14} />;
  const { Icon } = found;
  return <Icon size={14} />;
};

const getTypeLabel = (type) => {
  const found = TYPE_OPTIONS.find(t => t.value === type);
  return found ? found.label : 'Realm Report';
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

export default function ManageNews() {
  const { news } = useApp();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    text: '',
    type: 'news',
    kingdomName: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.text.trim()) return;
    setSubmitting(true);
    try {
      await postNews({ text: form.text.trim(), type: form.type, kingdomName: form.kingdomName.trim() });
      addToast('News post published successfully.', 'success');
      setForm({ text: '', type: 'news', kingdomName: '' });
    } catch (err) {
      addToast('Failed to publish post. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteNews(id);
      addToast('Post deleted.', 'success');
    } catch (err) {
      addToast('Failed to delete post.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="manage-news">
      <div className="mn-header">
        <div className="mn-header-icon"><Newspaper size={20} strokeWidth={1.5} /></div>
        <div>
          <h1 className="mn-title">NEWS &amp; UPDATES MANAGEMENT</h1>
          <p className="mn-subtitle">Publish official decrees, war warnings, and kingdom announcements</p>
        </div>
      </div>

      {/* Compose Form */}
      <div className="mn-compose-panel">
        <h2 className="mn-section-title">COMPOSE NEW POST</h2>
        <form className="mn-form" onSubmit={handleSubmit}>
          <div className="mn-form-row">
            <div className="mn-field mn-field--type">
              <label className="mn-label">POST TYPE</label>
              <div className="mn-type-grid">
                {TYPE_OPTIONS.map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    className={`mn-type-btn ${form.type === value ? 'mn-type-btn--active' : ''}`}
                    onClick={() => setForm(prev => ({ ...prev, type: value }))}
                  >
                    <Icon size={16} strokeWidth={1.5} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mn-field mn-field--kingdom">
              <label className="mn-label" htmlFor="mn-kingdomName">KINGDOM / SOURCE (OPTIONAL)</label>
              <input
                id="mn-kingdomName"
                className="mn-input"
                type="text"
                name="kingdomName"
                value={form.kingdomName}
                onChange={handleChange}
                placeholder="e.g. Kingdom 3"
                maxLength={60}
              />
            </div>
          </div>

          <div className="mn-field">
            <label className="mn-label" htmlFor="mn-text">POST CONTENT</label>
            <textarea
              id="mn-text"
              className="mn-textarea"
              name="text"
              value={form.text}
              onChange={handleChange}
              placeholder="Write the official announcement or update here..."
              rows={5}
              maxLength={1200}
              required
            />
            <span className="mn-char-count">{form.text.length} / 1200</span>
          </div>

          <button
            type="submit"
            className="mn-submit-btn"
            disabled={submitting || !form.text.trim()}
          >
            <Plus size={16} strokeWidth={2.5} />
            {submitting ? 'PUBLISHING...' : 'PUBLISH POST'}
          </button>
        </form>
      </div>

      {/* Existing Posts */}
      <div className="mn-posts-panel">
        <h2 className="mn-section-title">PUBLISHED POSTS <span className="mn-post-count">({news.length})</span></h2>
        {news.length === 0 ? (
          <div className="mn-empty">
            <Newspaper size={36} strokeWidth={1} className="mn-empty-icon" />
            <p>No posts have been published yet. Compose one above.</p>
          </div>
        ) : (
          <div className="mn-post-list">
            {news.map((item) => (
              <div key={item._id} className={`mn-post-row mn-post-row--${item.type}`}>
                <div className="mn-post-type-badge">
                  {getTypeIcon(item.type)}
                  <span>{getTypeLabel(item.type)}</span>
                </div>
                <div className="mn-post-body">
                  <p className="mn-post-text">{item.text}</p>
                  <div className="mn-post-meta">
                    {item.kingdomName && <span className="mn-post-kingdom">{item.kingdomName}</span>}
                    <span className="mn-post-date">{formatDate(item.createdAt)}</span>
                  </div>
                </div>
                <button
                  className="mn-delete-btn"
                  onClick={() => handleDelete(item._id)}
                  disabled={deletingId === item._id}
                  title="Delete this post"
                >
                  <Trash2 size={15} strokeWidth={2} />
                  {deletingId === item._id ? 'DELETING...' : 'DELETE'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
