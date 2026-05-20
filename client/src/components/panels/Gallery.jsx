import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';
import { getGallery, uploadGalleryImage, deleteGalleryImage } from '../../api';
import './Gallery.css';

export default function Gallery() {
  const { isAdmin } = useAdmin();
  const { addToast } = useToast();
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchImages = async () => {
    try {
      const data = await getGallery();
      setImages(data);
    } catch (err) {
      addToast('Failed to load gallery', 'error');
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async () => {
    if (!file) return addToast('Please select a file', 'error');
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('image', file);
    if (caption) formData.append('caption', caption);

    try {
      await uploadGalleryImage(formData);
      addToast('Image uploaded', 'success');
      setFile(null);
      setCaption('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchImages();
    } catch (err) {
      addToast(err.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await deleteGalleryImage(id);
      addToast('Image deleted', 'success');
      fetchImages();
    } catch (err) {
      addToast('Failed to delete image', 'error');
    }
  };

  return (
    <section className="panel gallery-panel">
      <div className="panel-header">
        <h2 className="panel-title">MEDIA & GALLERY</h2>
        <span className="gallery-count">{images.length} ITEMS</span>
      </div>

      {isAdmin && (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(184,115,51,0.2)', marginTop: '15px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-bright)', fontSize: '0.8rem', marginBottom: '10px' }}>UPLOAD NEW IMAGE</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files[0])} 
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}
            />
            <input 
              className="admin-input" 
              placeholder="Caption (Optional)" 
              value={caption} 
              onChange={e => setCaption(e.target.value)} 
              style={{ flex: 1, minWidth: '200px' }}
            />
            <button className="btn-gold" onClick={handleUpload} disabled={isUploading || !file}>
              {isUploading ? 'UPLOADING...' : 'UPLOAD'}
            </button>
          </div>
        </div>
      )}

      {images.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
          No media uploaded yet.
        </div>
      ) : (
        <div className="gallery-grid">
          {images.map((img) => (
            <div key={img._id} className="gallery-item">
              <img src={`/uploads/${img.filename}`} alt={img.caption || 'Gallery Image'} loading="lazy" />
              <div className="gallery-overlay" style={{ flexDirection: 'column', gap: '10px' }}>
                <span className="gallery-view-btn">VIEW</span>
                {img.caption && <span style={{ color: '#fff', fontSize: '0.75rem', textAlign: 'center', padding: '0 10px' }}>{img.caption}</span>}
              </div>
              {isAdmin && (
                <button 
                  className="btn-danger" 
                  style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, padding: '4px 8px', fontSize: '0.6rem' }}
                  onClick={() => handleDelete(img._id)}
                >
                  X
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
