import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';
import { getKingdom, updateKingdom, uploadKingdomAsset } from '../../api';
import { isImagePath, resolveImageUrl } from '../../utils/imageHelpers';
import './Admin.css';
import { Upload, Image as ImageIcon, Trash2, Shield } from 'lucide-react';

export default function KingdomProfile() {
  const { admin } = useAdmin();
  const { addToast } = useToast();
  const [kingdom, setKingdom] = useState(null);
  const [loading, setLoading] = useState(true);

  // Text inputs
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#B87333');
  const [accentColor, setAccentColor] = useState('#D4956A');

  // Loading states for individual uploads
  const [uploadingField, setUploadingField] = useState(null);

  const fetchKingdom = async () => {
    try {
      if (!admin?.kingdomId?._id) return;
      const k = await getKingdom(admin.kingdomId._id);
      setKingdom(k);
      setDescription(k.description || '');
      setColor(k.color || '#B87333');
      setAccentColor(k.accentColor || '#D4956A');
    } catch (err) {
      addToast('Failed to load kingdom profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKingdom();
  }, [admin]);

  const handleUpdateText = async () => {
    try {
      await updateKingdom(kingdom._id, { description, color, accentColor });
      addToast('Kingdom details updated', 'success');
      fetchKingdom();
    } catch (err) {
      addToast('Failed to update details', 'error');
    }
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingField(field);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('field', field);

    try {
      const res = await uploadKingdomAsset(kingdom._id, formData);
      setKingdom(res);
      addToast(`${field} uploaded successfully`, 'success');
    } catch (err) {
      addToast(`Failed to upload ${field}`, 'error');
    } finally {
      setUploadingField(null);
      e.target.value = ''; // Reset input
    }
  };

  const handleRemoveDesign = async (indexToRemove) => {
    if (!window.confirm('Remove this design?')) return;
    const updatedDesigns = kingdom.designs.filter((_, i) => i !== indexToRemove);
    try {
      await updateKingdom(kingdom._id, { designs: updatedDesigns });
      addToast('Design removed', 'success');
      fetchKingdom();
    } catch (err) {
      addToast('Failed to remove design', 'error');
    }
  };

  if (loading) return <div style={{ color: 'var(--text-muted)' }}>Loading...</div>;
  if (!kingdom) return <div style={{ color: 'var(--text-muted)' }}>No Kingdom Assigned. Please contact Super Admin.</div>;

  return (
    <section className="admin-panel" style={{ padding: '20px' }}>
      <div className="al-header" style={{ marginBottom: '30px' }}>
        <h2 className="al-title">MY KINGDOM PROFILE</h2>
        <div className="al-subtitle">MANAGE YOUR KINGDOM DETAILS & ASSETS</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Left Col: Details & Assets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Details Box */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(184,115,51,0.2)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-bright)', marginBottom: '20px', fontSize: '0.9rem' }}>IDENTITY & LORE</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>DESCRIPTION / LORE</label>
                <textarea 
                  className="admin-input" 
                  style={{ width: '100%', minHeight: '80px', resize: 'vertical' }} 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Enter kingdom lore..." 
                />
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>PRIMARY COLOR</label>
                  <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: '100%', height: '40px', background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', cursor: 'pointer' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>ACCENT COLOR</label>
                  <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} style={{ width: '100%', height: '40px', background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', cursor: 'pointer' }} />
                </div>
              </div>
              
              <button className="btn-gold" style={{ alignSelf: 'flex-start' }} onClick={handleUpdateText}>Save Details</button>
            </div>
          </div>

          {/* Core Assets Box */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(184,115,51,0.2)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-bright)', marginBottom: '20px', fontSize: '0.9rem' }}>CORE ASSETS</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Emblem */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: `2px solid ${kingdom.color || 'var(--gold-primary)'}` }}>
                  {isImagePath(kingdom.emblem) ? (
                    <img src={resolveImageUrl(kingdom.emblem)} alt="Emblem" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Shield size={24} color="var(--text-muted)" />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '5px' }}>Kingdom Emblem</div>
                  <input type="file" accept="image/*" id="upload-emblem" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'emblem')} disabled={uploadingField === 'emblem'} />
                  <label htmlFor="upload-emblem" className="btn-gold" style={{ display: 'inline-flex', padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer', opacity: uploadingField === 'emblem' ? 0.7 : 1 }}>
                    <Upload size={14} style={{ marginRight: '5px' }} /> {uploadingField === 'emblem' ? 'Uploading...' : 'Upload Emblem'}
                  </label>
                </div>
              </div>

              {/* Flag */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px' }}>
                <div style={{ width: '90px', height: '60px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {isImagePath(kingdom.flag) ? (
                    <img src={resolveImageUrl(kingdom.flag)} alt="Flag" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ImageIcon size={24} color="var(--text-muted)" />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '5px' }}>Kingdom Flag</div>
                  <input type="file" accept="image/*" id="upload-flag" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'flag')} disabled={uploadingField === 'flag'} />
                  <label htmlFor="upload-flag" className="btn-gold" style={{ display: 'inline-flex', padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer', opacity: uploadingField === 'flag' ? 0.7 : 1 }}>
                    <Upload size={14} style={{ marginRight: '5px' }} /> {uploadingField === 'flag' ? 'Uploading...' : 'Upload Flag'}
                  </label>
                </div>
              </div>

              {/* Map */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px' }}>
                <div style={{ width: '90px', height: '60px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {isImagePath(kingdom.map) ? (
                    <img src={resolveImageUrl(kingdom.map)} alt="Map" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ImageIcon size={24} color="var(--text-muted)" />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '5px' }}>Kingdom Map</div>
                  <input type="file" accept="image/*" id="upload-map" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'map')} disabled={uploadingField === 'map'} />
                  <label htmlFor="upload-map" className="btn-gold" style={{ display: 'inline-flex', padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer', opacity: uploadingField === 'map' ? 0.7 : 1 }}>
                    <Upload size={14} style={{ marginRight: '5px' }} /> {uploadingField === 'map' ? 'Uploading...' : 'Upload Map'}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Designs & Team Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Designs / Moodboard */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(184,115,51,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-bright)', fontSize: '0.9rem', margin: 0 }}>DESIGNS & MOODBOARD</h3>
              
              <input type="file" accept="image/*" id="upload-design" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'designs')} disabled={uploadingField === 'designs'} />
              <label htmlFor="upload-design" className="btn-gold" style={{ display: 'inline-flex', padding: '5px 10px', fontSize: '0.75rem', cursor: 'pointer', opacity: uploadingField === 'designs' ? 0.7 : 1 }}>
                <Upload size={12} style={{ marginRight: '5px' }} /> Add Design
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
              {kingdom.designs && kingdom.designs.length > 0 ? kingdom.designs.map((design, idx) => (
                <div key={idx} style={{ position: 'relative', aspectRatio: '1', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img src={resolveImageUrl(design)} alt={`Design ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button 
                    onClick={() => handleRemoveDesign(idx)}
                    style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(239, 68, 68, 0.9)', color: '#fff', border: 'none', borderRadius: '3px', padding: '4px', cursor: 'pointer', display: 'flex' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '0.8rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                  No designs uploaded yet.
                </div>
              )}
            </div>
          </div>

          {/* Team Summary */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(184,115,51,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-bright)', fontSize: '0.9rem', margin: 0 }}>TEAM ROSTER</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Manage in Teams Tab</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {kingdom.teamMembers && kingdom.teamMembers.length > 0 ? kingdom.teamMembers.map((member, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '4px', borderLeft: `2px solid ${kingdom.color || 'var(--gold-primary)'}` }}>
                  {isImagePath(member.image) ? (
                    <img src={resolveImageUrl(member.image)} alt={member.name} style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      <ImageIcon size={14} />
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gold-bright)' }}>{member.role}</div>
                    <div style={{ fontSize: '0.9rem', color: '#fff' }}>{member.name}</div>
                  </div>
                </div>
              )) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                  No team members assigned yet.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
