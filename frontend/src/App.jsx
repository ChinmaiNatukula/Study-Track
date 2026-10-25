import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import QuickLogModal from './components/QuickLogModal';

import DashboardPage from './pages/DashboardPage';
import SubjectsPage from './pages/SubjectsPage';
import TasksPage from './pages/TasksPage';
import TimetablePage from './pages/TimetablePage';
import ExamsPage from './pages/ExamsPage';
import StudySessionsPage from './pages/StudySessionsPage';
import NotesPage from './pages/NotesPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0e17',
          color: 'var(--text-secondary)',
        }}
      >
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
          <p>Verifying session...</p>
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppLayout = () => {
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSessionSaved = () => {
    // Increment to trigger reload in child components if needed
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar onOpenQuickLog={() => setIsQuickLogOpen(true)} />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<DashboardPage key={refreshKey} onOpenQuickLog={() => setIsQuickLogOpen(true)} />} />
            <Route path="/subjects" element={<SubjectsPage key={refreshKey} />} />
            <Route path="/tasks" element={<TasksPage key={refreshKey} />} />
            <Route path="/timetable" element={<TimetablePage key={refreshKey} />} />
            <Route path="/exams" element={<ExamsPage key={refreshKey} />} />
            <Route path="/timer" element={<StudySessionsPage key={refreshKey} />} />
            <Route path="/notes" element={<NotesPage key={refreshKey} />} />
            <Route path="/profile" element={<ProfilePage key={refreshKey} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        onSessionSaved={handleSessionSaved}
      />
    </div>
  );
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />}
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
