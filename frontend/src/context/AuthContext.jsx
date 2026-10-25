import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('study_track_student');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('study_track_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('study_track_token');
      if (storedToken) {
        try {
          const res = await authApi.getProfile();
          if (res && res.data) {
            setUser(res.data);
            localStorage.setItem('study_track_student', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error('Session expired or error fetching profile:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res && res.data) {
      const { token: jwtToken, student } = res.data;
      setToken(jwtToken);
      setUser(student);
      localStorage.setItem('study_track_token', jwtToken);
      localStorage.setItem('study_track_student', JSON.stringify(student));
      return student;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res && res.data) {
      const { token: jwtToken, student } = res.data;
      setToken(jwtToken);
      setUser(student);
      localStorage.setItem('study_track_token', jwtToken);
      localStorage.setItem('study_track_student', JSON.stringify(student));
      return student;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('study_track_token');
    localStorage.removeItem('study_track_student');
  };

  const updateProfile = async (profileData) => {
    const res = await authApi.updateProfile(profileData);
    if (res && res.data) {
      setUser(res.data);
      localStorage.setItem('study_track_student', JSON.stringify(res.data));
      return res.data;
    }
  };

  const loginAsDemo = async () => {
    return login('alex@studytrack.com', 'password123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        updateProfile,
        loginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
