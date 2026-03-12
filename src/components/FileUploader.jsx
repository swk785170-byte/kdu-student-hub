import React, { useState, useRef } from 'react';
import { UploadCloud, X, File, FileText, FileImage } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export default function FileUploader({ onClose }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [subjectId, setSubjectId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  
  const { subjects, addFile } = useData();
  const { user } = useAuth();
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleUpload = async () => {
    if (!selectedFile || !subjectId) return;
    
    setIsUploading(true);
    try {
      await addFile(
        selectedFile,
        subjectId,
        user.name
      );
      onClose();
    } catch (err) {
      console.error("Upload failed", err);
      setError(err.message || 'Failed to upload file.');
      setIsUploading(false);
    }
  };

  const renderFileIcon = () => {
    if (!selectedFile) return <UploadCloud size={48} color="var(--accent-primary)" />;
    if (selectedFile.type.includes('pdf')) return <FileText size={48} color="var(--danger)" />;
    if (selectedFile.type.includes('image')) return <FileImage size={48} color="var(--success)" />;
    return <File size={48} color="var(--accent-primary)" />;
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
        <button 
          onClick={onClose}
          className="btn-icon-only" 
          style={{ position: 'absolute', top: '1rem', right: '1rem' }}
        >
          <X size={20} />
        </button>

        <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Upload Note</h3>
        
        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div className="input-group">
          <label className="input-label">Select Subject</label>
          <select 
            className="input-field" 
            value={subjectId} 
            onChange={e => setSubjectId(e.target.value)}
          >
            <option value="" disabled>-- Select a subject --</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
            ))}
          </select>
        </div>

        <div 
          className={`flex-center`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={(e) => {
            if (!selectedFile) {
              e.preventDefault();
              onButtonClick();
            }
          }}
          style={{ 
            marginTop: '1.5rem',
            height: '200px', 
            border: `2px dashed ${dragActive ? 'var(--accent-primary)' : 'var(--border-color)'}`,
            borderRadius: '12px',
            backgroundColor: dragActive ? 'var(--accent-glow)' : 'var(--bg-dark)',
            flexDirection: 'column',
            gap: '1rem',
            cursor: !selectedFile ? 'pointer' : 'default',
            transition: 'all 0.2s ease'
          }}
        >
          <input ref={inputRef} type="file" multiple={false} onChange={handleChange} style={{ display: 'none' }} />
          
          {renderFileIcon()}
          
          {selectedFile ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{selectedFile.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
              <button className="btn-secondary" style={{ marginTop: '1rem', padding: '0.3rem 0.8rem', fontSize: '0.8rem' }} onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}>
                Remove File
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 500 }}>Drag and drop your file here</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>or click to browse from your computer</div>
            </div>
          )}
        </div>

        <button 
          className="btn" 
          style={{ width: '100%', marginTop: '1.5rem' }} 
          disabled={!selectedFile || !subjectId || isUploading}
          onClick={handleUpload}
        >
          {isUploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </div>
    </div>
  );
}
