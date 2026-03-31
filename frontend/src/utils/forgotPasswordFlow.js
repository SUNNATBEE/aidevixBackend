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

  createCode(email) {
    const normalized = normalizeEmail(email)
    const code = String(Math.floor(1000 + Math.random() * 9000))
    const expiresAt = Date.now() + CODE_TTL_MS
    const resetToken = `${normalized}:${Date.now()}:${Math.random().toString(36).slice(2, 10)}`

    writeState({
      email: normalized,
      code,
      expiresAt,
      resetToken,
      verified: false,
    })

    // Development helper for local-only flow
    console.info('[ForgotPassword] Verification code:', code)
    return { code, expiresAt }
  },

  getRemainingSeconds(email) {
    const state = readState()
    const normalized = normalizeEmail(email)
    if (!state || state.email !== normalized) return 0
    const remaining = Math.ceil((state.expiresAt - Date.now()) / 1000)
    return Math.max(0, remaining)
  },

  verifyCode(email, code) {
    const state = readState()
    const normalized = normalizeEmail(email)
    const cleanCode = String(code || '').trim()

    if (!state || state.email !== normalized) {
      throw new Error('Email uchun aktiv kod topilmadi.')
    }
    if (Date.now() > state.expiresAt) {
      clearState()
      throw new Error('Kod muddati tugagan. Qayta kod yuboring.')
    }
    if (state.code !== cleanCode) {
      throw new Error("Kod noto'g'ri.")
    }

    const updated = { ...state, verified: true }
    writeState(updated)
    return { resetToken: updated.resetToken }
  },

  canReset(email, resetToken) {
    const state = readState()
    const normalized = normalizeEmail(email)
    return Boolean(
      state &&
      state.email === normalized &&
      state.verified &&
      state.resetToken === resetToken &&
      Date.now() <= state.expiresAt,
    )
  },

  completeReset(email, resetToken) {
    if (!this.canReset(email, resetToken)) {
      throw new Error('Reset token yaroqsiz yoki muddati tugagan.')
    }
    clearState()
  },
}
