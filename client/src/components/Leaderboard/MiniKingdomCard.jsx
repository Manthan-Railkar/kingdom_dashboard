import React, { useState } from 'react';
import { isImagePath, resolveImageUrl } from '../../utils/imageHelpers';
import './MiniKingdomCard.css';

// Roman numeral converter for rank display
const toRoman = (n) => {
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const syms = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
  let result = '';
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) { result += syms[i]; n -= vals[i]; }
  }
  return result;
};

export default function MiniKingdomCard({ kingdom, delay = 0, rank }) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Drag-to-spin state
  const [dragX, setDragX] = useState(0);
  const [startX, setStartX] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const isPos = kingdom.pointsDelta >= 0;
  const displayRank = rank ?? kingdom.rank;
  const romanRank = toRoman(displayRank);
  const emblemUrl = kingdom.emblem;
  const emblemLetter = kingdom.name.split(' ')[1]?.[0] || kingdom.name[0];
  const breakdown = kingdom.pointsBreakdown || [];

  const handleTouchStart = (e) => {
    setStartX(e.touches ? e.touches[0].clientX : e.clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (startX === null) return;
    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    setDragX(currentX - startX);
  };

  const handleTouchEnd = () => {
    if (startX === null) return;
    
    // If dragged more than 40px, flip the card
    if (Math.abs(dragX) > 40) {
      setIsFlipped(!isFlipped);
    } else if (Math.abs(dragX) < 5) {
      // If it was just a tiny tap, also toggle flip (standard click behavior)
      setIsFlipped(!isFlipped);
    }
    
    setStartX(null);
    setDragX(0);
    setIsDragging(false);
  };

  // Calculate dynamic rotation during drag
  const baseRotation = isFlipped ? 180 : 0;
  // dragX > 0 means swiping right. 1px drag = ~0.6 degrees to feel natural
  const currentRotation = isDragging ? baseRotation + (dragX * 0.6) : baseRotation;

  return (
    <div
      className={`mcard-scene ${isFlipped && !isDragging ? 'flipped' : ''}`}
      style={{ '--delay': `${delay}s`, '--mc': kingdom.color || '#B87333' }}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onMouseLeave={() => isDragging && handleTouchEnd()}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="mcard-flipper"
        style={{
          transform: isDragging ? `rotateY(${currentRotation}deg)` : undefined,
          transition: isDragging ? 'none' : 'transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1)'
        }}
      >

        {/* ====== FRONT FACE ====== */}
        <div className="mcard mcard-front">
          <div className="mcard-parchment" />

          <span className="mcard-corner mcard-corner--tl">&#10022;</span>
          <span className="mcard-corner mcard-corner--tr">&#10022;</span>
          <span className="mcard-corner mcard-corner--bl">&#10022;</span>
          <span className="mcard-corner mcard-corner--br">&#10022;</span>

          <div className="mcard-shield">
            <div className="mcard-shield-inner">
              <span className="mcard-roman">{romanRank}</span>
            </div>
          </div>

          <div className="mcard-emblem-wrap">
            {isImagePath(emblemUrl) ? (
              <img
                src={resolveImageUrl(emblemUrl)}
                alt={`${kingdom.name} emblem`}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <span className="mcard-emblem">{emblemLetter}</span>
            )}
            <div className="mcard-emblem-glow" />
          </div>

          <h3 className="mcard-name">{kingdom.name}</h3>

          <div className="mcard-divider">
            <span className="mcard-divider-line" />
            <span className="mcard-divider-gem">&#9670;</span>
            <span className="mcard-divider-line" />
          </div>

          <div className="mcard-glory-wrap">
            <span className="mcard-glory-val">{kingdom.points.toLocaleString()}</span>
            <span className="mcard-glory-lbl">GLORY</span>
          </div>

          <span className={`mcard-honour ${isPos ? 'pos' : 'neg'}`}>
            {isPos ? '\u25B2' : '\u25BC'}&nbsp;
            {isPos ? 'HONOUR GAINED' : 'HONOUR LOST'}&nbsp;
            {isPos ? '+' : ''}{kingdom.pointsDelta}
          </span>

          {/* Flip hint */}
          <span className="mcard-flip-hint">HOVER TO REVEAL</span>
        </div>

        {/* ====== BACK FACE ====== */}
        <div className="mcard mcard-back">
          <div className="mcard-parchment" />

          <span className="mcard-corner mcard-corner--tl">&#10022;</span>
          <span className="mcard-corner mcard-corner--tr">&#10022;</span>
          <span className="mcard-corner mcard-corner--bl">&#10022;</span>
          <span className="mcard-corner mcard-corner--br">&#10022;</span>

          {/* Back header */}
          <div className="mcard-back-header">
            <div className="mcard-back-emblem">
              {isImagePath(emblemUrl) ? (
                <img
                  src={resolveImageUrl(emblemUrl)}
                  alt=""
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem' }}>{emblemLetter}</span>
              )}
            </div>
            <div className="mcard-back-title">{kingdom.name}</div>
          </div>

          <div className="mcard-divider" style={{ width: '90%' }}>
            <span className="mcard-divider-line" />
            <span className="mcard-divider-gem">&#9670;</span>
            <span className="mcard-divider-line" />
          </div>

          <div className="mcard-back-section-title">SECTION-WISE GLORY</div>

          {/* Breakdown list */}
          <div className="mcard-breakdown-list">
            {breakdown.length > 0 ? breakdown.map((item, idx) => {
              const catName = item.category?.name || 'Unknown';
              const pct = kingdom.points > 0 ? Math.round((item.value / kingdom.points) * 100) : 0;
              return (
                <div key={idx} className="mcard-breakdown-row">
                  <span className="mcard-breakdown-name">{catName}</span>
                  <div className="mcard-breakdown-bar-track">
                    <div
                      className="mcard-breakdown-bar-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="mcard-breakdown-val">{item.value.toLocaleString()}</span>
                </div>
              );
            }) : (
              <div className="mcard-breakdown-empty">No breakdown data yet.</div>
            )}
          </div>

          {/* Total */}
          <div className="mcard-back-total">
            <span className="mcard-back-total-lbl">TOTAL</span>
            <span className="mcard-back-total-val">{kingdom.points.toLocaleString()}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
