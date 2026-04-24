import api from './axiosInstance'

export const authApi = {
  /** POST /auth/register */
  register: (data) => api.post('auth/register', data),

  /** POST /auth/login */
  login: (data) => api.post('auth/login', data),

  /** POST /auth/google — Google OAuth (credential = Google ID token) */
  googleAuth: (data: { credential: string }) => api.post('auth/google', data),

  /** POST /auth/refresh-token */
  refresh: () => api.post('auth/refresh-token', {}),

  /** POST /auth/logout */
  logout: () => api.post('auth/logout'),

  /** GET /auth/me - get current user info */
  getMe: () => api.get('auth/me'),

  /** PUT /auth/change-password */
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('auth/change-password', data),
}
