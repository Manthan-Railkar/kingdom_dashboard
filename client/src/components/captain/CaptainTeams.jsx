import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';
import { uploadGalleryImage, updateKingdom, getKingdom } from '../../api';
import { Crown, BookOpen, Swords, Eye, Shield, Award, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import './CaptainTeams.css';

const getRoleIcon = (role = '') => {
  const r = role.toLowerCase();
  if (r.includes('lead') || r.includes('captain') || r.includes('king') || r.includes('queen') || r.includes('emperor')) return <Crown size={14} className="role-icon role-icon--leader" />;
  if (r.includes('strategy') || r.includes('strategist') || r.includes('advisor') || r.includes('wizard') || r.includes('tactician') || r.includes('intel')) return <BookOpen size={14} className="role-icon role-icon--strategist" />;
  if (r.includes('fighter') || r.includes('combat') || r.includes('champion') || r.includes('warrior') || r.includes('knight') || r.includes('duelist')) return <Swords size={14} className="role-icon role-icon--combatant" />;
  if (r.includes('scout') || r.includes('spy') || r.includes('hunter') || r.includes('recon') || r.includes('infiltrator')) return <Eye size={14} className="role-icon role-icon--scout" />;
  if (r.includes('mvp') || r.includes('elite') || r.includes('veteran') || r.includes('star')) return <Award size={14} className="role-icon role-icon--mvp" />;
  return <Shield size={14} className="role-icon role-icon--default" />;
};

export default function CaptainTeams() {
  const { admin } = useAdmin();
  const { addToast } = useToast();
  const [kingdom, setKingdom] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newRole, setNewRole] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberImage, setNewMemberImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchKingdom = async () => {
    try {
      if (!admin?.kingdomId?._id) return;
      const k = await getKingdom(admin.kingdomId._id);
      setKingdom(k);
    } catch (err) {
      addToast('Failed to load kingdom profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKingdom();
  }, [admin]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newRole || !newMemberName) {
      return addToast('Role and Name are required', 'error');
    }
    
    setIsUploading(true);
    let imageUrl = '';
    
    if (newMemberImage) {
      const formData = new FormData();
      formData.append('image', newMemberImage);
      try {
        const res = await uploadGalleryImage(formData);
        imageUrl = `/uploads/${res.filename}`;
      } catch (err) {
        addToast('Failed to upload image', 'error');
        setIsUploading(false);
        return;
      }
    }

    const newMember = { name: newMemberName, role: newRole, image: imageUrl };
    const updatedMembers = [...(kingdom.teamMembers || []), newMember];
    
    try {
      await updateKingdom(kingdom._id, { teamMembers: updatedMembers });
      setKingdom(prev => ({ ...prev, teamMembers: updatedMembers }));
      setNewRole('');
      setNewMemberName('');
      setNewMemberImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      addToast('Member added successfully', 'success');
    } catch(err) {
      addToast('Failed to add member', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveMember = async (index) => {
    const updatedMembers = kingdom.teamMembers.filter((_, i) => i !== index);
    try {
      await updateKingdom(kingdom._id, { teamMembers: updatedMembers });
      setKingdom(prev => ({ ...prev, teamMembers: updatedMembers }));
      addToast('Member removed', 'success');
    } catch(err) {
      addToast('Failed to remove member', 'error');
    }
  };

  if (loading) return <div className="captain-teams-loading">Loading...</div>;
  if (!kingdom) return <div className="captain-teams-loading">No Kingdom Assigned. Please contact Super Admin.</div>;

  return (
    <div className="captain-teams">
      <div className="ct-header">
        <h2 className="ct-title">MANAGE YOUR TEAM ROSTER</h2>
        <div className="ct-subtitle">ASSIGN ROLES AND DISPLAY YOUR CHAMPIONS TO THE REALM</div>
      </div>

      <div className="ct-layout">
        {/* Left Col: Kingdom Identity & Read-Only Roster */}
        <div className="ct-card">
          <div className="ct-card-header" style={{ borderColor: kingdom.color }}>
            {kingdom.emblem ? (
               <img src={kingdom.emblem.startsWith('http') ? kingdom.emblem : `http://localhost:5001${kingdom.emblem}`} className="ct-card-emblem" alt="emblem" />
            ) : (
              <Shield size={40} color={kingdom.color || "var(--gold-bright)"} />
            )}
            <h3 className="ct-card-name" style={{ color: kingdom.color }}>{kingdom.name}</h3>
            <div className="ct-card-count">{kingdom.teamMembers?.length || 0} CHAMPIONS</div>
          </div>
          
          <div className="ct-roster">
            {kingdom.teamMembers && kingdom.teamMembers.length > 0 ? (
              kingdom.teamMembers.map((member, idx) => (
                <div key={idx} className="ct-roster-item" style={{ borderLeftColor: kingdom.color || 'var(--gold-primary)' }}>
                  <div className="ct-roster-avatar">
                     {member.image ? (
                        <img src={member.image.startsWith('http') ? member.image : `http://localhost:5001${member.image}`} alt={member.name} />
                      ) : (
                        <ImageIcon size={18} color="rgba(255,255,255,0.4)" />
                      )}
                  </div>
                  <div className="ct-roster-info">
                    <div className="ct-roster-role">
                      {getRoleIcon(member.role)}
                      <span>{member.role}</span>
                    </div>
                    <div className="ct-roster-name">{member.name}</div>
                  </div>
                  <button className="ct-btn-remove" onClick={() => handleRemoveMember(idx)} title="Remove Member">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            ) : (
              <div className="ct-roster-empty">No champions assigned to your roster yet.</div>
            )}
          </div>
        </div>

        {/* Right Col: Add Member Form */}
        <div className="ct-form-panel">
          <h3 className="ct-form-title">RECRUIT NEW CHAMPION</h3>
          <form className="ct-form" onSubmit={handleAddMember}>
            <div className="ct-field">
              <label>CHAMPION NAME</label>
              <input 
                type="text" 
                value={newMemberName} 
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="e.g. Arthur Pendragon"
                required
              />
            </div>
            
            <div className="ct-field">
              <label>ASSIGNED ROLE</label>
              <input 
                type="text" 
                value={newRole} 
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="e.g. Captain, Strategist, Scout"
                required
              />
            </div>

            <div className="ct-field">
              <label>PORTRAIT (OPTIONAL)</label>
              <div className="ct-file-input">
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={(e) => setNewMemberImage(e.target.files[0])}
                />
              </div>
            </div>

            <button type="submit" className="ct-btn-submit" disabled={isUploading}>
              <Plus size={16} strokeWidth={2.5} />
              {isUploading ? 'RECRUITING...' : 'ADD TO ROSTER'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
