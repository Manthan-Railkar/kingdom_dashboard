import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { updateKingdom } from '../../api';
import { useToast } from '../../context/ToastContext';
import './Admin.css';

export default function ManageTeams() {
  const { kingdoms } = useApp();
  const { addToast } = useToast();
  const [editingKingdom, setEditingKingdom] = useState(null);
  const [formData, setFormData] = useState({ name: '', color: '', teamMembers: [] });
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');

  const handleEdit = (k) => {
    setEditingKingdom(k._id);
    setFormData({ name: k.name, color: k.color || '#B87333', teamMembers: k.teamMembers || [] });
    setNewMemberName('');
    setNewMemberRole('');
  };

  const handleCancel = () => {
    setEditingKingdom(null);
  };

  const handleAddMember = () => {
    if (!newMemberName) return;
    setFormData({
      ...formData,
      teamMembers: [...formData.teamMembers, { name: newMemberName, role: newMemberRole || 'Member' }]
    });
    setNewMemberName('');
    setNewMemberRole('');
  };

  const handleRemoveMember = (idx) => {
    setFormData({
      ...formData,
      teamMembers: formData.teamMembers.filter((_, i) => i !== idx)
    });
  };

  const handleSave = async (id) => {
    if (!formData.name) return addToast('Name is required', 'error');
    try {
      await updateKingdom(id, formData);
      addToast('Team updated successfully', 'success');
      setEditingKingdom(null);
    } catch (err) {
      addToast('Failed to update team', 'error');
    }
  };

  const sortedKingdoms = [...kingdoms].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section className="panel admin-panel">
      <div className="panel-header">
        <h2 className="panel-title">TEAMS MANAGEMENT</h2>
      </div>
      <div className="admin-content">
        <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Kingdom Name</th>
              <th>Theme Color</th>
              <th>Team Members</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedKingdoms.map(k => (
              <tr key={k._id}>
                <td>
                  {editingKingdom === k._id ? (
                    <input
                      className="admin-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  ) : (
                    k.name
                  )}
                </td>
                <td>
                  {editingKingdom === k._id ? (
                    <input
                      type="color"
                      className="admin-input"
                      style={{ padding: 0, width: '50px', height: '35px' }}
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: k.color || '#B87333' }} />
                      {k.color || '#B87333'}
                    </div>
                  )}
                </td>
                <td>
                  {editingKingdom === k._id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {formData.teamMembers.map((m, i) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem' }}>{m.name} ({m.role})</span>
                          <button className="btn-danger" style={{ padding: '2px 6px', fontSize: '0.6rem' }} onClick={() => handleRemoveMember(i)}>X</button>
                        </div>
                      ))}
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <input className="admin-input" style={{ width: '80px', padding: '4px' }} placeholder="Name" value={newMemberName} onChange={e => setNewMemberName(e.target.value)} />
                        <input className="admin-input" style={{ width: '60px', padding: '4px' }} placeholder="Role" value={newMemberRole} onChange={e => setNewMemberRole(e.target.value)} />
                        <button className="btn-gold" style={{ padding: '4px 8px' }} onClick={handleAddMember}>Add</button>
                      </div>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {(k.teamMembers || []).length} Members
                    </span>
                  )}
                </td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  {editingKingdom === k._id ? (
                    <>
                      <button className="btn-gold" onClick={() => handleSave(k._id)}>Save</button>
                      <button className="btn-danger" onClick={handleCancel}>Cancel</button>
                    </>
                  ) : (
                    <button className="btn-gold" onClick={() => handleEdit(k)}>Edit</button>
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
