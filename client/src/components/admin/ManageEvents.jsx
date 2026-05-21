import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { createRound, updateRound, deleteRound } from '../../api';
import { useToast } from '../../context/ToastContext';
import './Admin.css';

export default function ManageEvents() {
  const { allRounds } = useApp();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    duration: 60,
    status: 'upcoming',
    dayNumber: '',
    dayTitle: '',
    timeLabel: '',
    location: '',
    theme: ''
  });
  const [editingRound, setEditingRound] = useState(null);

  const handleAddRound = async () => {
    if (!formData.name) return addToast('Event name is required', 'error');
    try {
      await createRound({
        name: formData.name,
        durationMinutes: Number(formData.duration) || 60,
        status: 'upcoming',
        dayNumber: formData.dayNumber ? Number(formData.dayNumber) : undefined,
        dayTitle: formData.dayTitle,
        timeLabel: formData.timeLabel,
        location: formData.location,
        theme: formData.theme
      });
      addToast('Event created successfully', 'success');
      setFormData({
        name: '',
        duration: 60,
        status: 'upcoming',
        dayNumber: '',
        dayTitle: '',
        timeLabel: '',
        location: '',
        theme: ''
      });
    } catch (err) {
      addToast('Failed to create event', 'error');
    }
  };

  const handleEdit = (r) => {
    setEditingRound(r._id);
    setFormData({
      name: r.name,
      duration: r.durationMinutes || 60,
      status: r.status,
      dayNumber: r.dayNumber || '',
      dayTitle: r.dayTitle || '',
      timeLabel: r.timeLabel || '',
      location: r.location || '',
      theme: r.theme || ''
    });
  };

  const handleSave = async (id) => {
    try {
      await updateRound(id, {
        name: formData.name,
        durationMinutes: Number(formData.duration) || 60,
        status: formData.status,
        dayNumber: formData.dayNumber ? Number(formData.dayNumber) : undefined,
        dayTitle: formData.dayTitle,
        timeLabel: formData.timeLabel,
        location: formData.location,
        theme: formData.theme
      });
      addToast('Event updated successfully', 'success');
      setEditingRound(null);
      setFormData({
        name: '',
        duration: 60,
        status: 'upcoming',
        dayNumber: '',
        dayTitle: '',
        timeLabel: '',
        location: '',
        theme: ''
      });
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
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(184,115,51,0.25)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-bright)', fontSize: '0.85rem', marginBottom: '12px', letterSpacing: '0.05em' }}>CREATE NEW EVENT</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>EVENT NAME</label>
              <input className="admin-input" style={{ width: '100%' }} placeholder="e.g. Rise of the Realm" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>DAY NUMBER</label>
              <input type="number" className="admin-input" style={{ width: '100%' }} placeholder="e.g. 1" value={formData.dayNumber} onChange={e => setFormData({ ...formData, dayNumber: e.target.value })} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>DAY TITLE</label>
              <input className="admin-input" style={{ width: '100%' }} placeholder="e.g. The First Crown" value={formData.dayTitle} onChange={e => setFormData({ ...formData, dayTitle: e.target.value })} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>TIME LABEL</label>
              <input className="admin-input" style={{ width: '100%' }} placeholder="e.g. 08:30 AM" value={formData.timeLabel} onChange={e => setFormData({ ...formData, timeLabel: e.target.value })} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>LOCATION (OPTIONAL)</label>
              <input className="admin-input" style={{ width: '100%' }} placeholder="e.g. Sahitya Sangh, Girgaon" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>THEME (OPTIONAL)</label>
              <input className="admin-input" style={{ width: '100%' }} placeholder="e.g. Dress up as DC/Marvel" value={formData.theme} onChange={e => setFormData({ ...formData, theme: e.target.value })} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>DURATION (MINS)</label>
              <input type="number" className="admin-input" style={{ width: '100%' }} placeholder="e.g. 90" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
            </div>
          </div>
          <button className="btn-gold" style={{ width: '100%', padding: '10px' }} onClick={handleAddRound}>Add Event to Timeline</button>
        </div>

        {/* Existing Events List */}
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Time</th>
                <th>Event Name</th>
                <th>Status</th>
                <th>Location / Theme</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allRounds.map(r => (
                <tr key={r._id}>
                  <td>
                    {editingRound === r._id ? (
                      <input type="number" className="admin-input" style={{ width: '60px' }} value={formData.dayNumber} onChange={e => setFormData({ ...formData, dayNumber: e.target.value })} />
                    ) : (r.dayNumber ? `Day ${r.dayNumber}` : '--')}
                  </td>
                  <td>
                    {editingRound === r._id ? (
                      <input className="admin-input" style={{ width: '100px' }} value={formData.timeLabel} onChange={e => setFormData({ ...formData, timeLabel: e.target.value })} />
                    ) : (r.timeLabel || '--')}
                  </td>
                  <td>
                    {editingRound === r._id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <input className="admin-input" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        <input className="admin-input" placeholder="Day Title" value={formData.dayTitle} onChange={e => setFormData({ ...formData, dayTitle: e.target.value })} />
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{r.name}</div>
                        {r.dayTitle && <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{r.dayTitle}</div>}
                      </div>
                    )}
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
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <input className="admin-input" placeholder="Location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                        <input className="admin-input" placeholder="Theme" value={formData.theme} onChange={e => setFormData({ ...formData, theme: e.target.value })} />
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.65rem' }}>
                        {r.location && <div>📍 {r.location}</div>}
                        {r.theme && <div style={{ color: 'var(--gold-dim)' }}>🎭 {r.theme}</div>}
                        {!r.location && !r.theme && <span style={{ color: 'var(--text-muted)' }}>--</span>}
                      </div>
                    )}
                  </td>
                  <td>
                    {editingRound === r._id ? (
                      <input type="number" className="admin-input" style={{ width: '70px' }} value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                    ) : (r.durationMinutes ? `${r.durationMinutes}m` : '--')}
                  </td>
                  <td>
                    {editingRound === r._id ? (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="btn-gold" style={{ padding: '4px 8px', fontSize: '0.65rem' }} onClick={() => handleSave(r._id)}>Save</button>
                        <button className="btn-danger" style={{ padding: '4px 8px', fontSize: '0.65rem' }} onClick={() => setEditingRound(null)}>Cancel</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="btn-gold" style={{ padding: '4px 8px', fontSize: '0.65rem' }} onClick={() => handleEdit(r)}>Edit</button>
                        <button className="btn-danger" style={{ padding: '4px 8px', fontSize: '0.65rem' }} onClick={() => handleDelete(r._id)}>Delete</button>
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
