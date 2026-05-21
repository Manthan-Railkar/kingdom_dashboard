import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Clock, Calendar, Bookmark, Swords, PlayCircle, CheckCircle, PauseCircle } from 'lucide-react';
import './EventsPage.css';

export default function EventsPage() {
  const { allRounds } = useApp();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Group events by dayNumber
  const daysMap = {};
  allRounds.forEach(r => {
    const day = r.dayNumber || 99; // 99 for unscheduled
    if (!daysMap[day]) {
      daysMap[day] = { dayNumber: day, dayTitle: r.dayTitle, events: [] };
    }
    daysMap[day].events.push(r);
  });

  const sortedDays = Object.values(daysMap).sort((a, b) => a.dayNumber - b.dayNumber);

  const getStatusInfo = (status) => {
    switch(status) {
      case 'live': return { label: 'LIVE NOW', icon: <PlayCircle size={13}/>, colorClass: 'ev-status-live' };
      case 'ended': return { label: 'COMPLETED', icon: <CheckCircle size={13}/>, colorClass: 'ev-status-ended' };
      case 'paused': return { label: 'PAUSED', icon: <PauseCircle size={13}/>, colorClass: 'ev-status-paused' };
      default: return { label: 'UPCOMING', icon: <Clock size={13}/>, colorClass: 'ev-status-upcoming' };
    }
  };

  return (
    <div className={`events-page ${entered ? 'events-page--entered' : ''}`}>
      <div className="ev-header">
        <div className="ev-header-bg"></div>
        <div className="ev-header-content animate-fade-in">
          <Calendar size={32} className="ev-crest" />
          <h1 className="ev-title">THE GRAND TIMELINE</h1>
          <p className="ev-subtitle">THE SIX DAYS OF QUANTUM</p>
          <div className="ev-divider">
            <div className="ev-divider-line"></div>
            <div className="ev-divider-diamond">♦</div>
            <div className="ev-divider-line"></div>
          </div>
        </div>
      </div>

      <div className="ev-timeline-container">
        {sortedDays.length === 0 && (
          <div className="ev-empty">
            <p>No events have been written into the scrolls.</p>
          </div>
        )}

        {sortedDays.map((dayGroup, dIdx) => (
          <div key={`day-${dayGroup.dayNumber}`} className="ev-day-section" style={{ '--delay': `${dIdx * 0.15}s` }}>
            
            <div className="ev-day-banner">
              <div className="ev-day-banner-inner">
                <span className="ev-day-badge">DAY {dayGroup.dayNumber !== 99 ? dayGroup.dayNumber : '?'}</span>
                <h2 className="ev-day-heading">{dayGroup.dayTitle || 'UNKNOWN TIDE'}</h2>
              </div>
            </div>
            
            <div className="ev-timeline-track">
              <div className="ev-track-line"></div>
              {dayGroup.events.sort((a, b) => a.roundNumber - b.roundNumber).map((ev, eIdx) => {
                const statusInfo = getStatusInfo(ev.status);
                
                return (
                  <div key={ev._id} className={`ev-card-wrapper ${ev.status === 'live' ? 'ev-card-wrapper--live' : ''}`} style={{ '--card-delay': `${(dIdx * 0.15) + (eIdx * 0.1)}s` }}>
                    <div className="ev-track-node">
                      <div className={`ev-node-inner ${ev.status === 'live' ? 'ev-node-pulse' : ''}`}></div>
                    </div>
                    
                    <div className="ev-card">
                      <div className="ev-card-glow"></div>
                      <div className="ev-card-content">
                        <div className="ev-card-header">
                          <div className="ev-time-badge">
                            <Clock size={12} strokeWidth={2.5} />
                            <span>{ev.timeLabel || 'TBD'}</span>
                          </div>
                          <div className={`ev-status-badge ${statusInfo.colorClass}`}>
                            {statusInfo.icon}
                            <span>{statusInfo.label}</span>
                          </div>
                        </div>
                        
                        <div className="ev-card-body">
                          <h3 className="ev-event-name">{ev.name}</h3>
                          {ev.description && <p className="ev-event-desc">{ev.description}</p>}
                          
                          <div className="ev-event-meta">
                            {ev.durationMinutes > 0 && (
                              <span className="ev-meta-item">
                                <Swords size={12} /> {ev.durationMinutes} MINS
                              </span>
                            )}
                            {ev.location && (
                              <span className="ev-meta-item">
                                <MapPin size={12} /> {ev.location}
                              </span>
                            )}
                            {ev.theme && (
                              <span className="ev-meta-item ev-meta-theme">
                                <Bookmark size={12} /> {ev.theme}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
