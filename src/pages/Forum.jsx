import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, ArrowUp, Clock, Plus } from 'lucide-react';

export default function Forum() {
  const { posts, addPost } = useData();
  const { user } = useAuth();
  const [showNewPost, setShowNewPost] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    addPost(title, content, user.name);
    setTitle('');
    setContent('');
    setShowNewPost(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>Discussion Board</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Ask questions and share knowledge with peers.</p>
        </div>
        <button className="btn" onClick={() => setShowNewPost(!showNewPost)}>
          <Plus size={18} /> New Post
        </button>
      </div>

      {showNewPost && (
        <div className="card glass animate-fade-in" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginTop: 0 }}>Create a new discussion</h3>
          <form onSubmit={handleCreatePost}>
            <div className="input-group">
              <input 
                type="text" 
                className="input-field" 
                placeholder="Post Title..." 
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={{ fontSize: '1.1rem', fontWeight: 500 }}
              />
            </div>
            <div className="input-group">
              <textarea 
                className="input-field" 
                placeholder="What's on your mind?" 
                rows={4}
                value={content}
                onChange={e => setContent(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-secondary" onClick={() => setShowNewPost(false)}>Cancel</button>
              <button type="submit" className="btn" disabled={!title.trim() || !content.trim()}>Post Discussion</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {posts.length === 0 ? (
          <div className="card flex-center" style={{ flexDirection: 'column', padding: '4rem 2rem', borderStyle: 'dashed' }}>
            <MessageSquare size={40} color="var(--text-secondary)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>No discussions yet</h3>
            <p>Be the first to start a conversation manually.</p>
          </div>
        ) : (
          posts.map(post => {
            const date = new Date(post.createdAt);
            const formattedDate = !isNaN(date) ? date.toLocaleDateString() : 'Recently';

            return (
              <Link key={post.id} to={`/post/${post.id}`} className="card" style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', textDecoration: 'none' }}>
                {/* Voting arrows (Mock visual only) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <button className="btn-icon-only" style={{ padding: '0.2rem' }}><ArrowUp size={20} /></button>
                  <span style={{ fontWeight: 600 }}>{post.upvotes || 0}</span>
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '1.25rem' }}>
                    {post.title}
                  </h3>
                  <p style={{ margin: 0, marginBottom: '1rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.content}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>Posted by <strong style={{ color: 'var(--text-primary)' }}>{post.author}</strong></span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14} /> {formattedDate}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MessageSquare size={14} /> {post.comments?.length || 0} Comments</span>
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  );
}
