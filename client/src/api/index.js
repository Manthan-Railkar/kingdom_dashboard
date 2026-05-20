import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('q26_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Kingdoms
export const getKingdoms = () => api.get('/kingdoms').then((r) => r.data);
export const getKingdom = (id) => api.get(`/kingdoms/${id}`).then((r) => r.data);
export const updatePoints = (id, body) => api.patch(`/kingdoms/${id}/points`, body).then((r) => r.data);
export const updateKingdom = (id, body) => api.patch(`/kingdoms/${id}`, body).then((r) => r.data);
export const createKingdom = (body) => api.post('/kingdoms', body).then((r) => r.data);

// Rounds
export const getRounds = () => api.get('/rounds').then((r) => r.data);
export const getCurrentRound = () => api.get('/rounds/current').then((r) => r.data);
export const createRound = (body) => api.post('/rounds', body).then((r) => r.data);
export const updateRoundStatus = (id, status) => api.patch(`/rounds/${id}/status`, { status }).then((r) => r.data);
export const updateRound = (id, body) => api.patch(`/rounds/${id}`, body).then((r) => r.data);
export const deleteRound = (id) => api.delete(`/rounds/${id}`).then((r) => r.data);

// News
export const getNews = () => api.get('/news').then((r) => r.data);
export const postNews = (body) => api.post('/news', body).then((r) => r.data);
export const deleteNews = (id) => api.delete(`/news/${id}`).then((r) => r.data);

// Gallery
export const getGallery = () => api.get('/gallery').then((r) => r.data);
export const uploadGalleryImage = (formData) => api.post('/gallery', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
export const deleteGalleryImage = (id) => api.delete(`/gallery/${id}`).then((r) => r.data);

// Auth
export const loginAdmin = (username, accessKey) => api.post('/auth/login', { username, accessKey }).then((r) => r.data);
export const getMe = (token) =>
  axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data);

export default api;
