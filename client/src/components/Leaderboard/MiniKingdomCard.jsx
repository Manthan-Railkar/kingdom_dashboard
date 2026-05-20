import React from 'react';
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
  const isPos = kingdom.pointsDelta >= 0;
  const displayRank = rank ?? kingdom.rank;
  const romanRank = toRoman(displayRank);
  // First letter of second word, fallback to first letter of name
  const emblemLetter = kingdom.name.split(' ')[1]?.[0] || kingdom.name[0];

  return (
    <div
      className="mcard"
      style={{ '--delay': `${delay}s`, '--mc': kingdom.color || '#B87333' }}
    >
      {/* Parchment grain overlay */}
      <div className="mcard-parchment" />

      {/* Corner ornaments */}
      <span className="mcard-corner mcard-corner--tl">✦</span>
      <span className="mcard-corner mcard-corner--tr">✦</span>
      <span className="mcard-corner mcard-corner--bl">✦</span>
      <span className="mcard-corner mcard-corner--br">✦</span>

      {/* Heraldic rank shield */}
      <div className="mcard-shield">
        <div className="mcard-shield-inner">
          <span className="mcard-roman">{romanRank}</span>
        </div>
      </div>

      {/* Kingdom emblem circle */}
      <div className="mcard-emblem-wrap">
        <span className="mcard-emblem">{emblemLetter}</span>
        <div className="mcard-emblem-glow" />
      </div>

      {/* Kingdom name */}
      <h3 className="mcard-name">{kingdom.name}</h3>

      {/* Decorative divider */}
      <div className="mcard-divider">
        <span className="mcard-divider-line" />
        <span className="mcard-divider-gem">◆</span>
        <span className="mcard-divider-line" />
      </div>

      {/* Points */}
      <div className="mcard-glory-wrap">
        <span className="mcard-glory-val">{kingdom.points.toLocaleString()}</span>
        <span className="mcard-glory-lbl">⚔ GLORY ⚔</span>
      </div>

      {/* Delta */}
      <span className={`mcard-honour ${isPos ? 'pos' : 'neg'}`}>
        {isPos ? '▲' : '▼'}&nbsp;
        {isPos ? 'HONOUR GAINED' : 'HONOUR LOST'}&nbsp;
        {isPos ? '+' : ''}{kingdom.pointsDelta}
      </span>
    </div>
  );
}
