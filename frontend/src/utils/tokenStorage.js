import { STORAGE_KEYS } from './constants'

export const tokenStorage = {
  getAccess:    ()      => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
  getRefresh:   ()      => localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  setAccess:    (token) => localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token),
  setRefresh:   (token) => localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token),
  setTokens:    (access, refresh) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access)
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh)
  },
  clearTokens:  () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  },
  getUser:      ()     => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) }
    catch { return null }
  },
  setUser:      (user) => localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
}
