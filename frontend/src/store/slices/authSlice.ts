import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authApi } from '@api/authApi'
import { tokenStorage } from '@utils/tokenStorage'

// ─── Async Thunks ─────────────────────────────────────────────

export const register = createAsyncThunk(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await authApi.register(credentials)
      tokenStorage.clearTokens()
      tokenStorage.setUser(data.data.user)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Ro\'yxatdan o\'tishda xato')
    }
  },
)

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await authApi.login(credentials)
      tokenStorage.clearTokens()
      tokenStorage.setUser(data.data.user)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login yoki parol xato')
    }
  },
)

export const googleAuth = createAsyncThunk(
  'auth/googleAuth',
  async (payload: { credential: string }, { rejectWithValue }) => {
    try {
      const { data } = await authApi.googleAuth(payload)
      tokenStorage.clearTokens()
      tokenStorage.setUser(data.data.user)
      return data.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Google orqali kirish amalga oshmadi')
    }
  },
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout()
    } catch {
      // Logout always clears local tokens even if API fails
    } finally {
      tokenStorage.clearTokens()
    }
  },
)

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await authApi.getMe()
      tokenStorage.clearTokens()
      tokenStorage.setUser(data.data)
      return { user: data.data }
    } catch {
      return rejectWithValue('No active session')
    }
  },
)

// ─── Slice ────────────────────────────────────────────────────

const initialState = {
  user:        null,
  isLoggedIn:  false,
  loading:     false,
  error:       null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null },
    updateUser: (state, action) => {
      state.user = { ...(state.user || {}), ...action.payload }
    },
  },
  extraReducers: (builder) => {
    const pending   = (state) => { state.loading = true; state.error = null }
    const rejected  = (state, action) => { state.loading = false; state.error = action.payload }
    const clearSession = (state) => {
      state.user = null
      state.isLoggedIn = false
    }
    const registerFulfilled = (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.isLoggedIn = true
    }
    const fulfilled = (state, action) => {
      state.loading   = false
      state.user      = action.payload.user
      state.isLoggedIn = true
    }

    builder
      .addCase(register.pending,         pending)
      .addCase(register.fulfilled,       registerFulfilled)
      .addCase(register.rejected,        rejected)

      .addCase(login.pending,            pending)
      .addCase(login.fulfilled,          fulfilled)
      .addCase(login.rejected,           rejected)

      .addCase(googleAuth.pending,       pending)
      .addCase(googleAuth.fulfilled,     fulfilled)
      .addCase(googleAuth.rejected,      rejected)

      .addCase(logout.fulfilled,         (state) => {
        state.loading = false
        state.error = null
        clearSession(state)
      })

      .addCase(checkAuthStatus.pending,  pending)
      .addCase(checkAuthStatus.fulfilled, fulfilled)
      .addCase(checkAuthStatus.rejected,  (state) => {
        state.loading = false
        clearSession(state)
      })
  },
})

export const { clearError, updateUser } = authSlice.actions
export default authSlice.reducer

// ─── Selectors ────────────────────────────────────────────────
export const selectUser      = (state) => state.auth.user
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthError  = (state) => state.auth.error
export const selectIsAdmin    = (state) => state.auth.user?.role === 'admin'
