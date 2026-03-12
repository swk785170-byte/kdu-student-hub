import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { FileText, File, Download, Trash2, Calendar, User, Eye, Plus } from 'lucide-react';
import FileUploader from '../components/FileUploader';

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

export default function Hub() {
  const { subjectId } = useParams();
  const { files, subjects, deleteFile } = useData();
  const [showUploader, setShowUploader] = useState(false);

  const currentSubject = subjectId ? subjects.find(s => s.id === subjectId) : null;
  const filteredFiles = subjectId ? files.filter(f => f.subjectId === subjectId) : files;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2rem' }}>
            {currentSubject ? (
              <><span style={{ fontSize: '2.5rem' }}>{currentSubject.icon}</span> {currentSubject.name}</>
            ) : (
              'All Notes & Documents'
            )}
          </h1>
          <p style={{ margin: 0 }}>
            {filteredFiles.length} {filteredFiles.length === 1 ? 'document' : 'documents'} found
          </p>
        </div>
        
        <button className="btn" onClick={() => setShowUploader(true)}>
          <Plus size={18} />
          Upload Note
        </button>
      </div>

      {filteredFiles.length === 0 ? (
        <div className="card flex-center" style={{ flexDirection: 'column', padding: '4rem 2rem', borderStyle: 'dashed', borderColor: 'var(--border-light)' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            <FileText size={40} />
          </div>
          <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>No documents found</h3>
          <p style={{ textAlign: 'center', maxWidth: '400px' }}>
            There are no files uploaded in this section yet. Be the first to share your notes!
          </p>
          <button className="btn btn-secondary" onClick={() => setShowUploader(true)}>
            Upload Note
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filteredFiles.map(file => {
            const subject = subjects.find(s => s.id === file.subjectId);
            const isPdf = file.type.includes('pdf');
            
            return (
              <div key={file.id} className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ 
                    width: '50px', height: '50px', borderRadius: '12px', 
                    backgroundColor: isPdf ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isPdf ? 'var(--danger)' : 'var(--accent-primary)',
                    flexShrink: 0
                  }}>
                    {isPdf ? <FileText size={24} /> : <File size={24} />}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <h4 style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }} title={file.name}>
                      {file.name}
                    </h4>
                    {!subjectId && subject && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', backgroundColor: 'rgba(139, 92, 246, 0.2)', padding: '0.2rem 0.6rem', borderRadius: '12px', display: 'inline-block', marginTop: '0.4rem', border: '1px solid rgba(139, 92, 246, 0.4)' }}>
                        {subject.icon} {subject.name}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={14} /> Uploaded by {file.uploader}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={14} /> {formatDate(file.uploadedAt)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <File size={14} /> {formatBytes(file.size)}
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                  <Link to={`/view/${file.id}`} className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}>
                    <Eye size={16} /> View
                  </Link>
                  <button className="btn btn-secondary" style={{ padding: '0.5rem', fontSize: '0.85rem' }}>
                    <Download size={16} />
                  </button>
                  <button className="btn-icon-only" onClick={() => deleteFile(file.id)} style={{ padding: '0.5rem', color: 'var(--danger)', backgroundColor: 'rgba(255, 75, 75, 0.05)' }} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showUploader && <FileUploader onClose={() => setShowUploader(false)} />}
    </div>
  );
}
