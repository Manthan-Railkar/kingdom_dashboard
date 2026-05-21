import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api'; // direct api access for admins
import './Admin.css';

export default function ManageAdmins() {
  const { token, admin: currentAdmin } = useAdmin();
  const { addToast } = useToast();
  const [admins, setAdmins] = useState([]);
  const [kingdoms, setKingdoms] = useState([]);
  const [formData, setFormData] = useState({ username: '', displayName: '', accessKey: '', role: 'admin', kingdomId: '' });
  const [visibleKeys, setVisibleKeys] = useState({});

  const toggleKeyVisibility = (id) => {
    setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchData = async () => {
    try {
      const [adminRes, kingdomRes] = await Promise.all([
        api.get('/admins', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/kingdoms', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setAdmins(adminRes.data);
      setKingdoms(kingdomRes.data);
    } catch (err) {
      addToast('Failed to load data', 'error');
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleCreate = async () => {
    if (!formData.username || !formData.accessKey) return addToast('Username and Key are required', 'error');
    try {
      const payload = { ...formData };
      if (!payload.kingdomId) delete payload.kingdomId;
      if (payload.role === 'superadmin') delete payload.kingdomId; // SuperAdmins don't need kingdoms

      await api.post('/admins', payload, { headers: { Authorization: `Bearer ${token}` } });
      addToast('Admin created successfully', 'success');
      setFormData({ username: '', displayName: '', accessKey: '', role: 'admin', kingdomId: '' });
      fetchData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create admin', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;
    try {
      await api.delete(`/admins/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      addToast('Admin deleted', 'success');
      fetchData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete admin', 'error');
    }
  };

  return (
    <section className="panel admin-panel">
      <div className="panel-header">
        <h2 className="panel-title">ADMIN USERS</h2>
      </div>
      <div className="admin-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Create Admin Form */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(184,115,51,0.2)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-bright)', fontSize: '0.8rem', marginBottom: '10px' }}>CREATE NEW ADMIN</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input className="admin-input" placeholder="Username" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
            <input className="admin-input" placeholder="Display Name" value={formData.displayName} onChange={e => setFormData({ ...formData, displayName: e.target.value })} />
            <input type="password" className="admin-input" placeholder="4-Digit Key" value={formData.accessKey} onChange={e => setFormData({ ...formData, accessKey: e.target.value })} maxLength={10} />
            <select className="admin-input" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} style={{ width: '120px' }}>
              <option value="admin">Captain (Admin)</option>
              <option value="superadmin">Super Admin</option>
            </select>
            {formData.role === 'admin' && (
              <select className="admin-input" value={formData.kingdomId} onChange={e => setFormData({ ...formData, kingdomId: e.target.value })} style={{ width: '150px' }}>
                <option value="">Select Kingdom...</option>
                {kingdoms.map(k => <option key={k._id} value={k._id}>{k.name}</option>)}
              </select>
            )}
            <button className="btn-gold" onClick={handleCreate}>Create</button>
          </div>
        </div>

        {/* Existing Admins */}
        <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Display Name</th>
              <th>Role</th>
              <th>Kingdom</th>
              <th>Access Key</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(a => (
              <tr key={a._id}>
                <td>
                  {a.username}
                  {currentAdmin.id === a._id && (
                    <span style={{ marginLeft: '8px', fontSize: '0.65rem', color: 'var(--gold-primary)', border: '1px solid var(--gold-primary)', padding: '2px 4px', borderRadius: '4px' }}>LOGGED IN</span>
                  )}
                </td>
                <td>{a.displayName}</td>
                <td style={{ color: a.role === 'superadmin' ? 'var(--gold-bright)' : 'var(--text-muted)' }}>
                  {a.role === 'superadmin' ? 'SUPER ADMIN' : 'CAPTAIN'}
                </td>
                <td style={{ fontSize: '0.8rem' }}>
                  {a.kingdomId ? a.kingdomId.name : '--'}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                      {visibleKeys[a._id] ? a.accessKey : '••••'}
                    </span>
                    <button 
                      style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', cursor: 'pointer', fontSize: '0.65rem', textDecoration: 'underline' }}
                      onClick={() => toggleKeyVisibility(a._id)}
                    >
                      {visibleKeys[a._id] ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>
                </td>
                <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {a.lastLogin ? new Date(a.lastLogin).toLocaleString() : 'Never'}
                </td>
                <td>
                  {currentAdmin.id !== a._id ? (
                    <button className="btn-danger" onClick={() => handleDelete(a._id)}>Delete</button>
                  ) : (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>--</span>
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
