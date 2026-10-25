import React, { useState, useEffect } from 'react';
import { tasksApi, subjectsApi } from '../api';
import Modal from '../components/Modal';
import {
  CheckSquare,
  Plus,
  Edit2,
  Trash2,
  Clock,
  AlertTriangle,
  Check,
  Filter,
} from 'lucide-react';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: '',
    priority: 'MEDIUM',
    status: 'PENDING',
    deadline: '',
    estimatedMinutes: 60,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (subjectFilter) params.subjectId = subjectFilter;
      if (priorityFilter) params.priority = priorityFilter;

      const res = await tasksApi.getAll(params);
      setTasks(res.data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    subjectsApi.getAll().then((res) => setSubjects(res.data || []));
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, subjectFilter, priorityFilter]);

  const openCreateModal = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      subjectId: subjects.length > 0 ? subjects[0].id : '',
      priority: 'MEDIUM',
      status: 'PENDING',
      deadline: '',
      estimatedMinutes: 60,
    });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title || '',
      description: task.description || '',
      subjectId: task.subjectId || '',
      priority: task.priority || 'MEDIUM',
      status: task.status || 'PENDING',
      deadline: task.deadline ? task.deadline.substring(0, 16) : '',
      estimatedMinutes: task.estimatedMinutes || 60,
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...formData,
        subjectId: formData.subjectId ? Number(formData.subjectId) : null,
        deadline: formData.deadline ? (formData.deadline.length === 16 ? `${formData.deadline}:00` : formData.deadline) : null,
        estimatedMinutes: Number(formData.estimatedMinutes),
      };

      if (editingTask) {
        await tasksApi.update(editingTask.id, payload);
      } else {
        await tasksApi.create(payload);
      }
      setIsModalOpen(false);
      fetchTasks();
    } catch (err) {
      setError(err.message || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await tasksApi.updateStatus(taskId, newStatus);
      fetchTasks();
    } catch (err) {
      alert(err.message || 'Failed to update task status');
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete task "${title}"?`)) {
      try {
        await tasksApi.delete(id);
        fetchTasks();
      } catch (err) {
        alert(err.message || 'Failed to delete task');
      }
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Tasks & Study Planner</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Track assignments, problem sets, and milestones across all subjects
          </p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          padding: '1rem 1.25rem',
        }}
      >
        {/* Status Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: 'rgba(0,0,0,0.3)', padding: '0.3rem', borderRadius: '10px' }}>
          {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                background: statusFilter === st ? 'var(--primary)' : 'transparent',
                color: statusFilter === st ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Dropdown Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={15} color="#94a3b8" />
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
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

          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
          Loading your task queue...
        </div>
      ) : tasks.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <CheckSquare size={48} color="#64748b" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No Tasks Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {statusFilter !== 'ALL' || subjectFilter || priorityFilter
              ? 'No tasks match your selected filter criteria.'
              : 'You have no tasks scheduled. Add an assignment or study goal!'}
          </p>
          <button onClick={openCreateModal} className="btn btn-primary">
            <Plus size={16} />
            <span>Create New Task</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {tasks.map((task) => {
            const isCompleted = task.status === 'COMPLETED';

            return (
              <div
                key={task.id}
                className="glass-card card-interactive"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.1rem 1.25rem',
                  opacity: isCompleted ? 0.65 : 1,
                  borderLeft: `4px solid ${
                    task.priority === 'URGENT'
                      ? '#f43f5e'
                      : task.priority === 'HIGH'
                      ? '#f97316'
                      : task.priority === 'MEDIUM'
                      ? '#f59e0b'
                      : '#3b82f6'
                  }`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', minWidth: 0, flex: 1 }}>
                  {/* Status Toggle Box */}
                  <button
                    onClick={() => handleStatusChange(task.id, isCompleted ? 'PENDING' : 'COMPLETED')}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      backgroundColor: isCompleted ? '#10b981' : 'transparent',
                      border: isCompleted ? 'none' : '2px solid #64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#fff',
                      marginTop: '2px',
                      flexShrink: 0,
                    }}
                    title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
                  >
                    {isCompleted && <Check size={16} />}
                  </button>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: '1rem',
                          color: isCompleted ? '#94a3b8' : '#fff',
                          textDecoration: isCompleted ? 'line-through' : 'none',
                        }}
                      >
                        {task.title}
                      </span>
                      {task.subjectName && (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            color: '#94a3b8',
                          }}
                        >
                          {task.subjectName}
                        </span>
                      )}
                      <span className={`badge badge-${(task.priority || 'medium').toLowerCase()}`}>
                        {task.priority}
                      </span>
                      <span className={`badge badge-${(task.status || 'pending').toLowerCase().replace('_', '-')}`}>
                        {task.status?.replace('_', ' ')}
                      </span>
                    </div>

                    {task.description && (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.4rem', lineHeight: 1.4 }}>
                        {task.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {task.deadline && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Clock size={13} />
                          Due: {task.deadline.replace('T', ' ').substring(0, 16)}
                        </span>
                      )}
                      {task.estimatedMinutes && (
                        <span>Est: {task.estimatedMinutes} mins</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: '1rem' }}>
                  <select
                    className="form-select"
                    style={{ width: 'auto', padding: '0.35rem 0.6rem', fontSize: '0.75rem', height: '32px' }}
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>

                  <button
                    onClick={() => openEditModal(task)}
                    className="btn btn-secondary btn-icon"
                    style={{ width: '32px', height: '32px' }}
                    title="Edit task"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id, task.title)}
                    className="btn btn-danger btn-icon"
                    style={{ width: '32px', height: '32px' }}
                    title="Delete task"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Task Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTask ? 'Edit Task' : 'Create Task'}>
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
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Implement Dijkstra's Algorithm"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <select
                className="form-select"
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              >
                <option value="">General (No Subject)</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Deadline (Optional)</label>
              <input
                type="datetime-local"
                className="form-input"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Estimated Minutes</label>
              <input
                type="number"
                min="10"
                max="600"
                className="form-input"
                value={formData.estimatedMinutes}
                onChange={(e) => setFormData({ ...formData, estimatedMinutes: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Instructions</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Task details, links, or submission requirements..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TasksPage;
