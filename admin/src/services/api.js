const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Reads the (deliberately non-httpOnly) CSRF cookie the server sets on
// login, so it can be echoed back as a header on mutating requests \u2014
// the double-submit pattern in server/middleware/csrf.js.
const getCsrfToken = () => {
  const match = document.cookie.match(/(?:^|;\s*)csrfToken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch {
    throw new ApiError(`Unexpected response from server (status ${response.status})`, response.status);
  }
  if (!response.ok) {
    if (response.status === 401 && !window.location.pathname.includes('/admin/login')) {
      window.location.href = '/admin/login';
    }
    throw new ApiError(data.message || 'Something went wrong', response.status);
  }
  return data;
};

const apiFetch = (url, options = {}, timeoutMs = 10000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const method = (options.method || 'GET').toUpperCase();

  return fetch(url, {
    ...options,
    signal: controller.signal,
    // Sends the httpOnly auth cookie with every request \u2014 this replaces
    // the old manual `Authorization: Bearer <token>` header read from
    // localStorage.
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(method !== 'GET' && method !== 'HEAD' ? { 'X-CSRF-Token': getCsrfToken() } : {}),
      ...options.headers,
    },
  })
    .then(handleResponse)
    .catch((err) => {
      if (err.name === 'AbortError') {
        throw new ApiError('Request timed out \u2014 the server took too long to respond.', undefined);
      }
      if (err instanceof ApiError) throw err;
      // Network-level failure: VITE_API_URL not set for this deploy,
      // backend unreachable, CORS rejection, DNS failure, etc.
      throw new ApiError('Could not reach the server. Please check your connection.', undefined);
    })
    .finally(() => clearTimeout(timer));
};

// Auth
export const authAPI = {
  login: (email, password) => apiFetch(`${API_BASE_URL}/auth/login`, { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => apiFetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' }),
  getMe: () => apiFetch(`${API_BASE_URL}/auth/me`),
  updateProfile: (data) => apiFetch(`${API_BASE_URL}/auth/profile`, { method: 'PUT', body: JSON.stringify(data) }),
  changePassword: (currentPassword, newPassword) => apiFetch(`${API_BASE_URL}/auth/change-password`, { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) }),
  forgotPassword: (email) => apiFetch(`${API_BASE_URL}/auth/forgot-password`, { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (token, password) => apiFetch(`${API_BASE_URL}/auth/reset-password/${token}`, { method: 'PUT', body: JSON.stringify({ password }) }),
};

// Blog
export const blogAPI = {
  getAll: (params = '') => apiFetch(`${API_BASE_URL}/blog${params}`),
  getBySlug: (slug) => apiFetch(`${API_BASE_URL}/blog/${slug}`),
  create: (data) => apiFetch(`${API_BASE_URL}/blog`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`${API_BASE_URL}/blog/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`${API_BASE_URL}/blog/${id}`, { method: 'DELETE' }),
};

// Services
export const serviceAPI = {
  getAll: (params = '') => apiFetch(`${API_BASE_URL}/services${params}`),
  getBySlug: (slug) => apiFetch(`${API_BASE_URL}/services/${slug}`),
  create: (data) => apiFetch(`${API_BASE_URL}/services`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`${API_BASE_URL}/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`${API_BASE_URL}/services/${id}`, { method: 'DELETE' }),
};

// Team
export const teamAPI = {
  getAll: (params = '') => apiFetch(`${API_BASE_URL}/team${params}`),
  getById: (id) => apiFetch(`${API_BASE_URL}/team/${id}`),
  create: (data) => apiFetch(`${API_BASE_URL}/team`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`${API_BASE_URL}/team/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`${API_BASE_URL}/team/${id}`, { method: 'DELETE' }),
};

// Contact
export const contactAPI = {
  getAll: (params = '') => apiFetch(`${API_BASE_URL}/contact${params}`),
  getById: (id) => apiFetch(`${API_BASE_URL}/contact/${id}`),
  markAsRead: (id) => apiFetch(`${API_BASE_URL}/contact/${id}/read`, { method: 'PUT' }),
  reply: (id, replyMessage) => apiFetch(`${API_BASE_URL}/contact/${id}/reply`, { method: 'PUT', body: JSON.stringify({ replyMessage }) }),
  delete: (id) => apiFetch(`${API_BASE_URL}/contact/${id}`, { method: 'DELETE' }),
};

// Newsletter
export const newsletterAPI = {
  getSubscribers: () => apiFetch(`${API_BASE_URL}/newsletter/subscribers`),
};

// Partners
export const partnerAPI = {
  getAll: () => apiFetch(`${API_BASE_URL}/partners`),
  create: (data) => apiFetch(`${API_BASE_URL}/partners`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`${API_BASE_URL}/partners/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`${API_BASE_URL}/partners/${id}`, { method: 'DELETE' }),
};

// ESG
export const esgAPI = {
  getAll: (params = '') => apiFetch(`${API_BASE_URL}/esg${params}`),
  create: (data) => apiFetch(`${API_BASE_URL}/esg`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`${API_BASE_URL}/esg/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`${API_BASE_URL}/esg/${id}`, { method: 'DELETE' }),
};

// Jobs
export const jobAPI = {
  getAll: (params = '') => apiFetch(`${API_BASE_URL}/jobs${params}`),
  create: (data) => apiFetch(`${API_BASE_URL}/jobs`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`${API_BASE_URL}/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`${API_BASE_URL}/jobs/${id}`, { method: 'DELETE' }),
};

// Analytics
export const analyticsAPI = {
  getDashboard: () => apiFetch(`${API_BASE_URL}/analytics/dashboard`),
  getActivity: (limit = 10) => apiFetch(`${API_BASE_URL}/analytics/activity?limit=${limit}`),
  getMessages: () => apiFetch(`${API_BASE_URL}/analytics/messages`),
  getGrowth: () => apiFetch(`${API_BASE_URL}/analytics/growth`),
};

// Settings
export const settingsAPI = {
  getAll: () => apiFetch(`${API_BASE_URL}/settings`),
  getPublic: () => apiFetch(`${API_BASE_URL}/settings/public`),
  update: (key, value, group) => apiFetch(`${API_BASE_URL}/settings`, { method: 'POST', body: JSON.stringify({ key, value, group }) }),
  bulkUpdate: (settings) => apiFetch(`${API_BASE_URL}/settings/bulk`, { method: 'PUT', body: JSON.stringify({ settings }) }),
};

// Upload
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: formData,
    }).then(handleResponse);
  },
  deleteImage: (publicId) => apiFetch(`${API_BASE_URL}/upload`, { method: 'DELETE', body: JSON.stringify({ publicId }) }),
};
