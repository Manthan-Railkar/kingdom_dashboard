import React from 'react';
import { useApp } from '../../context/AppContext';
import './Panels.css';

const STATUS_CONFIG = {
  ended:    { label: 'COMPLETED', color: 'var(--positive)',      icon: '✓' },
  live:     { label: 'LIVE NOW',  color: 'var(--green-live)',    icon: '⚡', pulse: true },
  paused:   { label: 'PAUSED',    color: 'var(--yellow-warn)',   icon: '⏸' },
  upcoming: { label: 'UP NEXT',   color: 'var(--text-secondary)', icon: '⚔' },
};

export default function EventsTimeline() {
  const { allRounds } = useApp();

  return (
    <section className="panel events-panel">
      <div className="panel-header">
        <div className="panel-title-group">
          <span className="panel-icon">⚔</span>
          <h2 className="panel-title">UPCOMING EVENTS</h2>
        </div>
      </div>
      <div className="events-timeline">
        <div className="timeline-track">
          {allRounds.map((round, i) => {
            const cfg = STATUS_CONFIG[round.status] || STATUS_CONFIG.upcoming;
            const isLast = i === allRounds.length - 1;
            return (
              <div key={round._id} className="timeline-event">
                <div className={`evt-icon-wrap ${cfg.pulse ? 'pulse-wrap' : ''}`} style={{ borderColor: cfg.color, color: cfg.color }}>
                  <span className="evt-icon">{cfg.icon}</span>
                </div>
                {!isLast && <div className="evt-connector" style={{ background: i < allRounds.findIndex(r => r.status === 'live' || r.status === 'upcoming') ? cfg.color : 'rgba(255,255,255,0.1)' }} />}
                <span className="evt-name">{round.name}</span>
                <span className="evt-status" style={{ color: cfg.color }}>{cfg.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
