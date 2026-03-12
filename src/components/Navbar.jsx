import React from 'react';
import { Search, Bell, User as UserIcon, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <div 
      className="glass" 
      style={{ 
        height: '70px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0 2rem',
        borderBottom: '1px solid var(--border-light)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
        <button className="btn-icon-only mobile-menu-btn" onClick={onMenuClick}>
          <Menu size={24} color="var(--text-primary)" />
        </button>
        <div className="search-container" style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search notes, subjects..." 
            className="input-field" 
            style={{ paddingLeft: '2.5rem', borderRadius: '20px', backgroundColor: 'rgba(255, 255, 255, 0.05)', boxShadow: 'none' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn-icon-only">
          <Bell size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border-light)' }}>
          <div className="user-info-text" style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.name || 'Student'}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>KDU Scholar</div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-hover)', border: '1px solid rgba(139, 92, 246, 0.5)', flexShrink: 0 }}>
            <UserIcon size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}
