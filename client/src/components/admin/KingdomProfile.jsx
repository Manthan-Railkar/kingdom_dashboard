import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api';
import './Admin.css';
import { Upload, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

export default function KingdomProfile() {
  const { token, admin } = useAdmin();
  const { addToast } = useToast();
  const [kingdom, setKingdom] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [flagUrl, setFlagUrl] = useState('');
  const [emblemUrl, setEmblemUrl] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [designsUrl, setDesignsUrl] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  
  const [newRole, setNewRole] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberImage, setNewMemberImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchKingdom = async () => {
    try {
      if (!admin?.kingdomId?._id) return;
      const res = await api.get(`/kingdoms/${admin.kingdomId._id}`);
      const k = res.data;
      setKingdom(k);
      setFlagUrl(k.flag || '');
      setEmblemUrl(k.emblem || '');
      setMapUrl(k.map || '');
      setDesignsUrl(k.designs || '');
      setTeamMembers(k.teamMembers || []);
    } catch (err) {
      addToast('Failed to load kingdom profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKingdom();
  }, [admin]);

  const handleUpdate = async (updateData) => {
    try {
      await api.patch(`/kingdoms/${admin.kingdomId._id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      addToast('Profile updated', 'success');
      fetchKingdom();
    } catch (err) {
      addToast('Failed to update profile', 'error');
    }
  };

  const handleAddMember = async () => {
    if (!newRole || !newMemberName) {
      return addToast('Role and Name are required', 'error');
    }
    
    setIsUploading(true);
    let imageUrl = '';
    
    if (newMemberImage) {
      const formData = new FormData();
      formData.append('image', newMemberImage);
      try {
        const res = await api.post('/gallery', formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        imageUrl = `/uploads/${res.data.filename}`;
      } catch (err) {
        addToast('Failed to upload image', 'error');
        setIsUploading(false);
        return;
      }
    }

    const newMember = { name: newMemberName, role: newRole, image: imageUrl };
    const updatedMembers = [...teamMembers, newMember];
    await handleUpdate({ teamMembers: updatedMembers });
    setNewRole('');
    setNewMemberName('');
    setNewMemberImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsUploading(false);
  };

  const handleRemoveMember = async (index) => {
    const updatedMembers = teamMembers.filter((_, i) => i !== index);
    await handleUpdate({ teamMembers: updatedMembers });
  };

  if (loading) return <div style={{ color: 'var(--text-muted)' }}>Loading...</div>;
  if (!kingdom) return <div style={{ color: 'var(--text-muted)' }}>No Kingdom Assigned. Please contact Super Admin.</div>;

  return (
    <section className="admin-panel" style={{ padding: '20px' }}>
      <div className="al-header" style={{ marginBottom: '30px' }}>
        <h2 className="al-title">MY KINGDOM PROFILE</h2>
        <div className="al-subtitle">MANAGE YOUR KINGDOM DETAILS & TEAM ROLES</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Left Col: Media Uploads */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(184,115,51,0.2)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-bright)', marginBottom: '20px', fontSize: '0.9rem' }}>ASSETS & MEDIA</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>EMBLEM URL</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input className="admin-input" style={{ flex: 1 }} value={emblemUrl} onChange={e => setEmblemUrl(e.target.value)} placeholder="https://..." />
                <button className="btn-gold" onClick={() => handleUpdate({ emblem: emblemUrl })}>Save</button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>FLAG URL</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input className="admin-input" style={{ flex: 1 }} value={flagUrl} onChange={e => setFlagUrl(e.target.value)} placeholder="https://..." />
                <button className="btn-gold" onClick={() => handleUpdate({ flag: flagUrl })}>Save</button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>MAP URL</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input className="admin-input" style={{ flex: 1 }} value={mapUrl} onChange={e => setMapUrl(e.target.value)} placeholder="https://..." />
                <button className="btn-gold" onClick={() => handleUpdate({ map: mapUrl })}>Save</button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>DESIGNS/MOODBOARD URL</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input className="admin-input" style={{ flex: 1 }} value={designsUrl} onChange={e => setDesignsUrl(e.target.value)} placeholder="https://..." />
                <button className="btn-gold" onClick={() => handleUpdate({ designs: designsUrl })}>Save</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Team Roles */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(184,115,51,0.2)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-bright)', marginBottom: '20px', fontSize: '0.9rem' }}>TEAM ROLES</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input className="admin-input" placeholder="Role (e.g. King)" value={newRole} onChange={e => setNewRole(e.target.value)} style={{ flex: 1 }} />
              <input className="admin-input" placeholder="Name" value={newMemberName} onChange={e => setNewMemberName(e.target.value)} style={{ flex: 1 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={e => setNewMemberImage(e.target.files[0])} style={{ color: 'var(--text-muted)', fontSize: '0.8rem', flex: 1 }} />
              <button className="btn-gold" onClick={handleAddMember} disabled={isUploading} style={{ padding: '8px 15px' }}>
                {isUploading ? 'Adding...' : 'Add Role'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {teamMembers.map((member, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', padding: '10px 15px', borderRadius: '4px', borderLeft: '2px solid var(--gold-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  {member.image ? (
                    <img src={member.image.startsWith('http') ? member.image : `http://localhost:5001${member.image}`} alt={member.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--gold-dark)' }} />
                  ) : (
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      <ImageIcon size={20} />
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--gold-bright)' }}>{member.role}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{member.name}</div>
                  </div>
                </div>
                <button className="btn-danger" onClick={() => handleRemoveMember(idx)} style={{ padding: '5px' }}><Trash2 size={16} /></button>
              </div>
            ))}
            {teamMembers.length === 0 && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No team members assigned yet.</div>}
          </div>
        </div>

      </div>
    </section>
  );
}
