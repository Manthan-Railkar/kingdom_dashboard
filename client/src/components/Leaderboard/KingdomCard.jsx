import React, { useRef, useState, useEffect } from 'react';
import { useCountUp } from '../../hooks/useCountUp';
import SparklineCanvas from '../common/SparklineCanvas';
import { Shield, Flame, Mountain, Bird, Wind, Anchor, Star, Zap, Crown } from 'lucide-react';
import { isImagePath, resolveImageUrl } from '../../utils/imageHelpers';
import './KingdomCard.css';

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16) || 200;
  const g = parseInt(hex.slice(3, 5), 16) || 160;
  const b = parseInt(hex.slice(5, 7), 16) || 40;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getKingdomIcon = (name, size = 64) => {
  const n = name.toLowerCase();
  if (n.includes('phoenix') || n.includes('fire')) return <Flame size={size} strokeWidth={1.5} />;
  if (n.includes('titan') || n.includes('stone') || n.includes('mountain')) return <Mountain size={size} strokeWidth={1.5} />;
  if (n.includes('leviathan') || n.includes('water') || n.includes('sea')) return <Anchor size={size} strokeWidth={1.5} />;
  if (n.includes('dragon') || n.includes('sky') || n.includes('wind')) return <Wind size={size} strokeWidth={1.5} />;
  if (n.includes('eagle') || n.includes('raven')) return <Bird size={size} strokeWidth={1.5} />;
  if (n.includes('wolf') || n.includes('lion') || n.includes('guard')) return <Shield size={size} strokeWidth={1.5} />;
  if (n.includes('star') || n.includes('sun')) return <Star size={size} strokeWidth={1.5} />;
  if (n.includes('storm')) return <Zap size={size} strokeWidth={1.5} />;
  return <Crown size={size} strokeWidth={1.5} />;
};

export default function KingdomCard({ kingdom, rank, delay = 0, onClick }) {
  const pts = useCountUp(kingdom.points, 1600, delay * 180);
  const baseColor = kingdom.color || '#B87333';
  const borderColor = baseColor;
  const glowColor = hexToRgba(baseColor, 0.45);
  const isPos = kingdom.pointsDelta >= 0;

  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`kcard ${isVisible ? 'visible' : ''}`}
      onClick={onClick}
      style={{ 
        '--delay': `${delay * 0.1}s`, 
        '--border-c': borderColor, 
        '--glow-c': glowColor,
        '--bg-top': hexToRgba(baseColor, 0.15),
        '--bg-mid': hexToRgba(baseColor, 0.05)
      }}
    >
      <div className="kc-bg-texture" />

      {/* War Pennant Side Banner */}
      <div className="kc-side-banner">
        <div className="kc-side-icon">⚔</div>
      </div>

      {/* Main Ornate Frame */}
      <div className="kc-main-frame">
        
        {/* Heraldic Shield Crest */}
        <div className="kc-rank-crest">
          {isImagePath(kingdom.emblem) && (
            <img src={resolveImageUrl(kingdom.emblem)} alt="" className="kc-rank-img" />
          )}
          <span className="kc-rank-num">{rank}</span>
        </div>

        {/* Inner Content */}
        <div className="kc-content">
          <div className="kc-top-section">
            <div className="kc-emblem-wrap" style={{ color: baseColor, filter: `drop-shadow(0 0 15px ${glowColor})`, overflow: 'hidden' }}>
              {isImagePath(kingdom.emblem) ? (
                <img src={resolveImageUrl(kingdom.emblem)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                getKingdomIcon(kingdom.name, 48)
              )}
            </div>
            <h3 className="kc-name">{kingdom.name}</h3>
          </div>

          {/* Ornamental Divider */}
          <div className="kc-divider" style={{ background: `linear-gradient(90deg, transparent, ${baseColor}, transparent)` }} />
          
          <div className="kc-bottom-section">
            <div className="kc-points-wrap">
              <span className="kc-pts-val">{pts.toLocaleString()}</span>
              <span className="kc-pts-label">POINTS</span>
            </div>

            {kingdom.pointsDelta !== 0 && (
              <div className={`kc-delta ${isPos ? 'pos' : 'neg'}`}>
                <span className="kc-delta-icon">{isPos ? '▲' : '▼'}</span>
                <span className="kc-delta-val">{isPos ? '+' : ''}{kingdom.pointsDelta}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Crystal Spike */}
        <div className="kc-crystal-spike" style={{ background: `linear-gradient(180deg, ${glowColor} 0%, transparent 100%)` }} />
        <div className="kc-bottom-spike" />
      </div>

      {/* Outer ambient glow */}
      <div className="kc-ambient-glow" />
    </div>
  );
}
