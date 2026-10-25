import React, { useState, useEffect } from 'react';
import { timetableApi, subjectsApi } from '../api';
import Modal from '../components/Modal';
import { Calendar, Plus, Edit2, Trash2, Check, Clock, MapPin, CheckCircle2 } from 'lucide-react';

const TimetablePage = () => {
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterView, setFilterView] = useState('ALL'); // 'ALL', 'TODAY', 'UPCOMING'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [formData, setFormData] = useState({
    subjectId: '',
    sessionDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:30',
    topic: '',
    roomOrLink: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchSessions = async () => {
    try {
      setLoading(true);
      let res;
      if (filterView === 'TODAY') {
        const todayStr = new Date().toISOString().split('T')[0];
        res = await timetableApi.getAll({ date: todayStr });
      } else if (filterView === 'UPCOMING') {
        res = await timetableApi.getUpcoming();
      } else {
        res = await timetableApi.getAll();
      }
      setSessions(res.data || []);
    } catch (err) {
      console.error('Error fetching timetable sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    subjectsApi.getAll().then((res) => setSubjects(res.data || []));
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [filterView]);

  const openCreateModal = () => {
    setEditingSession(null);
    setFormData({
      subjectId: subjects.length > 0 ? subjects[0].id : '',
      sessionDate: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:30',
      topic: '',
      roomOrLink: '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (session) => {
    setEditingSession(session);
    setFormData({
      subjectId: session.subjectId || '',
      sessionDate: session.sessionDate || new Date().toISOString().split('T')[0],
      startTime: session.startTime ? session.startTime.substring(0, 5) : '09:00',
      endTime: session.endTime ? session.endTime.substring(0, 5) : '10:30',
      topic: session.topic || '',
      roomOrLink: session.roomOrLink || '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.subjectId) {
      setError('Please select a subject');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...formData,
        subjectId: Number(formData.subjectId),
        startTime: formData.startTime.length === 5 ? `${formData.startTime}:00` : formData.startTime,
        endTime: formData.endTime.length === 5 ? `${formData.endTime}:00` : formData.endTime,
      };

      if (editingSession) {
        await timetableApi.update(editingSession.id, payload);
      } else {
        await timetableApi.create(payload);
      }
      setIsModalOpen(false);
      fetchSessions();
    } catch (err) {
      setError(err.message || 'Failed to save timetable session');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      await timetableApi.toggleComplete(id);
      fetchSessions();
    } catch (err) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  const handleDelete = async (id, topic) => {
    if (window.confirm(`Delete session "${topic}"?`)) {
      try {
        await timetableApi.delete(id);
        fetchSessions();
      } catch (err) {
        alert(err.message || 'Failed to delete session');
      }
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Weekly Timetable</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Plan lectures, lab sessions, and study periods across your academic calendar
          </p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={16} />
          <span>Add Session</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[
          { key: 'ALL', label: 'All Sessions' },
          { key: 'TODAY', label: "Today's Schedule" },
          { key: 'UPCOMING', label: 'Upcoming' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterView(tab.key)}
            className={`btn btn-sm ${filterView === tab.key ? 'btn-primary' : 'btn-secondary'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timetable Items */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
          Loading your timetable...
        </div>
      ) : sessions.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <Calendar size={48} color="#64748b" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No Sessions Scheduled</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Add your lectures, seminars, or recurring study hours.
          </p>
          <button onClick={openCreateModal} className="btn btn-primary">
            <Plus size={16} />
            <span>Add Session</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {sessions.map((session) => (
            <div
              key={session.id}
              className="glass-card card-interactive"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.25rem',
                backgroundColor: session.isCompleted ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-card)',
                border: session.isCompleted ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                opacity: session.isCompleted ? 0.75 : 1,
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span
                    style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(99, 102, 241, 0.15)',
                      color: '#818cf8',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {session.subjectCode || 'CLASS'} • {session.subjectName}
                  </span>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      onClick={() => openEditModal(session)}
                      className="btn btn-secondary btn-icon"
                      style={{ width: '28px', height: '28px' }}
                      title="Edit session"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(session.id, session.topic)}
                      className="btn btn-danger btn-icon"
                      style={{ width: '28px', height: '28px' }}
                      title="Delete session"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: '#fff' }}>{session.topic}</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={14} color="#818cf8" />
                    <span>{session.sessionDate}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={14} color="#06b6d4" />
                    <span>
                      {session.startTime?.substring(0, 5)} - {session.endTime?.substring(0, 5)}
                    </span>
                  </div>
                  {session.roomOrLink && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={14} color="#f59e0b" />
                      <span>{session.roomOrLink}</span>
                    </div>
                  )}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <button
                  onClick={() => handleToggleComplete(session.id)}
                  className={`btn btn-sm ${session.isCompleted ? 'btn-success' : 'btn-secondary'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%' }}
                >
                  <Check size={14} />
                  <span>{session.isCompleted ? 'Marked Completed' : 'Mark as Attended / Done'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Timetable Session Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSession ? 'Edit Timetable Session' : 'Schedule Timetable Session'}
      >
        <form onSubmit={handleSave}>
          {error && (
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(244, 63, 94, 0.15)',
                color: '#fb7185',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.85rem',
              }}
            >
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Subject *</label>
            <select
              className="form-select"
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              required
            >
              <option value="">Select subject...</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Topic / Lecture Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Graph Algorithms: Dijkstra & Bellman-Ford"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Session Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.sessionDate}
                onChange={(e) => setFormData({ ...formData, sessionDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Room / Zoom Link</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Hall B-204 or Zoom Link"
                value={formData.roomOrLink}
                onChange={(e) => setFormData({ ...formData, roomOrLink: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Start Time *</label>
              <input
                type="time"
                className="form-input"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Time *</label>
              <input
                type="time"
                className="form-input"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : editingSession ? 'Update Session' : 'Schedule Session'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TimetablePage;
