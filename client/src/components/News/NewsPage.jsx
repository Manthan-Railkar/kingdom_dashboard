import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Newspaper, Bell, AlertTriangle, Trophy, Calendar, Clock, X, ChevronDown } from 'lucide-react';
import './NewsPage.css';

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  }).toUpperCase();
};

const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const getTypeMeta = (type) => {
  switch (type) {
    case 'announcement':
      return { label: 'OFFICIAL DECREE', colorClass: 'type--decree', Icon: Bell };
    case 'alert':
      return { label: 'WAR WARNING',     colorClass: 'type--warning', Icon: AlertTriangle };
    case 'achievement':
      return { label: 'GLORIOUS FEAT',   colorClass: 'type--feat',    Icon: Trophy };
    default:
      return { label: 'REALM REPORT',    colorClass: 'type--report',  Icon: Newspaper };
  }
};

const KingdomTag = ({ name }) => {
  if (!name) return null;
  return (
    <div className="kingdom-tag">
      <span className="kingdom-tag-label">FROM THE HALLS OF</span>
      <span className="kingdom-tag-name">{name.toUpperCase()}</span>
    </div>
  );
};

const TypeBadge = ({ type }) => {
  const { label, colorClass, Icon } = getTypeMeta(type);
  return (
    <div className={`type-badge ${colorClass}`}>
      <Icon size={11} strokeWidth={2} />
      <span>{label}</span>
    </div>
  );
};

// Helper: word count check
const isLong = (text) => text.trim().split(/\s+/).length > 20;

// Helper: get display heading (custom or auto-truncated fallback)
const getDisplayHeading = (item) => {
  if (item.heading && item.heading.trim()) return item.heading.trim();
  // Fallback: first 6 words + ellipsis
  const words = item.text.trim().split(/\s+/);
  return words.slice(0, 6).join(' ') + '...';
};

export default function NewsPage() {
  const { news } = useApp();
  const [entered, setEntered] = useState(false);
  const [expandedId, setExpandedId] = useState(null); // ID of the fully-expanded article modal

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(t);
  }, []);

  const leadStory = news.length > 0 ? news[0] : null;
  const dispatchGrid = news.length > 1 ? news.slice(1) : [];

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }).toUpperCase();

  const expandedItem = expandedId ? news.find(n => n._id === expandedId) : null;

  return (
    <div className={`news-page ${entered ? 'news-page--entered' : ''}`}>
      <div className="chronicle">

        {/* ── MASTHEAD ── */}
        <header className="masthead">
          <div className="masthead-ribbon">
            <span>THE REALM'S OFFICIAL LIVE TRANSCRIPT</span>
            <span className="masthead-ribbon-divider">|</span>
            <span>VOL. XXVI &nbsp;&nbsp; NO. 42</span>
          </div>

          <div className="masthead-title-wrap">
            <div className="masthead-rule-left" />
            <h1 className="masthead-title">THE QUANTUM CHRONICLE</h1>
            <div className="masthead-rule-right" />
          </div>

          <div className="masthead-meta">
            <div className="masthead-meta-cell">
              <Calendar size={11} strokeWidth={2} />
              <span>{todayStr}</span>
            </div>
            <div className="masthead-meta-center">
              SPECIAL WAR EDITION — UNITING THE REALMS
            </div>
            <div className="masthead-meta-cell">
              <Clock size={11} strokeWidth={2} />
              <span>LIVE EDITION</span>
            </div>
          </div>
        </header>

        {/* ── CONTENT ── */}
        {news.length === 0 ? (
          <div className="chronicle-empty">
            <Newspaper size={40} strokeWidth={1} className="chronicle-empty-icon" />
            <h2 className="chronicle-empty-title">THE PRINTING PRESS IS IDLE</h2>
            <p className="chronicle-empty-body">No declarations have been posted by the High Counsel. All is quiet in the realm.</p>
          </div>
        ) : (
          <div className="chronicle-body">
            
            {/* ── THE LEAD STORY (Absolute Newest) ── */}
            {leadStory && (() => {
              const long = isLong(leadStory.text);
              return (
                <div className="lead-story-area">
                  <article
                    className={`article article--lead ${long ? 'article--truncatable' : ''}`}
                    onClick={long ? () => setExpandedId(leadStory._id) : undefined}
                    style={long ? { cursor: 'pointer' } : {}}
                  >
                    <div className="article-top-meta">
                      <TypeBadge type={leadStory.type} />
                      <div className="article-dateline">
                        <span>CHRONICLE SCRIBE</span>
                        <span className="dateline-dot" />
                        <span>{formatDate(leadStory.createdAt)}</span>
                        <span className="dateline-dot" />
                        <span>{formatTime(leadStory.createdAt)}</span>
                      </div>
                    </div>

                    <h2 className="article-headline article-headline--lead">
                      {long ? getDisplayHeading(leadStory) : (
                        leadStory.kingdomName
                          ? `${leadStory.kingdomName.toUpperCase()} ISSUES A FORMAL DECLARATION`
                          : 'BREAKING: CRITICAL DEVELOPMENTS EMERGE ACROSS THE ARENA'
                      )}
                    </h2>

                    {long ? (
                      <p className="article-read-more">
                        <ChevronDown size={14} strokeWidth={2} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                        Click to read the full dispatch
                      </p>
                    ) : (
                      <div className="article-body article-body--lead">
                        <p>
                          <span className="dropped-cap">{leadStory.text.charAt(0)}</span>
                          {leadStory.text.slice(1)}
                        </p>
                      </div>
                    )}
                    
                    <KingdomTag name={leadStory.kingdomName} />
                  </article>
                </div>
              );
            })()}

            {/* ── THE GRID OF DISPATCHES ── */}
            {dispatchGrid.length > 0 && (
              <>
                <div className="chronicle-divider">
                  <div className="chronicle-divider-line" />
                  <span className="chronicle-divider-label">FURTHER DISPATCHES FROM THE FRONT LINES</span>
                  <div className="chronicle-divider-line" />
                </div>

                <div className="dispatch-grid">
                  {dispatchGrid.map((art) => {
                    const long = isLong(art.text);
                    return (
                      <article
                        key={art._id}
                        className={`article article--dispatch ${long ? 'article--truncatable' : ''}`}
                        onClick={long ? () => setExpandedId(art._id) : undefined}
                        style={long ? { cursor: 'pointer' } : {}}
                      >
                        <div className="dispatch-header">
                          <TypeBadge type={art.type} />
                          <span className="dispatch-time">{formatTime(art.createdAt)}</span>
                        </div>
                        
                        <h4 className="article-headline article-headline--dispatch">
                          {long
                            ? getDisplayHeading(art)
                            : (art.kingdomName ? `${art.kingdomName.toUpperCase()} — REPORT` : 'FIELD REPORT')
                          }
                        </h4>
                        
                        {long ? (
                          <p className="article-read-more">
                            <ChevronDown size={13} strokeWidth={2} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                            Tap to read full dispatch
                          </p>
                        ) : (
                          <p className="article-body article-body--dispatch">{art.text}</p>
                        )}
                        
                        <div className="dispatch-footer">
                          <KingdomTag name={art.kingdomName} />
                          <span className="dispatch-date">{formatDate(art.createdAt)}</span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── FOOTER ── */}
        <footer className="chronicle-footer">
          <div className="chronicle-footer-rule" />
          <p className="chronicle-footer-text">
            THE QUANTUM CHRONICLE &nbsp;&bull;&nbsp; TRUTH &amp; HONOUR &nbsp;&bull;&nbsp; TO REPORT IS TO REIGN &nbsp;&bull;&nbsp; ALL RIGHTS RESERVED
          </p>
        </footer>

      </div>

      {/* ── FULL ARTICLE MODAL ── */}
      {expandedItem && (
        <div className="article-modal-overlay" onClick={() => setExpandedId(null)}>
          <div className="article-modal" onClick={e => e.stopPropagation()}>
            <button className="article-modal-close" onClick={() => setExpandedId(null)} title="Close">
              <X size={18} strokeWidth={2} />
            </button>

            <div className="article-modal-meta">
              <TypeBadge type={expandedItem.type} />
              <span className="article-modal-date">{formatDate(expandedItem.createdAt)} · {formatTime(expandedItem.createdAt)}</span>
            </div>

            {expandedItem.heading && (
              <h2 className="article-modal-heading">{expandedItem.heading}</h2>
            )}

            <div className="article-modal-body">
              <span className="dropped-cap">{expandedItem.text.charAt(0)}</span>
              {expandedItem.text.slice(1)}
            </div>

            {expandedItem.kingdomName && <KingdomTag name={expandedItem.kingdomName} />}
          </div>
        </div>
      )}
    </div>
  );
}




