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
export const getMe = () => API.get('/auth/me');

// ---- STUDENT: LAUNDRY ----
export const createOrder = (data) => API.post('/laundry/create', data);
export const getMyOrders = () => API.get('/laundry/my-orders');

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
