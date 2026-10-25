import React, { useState, useEffect } from 'react';
import { subjectsApi } from '../api';
import Modal from '../components/Modal';
import { BookOpen, Plus, Edit2, Trash2, Clock, CheckCircle } from 'lucide-react';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#6366F1', '#14B8A6'];

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    targetStudyHours: 30,
    color: '#3B82F6',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await subjectsApi.getAll();
      setSubjects(res.data || []);
    } catch (err) {
      console.error('Error fetching subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const openCreateModal = () => {
    setEditingSubject(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      targetStudyHours: 30,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name || '',
      code: subject.code || '',
      description: subject.description || '',
      targetStudyHours: subject.targetStudyHours || 30,
      color: subject.color || '#3B82F6',
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingSubject) {
        await subjectsApi.update(editingSubject.id, formData);
      } else {
        await subjectsApi.create(formData);
      }
      setIsModalOpen(false);
      fetchSubjects();
    } catch (err) {
      setError(err.message || 'Failed to save subject');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? All associated tasks and notes will be deleted.`)) {
      try {
        await subjectsApi.delete(id);
        fetchSubjects();
      } catch (err) {
        alert(err.message || 'Failed to delete subject');
      }
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Course Subjects</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Manage your courses, target hours, and subject curriculum progress
          </p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={16} />
          <span>Add Subject</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
          Loading your subjects...
        </div>
      ) : subjects.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <BookOpen size={48} color="#64748b" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No Subjects Added</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Start by adding the subjects or courses you are enrolled in this semester.
          </p>
          <button onClick={openCreateModal} className="btn btn-primary">
            <Plus size={16} />
            <span>Add First Subject</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {subjects.map((subj) => {
            const logged = subj.loggedStudyHours || 0;
            const target = subj.targetStudyHours || 30;
            const progress = Math.min(Math.round((logged / target) * 100), 100);

            return (
              <div
                key={subj.id}
                className="glass-card card-interactive"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: `4px solid ${subj.color || '#3B82F6'}`,
                  position: 'relative',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: subj.color || '#818cf8',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {subj.code}
                    </span>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button
                        onClick={() => openEditModal(subj)}
                        className="btn btn-secondary btn-icon"
                        style={{ width: '28px', height: '28px' }}
                        title="Edit subject"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(subj.id, subj.name)}
                        className="btn btn-danger btn-icon"
                        style={{ width: '28px', height: '28px' }}
                        title="Delete subject"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#fff' }}>{subj.name}</h3>
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.85rem',
                      marginBottom: '1.25rem',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {subj.description || 'No course syllabus description provided.'}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Semester Target:</span>
                    <strong style={{ color: '#fff' }}>
                      {logged.toFixed(1)} / {target} hrs ({progress}%)
                    </strong>
                  </div>
                  <div className="progress-container" style={{ marginBottom: '1rem' }}>
                    <div
                      className="progress-bar"
                      style={{ width: `${progress}%`, backgroundColor: subj.color || '#3B82F6' }}
                    ></div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={13} />
                      {logged.toFixed(1)}h logged
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <CheckCircle size={13} color="#10b981" />
                      {subj.completedTasksCount || 0} tasks done
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Subject Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubject ? 'Edit Subject' : 'Add New Subject'}
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
            <label className="form-label">Subject Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Data Structures & Algorithms"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Subject Code *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. CS301"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Study Hours</label>
              <input
                type="number"
                min="5"
                max="300"
                className="form-input"
                value={formData.targetStudyHours}
                onChange={(e) => setFormData({ ...formData, targetStudyHours: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Color Accent</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {COLORS.map((col) => (
                <button
                  type="button"
                  key={col}
                  onClick={() => setFormData({ ...formData, color: col })}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: col,
                    border: formData.color === col ? '3px solid #fff' : 'none',
                    cursor: 'pointer',
                    boxShadow: formData.color === col ? '0 0 10px ' + col : 'none',
                  }}
                ></button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Topics</label>
            <textarea
              className="form-textarea"
              placeholder="Brief course objectives or topics covered..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : editingSubject ? 'Update Subject' : 'Create Subject'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubjectsPage;
