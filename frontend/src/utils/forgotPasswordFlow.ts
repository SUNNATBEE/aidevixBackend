const STORAGE_KEY = 'aidevix_forgot_password_state'
const CODE_TTL_MS = 10 * 60 * 1000

const normalize = (id = '') => id.trim().toLowerCase()

const readState = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null
  } catch {
    return null
  }
}

const writeState = (state: object) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

const clearState = () => {
  localStorage.removeItem(STORAGE_KEY)
}

export const forgotPasswordFlow = {
  startTimer(identifier: string) {
    const normalized = normalize(identifier)
    const expiresAt = Date.now() + CODE_TTL_MS
    writeState({ identifier: normalized, expiresAt })
  },

  getRemainingSeconds(identifier: string) {
    const state = readState()
    const normalized = normalize(identifier)
    if (!state || state.identifier !== normalized) return 0
    const remaining = Math.ceil((state.expiresAt - Date.now()) / 1000)
    return Math.max(0, remaining)
  },

  clear() {
    clearState()
  },
}
