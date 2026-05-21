import React from 'react';
import { X, Shield, Users as UsersIcon, Image as ImageIcon } from 'lucide-react';
import { isImagePath, resolveImageUrl } from '../../utils/imageHelpers';
import './KingdomDetailModal.css';

const hexToRgba = (hex, alpha) => {
  if (!hex || !hex.startsWith('#')) return `rgba(184, 115, 51, ${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16) || 184;
  const g = parseInt(hex.slice(3, 5), 16) || 115;
  const b = parseInt(hex.slice(5, 7), 16) || 51;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function KingdomDetailModal({ kingdom, onClose }) {
  if (!kingdom) return null;

  const color = kingdom.color || '#B87333';
  const glow = hexToRgba(color, 0.25);
  const hasFlag = isImagePath(kingdom.flag);
  const hasMap = isImagePath(kingdom.map);
  const hasEmblem = isImagePath(kingdom.emblem);
  const hasDesigns = kingdom.designs && kingdom.designs.length > 0;
  const hasTeam = kingdom.teamMembers && kingdom.teamMembers.length > 0;

  return (
    <div className="kdm-overlay" onClick={onClose}>
      <div
        className="kdm-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          '--kingdom-color': color,
          '--kingdom-glow': glow,
        }}
      >
        <button className="kdm-close" onClick={onClose}>✕</button>

        {/* Hero Banner */}
        <div className="kdm-hero" style={{ backgroundImage: `radial-gradient(ellipse at center, ${hexToRgba(color, 0.08)} 0%, transparent 70%)` }}>
          <div className="kdm-emblem-wrap">
            {hasEmblem ? (
              <img src={resolveImageUrl(kingdom.emblem)} alt="Emblem" />
            ) : (
              <span className="kdm-emblem-fallback">
                <Shield size={32} color={color} />
              </span>
            )}
          </div>
          <h2 className="kdm-kingdom-name">{kingdom.name}</h2>
          <div className="kdm-rank">RANK {kingdom.rank} • {kingdom.points?.toLocaleString() || 0} POINTS</div>
        </div>

        {/* Stats */}
        <div className="kdm-stats">
          <div className="kdm-stat">
            <div className="kdm-stat-val">{kingdom.points?.toLocaleString() || 0}</div>
            <div className="kdm-stat-lbl">TOTAL POINTS</div>
          </div>
          <div className="kdm-stat">
            <div className="kdm-stat-val">{kingdom.teamMembers?.length || 0}</div>
            <div className="kdm-stat-lbl">CHAMPIONS</div>
          </div>
          <div className="kdm-stat">
            <div className="kdm-stat-val" style={{ color: kingdom.pointsDelta >= 0 ? '#4caf50' : '#ef5350' }}>
              {kingdom.pointsDelta >= 0 ? '+' : ''}{kingdom.pointsDelta || 0}
            </div>
            <div className="kdm-stat-lbl">RECENT CHANGE</div>
          </div>
        </div>

        {/* Body */}
        <div className="kdm-body">
          {/* Flag & Map Images */}
          {(hasFlag || hasMap) && (
            <div className="kdm-images">
              {hasFlag && (
                <div className="kdm-image-card">
                  <img src={resolveImageUrl(kingdom.flag)} alt="Flag" />
                  <div className="kdm-image-label">KINGDOM FLAG</div>
                </div>
              )}
              {hasMap && (
                <div className="kdm-image-card">
                  <img src={resolveImageUrl(kingdom.map)} alt="Map" />
                  <div className="kdm-image-label">KINGDOM MAP</div>
                </div>
              )}
            </div>
          )}

          {/* Description / Lore */}
          {kingdom.description && (
            <div>
              <div className="kdm-section-title">LORE & DESCRIPTION</div>
              <p className="kdm-description">{kingdom.description}</p>
            </div>
          )}

          {/* Team Members */}
          <div>
            <div className="kdm-section-title">
              <UsersIcon size={12} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              COUNCIL MEMBERS
            </div>
            {hasTeam ? (
              <div className="kdm-team-list">
                {kingdom.teamMembers.map((member, idx) => (
                  <div key={idx} className="kdm-team-member">
                    <div className="kdm-member-avatar">
                      {isImagePath(member.image) ? (
                        <img src={resolveImageUrl(member.image)} alt={member.name} />
                      ) : (
                        <ImageIcon size={14} color="rgba(255,255,255,0.3)" />
                      )}
                    </div>
                    <div>
                      <div className="kdm-member-name">{member.name}</div>
                      <div className="kdm-member-role">{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="kdm-empty">No champions pledged yet.</div>
            )}
          </div>

          {/* Designs */}
          {hasDesigns && (
            <div>
              <div className="kdm-section-title">DESIGNS & MOODBOARD</div>
              <div className="kdm-designs-grid">
                {kingdom.designs.map((design, idx) => (
                  <div key={idx} className="kdm-design-thumb">
                    <img src={resolveImageUrl(design)} alt={`Design ${idx + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
