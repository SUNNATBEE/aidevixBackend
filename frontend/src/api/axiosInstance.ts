import axios from 'axios'
import { API_BASE_URL } from '@utils/constants'
import { tokenStorage } from '@utils/tokenStorage'

const CSRF_COOKIE_NAME = 'aidevix_csrf'

const readCsrfToken = (): string | null => {
  if (typeof document === 'undefined') return null
  const match = document.cookie
    .split(';')
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${CSRF_COOKIE_NAME}=`))
  if (!match) return null
  return decodeURIComponent(match.slice(CSRF_COOKIE_NAME.length + 1))
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Attach CSRF token for state-changing requests
api.interceptors.request.use((config) => {
  const method = String(config.method || 'get').toLowerCase()
  if (['post', 'put', 'patch', 'delete'].includes(method)) {
    const csrf = readCsrfToken()
    if (csrf) {
      config.headers = config.headers || {}
      ;(config.headers as Record<string, string>)['X-CSRF-Token'] = csrf
    }
  }
  return config
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
        // Do not force global redirect from interceptor.
        // Public pages can legitimately receive 401 on optional auth checks.
        // ProtectedRoute/AdminRoute handle navigation for protected screens.
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    // Obuna bekor qilingan bo'lsa — Redux state ni yangilash
    if (error.response?.status === 403 && error.response?.data?.isSubscriptionError) {
      import('@store/index').then(({ dispatch }) => {
        import('@store/slices/subscriptionSlice').then(({ resetSubscription }) => {
          dispatch(resetSubscription({
            subscriptions: error.response.data.subscriptions,
          }))
        })
      })
    }

    // Admin 2FA enrollment required — auto-redirect once
    if (
      error.response?.status === 403 &&
      error.response?.data?.requires2FAEnrollment &&
      typeof window !== 'undefined' &&
      !window.location.pathname.startsWith('/auth/2fa-setup')
    ) {
      const next = encodeURIComponent(window.location.pathname + window.location.search)
      window.location.replace(`/auth/2fa-setup?next=${next}`)
    }

    return Promise.reject(error)
  },
)

export default api
