import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import { useTimer } from '../../hooks/useTimer';
import { updateRoundStatus } from '../../api';
import { useToast } from '../../context/ToastContext';
import './Panels.css';

export default function RoundManagement() {
  const { currentRound, setCurrentRound } = useApp();
  const { isAdmin, token } = useAdmin();
  const timer = useTimer(currentRound);
  const { addToast } = useToast();

  const handleStatus = async (status) => {
    if (!currentRound) return;
    try {
      const updated = await updateRoundStatus(currentRound._id, status);
      setCurrentRound(updated);
      addToast(`Round ${status === 'paused' ? 'paused' : 'ended'} successfully`, 'success');
    } catch {
      addToast('Failed to update round status', 'error');
    }
  };

  if (!currentRound) return (
    <section className="panel round-panel">
      <div className="panel-header">
        <div className="panel-title-group">
          <span className="panel-icon"></span>
          <h2 className="panel-title">ROUND MANAGEMENT</h2>
        </div>
      </div>
      <p className="panel-empty">No active round</p>
    </section>
  );

  return (
    <section className="panel round-panel">
      <div className="panel-header">
        <div className="panel-title-group">
          <span className="panel-icon"></span>
          <h2 className="panel-title">ROUND MANAGEMENT</h2>
        </div>
      </div>
      <div className="round-mgmt-body">
        <div className="rm-current-row">
          <span className="rm-label">CURRENT ROUND</span>
          <span className={`rm-status-badge ${currentRound.status}`}>{currentRound.status.toUpperCase()}</span>
        </div>
        <div className="rm-round-name">
          {currentRound.name}
          {isAdmin && <button className="rm-edit-btn" title="Edit round"></button>}
        </div>

        <div className="rm-divider" />

        <span className="rm-label">ROUND TIMER</span>
        <div className="rm-timer">
          <span className="rm-timer-val">{timer.hrs}</span>
          <span className="rm-timer-sep">:</span>
          <span className="rm-timer-val">{timer.mins}</span>
          <span className="rm-timer-sep">:</span>
          <span className="rm-timer-val">{timer.secs}</span>
        </div>
        <div className="rm-timer-labels">
          <span>HRS</span><span>MINS</span><span>SECS</span>
        </div>

        {isAdmin && (
          <div className="rm-actions">
            {currentRound.status === 'upcoming' ? (
              <button className="btn-primary rm-btn" onClick={() => handleStatus('live')}>
                ▶ START ROUND
              </button>
            ) : (
              <>
                <button className="btn-primary rm-btn" onClick={() => handleStatus(currentRound.status === 'paused' ? 'live' : 'paused')}>
                  {currentRound.status === 'paused' ? '▶ RESUME' : '⏸ PAUSE ROUND'}
                </button>
                <button className="btn-danger rm-btn" onClick={() => handleStatus('ended')}>
                  ⏹ END ROUND
                </button>
              </>
            )}
          </div>
        )}

        {currentRound.nextRoundName && (
          <div className="rm-next">
            <span className="rm-label">NEXT ROUND</span>
            <span className="rm-next-name">{currentRound.nextRoundName}</span>
            <span className="rm-next-sub">Starts automatically after current round ends</span>
          </div>
        )}
      </div>
    </section>
  );
}
