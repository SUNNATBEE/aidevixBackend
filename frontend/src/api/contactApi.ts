import api from './axiosInstance';

export const contactApi = {
  /** POST /public/contact — Public contact form (rate-limited) */
  submit: (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    _honeypot?: string;
  }) => api.post('public/contact', data),
};
