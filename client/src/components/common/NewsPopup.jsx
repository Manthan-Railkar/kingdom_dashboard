import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, X, Newspaper, AlertTriangle, Trophy } from 'lucide-react';
import './NewsPopup.css';

const getTypeIcon = (type) => {
  switch (type) {
    case 'announcement': return <Bell size={24} />;
    case 'alert':        return <AlertTriangle size={24} />;
    case 'achievement':  return <Trophy size={24} />;
    default:             return <Newspaper size={24} />;
  }
};

export default function NewsPopup() {
  const { latestNewsItem, setLatestNewsItem } = useApp();

  useEffect(() => {
    if (latestNewsItem) {
      const timer = setTimeout(() => {
        setLatestNewsItem(null);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [latestNewsItem, setLatestNewsItem]);

  if (!latestNewsItem) return null;

  return (
    <div className={`news-popup-overlay ${latestNewsItem ? 'active' : ''}`}>
      <div className={`news-popup-card type-${latestNewsItem.type}`}>
        <button className="news-popup-close" onClick={() => setLatestNewsItem(null)}>
          <X size={18} />
        </button>
        
        <div className="news-popup-icon">
          {getTypeIcon(latestNewsItem.type)}
        </div>

        <div className="news-popup-content">
          <div className="news-popup-label">
            {latestNewsItem.type === 'announcement' ? 'NEW DECREE' : 
             latestNewsItem.type === 'alert' ? 'WAR ALERT' : 
             latestNewsItem.type === 'achievement' ? 'GLORIOUS FEAT' : 'LATEST DISPATCH'}
          </div>
          <h3 className="news-popup-title">
            {latestNewsItem.kingdomName ? latestNewsItem.kingdomName.toUpperCase() : 'REALM UPDATE'}
          </h3>
          <p className="news-popup-text">{latestNewsItem.text}</p>
        </div>

        <div className="news-popup-progress"></div>
      </div>
    </div>
  );
}
