const STORAGE_KEY = 'aidevix_forgot_password_state'
const KNOWN_EMAILS_KEY = 'aidevix_known_emails'
const CODE_TTL_MS = 10 * 60 * 1000

const normalizeEmail = (email = '') => email.trim().toLowerCase()

const readState = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null
  } catch {
    return null
  }
}

const writeState = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

const clearState = () => {
  localStorage.removeItem(STORAGE_KEY)
}

const readKnownEmails = () => {
  try {
    return JSON.parse(localStorage.getItem(KNOWN_EMAILS_KEY)) || []
  } catch {
    return []
  }
}

const writeKnownEmails = (emails) => {
  localStorage.setItem(KNOWN_EMAILS_KEY, JSON.stringify(emails))
}

export const forgotPasswordFlow = {
  rememberEmail(email) {
    const normalized = normalizeEmail(email)
    if (!normalized) return

    const existing = readKnownEmails()
    if (!existing.includes(normalized)) {
      writeKnownEmails([...existing, normalized])
    }
  },

  isKnownEmail(email) {
    const normalized = normalizeEmail(email)
    if (!normalized) return false
    return readKnownEmails().includes(normalized)
  },

  startTimer(email) {
    const normalized = normalizeEmail(email)
    const expiresAt = Date.now() + CODE_TTL_MS
    writeState({
      email: normalized,
      expiresAt,
    })
  },

  getRemainingSeconds(email) {
    const state = readState()
    const normalized = normalizeEmail(email)
    if (!state || state.email !== normalized) return 0
    const remaining = Math.ceil((state.expiresAt - Date.now()) / 1000)
    return Math.max(0, remaining)
  },

  clear() {
    clearState()
  },
}
