import axios from 'axios'
import { API_BASE_URL } from '@utils/constants'
import { tokenStorage } from '@utils/tokenStorage'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

let isRefreshing = false
let refreshQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }> = []

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !String(original.url || '').includes('auth/refresh-token') &&
      !String(original.url || '').includes('auth/login') &&
      !String(original.url || '').includes('auth/register') &&
      !String(original.url || '').includes('auth/forgot-password') &&
      !String(original.url || '').includes('auth/verify-code') &&
      !String(original.url || '').includes('auth/reset-password')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject })
        }).then(() => api(original))
      }

      original._retry = true
      isRefreshing = true

      try {
        await axios.post(
          `${API_BASE_URL}auth/refresh-token`,
          {},
          {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000,
          },
        )

        refreshQueue.forEach((cb) => cb.resolve(true))
        refreshQueue = []
        return api(original)
      } catch (refreshError) {
        tokenStorage.clearTokens()
        refreshQueue.forEach((cb) => cb.reject(refreshError))
        refreshQueue = []

        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          console.log('[Axios] Redirecting to /login due to auth failure');
          window.location.href = '/login'
        }

        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    // Obuna bekor qilingan bo'lsa — Redux state ni yangilash
    // Lazy import — circular dependency oldini olish (axiosInstance → store → slice → api → axiosInstance)
    if (error.response?.status === 403 && error.response?.data?.isSubscriptionError) {
      import('@store/index').then(({ dispatch }) => {
        import('@store/slices/subscriptionSlice').then(({ resetSubscription }) => {
          dispatch(resetSubscription({
            subscriptions: error.response.data.subscriptions,
          }))
        })
      })
    }

    return Promise.reject(error)
  },
)

export default api
