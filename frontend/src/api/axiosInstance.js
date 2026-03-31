import axios from 'axios'
import { API_BASE_URL } from '@utils/constants'
import { tokenStorage } from '@utils/tokenStorage'

/**
 * Main Axios instance — attaches Bearer token automatically
 * and handles 401 (token refresh) transparently.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ─── Request Interceptor ──────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccess()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

// ─── Response Interceptor ────────────────────────────────────
let isRefreshing = false
let refreshQueue = []

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    // If 401 and hasn't retried yet → try token refresh
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject })
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        const refreshToken = tokenStorage.getRefresh()
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken })
        const newToken = data.data.accessToken
        tokenStorage.setAccess(newToken)
        refreshQueue.forEach((cb) => cb.resolve(newToken))
        refreshQueue = []
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch (refreshError) {
        tokenStorage.clearTokens()
        refreshQueue.forEach((cb) => cb.reject(refreshError))
        refreshQueue = []
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default api
