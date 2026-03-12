import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Download, MessageSquare, Send } from 'lucide-react';

export default function DocumentViewer() {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const { files, subjects } = useData();
  const { user } = useAuth();
  
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, author: 'Prof. Smith', text: 'Great resource, make sure to read chapter 4.', date: '2 days ago' }
  ]); // Mock comments for the document

  const [blobUrl, setBlobUrl] = useState('');

  const file = files.find(f => f.id === fileId);
  if (!file) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Document not found</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>Back to Hub</button>
      </div>
    );
  }

  const subject = subjects.find(s => s.id === file.subjectId);
  const isPdf = file.type.includes('pdf');

  React.useEffect(() => {
    let urlToRevoke;
    if (file && file.fileUrl) {
      if (file.fileUrl.startsWith('data:')) {
        // Convert base64 data URL to Blob URL for iframe rendering
        fetch(file.fileUrl)
          .then(res => res.blob())
          .then(blob => {
            const url = URL.createObjectURL(blob);
            setBlobUrl(url);
            urlToRevoke = url;
          })
          .catch(err => console.error("Failed to convert data URL to blob", err));
      } else {
        setBlobUrl(file.fileUrl);
      }
    }
    return () => {
      if (urlToRevoke) URL.revokeObjectURL(urlToRevoke);
    };
  }, [file?.fileUrl]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setComments([
      ...comments,
      { id: Date.now(), author: user.name, text: comment, date: 'Just now' }
    ]);
    setComment('');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn-icon-only" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {file.name}
            </h2>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', gap: '1.5rem' }}>
              <span>Uploaded by <strong>{file.uploader}</strong></span>
              <span>Subject: {subject?.name || 'General'}</span>
            </div>
          </div>
        </div>
        
        <button className="btn">
          <Download size={18} />
          Download
        </button>
      </div>

      <div className="viewer-container" style={{ flex: 1, minHeight: 0 }}>
        {/* Viewer Area */}
        <div className="card viewer-main" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-hover)' }}>
            <h4 style={{ margin: 0 }}>{isPdf ? 'PDF Viewer' : 'Document Viewer (Mock)'}</h4>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)', overflow: 'auto' }}>
            {blobUrl ? (
              <iframe 
                src={blobUrl} 
                style={{ width: '100%', height: '100%', border: 'none', backgroundColor: 'white' }} 
                title={file.name}
              />
            ) : isPdf ? (
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
                <p>Mock PDF File - Cannot be rendered.</p>
                <div style={{ width: '600px', height: '800px', backgroundColor: 'white', margin: '2rem auto', border: '1px solid #333' }}></div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
                <p>Preview for {file.type || 'Word/PPT'} is not natively supported in browser.</p>
                <button className="btn btn-secondary">Download to View</button>
              </div>
            )}
          </div>
        </div>

        {/* Comments Sidebar */}
        <div className="card viewer-sidebar" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
          <h3 style={{ margin: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={18} /> Comments
          </h3>
          
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
            {comments.map(c => (
              <div key={c.id} style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.author}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{c.date}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.95rem' }}>{c.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Add a comment..." 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)', boxShadow: 'none' }}
            />
            <button className="btn" type="submit" style={{ padding: '0.75rem' }} disabled={!comment.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
