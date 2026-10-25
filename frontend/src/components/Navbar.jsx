import React from 'react';
import { PlusCircle, Clock, CalendarDays, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = ({ onOpenQuickLog }) => {
  const { user } = useAuth();

  const todayStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: 'rgba(12, 17, 29, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Date & Subtext */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          <CalendarDays size={16} color="#818cf8" />
          <span>{todayStr}</span>
        </div>
        <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-color)' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', color: '#10b981' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }}></span>
          <span>Semester Active</span>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <Link to="/timer" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Clock size={15} color="#06b6d4" />
          <span>Pomodoro Timer</span>
        </Link>

        <button
          onClick={onOpenQuickLog}
          className="btn btn-primary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <PlusCircle size={15} />
          <span>Log Study Session</span>
        </button>

        {user?.targetWeeklyHours && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              padding: '0.4rem 0.75rem',
              borderRadius: '20px',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              fontSize: '0.78rem',
              color: '#a5b4fc',
            }}
          >
            <Award size={14} color="#818cf8" />
            <span>Target: <strong>{user.targetWeeklyHours}h / wk</strong></span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
