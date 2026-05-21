import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import { updatePoints } from '../../api';
import api from '../../api';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2, FolderPlus } from 'lucide-react';
import './Admin.css';

export default function ManagePoints() {
  const { kingdoms } = useApp();
  const { token } = useAdmin();
  const { addToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [pointDeltas, setPointDeltas] = useState({});
  const [newCat, setNewCat] = useState({ name: '', description: '', icon: '⭐' });
  const [categoryPoints, setCategoryPoints] = useState({}); // { kingdomId: { categoryId: value } }

  const fetchCategories = async () => {
    try {
      const res = await api.get('/point-categories');
      setCategories(res.data);
    } catch (err) {
      addToast('Failed to load categories', 'error');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async () => {
    if (!newCat.name.trim()) return;
    try {
      await api.post('/point-categories', newCat, { headers: { Authorization: `Bearer ${token}` } });
      addToast('Category created', 'success');
      setNewCat({ name: '', description: '', icon: '⭐' });
      fetchCategories();
    } catch (err) {
      addToast('Failed to create category', 'error');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/point-categories/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      addToast('Category deleted', 'success');
      fetchCategories();
    } catch (err) {
      addToast('Failed to delete category', 'error');
    }
  };

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

  const handleUpdateBreakdown = async (kingdomId) => {
    // Collect all category values for this kingdom
    const breakdown = categories.map(cat => {
      const val = categoryPoints[kingdomId]?.[cat._id];
      const kingdom = kingdoms.find(k => k._id === kingdomId);
      const existing = (kingdom?.pointsBreakdown || []).find(b => (b.category?._id || b.category) === cat._id);
      return {
        category: cat._id,
        value: Number(val !== undefined ? val : (existing?.value || 0))
      };
    });

    try {
      await updatePoints(kingdomId, { pointsBreakdown: breakdown });
      addToast('Breakdown updated', 'success');
      setCategoryPoints(prev => ({ ...prev, [kingdomId]: {} })); // Clear local overrides
    } catch (err) {
      addToast('Failed to update breakdown', 'error');
    }
  };

  const handleReset = async (kingdomId) => {
    try {
      await updatePoints(kingdomId, { points: 0, clearDelta: true, pointsBreakdown: [] });
      addToast('Points reset to 0', 'success');
      setPointDeltas(prev => ({ ...prev, [kingdomId]: '' }));
      setCategoryPoints(prev => ({ ...prev, [kingdomId]: {} }));
    } catch (err) {
      addToast('Failed to reset points', 'error');
    }
  };

  return (
    <section className="panel admin-panel">
      <div className="panel-header">
        <h2 className="panel-title">POINTS & CATEGORIES</h2>
      </div>
      
      <div className="admin-content" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* Category Management */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(184,115,51,0.2)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-bright)', fontSize: '0.9rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FolderPlus size={18} /> MANAGE POINT SECTIONS
          </h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input className="admin-input" placeholder="Category Name" value={newCat.name} onChange={e => setNewCat({ ...newCat, name: e.target.value })} />
            <input className="admin-input" placeholder="Icon (e.g. 🛡️)" value={newCat.icon} onChange={e => setNewCat({ ...newCat, icon: e.target.value })} style={{ width: '80px' }} />
            <button className="btn-gold" onClick={handleCreateCategory}><Plus size={16} /> Create Section</button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {categories.map(cat => (
              <div key={cat._id} style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
                <span style={{ fontSize: '0.85rem', color: '#fff' }}>{cat.name}</span>
                <button 
                  onClick={() => handleDeleteCategory(cat._id)}
                  style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', padding: '4px', display: 'flex' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Global Points Table */}
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Kingdom</th>
                <th>Total Points</th>
                <th>Add/Subtract</th>
                <th>Section Breakdown</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {kingdoms.map(k => (
                <tr key={k._id}>
                  <td>{k.name}</td>
                  <td className="gold-text" style={{ fontSize: '1.2rem' }}>{k.points}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <input
                        type="number"
                        className="admin-input"
                        placeholder="Delta"
                        value={pointDeltas[k._id] || ''}
                        onChange={(e) => setPointDeltas({ ...pointDeltas, [k._id]: e.target.value })}
                        style={{ width: '80px' }}
                      />
                      <button className="btn-gold" style={{ padding: '8px' }} onClick={() => handleUpdate(k._id)}>OK</button>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {categories.map(cat => {
                        const existing = (k.pointsBreakdown || []).find(b => (b.category?._id || b.category) === cat._id);
                        return (
                          <div key={cat._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: '4px' }}>
                            <span style={{ fontSize: '0.8rem', width: '20px' }}>{cat.icon}</span>
                            <span style={{ fontSize: '0.7rem', flex: 1, color: 'var(--text-muted)' }}>{cat.name}</span>
                            <input 
                              type="number" 
                              className="admin-input"
                              style={{ width: '60px', padding: '2px 4px', fontSize: '0.75rem' }}
                              value={categoryPoints[k._id]?.[cat._id] ?? (existing?.value || 0)}
                              onChange={(e) => setCategoryPoints({
                                ...categoryPoints,
                                [k._id]: { ...(categoryPoints[k._id] || {}), [cat._id]: e.target.value }
                              })}
                            />
                          </div>
                        );
                      })}
                      {categories.length > 0 && (
                        <button className="btn-gold" style={{ fontSize: '0.65rem', padding: '4px' }} onClick={() => handleUpdateBreakdown(k._id)}>Update Breakdown</button>
                      )}
                    </div>
                  </td>
                  <td>
                    <button className="btn-danger" onClick={() => handleReset(k._id)}>Reset All</button>
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
