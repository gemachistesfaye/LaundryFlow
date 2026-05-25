import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---- AUTH ----
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const loginWithSupabase = (token) => API.post('/auth/supabase-login', { token });
export const getMe = () => API.get('/auth/me');

// ---- STUDENT: LAUNDRY & PAYMENTS ----
export const createOrder = (data) => API.post('/laundry/create', data);
export const getMyOrders = () => API.get('/laundry/my-orders');
export const createPayment = (data) => API.post('/payments/create', data);
export const changePassword = (data) => API.post('/auth/change-password', data);

export const getMyPayments = () => API.get('/payments/my-payments');

// ---- WORKER ----
export const getWorkerOrders = () => API.get('/laundry/worker-orders');
export const updateOrderStatus = (data) => API.put('/laundry/update-status', data);

// ---- DELIVERER ----
export const getDeliveryTasks = () => API.get('/delivery/tasks');
export const acceptDeliveryTask = (data) => API.put('/delivery/accept', data);
export const completeDelivery = (data) => API.put('/delivery/complete', data);

// ---- ADMIN ----
export const createWorker = (data) => API.post('/admin/create-worker', data);
export const createDeliverer = (data) => API.post('/admin/create-deliverer', data);
export const getAllUsers = () => API.get('/admin/users');
export const getAnalytics = () => API.get('/admin/analytics');
export const getAllOrders = () => API.get('/laundry/all-orders');
export const assignWorker = (data) => API.put('/admin/assign-worker', data);
export const assignDeliverer = (data) => API.put('/admin/assign-deliverer', data);
export const cancelOrder = (data) => API.put('/admin/cancel-order', data);
export const requestPayment = (data) => API.put('/admin/request-payment', data);
export const removeUser = (id) => API.delete(`/admin/remove-user/${id}`);
export const getAllPayments = () => API.get('/payments/all');
export const confirmPayment = (data) => API.put('/payments/confirm', data);

// ---- NOTIFICATIONS ----
export const getMyNotifications = () => API.get('/notifications');
export const markNotificationsRead = () => API.put('/notifications/read');

// ---- AI ASSISTANT ----
export const chatWithAI = (data) => API.post('/ai/chat', data);
export const getAIInsights = () => API.get('/ai/insights');
