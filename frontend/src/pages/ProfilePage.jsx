import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Award, School, BookOpen, Clock, CheckCircle2 } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    semester: '',
    institution: '',
    targetWeeklyHours: 20,
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        course: user.course || '',
        semester: user.semester || '',
        institution: user.institution || '',
        targetWeeklyHours: user.targetWeeklyHours || 20,
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await updateProfile({
        ...formData,
        targetWeeklyHours: Number(formData.targetWeeklyHours),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update academic profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ maxWidth: '850px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Student Profile & Academic Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Customize your study hours target and degree program details
        </p>
      </div>

      {/* Profile Overview Card */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(17, 24, 39, 0.8) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--grad-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#fff',
            boxShadow: 'var(--shadow-glow)',
            flexShrink: 0,
          }}
        >
          {user?.name?.charAt(0) || 'S'}
        </div>

        <div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.25rem', color: '#fff' }}>{user?.name || 'Student'}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span>{user?.email}</span>
            <span>•</span>
            <span>{user?.institution || 'Institution'}</span>
            <span>•</span>
            <span style={{ color: '#818cf8', fontWeight: 600 }}>{user?.course || 'Degree Program'}</span>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          Academic Details
        </h3>

        {success && (
          <div
            style={{
              padding: '0.85rem',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
            }}
          >
            <CheckCircle2 size={18} />
            <span>Profile and study target updated successfully!</span>
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '0.85rem',
              backgroundColor: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fb7185',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Registered)</label>
              <input
                type="email"
                className="form-input"
                value={user?.email || ''}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Degree / Course Major</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Computer Science & Engineering"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current Semester / Year</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Semester 5 or Year 3"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">University / College / Institution</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Stanford University"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Target Weekly Study Hours:</span>
              <strong style={{ color: '#818cf8', fontSize: '1rem' }}>{formData.targetWeeklyHours} hrs / week</strong>
            </label>
            <input
              type="range"
              min="5"
              max="60"
              step="1"
              value={formData.targetWeeklyHours}
              onChange={(e) => setFormData({ ...formData, targetWeeklyHours: Number(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--primary)', marginTop: '0.5rem' }}
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              This goal calibrates your weekly progress bar and dashboard metrics.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              {saving ? 'Updating...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
