import React, { useState, useEffect } from 'react';
import { examsApi, subjectsApi } from '../api';
import Modal from '../components/Modal';
import { GraduationCap, Plus, Edit2, Trash2, Calendar, MapPin, Target, CheckCircle } from 'lucide-react';

const STATUS_COLORS = {
  NOT_STARTED: { bg: 'rgba(148, 163, 184, 0.15)', text: '#cbd5e1', border: 'rgba(148, 163, 184, 0.3)' },
  IN_PROGRESS: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
  READY: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
  MASTERED: { bg: 'rgba(99, 102, 241, 0.2)', text: '#818cf8', border: 'rgba(99, 102, 241, 0.4)' },
};

const ExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [formData, setFormData] = useState({
    subjectId: '',
    examName: '',
    examDate: '',
    location: '',
    syllabus: '',
    syllabusCompletionPercentage: 0,
    preparationStatus: 'NOT_STARTED',
    targetScore: 'A / 90%',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await examsApi.getAll();
      setExams(res.data || []);
    } catch (err) {
      console.error('Error fetching exams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    subjectsApi.getAll().then((res) => setSubjects(res.data || []));
    fetchExams();
  }, []);

  const openCreateModal = () => {
    setEditingExam(null);
    setFormData({
      subjectId: subjects.length > 0 ? subjects[0].id : '',
      examName: '',
      examDate: '',
      location: '',
      syllabus: '',
      syllabusCompletionPercentage: 0,
      preparationStatus: 'NOT_STARTED',
      targetScore: 'A / 90%',
    });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (exam) => {
    setEditingExam(exam);
    setFormData({
      subjectId: exam.subjectId || '',
      examName: exam.examName || '',
      examDate: exam.examDate ? exam.examDate.substring(0, 16) : '',
      location: exam.location || '',
      syllabus: exam.syllabus || '',
      syllabusCompletionPercentage: exam.syllabusCompletionPercentage || 0,
      preparationStatus: exam.preparationStatus || 'NOT_STARTED',
      targetScore: exam.targetScore || '',
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
        examDate: formData.examDate.length === 16 ? `${formData.examDate}:00` : formData.examDate,
        syllabusCompletionPercentage: Number(formData.syllabusCompletionPercentage),
      };

      if (editingExam) {
        await examsApi.update(editingExam.id, payload);
      } else {
        await examsApi.create(payload);
      }
      setIsModalOpen(false);
      fetchExams();
    } catch (err) {
      setError(err.message || 'Failed to save exam');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, examName) => {
    if (window.confirm(`Delete exam "${examName}"?`)) {
      try {
        await examsApi.delete(id);
        fetchExams();
      } catch (err) {
        alert(err.message || 'Failed to delete exam');
      }
    }
  };

  const calculateDaysLeft = (examDateStr) => {
    if (!examDateStr) return null;
    const examDate = new Date(examDateStr);
    const now = new Date();
    const diffTime = examDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Exams & Assessment Center</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Track midterms, finals, quizzes, syllabus coverage, and target scores
          </p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={16} />
          <span>Add Exam</span>
        </button>
      </div>

      {/* Exam Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
          Loading your exam schedules...
        </div>
      ) : exams.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <GraduationCap size={48} color="#64748b" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No Upcoming Exams</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Add test dates to keep syllabus preparation on track and avoid last-minute cramming.
          </p>
          <button onClick={openCreateModal} className="btn btn-primary">
            <Plus size={16} />
            <span>Add Exam</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {exams.map((exam) => {
            const daysLeft = calculateDaysLeft(exam.examDate);
            const statusStyle = STATUS_COLORS[exam.preparationStatus] || STATUS_COLORS.NOT_STARTED;

            return (
              <div
                key={exam.id}
                className="glass-card card-interactive"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.5rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        color: '#818cf8',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      {exam.subjectCode || 'EXAM'} • {exam.subjectName}
                    </span>

                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button
                        onClick={() => openEditModal(exam)}
                        className="btn btn-secondary btn-icon"
                        style={{ width: '28px', height: '28px' }}
                        title="Edit exam"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(exam.id, exam.examName)}
                        className="btn btn-danger btn-icon"
                        style={{ width: '28px', height: '28px' }}
                        title="Delete exam"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fff' }}>{exam.examName}</h3>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={14} color="#818cf8" />
                      <span>{exam.examDate ? exam.examDate.replace('T', ' ').substring(0, 16) : 'Date TBD'}</span>
                    </div>

                    {daysLeft !== null && (
                      <span
                        style={{
                          backgroundColor: daysLeft <= 3 ? 'rgba(244, 63, 94, 0.2)' : 'rgba(99, 102, 241, 0.15)',
                          color: daysLeft <= 3 ? '#fb7185' : '#818cf8',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {daysLeft <= 0 ? 'Today / Passed' : `${daysLeft} days remaining`}
                      </span>
                    )}

                    {exam.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={13} color="#f59e0b" />
                        <span>{exam.location}</span>
                      </div>
                    )}
                  </div>

                  {exam.syllabus && (
                    <div
                      style={{
                        padding: '0.75rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.25)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        fontSize: '0.825rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '1.25rem',
                        lineHeight: 1.4,
                      }}
                    >
                      <strong style={{ color: '#fff', display: 'block', marginBottom: '0.2rem' }}>Syllabus:</strong>
                      {exam.syllabus}
                    </div>
                  )}
                </div>

                <div>
                  {/* Syllabus Completion Slider / Bar */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Syllabus Prepared:</span>
                      <strong style={{ color: '#fff' }}>{exam.syllabusCompletionPercentage || 0}%</strong>
                    </div>
                    <div className="progress-container">
                      <div
                        className="progress-bar"
                        style={{
                          width: `${exam.syllabusCompletionPercentage || 0}%`,
                          background:
                            exam.syllabusCompletionPercentage > 75
                              ? 'linear-gradient(90deg, #10b981, #06b6d4)'
                              : 'var(--grad-primary)',
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Footer status & target */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                      fontSize: '0.8rem',
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.text,
                        border: `1px solid ${statusStyle.border}`,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}
                    >
                      {exam.preparationStatus?.replace('_', ' ')}
                    </span>

                    {exam.targetScore && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f59e0b', fontWeight: 600 }}>
                        <Target size={14} />
                        <span>Goal: {exam.targetScore}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Exam Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingExam ? 'Edit Exam' : 'Schedule Exam'}>
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
            <label className="form-label">Exam / Assessment Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Midterm Examination: Algorithms"
              value={formData.examName}
              onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
              <label className="form-label">Exam Date & Time *</label>
              <input
                type="datetime-local"
                className="form-input"
                value={formData.examDate}
                onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Location / Room</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Exam Hall 102"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Score</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. A+ / 95%"
                value={formData.targetScore}
                onChange={(e) => setFormData({ ...formData, targetScore: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                Syllabus Completed: <strong>{formData.syllabusCompletionPercentage}%</strong>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                style={{ width: '100%', accentColor: 'var(--primary)', marginTop: '0.5rem' }}
                value={formData.syllabusCompletionPercentage}
                onChange={(e) => setFormData({ ...formData, syllabusCompletionPercentage: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Preparation Readiness</label>
              <select
                className="form-select"
                value={formData.preparationStatus}
                onChange={(e) => setFormData({ ...formData, preparationStatus: e.target.value })}
              >
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="READY">Ready</option>
                <option value="MASTERED">Mastered</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Syllabus Scope / Topics</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="List modules, chapters, or textbook references..."
              value={formData.syllabus}
              onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : editingExam ? 'Update Exam' : 'Schedule Exam'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ExamsPage;
