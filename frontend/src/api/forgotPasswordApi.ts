import api from './axiosInstance';

export const forgotPasswordApi = {
  /** POST /auth/forgot-password */
  forgotPassword: (data: { identifier: string; method?: string; captchaToken?: string }) =>
    api.post('auth/forgot-password', data),

  /** POST /auth/verify-code */
  verifyCode: (data: { identifier: string; method?: string; code: string }) =>
    api.post('auth/verify-code', data),

  /** POST /auth/reset-password */
  resetPassword: (data: { resetToken: string; newPassword: string }) =>
    api.post('auth/reset-password', data),
};
