import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { createRound, updateRound, deleteRound } from '../../api';
import { useToast } from '../../context/ToastContext';
import './Admin.css';

export default function ManageEvents() {
  const { allRounds } = useApp();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({ name: '', duration: 60, status: 'upcoming' });
  const [editingRound, setEditingRound] = useState(null);

  const handleAddRound = async () => {
    if (!formData.name) return addToast('Round name is required', 'error');
    try {
      await createRound({
        name: formData.name,
        durationMinutes: Number(formData.duration),
        status: 'upcoming'
      });
      addToast('Event created successfully', 'success');
      setFormData({ name: '', duration: 60, status: 'upcoming' });
    } catch (err) {
      addToast('Failed to create event', 'error');
    }
  };

  const handleEdit = (r) => {
    setEditingRound(r._id);
    setFormData({ name: r.name, duration: r.durationMinutes || 60, status: r.status });
  };

  const handleSave = async (id) => {
    try {
      await updateRound(id, { name: formData.name, durationMinutes: Number(formData.duration), status: formData.status });
      addToast('Event updated successfully', 'success');
      setEditingRound(null);
      setFormData({ name: '', duration: 60, status: 'upcoming' });
    } catch (err) {
      addToast('Failed to update event', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteRound(id);
      addToast('Event deleted', 'success');
    } catch (err) {
      addToast('Failed to delete event', 'error');
    }
  };

  return (
    <section className="panel admin-panel">
      <div className="panel-header">
        <h2 className="panel-title">EVENT MANAGER</h2>
      </div>
      <div className="admin-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Create Event Form */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(201,162,39,0.2)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-bright)', fontSize: '0.8rem', marginBottom: '10px' }}>CREATE NEW EVENT</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input className="admin-input" style={{ flex: 1 }} placeholder="Event / Round Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            <input type="number" className="admin-input" style={{ width: '120px' }} placeholder="Duration (mins)" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
            <button className="btn-gold" onClick={handleAddRound}>Add Event</button>
          </div>
        </div>

        {/* Existing Events List */}
        <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Status</th>
              <th>Duration (mins)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allRounds.map(r => (
              <tr key={r._id}>
                <td>
                  {editingRound === r._id ? (
                    <input className="admin-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  ) : r.name}
                </td>
                <td style={{ color: r.status === 'live' ? 'var(--gold-bright)' : r.status === 'ended' ? '#44dd88' : 'var(--text-muted)' }}>
                  {editingRound === r._id ? (
                    <select className="admin-input" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live</option>
                      <option value="paused">Paused</option>
                      <option value="ended">Ended</option>
                    </select>
                  ) : (
                    r.status.toUpperCase()
                  )}
                </td>
                <td>
                  {editingRound === r._id ? (
                    <input type="number" className="admin-input" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                  ) : (r.durationMinutes || '--')}
                </td>
                <td>
                  {editingRound === r._id ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-gold" onClick={() => handleSave(r._id)}>Save</button>
                      <button className="btn-danger" onClick={() => setEditingRound(null)}>Cancel</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-gold" onClick={() => handleEdit(r)}>Edit</button>
                      <button className="btn-danger" onClick={() => handleDelete(r._id)}>Delete</button>
                    </div>
                  )}
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
