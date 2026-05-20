import React from 'react';
import { useApp } from '../../context/AppContext';
import { Swords } from 'lucide-react';
import './RightPanels.css';

const STATUS_META = {
  ended:    { icon: '', label: 'COMPLETED', color: '#44dd88', lineColor: '#44dd88' },
  live:     { icon: '', label: 'LIVE NOW',  color: '#c9a227', lineColor: '#c9a227', pulse: true },
  paused:   { icon: '⏸', label: 'PAUSED',    color: '#ffc107', lineColor: '#ffc107' },
  upcoming: { icon: '', label: 'UP NEXT',   color: '#5a4a2a', lineColor: 'rgba(255,255,255,0.1)' },
};

export default function UpcomingEvents() {
  const { allRounds } = useApp();
  const rounds = allRounds.slice(0, 4);

  return (
    <section className="panel rp-panel events-panel">
      <div className="panel-header">
        <Swords size={16} className="panel-crown" />
        <h2 className="panel-title">UPCOMING EVENTS</h2>
      </div>
      <div className="ue-timeline">
        {rounds.map((round, i) => {
          const meta = STATUS_META[round.status] || STATUS_META.upcoming;
          const isLast = i === rounds.length - 1;
          return (
            <div key={round._id} className="ue-event">
              <div className="ue-icon-col">
                <div
                  className={`ue-icon ${meta.pulse ? 'ue-pulse' : ''}`}
                  style={{ borderColor: meta.color, color: meta.color }}
                >
                  {meta.icon}
                </div>
                {!isLast && <div className="ue-connector" style={{ background: meta.lineColor }} />}
              </div>
              <div className="ue-info">
                <span className="ue-name">{round.name}</span>
                <span className="ue-status" style={{ color: meta.color }}>{meta.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
