import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, MessageSquare, Send, ArrowUp, ArrowDown, Clock } from 'lucide-react';

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { posts, setPosts } = useData();
  const { user } = useAuth();
  
  const [comment, setComment] = useState('');
  
  const post = posts.find(p => p.id === postId);

  if (!post) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Post not found</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/forum')}>Back to Forum</button>
      </div>
    );
  }

  const date = new Date(post.createdAt);
  const formattedDate = !isNaN(date) ? date.toLocaleDateString() : 'Recently';

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    const newComment = {
      id: Date.now().toString(),
      author: user.name,
      text: comment,
      createdAt: new Date().toISOString()
    };

    // Need to do a manual local update here, ideally part of context but let's just patch localstorage for mockup
    const updatedPost = { ...post, comments: [...(post.comments || []), newComment] };
    const updatedPosts = posts.map(p => p.id === postId ? updatedPost : p);
    
    // In a real app we'd have a function in DataContext like addComment(postId, comment)
    // Doing a hacky direct update for now
    localStorage.setItem('kdu_hub_posts', JSON.stringify(updatedPosts));
    post.comments = updatedPost.comments; // force local mutate to re-render simply
    setComment('');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <button className="btn-secondary" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }} onClick={() => navigate('/forum')}>
        <ArrowLeft size={18} /> Back to Discussions
      </button>

      {/* Main Post */}
      <div className="card" style={{ display: 'flex', gap: '1.5rem', padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <button className="btn-icon-only" style={{ padding: '0.2rem' }}><ArrowUp size={24} /></button>
          <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>{post.upvotes || 0}</span>
          <button className="btn-icon-only" style={{ padding: '0.2rem' }}><ArrowDown size={24} /></button>
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', gap: '1rem' }}>
            <span>Posted by <strong style={{ color: 'var(--text-primary)' }}>{post.author}</strong></span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14} /> {formattedDate}</span>
          </div>

          <h1 style={{ margin: 0, marginBottom: '1.5rem', fontSize: '2rem' }}>{post.title}</h1>
          <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {post.content}
          </p>
          
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}><MessageSquare size={18} /> {post.comments?.length || 0} Comments</span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <h3 style={{ marginBottom: '1.5rem' }}>Comments</h3>
      <form onSubmit={handleAddComment} style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', flexShrink: 0, fontWeight: 600 }}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <textarea 
            className="input-field" 
            placeholder="What are your thoughts?" 
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ resize: 'vertical' }}
          />
          <button className="btn" type="submit" style={{ alignSelf: 'flex-end' }} disabled={!comment.trim()}>
            <Send size={18} /> Comment
          </button>
        </div>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {(!post.comments || post.comments.length === 0) ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontStyle: 'italic', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          post.comments.map(c => {
            const commentDate = new Date(c.createdAt);
            const cFormattedDate = !isNaN(commentDate) ? commentDate.toLocaleDateString() : 'Just now';
            return (
              <div key={c.id} style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {c.author.charAt(0).toUpperCase()}
                </div>
                <div className="card" style={{ flex: 1, padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{c.author}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{cFormattedDate}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{c.text}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
