import api from './axiosInstance'

export const authApi = {
  /** POST /auth/register */
  register: (data) => api.post('/auth/register', data),

  /** POST /auth/login */
  login: (data) => api.post('/auth/login', data),

  /** POST /auth/refresh */
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),

  /** POST /auth/logout */
  logout: () => api.post('/auth/logout'),

  /** GET /auth/me - get current user info */
  getMe: () => api.get('/auth/me'),
}
