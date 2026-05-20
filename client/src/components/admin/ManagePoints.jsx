import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { updatePoints } from '../../api';
import { useToast } from '../../context/ToastContext';
import './Admin.css';

export default function ManagePoints() {
  const { kingdoms } = useApp();
  const { addToast } = useToast();
  const [pointDeltas, setPointDeltas] = useState({});

  const handleUpdate = async (kingdomId) => {
    const delta = pointDeltas[kingdomId];
    if (!delta) return;
    try {
      await updatePoints(kingdomId, { delta: Number(delta) });
      addToast('Points updated successfully', 'success');
      setPointDeltas(prev => ({ ...prev, [kingdomId]: '' }));
    } catch (err) {
      addToast('Failed to update points', 'error');
    }
  };

  const handleReset = async (kingdomId) => {
    try {
      await updatePoints(kingdomId, { points: 0, clearDelta: true });
      addToast('Points reset to 0', 'success');
      setPointDeltas(prev => ({ ...prev, [kingdomId]: '' }));
    } catch (err) {
      addToast('Failed to reset points', 'error');
    }
  };

  return (
    <section className="panel admin-panel">
      <div className="panel-header">
        <h2 className="panel-title">POINTS MANAGEMENT</h2>
      </div>
      <div className="admin-content">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Kingdom</th>
                <th>Current Points</th>
                <th>Add/Subtract Points</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {kingdoms.map(k => (
                <tr key={k._id}>
                  <td>{k.name}</td>
                  <td className="gold-text">{k.points}</td>
                  <td>
                    <input
                      type="number"
                      className="admin-input"
                      placeholder="e.g. 100 or -50"
                      value={pointDeltas[k._id] || ''}
                      onChange={(e) => setPointDeltas({ ...pointDeltas, [k._id]: e.target.value })}
                    />
                  </td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-gold" onClick={() => handleUpdate(k._id)}>
                      Update
                    </button>
                    <button className="btn-danger" onClick={() => handleReset(k._id)}>
                      Reset
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
