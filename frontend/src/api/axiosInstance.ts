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
          },
        )

        refreshQueue.forEach((cb) => cb.resolve(true))
        refreshQueue = []
        return api(original)
      } catch (refreshError) {
        tokenStorage.clearUser()
        refreshQueue.forEach((cb) => cb.reject(refreshError))
        refreshQueue = []

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default api
