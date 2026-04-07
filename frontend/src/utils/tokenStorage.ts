import { STORAGE_KEYS } from './constants'

const isBrowser = typeof window !== 'undefined'

export const tokenStorage = {
  clearTokens:  () => {
    if (isBrowser) {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
    }
  },
  clearUser: () => {
    if (isBrowser) {
      localStorage.removeItem(STORAGE_KEYS.USER)
    }
  },
  getUser:      ()     => {
    if (!isBrowser) return null
    try { 
      const user = localStorage.getItem(STORAGE_KEYS.USER)
      return user ? JSON.parse(user) : null 
    }
    catch { return null }
  },
  setUser:      (user: any) => isBrowser && localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
}
