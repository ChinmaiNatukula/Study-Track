import React, { useState, useEffect } from 'react';
import { dashboardApi, timetableApi, tasksApi } from '../api';
import { useAuth } from '../context/AuthContext';
import {
  Clock,
  CheckCircle,
  GraduationCap,
  BookOpen,
  Calendar,
  AlertCircle,
  Check,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const DashboardPage = ({ onOpenQuickLog }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await dashboardApi.getDashboardStats();
      if (res && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleTimetable = async (sessionId) => {
    try {
      await timetableApi.toggleComplete(sessionId);
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to toggle session complete:', err);
    }
  };

  const handleToggleTaskStatus = async (task) => {
    try {
      const nextStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
      await tasksApi.updateStatus(task.id, nextStatus);
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to toggle task status:', err);
    }
  };

  if (loading && !stats) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '3px solid rgba(99, 102, 241, 0.2)',
              borderTopColor: '#6366f1',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem',
            }}
          ></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading your academic workspace...</p>
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  const weeklyStudyHours = stats?.weeklyStudyHours || 0;
  const targetWeeklyHours = stats?.targetWeeklyHours || user?.targetWeeklyHours || 20;
  const weeklyProgress = Math.min(Math.round((weeklyStudyHours / targetWeeklyHours) * 100), 100);

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Welcome Hero Banner */}
      <div
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(6, 182, 212, 0.08) 100%)',
          borderColor: 'rgba(99, 102, 241, 0.3)',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Sparkles size={18} color="#818cf8" />
            <span style={{ fontSize: '0.85rem', color: '#a5b4fc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Academic Control Hub
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>
            Welcome back, {user?.name || 'Student'}! 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px' }}>
            You have logged <strong style={{ color: '#fff' }}>{weeklyStudyHours.toFixed(1)} hours</strong> of study this week. You're at{' '}
            <strong style={{ color: '#818cf8' }}>{weeklyProgress}%</strong> of your {targetWeeklyHours}h target.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onOpenQuickLog} className="btn btn-primary">
            <Clock size={16} />
            <span>Log Study Session</span>
          </button>
          <Link to="/timer" className="btn btn-secondary">
            <span>Focus Mode</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        {/* Card 1: Weekly Study Hours */}
        <div className="glass-card card-interactive">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Study This Week</span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Clock size={18} color="#818cf8" />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
            {weeklyStudyHours.toFixed(1)} <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>/ {targetWeeklyHours} hrs</span>
          </div>
          <div className="progress-container" style={{ marginBottom: '0.4rem' }}>
            <div className="progress-bar" style={{ width: `${weeklyProgress}%` }}></div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {weeklyProgress}% of weekly study goal accomplished
          </div>
        </div>

        {/* Card 2: Tasks Completed */}
        <div className="glass-card card-interactive">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Tasks Completed</span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle size={18} color="#34d399" />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
            {stats?.tasksCompleted || 0}{' '}
            <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              / {(stats?.tasksCompleted || 0) + (stats?.pendingTasks || 0)} Total
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#34d399' }}>
            <TrendingUp size={14} />
            <span>{stats?.pendingTasks || 0} tasks currently pending</span>
          </div>
        </div>

        {/* Card 3: Upcoming Exams */}
        <div className="glass-card card-interactive">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Upcoming Exams</span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <GraduationCap size={18} color="#fbbf24" />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
            {stats?.upcomingExamsCount || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Next test in schedule tracked below
          </div>
        </div>

        {/* Card 4: Enrolled Subjects */}
        <div className="glass-card card-interactive">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Subjects Enrolled</span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BookOpen size={18} color="#22d3ee" />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
            {stats?.totalSubjects || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Active courses with progress tracking
          </div>
        </div>
      </div>

      {/* Main Charts & Analytics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* Weekly Study Hours Chart */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Weekly Study Activity</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Daily logged study distribution (Hours)</p>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600 }}>Last 7 Days</span>
          </div>

          <div style={{ width: '100%', height: '240px' }}>
            {stats?.weeklyStudyChart && stats.weeklyStudyChart.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.weeklyStudyChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    formatter={(value) => [`${value} hrs`, 'Study Time']}
                  />
                  <Bar dataKey="hours" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No study sessions recorded this week yet.
              </div>
            )}
          </div>
        </div>

        {/* Subject Study Progress */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Subject Progress</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Logged hours against semester targets</p>
            </div>
            <Link to="/subjects" style={{ color: '#818cf8', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <span>View All</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '250px', overflowY: 'auto' }}>
            {stats?.subjectProgressChart && stats.subjectProgressChart.length > 0 ? (
              stats.subjectProgressChart.map((subj) => (
                <div key={subj.subjectId} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: subj.color || '#6366f1',
                          display: 'inline-block',
                        }}
                      ></span>
                      <strong style={{ color: '#fff' }}>{subj.subjectName}</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({subj.subjectCode})</span>
                    </div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {subj.loggedHours.toFixed(1)} / {subj.targetHours}h ({subj.completionPercentage}%)
                    </span>
                  </div>
                  <div className="progress-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${Math.min(subj.completionPercentage, 100)}%`,
                        backgroundColor: subj.color || '#6366f1',
                      }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                No subjects registered yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Section: Today's Schedule & Priority Tasks */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Today's Timetable */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} color="#06b6d4" />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Today's Classes & Sessions</h3>
            </div>
            <Link to="/timetable" style={{ color: '#06b6d4', fontSize: '0.8rem', textDecoration: 'none' }}>
              Full Schedule →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats?.todayTimetable && stats.todayTimetable.length > 0 ? (
              stats.todayTimetable.map((session) => (
                <div
                  key={session.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem',
                    backgroundColor: session.isCompleted ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                    border: session.isCompleted ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--border-color)',
                    borderRadius: '10px',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                      onClick={() => handleToggleTimetable(session.id)}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        backgroundColor: session.isCompleted ? '#10b981' : 'transparent',
                        border: session.isCompleted ? 'none' : '2px solid #64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#fff',
                        transition: 'all 0.2s',
                      }}
                      title="Toggle session completed"
                    >
                      {session.isCompleted && <Check size={16} />}
                    </button>
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          color: session.isCompleted ? '#94a3b8' : '#fff',
                          textDecoration: session.isCompleted ? 'line-through' : 'none',
                        }}
                      >
                        {session.topic}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {session.subjectName} • {session.startTime?.substring(0, 5)} - {session.endTime?.substring(0, 5)} {session.roomOrLink && `• ${session.roomOrLink}`}
                      </div>
                    </div>
                  </div>
                  {session.isCompleted ? (
                    <span className="badge badge-completed">Done</span>
                  ) : (
                    <span className="badge badge-pending">Upcoming</span>
                  )}
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0', fontSize: '0.85rem' }}>
                No scheduled lectures or sessions for today. Enjoy your self-study!
              </div>
            )}
          </div>
        </div>

        {/* Priority Deadlines & Tasks */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} color="#f43f5e" />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Upcoming Deadlines</h3>
            </div>
            <Link to="/tasks" style={{ color: '#818cf8', fontSize: '0.8rem', textDecoration: 'none' }}>
              View Tasks →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats?.upcomingDeadlines && stats.upcomingDeadlines.length > 0 ? (
              stats.upcomingDeadlines.map((task) => (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                      onClick={() => handleToggleTaskStatus(task)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        backgroundColor: task.status === 'COMPLETED' ? '#10b981' : 'transparent',
                        border: task.status === 'COMPLETED' ? 'none' : '2px solid #64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#fff',
                      }}
                      title="Mark task done"
                    >
                      {task.status === 'COMPLETED' && <Check size={15} />}
                    </button>
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          color: task.status === 'COMPLETED' ? '#94a3b8' : '#fff',
                          textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none',
                        }}
                      >
                        {task.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {task.subjectName || 'General'} {task.deadline && `• Due: ${task.deadline.substring(0, 10)}`}
                      </div>
                    </div>
                  </div>
                  <span className={`badge badge-${(task.priority || 'medium').toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0', fontSize: '0.85rem' }}>
                🎉 No pressing deadlines due immediately!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
