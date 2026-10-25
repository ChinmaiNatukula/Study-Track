import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { subjectsApi, studySessionsApi } from '../api';
import { Clock, BookOpen, FileText, CheckCircle2 } from 'lucide-react';

const QuickLogModal = ({ isOpen, onClose, onSessionSaved }) => {
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [topic, setTopic] = useState('');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccess(false);
      subjectsApi
        .getAll()
        .then((res) => {
          const list = res.data || [];
          setSubjects(list);
          if (list.length > 0 && !subjectId) {
            setSubjectId(list[0].id);
          }
        })
        .catch((err) => console.error('Error fetching subjects for modal:', err));
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subjectId) {
      setError('Please select a subject');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await studySessionsApi.record({
        subjectId: Number(subjectId),
        durationMinutes: Number(durationMinutes),
        topic: topic || 'Self Study Session',
        sessionDate,
        notes,
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        if (onSessionSaved) onSessionSaved();
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to record study session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Study Session">
      {success ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
          <h4 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Session Recorded!</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Great job! Your study hours and dashboard stats have been updated.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
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
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={14} color="#818cf8" />
              Subject *
            </label>
            <select
              className="form-select"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              required
            >
              <option value="">Select subject...</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code ? `[${s.code}] ` : ''}{s.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={14} color="#06b6d4" />
                Duration (Minutes) *
              </label>
              <input
                type="number"
                min="5"
                max="720"
                className="form-input"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                className="form-input"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Topic / Focus Area</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Graph Algorithms or Chapter 4 Normalization"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={14} color="#f59e0b" />
              Notes / Takeaways (Optional)
            </label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="What did you learn? Any formulas, solved problems, or questions?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Recording...' : 'Record Session'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default QuickLogModal;
