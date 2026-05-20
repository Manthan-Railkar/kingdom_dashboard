import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Newspaper, Bell, AlertTriangle, Trophy, Calendar, Clock } from 'lucide-react';
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

export default function NewsPage() {
  const { news } = useApp();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(t);
  }, []);

  const featured    = news.length > 0 ? news[0]      : null;
  const secondary   = news.length > 1 ? news.slice(1, 4) : [];
  const tertiary    = news.length > 4 ? news.slice(4)    : [];

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }).toUpperCase();

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

            {/* ── ROW 1: Featured + secondary stack ── */}
            {featured && (
              <div className="row-featured">

                {/* Main featured article */}
                <article className="article article--featured">
                  <TypeBadge type={featured.type} />
                  <h2 className="article-headline article-headline--xl">
                    {featured.kingdomName
                      ? `${featured.kingdomName.toUpperCase()} ISSUES A FORMAL DECLARATION`
                      : 'BREAKING: CRITICAL DEVELOPMENTS EMERGE ACROSS THE ARENA'}
                  </h2>
                  <div className="article-dateline">
                    <span>CHRONICLE SCRIBE</span>
                    <span className="dateline-dot" />
                    <span>{formatDate(featured.createdAt)}</span>
                    <span className="dateline-dot" />
                    <span>{formatTime(featured.createdAt)}</span>
                  </div>
                  <div className="article-body article-body--columns">
                    <p>
                      <span className="dropped-cap">{featured.text.charAt(0)}</span>
                      {featured.text.slice(1)}
                    </p>
                  </div>
                  <KingdomTag name={featured.kingdomName} />
                </article>

                {/* Secondary stack (up to 3 articles) */}
                {secondary.length > 0 && (
                  <div className="secondary-stack">
                    {secondary.map((art) => {
                      return (
                        <article key={art._id} className="article article--secondary">
                          <TypeBadge type={art.type} />
                          <h3 className="article-headline article-headline--md">
                            {art.kingdomName
                              ? `DISPATCH FROM ${art.kingdomName.toUpperCase()}`
                              : 'INTELLIGENCE FROM THE FRONT LINES'}
                          </h3>
                          <div className="article-dateline">
                            <span>{formatDate(art.createdAt)}</span>
                            <span className="dateline-dot" />
                            <span>{formatTime(art.createdAt)}</span>
                          </div>
                          <p className="article-body">
                            <span className="dropped-cap dropped-cap--sm">{art.text.charAt(0)}</span>
                            {art.text.slice(1)}
                          </p>
                          <KingdomTag name={art.kingdomName} />
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── DIVIDER ── */}
            {tertiary.length > 0 && (
              <div className="chronicle-divider">
                <div className="chronicle-divider-line" />
                <span className="chronicle-divider-label">FURTHER DISPATCHES FROM THE REALM</span>
                <div className="chronicle-divider-line" />
              </div>
            )}

            {/* ── ROW 2: Tertiary grid ── */}
            {tertiary.length > 0 && (
              <div className="tertiary-grid">
                {tertiary.map((art) => (
                  <article key={art._id} className="article article--tertiary">
                    <TypeBadge type={art.type} />
                    <h4 className="article-headline article-headline--sm">
                      {art.kingdomName
                        ? `${art.kingdomName.toUpperCase()} — REPORT`
                        : 'FIELD REPORT'}
                    </h4>
                    <div className="article-dateline">
                      <span>{formatDate(art.createdAt)}</span>
                    </div>
                    <p className="article-body article-body--compact">{art.text}</p>
                    <KingdomTag name={art.kingdomName} />
                  </article>
                ))}
              </div>
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
    </div>
  );
}
