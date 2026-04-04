import { STORAGE_KEYS } from './constants'

const isBrowser = typeof window !== 'undefined'

export const tokenStorage = {
  getAccess:    ()      => isBrowser ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null,
  getRefresh:   ()      => isBrowser ? localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) : null,
  setAccess:    (token: string) => isBrowser && localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token),
  setRefresh:   (token: string) => isBrowser && localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token),
  setTokens:    (access: string, refresh: string) => {
    if (isBrowser) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access)
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh)
    }
  },
  clearTokens:  () => {
    if (isBrowser) {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
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
