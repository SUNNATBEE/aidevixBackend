import api from './axiosInstance'

export const subscriptionApi = {
  /** GET /subscriptions/status - current user's subscription status */
  getStatus: () => api.get('subscriptions/status'),

  /** POST /subscriptions/verify/telegram - verify Telegram subscription */
  verifyTelegram: (data) => api.post('subscriptions/verify/telegram', data),
  // data: { telegramUserId, username }

  /** POST /subscriptions/verify/instagram - verify Instagram subscription */
  verifyInstagram: (data) => api.post('subscriptions/verify/instagram', data),
  // data: { instagramUsername }

  /** GET /subscriptions/check - real-time check (used before video access) */
  check: () => api.get('subscriptions/check'),
}
