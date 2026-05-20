import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Crown, BookOpen, Swords, Eye, Shield, Award, Flame, Mountain, Anchor, Wind, Bird, Star, Zap } from 'lucide-react';
import './TeamsPage.css';

const hexToRgba = (hex, alpha) => {
  if (!hex) return `rgba(200, 160, 40, ${alpha})`;
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

const getRoleIcon = (role = '') => {
  const r = role.toLowerCase();
  if (r.includes('lead') || r.includes('captain') || r.includes('king') || r.includes('queen') || r.includes('emperor')) return <Crown size={14} className="role-icon role-icon--leader" />;
  if (r.includes('strategy') || r.includes('strategist') || r.includes('advisor') || r.includes('wizard') || r.includes('tactician') || r.includes('intel')) return <BookOpen size={14} className="role-icon role-icon--strategist" />;
  if (r.includes('fighter') || r.includes('combat') || r.includes('champion') || r.includes('warrior') || r.includes('knight') || r.includes('duelist')) return <Swords size={14} className="role-icon role-icon--combatant" />;
  if (r.includes('scout') || r.includes('spy') || r.includes('hunter') || r.includes('recon') || r.includes('infiltrator')) return <Eye size={14} className="role-icon role-icon--scout" />;
  if (r.includes('mvp') || r.includes('elite') || r.includes('veteran') || r.includes('star')) return <Award size={14} className="role-icon role-icon--mvp" />;
  return <Shield size={14} className="role-icon role-icon--default" />;
};

export default function TeamsPage() {
  const { kingdoms } = useApp();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`teams-page ${entered ? 'teams-page--entered' : ''}`}>
      <div className="teams-header">
        <div className="teams-header-bg"></div>
        <div className="teams-header-overlay"></div>
        <div className="teams-header-content animate-fade-in">
          <Users size={32} className="teams-crest" />
          <h1 className="teams-title">KINGDOM ALLIANCES</h1>
          <p className="teams-subtitle">THE WAR COUNCILS & CHAMPIONS</p>
          <div className="teams-divider">
            <div className="teams-divider-line"></div>
            <div className="teams-divider-diamond">♦</div>
            <div className="teams-divider-line"></div>
          </div>
        </div>
      </div>

      <div className="teams-grid-wrap">
        <div className="teams-grid">
          {kingdoms.map((k, idx) => {
            const baseColor = k.color || '#B87333';
            const borderColor = baseColor;
            const glowColor = hexToRgba(baseColor, 0.45);

            return (
              <div 
                key={k._id} 
                className="tcard visible"
                style={{ 
                  '--delay': `${idx * 0.1}s`,
                  '--border-c': borderColor,
                  '--glow-c': glowColor,
                  '--bg-top': hexToRgba(baseColor, 0.15),
                  '--bg-mid': hexToRgba(baseColor, 0.05)
                }}
              >
                <div className="tc-bg-texture" />
                
                <div className="tc-side-banner">
                  <div className="tc-side-icon">⚔</div>
                </div>

                <div className="tc-main-frame">
                  <div className="tc-content">
                    <div className="tc-top-section">
                      <div className="tc-emblem-wrap" style={{ color: baseColor, filter: `drop-shadow(0 0 15px ${glowColor})` }}>
                        {getKingdomIcon(k.name, 48)}
                      </div>
                      <h3 className="tc-name">{k.name}</h3>
                    </div>

                    <div className="tc-divider" style={{ background: `linear-gradient(90deg, transparent, ${baseColor}, transparent)` }} />
                    
                    <div className="tc-bottom-section">
                      <div className="tc-points-wrap">
                        <span className="tc-pts-val">{k.points ? k.points.toLocaleString() : 0}</span>
                        <span className="tc-pts-label">POINTS</span>
                      </div>
                    </div>

                    <div className="tc-roster">
                      <div className="tc-roster-header">
                        <span>COUNCIL MEMBERS</span>
                      </div>
                      
                      {k.teamMembers && k.teamMembers.length > 0 ? (
                        <div className="tc-roster-list">
                          {k.teamMembers.map((member, i) => (
                            <div key={i} className="tc-roster-row">
                              <div className="tc-roster-glow" style={{ background: baseColor }}></div>
                              <div className="tc-member-name-wrap">
                                {member.image ? (
                                  <img 
                                    src={member.image.startsWith('http') ? member.image : `http://localhost:5001${member.image}`} 
                                    alt={member.name} 
                                    style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover', border: `1px solid ${baseColor}` }}
                                  />
                                ) : (
                                  getRoleIcon(member.role)
                                )}
                                <span className="tc-member-name">{member.name}</span>
                              </div>
                              <span className="tc-member-role" style={{ color: baseColor }}>{member.role}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="tc-roster-empty">
                          <p>No champions pledged.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="tc-crystal-spike" style={{ background: `linear-gradient(180deg, ${glowColor} 0%, transparent 100%)` }} />
                </div>
                
                <div className="tc-ambient-glow" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
