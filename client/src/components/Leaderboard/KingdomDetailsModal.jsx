import React, { useEffect, useState } from 'react';
import './KingdomDetailsModal.css';

export default function KingdomDetailsModal({ kingdom, onClose }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (kingdom) {
      setClosing(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [kingdom]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 300); // match animation duration
  };

  if (!kingdom) return null;

  const baseColor = kingdom.color || '#B87333';
  const glowColor = `rgba(${parseInt(baseColor.slice(1,3),16)}, ${parseInt(baseColor.slice(3,5),16)}, ${parseInt(baseColor.slice(5,7),16)}, 0.5)`;

  return (
    <div className={`kd-modal-overlay ${closing ? 'closing' : ''}`} onClick={handleClose}>
      <div className="kd-modal-content" onClick={(e) => e.stopPropagation()} style={{ '--border-c': baseColor, '--glow-c': glowColor }}>
        
        {/* Decorative borders */}
        <div className="kd-modal-frame"></div>
        <button className="kd-close-btn" onClick={handleClose}>×</button>

        <div className="kd-modal-header">
          <div className="kd-emblem-wrap">
            <span className="kd-emblem">{kingdom.name.split(' ')[1]?.[0] || kingdom.name[0]}</span>
          </div>
          <h2 className="kd-name">{kingdom.name}</h2>
          <div className="kd-points-badge">
            <span className="kd-pts-val">{kingdom.points.toLocaleString()}</span>
            <span className="kd-pts-label">TOTAL POINTS</span>
          </div>
        </div>

        <div className="kd-modal-body">
          <h3 className="kd-section-title">CHAMPIONS OF THE REALM</h3>
          
          {(!kingdom.teamMembers || kingdom.teamMembers.length === 0) ? (
            <p className="kd-empty">No champions documented in the sacred texts.</p>
          ) : (
            <div className="kd-roster">
              {kingdom.teamMembers.map((member, i) => (
                <div key={i} className="kd-member-card">
                  <div className="kd-member-icon">⚔</div>
                  <div className="kd-member-info">
                    <span className="kd-member-name">{member.name}</span>
                    <span className="kd-member-role">{member.role}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
