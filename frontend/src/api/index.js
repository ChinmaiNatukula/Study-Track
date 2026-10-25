import api from './client';

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/students/profile', profileData),
};

export const dashboardApi = {
  getDashboardStats: () => api.get('/dashboard/stats'),
  getProgressStats: () => api.get('/progress/stats'),
};

export const subjectsApi = {
  getAll: () => api.get('/subjects'),
  getById: (id) => api.get(`/subjects/${id}`),
  create: (data) => api.post('/subjects', data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
};

export const tasksApi = {
  getAll: (params) => api.get('/tasks', { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  getOverdue: () => api.get('/tasks/overdue'),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
  delete: (id) => api.delete(`/tasks/${id}`),
};

export const timetableApi = {
  getAll: (params) => api.get('/timetable', { params }),
  getUpcoming: () => api.get('/timetable/upcoming'),
  getById: (id) => api.get(`/timetable/${id}`),
  create: (data) => api.post('/timetable', data),
  update: (id, data) => api.put(`/timetable/${id}`, data),
  toggleComplete: (id) => api.patch(`/timetable/${id}/complete`),
  delete: (id) => api.delete(`/timetable/${id}`),
};

export const examsApi = {
  getAll: () => api.get('/exams'),
  getUpcoming: () => api.get('/exams/upcoming'),
  getById: (id) => api.get(`/exams/${id}`),
  create: (data) => api.post('/exams', data),
  update: (id, data) => api.put(`/exams/${id}`, data),
  delete: (id) => api.delete(`/exams/${id}`),
};

export const studySessionsApi = {
  getAll: () => api.get('/study-sessions'),
  record: (data) => api.post('/study-sessions', data),
  delete: (id) => api.delete(`/study-sessions/${id}`),
};

export const notesApi = {
  search: (params) => api.get('/notes', { params }),
  getById: (id) => api.get(`/notes/${id}`),
  create: (data) => api.post('/notes', data),
  update: (id, data) => api.put(`/notes/${id}`, data),
  togglePin: (id) => api.patch(`/notes/${id}/pin`),
  delete: (id) => api.delete(`/notes/${id}`),
};
