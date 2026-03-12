import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Folder, MessageSquare, LogOut, Plus, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { logout } = useAuth();
  const { subjects, addSubject } = useData();
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  const handleAddSubject = () => {
    if (newSubjectName.trim()) {
      // Pick a random icon for simplicity or allow user to pick later
      const icons = ['📚', '🔬', '🌍', '🎨', '📈', '💻'];
      const randomIcon = icons[Math.floor(Math.random() * icons.length)];
      addSubject(newSubjectName.trim(), randomIcon);
      setNewSubjectName('');
      setIsAddingSubject(false);
    }
  };

  return (
    <div 
      className={`glass sidebar ${isOpen ? 'open' : ''}`}
      style={{ 
        width: '260px', 
        display: 'flex', 
        flexDirection: 'column',
        borderRight: '1px solid var(--border-light)',
        padding: '1.5rem 1rem'
      }}
    >
      <div className="flex-between" style={{ padding: '0 0.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', margin: 0, background: 'linear-gradient(to right, #6366F1, #818CF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          KDU Hub
        </h2>
        <button className="btn-icon-only sidebar-close-btn" onClick={() => setIsOpen(false)}>
          <X size={20} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600, padding: '0 0.5rem', marginBottom: '0.75rem' }}>
            Main
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <NavLink 
              to="/" 
              end
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.5rem', 
                borderRadius: '8px', color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--bg-hover)' : 'transparent',
                transition: 'all 0.2s', fontWeight: isActive ? 500 : 400
              })}
            >
              <Folder size={18} />
              <span>All Files</span>
            </NavLink>
            <NavLink 
              to="/forum" 
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.5rem', 
                borderRadius: '8px', color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--bg-hover)' : 'transparent',
                transition: 'all 0.2s', fontWeight: isActive ? 500 : 400
              })}
            >
              <MessageSquare size={18} />
              <span>Discussion Board</span>
            </NavLink>
          </div>
        </div>

        <div>
          <div className="flex-between" style={{ padding: '0 0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Subjects
            </div>
            <button className="btn-icon-only" style={{ padding: '0.2rem' }} onClick={() => setIsAddingSubject(true)} title="Add Subject">
              <Plus size={14} />
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {subjects.map(subject => (
              <NavLink 
                key={subject.id}
                to={`/subject/${subject.id}`} 
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.5rem', 
                  borderRadius: '8px', color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--bg-hover)' : 'transparent',
                  transition: 'all 0.2s'
                })}
              >
                <span style={{ fontSize: '1.2rem' }}>{subject.icon}</span>
                <span style={{ fontSize: '0.95rem' }}>{subject.name}</span>
              </NavLink>
            ))}
            
            {isAddingSubject && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', marginTop: '0.25rem', border: '1px solid var(--border-light)' }}>
                <input 
                  type="text" 
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="New Subject"
                  style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem' }}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddSubject();
                    if (e.key === 'Escape') setIsAddingSubject(false);
                  }}
                />
                <button className="btn-icon-only" style={{ padding: '0.2rem', color: 'var(--success)' }} onClick={handleAddSubject}>
                  <Check size={14} />
                </button>
                <button className="btn-icon-only" style={{ padding: '0.2rem', color: 'var(--text-secondary)' }} onClick={() => setIsAddingSubject(false)}>
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <button 
          className="btn-secondary" 
          onClick={logout}
          style={{ width: '100%', justifyContent: 'flex-start', padding: '0.75rem 0.5rem', border: 'none', color: 'var(--text-secondary)' }}
          onMouseOver={(e) => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)' }}
          onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          <LogOut size={18} style={{ marginRight: '0.5rem' }} />
          Logout
        </button>
      </div>
    </div>
  );
}
