import React, { useState, useEffect } from 'react';
import { notesApi, subjectsApi } from '../api';
import Modal from '../components/Modal';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Pin,
  Search,
  Tag,
  BookOpen,
  Calendar,
} from 'lucide-react';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    subjectId: '',
    title: '',
    topic: '',
    content: '',
    tags: '',
    isPinned: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // View note detail modal
  const [viewingNote, setViewingNote] = useState(null);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (subjectFilter) params.subjectId = subjectFilter;

      const res = await notesApi.search(params);
      setNotes(res.data || []);
    } catch (err) {
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    subjectsApi.getAll().then((res) => setSubjects(res.data || []));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotes();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, subjectFilter]);

  const openCreateModal = () => {
    setEditingNote(null);
    setFormData({
      subjectId: subjects.length > 0 ? subjects[0].id : '',
      title: '',
      topic: '',
      content: '',
      tags: '',
      isPinned: false,
    });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setFormData({
      subjectId: note.subjectId || '',
      title: note.title || '',
      topic: note.topic || '',
      content: note.content || '',
      tags: note.tags || '',
      isPinned: note.isPinned || false,
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
      };

      if (editingNote) {
        await notesApi.update(editingNote.id, payload);
      } else {
        await notesApi.create(payload);
      }
      setIsModalOpen(false);
      fetchNotes();
    } catch (err) {
      setError(err.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePin = async (id) => {
    try {
      await notesApi.togglePin(id);
      fetchNotes();
    } catch (err) {
      alert(err.message || 'Failed to toggle pin');
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete note "${title}"?`)) {
      try {
        await notesApi.delete(id);
        if (viewingNote?.id === id) setViewingNote(null);
        fetchNotes();
      } catch (err) {
        alert(err.message || 'Failed to delete note');
      }
    }
  };

  const pinnedNotes = notes.filter((n) => n.isPinned);
  const otherNotes = notes.filter((n) => !n.isPinned);

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Study Notes & Cheatsheets</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Curate concepts, formulas, lecture summaries, and quick references
          </p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={16} />
          <span>New Note</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          padding: '1rem 1.25rem',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search notes by keyword, topic, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={16} color="#94a3b8" />
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
          Loading your study notes...
        </div>
      ) : notes.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <FileText size={48} color="#64748b" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No Notes Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {searchTerm || subjectFilter
              ? 'No notes match your current search criteria.'
              : 'Keep all your formulas and lecture takeaways organized here!'}
          </p>
          <button onClick={openCreateModal} className="btn btn-primary">
            <Plus size={16} />
            <span>Create First Note</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Pinned Notes Section */}
          {pinnedNotes.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#fbbf24', fontSize: '0.9rem', fontWeight: 600 }}>
                <Pin size={16} />
                <span>Pinned Favorites</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {pinnedNotes.map((note) => renderNoteCard(note))}
              </div>
            </div>
          )}

          {/* Regular Notes Section */}
          <div>
            {pinnedNotes.length > 0 && (
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                All Subject Notes
              </h3>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {otherNotes.map((note) => renderNoteCard(note))}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Note Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingNote ? 'Edit Study Note' : 'Create Study Note'} maxWidth="650px">
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
            <label className="form-label">Note Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Asymptotic Complexity & Master Theorem"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              <label className="form-label">Topic / Unit</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Chapter 2"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma-separated)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. algorithms, formulas, exam-prep"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Note Content *</label>
            <textarea
              className="form-textarea"
              rows={8}
              placeholder="Write your study notes, definitions, formulas, or code snippets..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
            ></textarea>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="checkbox"
              id="isPinned"
              checked={formData.isPinned}
              onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
              style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
            />
            <label htmlFor="isPinned" style={{ fontSize: '0.875rem', color: '#fff', cursor: 'pointer' }}>
              Pin this note to the top of the repository
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : editingNote ? 'Update Note' : 'Create Note'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Note Modal */}
      {viewingNote && (
        <Modal isOpen={!!viewingNote} onClose={() => setViewingNote(null)} title={viewingNote.title} maxWidth="700px">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
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
                {viewingNote.subjectName}
              </span>
              {viewingNote.topic && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Topic: <strong>{viewingNote.topic}</strong>
                </span>
              )}
              {viewingNote.createdAt && (
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Created: {viewingNote.createdAt.substring(0, 10)}
                </span>
              )}
            </div>

            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px',
                padding: '1.25rem',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                color: '#e2e8f0',
                whiteSpace: 'pre-wrap',
                maxHeight: '400px',
                overflowY: 'auto',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {viewingNote.content}
            </div>

            {viewingNote.tags && (
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                {viewingNote.tags.split(',').map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      color: 'var(--text-secondary)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                    }}
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => {
                  const note = viewingNote;
                  setViewingNote(null);
                  openEditModal(note);
                }}
                className="btn btn-secondary"
              >
                <Edit2 size={14} />
                <span>Edit Note</span>
              </button>
              <button onClick={() => setViewingNote(null)} className="btn btn-primary">
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );

  function renderNoteCard(note) {
    return (
      <div
        key={note.id}
        className="glass-card card-interactive"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.25rem',
          borderTop: note.isPinned ? '3px solid #fbbf24' : '1px solid var(--border-color)',
          cursor: 'pointer',
        }}
        onClick={() => setViewingNote(note)}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#818cf8',
              }}
            >
              {note.subjectCode || 'NOTE'} • {note.subjectName}
            </span>

            <div style={{ display: 'flex', gap: '0.35rem' }} onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => handleTogglePin(note.id)}
                className="btn btn-secondary btn-icon"
                style={{ width: '28px', height: '28px', color: note.isPinned ? '#fbbf24' : 'var(--text-muted)' }}
                title={note.isPinned ? 'Unpin' : 'Pin to top'}
              >
                <Pin size={13} />
              </button>
              <button
                onClick={() => openEditModal(note)}
                className="btn btn-secondary btn-icon"
                style={{ width: '28px', height: '28px' }}
                title="Edit note"
              >
                <Edit2 size={13} />
              </button>
              <button
                onClick={() => handleDelete(note.id, note.title)}
                className="btn btn-danger btn-icon"
                style={{ width: '28px', height: '28px' }}
                title="Delete note"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: '#fff' }}>{note.title}</h3>

          {note.topic && (
            <div style={{ fontSize: '0.78rem', color: '#06b6d4', marginBottom: '0.6rem' }}>
              Topic: {note.topic}
            </div>
          )}

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              lineHeight: 1.5,
              marginBottom: '1rem',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {note.content}
          </p>
        </div>

        <div>
          {note.tags && (
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {note.tags.split(',').map((tag, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Click to read full note →</span>
            {note.updatedAt && <span>{note.updatedAt.substring(0, 10)}</span>}
          </div>
        </div>
      </div>
    );
  }
};

export default NotesPage;
