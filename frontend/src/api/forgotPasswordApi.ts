import api from './axiosInstance';

export const forgotPasswordApi = {
  /** POST /auth/forgot-password */
  forgotPassword: (data) => api.post('auth/forgot-password', data),

  /** POST /auth/verify-code */
  verifyCode: (data) => api.post('auth/verify-code', data),

  /** POST /auth/reset-password */
  resetPassword: (data) => api.post('auth/reset-password', data),
};
