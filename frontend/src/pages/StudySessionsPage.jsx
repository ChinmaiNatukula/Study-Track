import React, { useState, useEffect, useRef } from 'react';
import { studySessionsApi, subjectsApi } from '../api';
import Modal from '../components/Modal';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  BookOpen,
  Calendar,
  FileText,
  Award,
  Sparkles,
} from 'lucide-react';

const TIMER_MODES = {
  POMODORO: { name: 'Focus (25m)', seconds: 25 * 60 },
  SHORT_BREAK: { name: 'Short Break (5m)', seconds: 5 * 60 },
  LONG_BREAK: { name: 'Long Break (15m)', seconds: 15 * 60 },
};

const StudySessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Timer State
  const [mode, setMode] = useState('POMODORO');
  const [timeLeft, setTimeLeft] = useState(TIMER_MODES.POMODORO.seconds);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  // Manual Log Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    subjectId: '',
    durationMinutes: 45,
    sessionDate: new Date().toISOString().split('T')[0],
    topic: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await studySessionsApi.getAll();
      setSessions(res.data || []);
    } catch (err) {
      console.error('Error fetching study sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    subjectsApi.getAll().then((res) => {
      const list = res.data || [];
      setSubjects(list);
      if (list.length > 0 && !formData.subjectId) {
        setFormData((prev) => ({ ...prev, subjectId: list[0].id }));
      }
    });
    fetchSessions();
  }, []);

  // Timer Countdown Logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, mode]);

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(TIMER_MODES[newMode].seconds);
  };

  const handleTimerComplete = () => {
    // Alert student
    if (Notification.permission === 'granted') {
      new Notification('Study Track Timer', { body: 'Session complete! Time to take a break or log your work.' });
    }
    // Auto-prompt to log session
    if (mode === 'POMODORO') {
      setFormData((prev) => ({
        ...prev,
        durationMinutes: 25,
        topic: 'Pomodoro Focus Sprint',
      }));
      setIsModalOpen(true);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_MODES[mode].seconds);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveSession = async (e) => {
    e.preventDefault();
    if (!formData.subjectId) {
      setError('Please select a subject');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await studySessionsApi.record({
        ...formData,
        subjectId: Number(formData.subjectId),
        durationMinutes: Number(formData.durationMinutes),
      });
      setIsModalOpen(false);
      fetchSessions();
    } catch (err) {
      setError(err.message || 'Failed to record session');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSession = async (id) => {
    if (window.confirm('Delete this study log entry?')) {
      try {
        await studySessionsApi.delete(id);
        fetchSessions();
      } catch (err) {
        alert(err.message || 'Failed to delete session');
      }
    }
  };

  const totalMinutesStudied = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const totalHoursStudied = (totalMinutesStudied / 60).toFixed(1);

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Pomodoro & Study Hub</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Deep-work interval timer and verified study session tracker
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({
              subjectId: subjects.length > 0 ? subjects[0].id : '',
              durationMinutes: 45,
              sessionDate: new Date().toISOString().split('T')[0],
              topic: '',
              notes: '',
            });
            setIsModalOpen(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={16} />
          <span>Manual Log Session</span>
        </button>
      </div>

      {/* Pomodoro Interactive Station */}
      <div
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(17, 24, 39, 0.85) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          textAlign: 'center',
          padding: '2.5rem 1.5rem',
          marginBottom: '2.5rem',
          maxWidth: '680px',
          margin: '0 auto 2.5rem auto',
        }}
      >
        {/* Mode Selector Tabs */}
        <div
          style={{
            display: 'inline-flex',
            gap: '0.5rem',
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            padding: '0.35rem',
            borderRadius: '12px',
            marginBottom: '2rem',
          }}
        >
          {Object.keys(TIMER_MODES).map((k) => (
            <button
              key={k}
              onClick={() => switchMode(k)}
              style={{
                background: mode === k ? 'var(--grad-primary)' : 'transparent',
                color: mode === k ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {TIMER_MODES[k].name}
            </button>
          ))}
        </div>

        {/* Big Timer Clock Display */}
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '5.5rem',
            fontWeight: 800,
            letterSpacing: '2px',
            color: '#fff',
            textShadow: '0 0 40px rgba(99, 102, 241, 0.4)',
            marginBottom: '1.75rem',
          }}
        >
          {formatTime(timeLeft)}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="btn btn-primary"
            style={{ padding: '0.85rem 2.2rem', fontSize: '1.05rem', minWidth: '150px' }}
          >
            {isRunning ? (
              <>
                <Pause size={20} />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={20} />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button onClick={resetTimer} className="btn btn-secondary btn-icon" style={{ width: '46px', height: '46px' }} title="Reset timer">
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Quick Log completed note */}
        <div style={{ marginTop: '1.75rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          Tip: Stay distraction-free. When timer rings, you can directly log this time to your subject progress!
        </div>
      </div>

      {/* Session History Section */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.2rem' }}>Logged Study History</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Total Verified Study Time: <strong style={{ color: '#fff' }}>{totalHoursStudied} hours</strong> ({totalMinutesStudied} mins)
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
          Loading your study logs...
        </div>
      ) : sessions.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <Clock size={48} color="#64748b" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No Sessions Logged Yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Complete a Pomodoro sprint or log your study session manually above!
          </p>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Subject</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Topic / Focus</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Duration</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Notes</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                      {s.sessionDate}
                    </td>
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                      <span
                        style={{
                          backgroundColor: 'rgba(99, 102, 241, 0.15)',
                          color: '#818cf8',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px',
                          fontWeight: 600,
                          fontSize: '0.78rem',
                        }}
                      >
                        {s.subjectCode || 'SUBJ'} • {s.subjectName}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#fff' }}>{s.topic || 'General Study'}</td>
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                      <span style={{ color: '#10b981', fontWeight: 600 }}>
                        {s.durationMinutes} mins ({(s.durationMinutes / 60).toFixed(1)}h)
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)', maxWidth: '300px' }}>
                      {s.notes || <span style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteSession(s.id)}
                        className="btn btn-danger btn-icon"
                        style={{ width: '28px', height: '28px' }}
                        title="Delete session"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual Record Session Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Study Session">
        <form onSubmit={handleSaveSession}>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Duration (Minutes) *</label>
              <input
                type="number"
                min="5"
                max="720"
                className="form-input"
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                required
              />
            </div>

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
          </div>

          <div className="form-group">
            <label className="form-label">Topic / Key Subject Concept</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Dynamic Programming & LeetCode Practice"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Session Notes & Summary</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Summary of what was reviewed, solved problems, or formulas..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : 'Record Session'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudySessionsPage;
