import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Newspaper, Bell, AlertTriangle, Trophy, Calendar, Coins } from 'lucide-react';
import './NewsPage.css';

// Helper to format date
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).toUpperCase();
};

// Helper for type icons
const getTypeMeta = (type) => {
  switch (type) {
    case 'announcement':
      return { label: 'OFFICIAL DECREE', icon: <Bell size={14} className="news-type-icon text-gold" /> };
    case 'alert':
      return { label: 'WAR WARNING', icon: <AlertTriangle size={14} className="news-type-icon text-red" /> };
    case 'achievement':
      return { label: 'GLORIOUS FEAT', icon: <Trophy size={14} className="news-type-icon text-green" /> };
    default:
      return { label: 'REALM REPORT', icon: <Newspaper size={14} className="news-type-icon text-blue" /> };
  }
};

export default function NewsPage() {
  const { news } = useApp();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Split news into featured (first item) and secondary
  const featuredArticle = news.length > 0 ? news[0] : null;
  const otherArticles = news.length > 1 ? news.slice(1) : [];

  return (
    <div className={`news-page-container ${entered ? 'news-page--entered' : ''}`}>
      <div className="newspaper">
        {/* Newspaper Header */}
        <header className="newspaper-header">
          <div className="header-top-banner">
            <span>THE REALM'S OFFICIAL LIVE TRANSCRIPT</span>
            <span>VOL. XXVI NO. 42</span>
          </div>

          <h1 className="newspaper-title">THE QUANTUM CHRONICLE</h1>
          
          <div className="header-meta-bar">
            <div className="meta-left">
              <Calendar size={14} />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}</span>
            </div>
            <div className="meta-center">
              <span>SPECIAL WAR EDITION: UNITING THE REALMS</span>
            </div>
            <div className="meta-right">
              <Coins size={14} />
              <span>PRICE: 5 GOLD COINS</span>
            </div>
          </div>
        </header>

        {/* Newspaper content body */}
        {news.length === 0 ? (
          <div className="newspaper-empty">
            <h2 className="empty-title">THE PRINTING PRESS IS IDLE</h2>
            <p className="empty-subtitle">No declarations or decrees have been posted by the High Counsel. All is quiet in the kingdom... for now.</p>
          </div>
        ) : (
          <div className="newspaper-body-layout">
            
            {/* FEATURED STORY - Spans full width at top */}
            {featuredArticle && (
              <section className="featured-story">
                <div className="featured-tag">
                  {getTypeMeta(featuredArticle.type).icon}
                  <span>FEATURED ARTICLE: {getTypeMeta(featuredArticle.type).label}</span>
                </div>
                
                <h2 className="featured-headline">
                  {featuredArticle.kingdomName ? `${featuredArticle.kingdomName.toUpperCase()} DECLARATION!` : 'SHOCKING EVENTS UNFOLD IN THE ARENA!'}
                </h2>
                
                <div className="article-meta">
                  <span>REPORTED BY CHRONICLE SCRIBE • {formatDate(featuredArticle.createdAt)}</span>
                </div>

                <div className="featured-content-wrap">
                  <div className="featured-text">
                    <span className="dropped-cap">{featuredArticle.text.charAt(0)}</span>
                    {featuredArticle.text.slice(1)}
                  </div>
                  
                  {featuredArticle.kingdomName && (
                    <div className="featured-seal-box">
                      <div className="seal-emblem">{featuredArticle.kingdomEmblem || '⚡'}</div>
                      <div className="seal-kingdom">{featuredArticle.kingdomName}</div>
                      <div className="seal-status">ALLIED ALLIANCE</div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* SECONDARY STORIES - In 2 Column Layout */}
            {otherArticles.length > 0 && (
              <div className="newspaper-columns">
                {otherArticles.map((art, idx) => {
                  const meta = getTypeMeta(art.type);
                  return (
                    <article key={art._id} className="newspaper-article">
                      <div className="article-tag">
                        {meta.icon}
                        <span>{meta.label}</span>
                      </div>
                      
                      <h3 className="article-headline">
                        {art.kingdomName ? `THE FEUD OF ${art.kingdomName.toUpperCase()}` : 'DISPATCH FROM THE FRONT LINES'}
                      </h3>
                      
                      <div className="article-meta">
                        <span>POSTED {formatDate(art.createdAt)}</span>
                      </div>

                      <p className="article-text">
                        <span className="dropped-cap">{art.text.charAt(0)}</span>
                        {art.text.slice(1)}
                      </p>

                      {art.kingdomName && (
                        <div className="article-footer-kingdom">
                          <span className="mini-emblem">{art.kingdomEmblem}</span>
                          <span>Origin: {art.kingdomName}</span>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Newspaper Footer */}
        <footer className="newspaper-footer">
          <div className="footer-line"></div>
          <div className="footer-text">
            <span>© QUANTUM 26 PRESS WORKSHOP • TRUTH & HONOR • TO REPORT IS TO REIGN</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
