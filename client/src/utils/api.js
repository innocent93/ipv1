const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status;
    this.code = code;
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
    throw new ApiError(data.message || 'Something went wrong', response.status, data.code);
  }
  return data;
};

// Token refresh queue
let isRefreshing = false;
let refreshSubscribers = [];

const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (cb) => {
  refreshSubscribers.push(cb);
};

const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');

    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await handleResponse(res);
    if (data.data?.accessToken) {
      localStorage.setItem('accessToken', data.data.accessToken);
      if (data.data.refreshToken) {
        localStorage.setItem('refreshToken', data.data.refreshToken);
      }
      return data.data.accessToken;
    }
    throw new Error('Refresh failed');
  } catch (err) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.dispatchEvent(new CustomEvent('auth:logout'));
    throw err;
  }
};

const apiFetch = async (url, options = {}, timeoutMs = 15000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const accessToken = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
    ...options.headers,
  };

  // Add CSRF token for state-changing requests
  if (options.method && options.method !== 'GET') {
    const csrfToken = document.cookie.match(/csrfToken=([^;]+)/)?.[1];
    if (csrfToken) headers['X-CSRF-Token'] = csrfToken;
  }

  const makeRequest = async (token) => {
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return fetch(url, {
      ...options,
      signal: controller.signal,
      headers,
      credentials: 'include',
    });
  };

  try {
    let response = await makeRequest();

    // Handle token expiration
    if (response.status === 401) {
      const data = await response.json().catch(() => ({}));
      if (data.code === 'TOKEN_EXPIRED') {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const newToken = await refreshAccessToken();
            onTokenRefreshed(newToken);
            response = await makeRequest(newToken);
          } catch (refreshErr) {
            throw new ApiError('Session expired. Please log in again.', 401, 'SESSION_EXPIRED');
          } finally {
            isRefreshing = false;
          }
        } else {
          // Wait for refresh to complete
          const newToken = await new Promise((resolve) => {
            addRefreshSubscriber((token) => resolve(token));
          });
          response = await makeRequest(newToken);
        }
      }
    }

    return handleResponse(response);
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new ApiError('Request timed out — the server took too long to respond.', undefined);
    }
    if (err instanceof ApiError) throw err;
    throw new ApiError('Could not reach the server. Please check your connection.', undefined);
  } finally {
    clearTimeout(timer);
  }
};

export const api = {
  // Auth
  login: (credentials) => apiFetch(`${API_BASE_URL}/auth/login`, { method: 'POST', body: JSON.stringify(credentials) }),
  register: (data) => apiFetch(`${API_BASE_URL}/auth/register`, { method: 'POST', body: JSON.stringify(data) }),
  refreshToken: (token) => apiFetch(`${API_BASE_URL}/auth/refresh`, { method: 'POST', body: JSON.stringify({ refreshToken: token }) }),
  logout: () => {
    const refreshToken = localStorage.getItem('refreshToken');
    return apiFetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', body: JSON.stringify({ refreshToken }) });
  },
  logoutAll: () => apiFetch(`${API_BASE_URL}/auth/logout-all`, { method: 'POST' }),
  me: () => apiFetch(`${API_BASE_URL}/auth/me`),
  getSessions: () => apiFetch(`${API_BASE_URL}/auth/sessions`),
  forgotPassword: (email) => apiFetch(`${API_BASE_URL}/auth/forgot-password`, { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (data) => apiFetch(`${API_BASE_URL}/auth/reset-password`, { method: 'POST', body: JSON.stringify(data) }),

  // Services
  getServices: (params = '') => apiFetch(`${API_BASE_URL}/services${params}`).then(r => r.data),
  getService: (slug) => apiFetch(`${API_BASE_URL}/services/${slug}`).then(r => r.data),

  // Blog
  getPosts: (params = '') => apiFetch(`${API_BASE_URL}/blog${params}`).then(r => r),
  getPost: (slug) => apiFetch(`${API_BASE_URL}/blog/${slug}`).then(r => r.data),
  getRelatedPosts: (slug, limit = 3) => apiFetch(`${API_BASE_URL}/blog/${slug}/related?limit=${limit}`).then(r => r.data),

  // Contact
  submitContact: (data) => apiFetch(`${API_BASE_URL}/contact`, { method: 'POST', body: JSON.stringify(data) }),

  // Newsletter
  subscribeNewsletter: (data) => apiFetch(`${API_BASE_URL}/newsletter`, { method: 'POST', body: JSON.stringify(data) }),

  // Search
  search: (query, page = 1, limit = 20) => apiFetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`).then(r => r),
  getSuggestions: (query) => apiFetch(`${API_BASE_URL}/search/suggestions?q=${encodeURIComponent(query)}`).then(r => r.data),

  // Team
  getTeam: () => apiFetch(`${API_BASE_URL}/team`).then(r => r.data),

  // ESG
  getESGReports: () => apiFetch(`${API_BASE_URL}/esg`).then(r => r.data),

  // Jobs
  getJobs: () => apiFetch(`${API_BASE_URL}/jobs`).then(r => r.data),

  // Job Applications
  submitJobApplication: (data) => apiFetch(`${API_BASE_URL}/job-applications/apply`, { method: 'POST', body: JSON.stringify(data) }),
  trackJobApplication: (data) => apiFetch(`${API_BASE_URL}/job-applications/track`, { method: 'POST', body: JSON.stringify(data) }),

  // Event RSVP
  submitEventRSVP: (data) => apiFetch(`${API_BASE_URL}/event-rsvp`, { method: 'POST', body: JSON.stringify(data) }),
  cancelRSVP: (id, email) => apiFetch(`${API_BASE_URL}/event-rsvp/${id}/cancel`, { method: 'POST', body: JSON.stringify({ email }) }),

  // Proposal
  submitProposal: (data) => apiFetch(`${API_BASE_URL}/contact`, { method: 'POST', body: JSON.stringify({ ...data, subject: 'Proposal Request' }) }),

  // Upload
  uploadFile: (formData) => apiFetch(`${API_BASE_URL}/upload`, { method: 'POST', body: formData, headers: {} }),
};

export { ApiError };
