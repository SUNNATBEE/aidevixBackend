import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authApi } from '@api/authApi'
import { tokenStorage } from '@utils/tokenStorage'

// ─── Async Thunks ─────────────────────────────────────────────

export const register = createAsyncThunk(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await authApi.register(credentials)
      tokenStorage.setTokens(data.data.accessToken, data.data.refreshToken)
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
      tokenStorage.setTokens(data.data.accessToken, data.data.refreshToken)
      tokenStorage.setUser(data.data.user)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login yoki parol xato')
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
    const token = tokenStorage.getAccess()
    const user  = tokenStorage.getUser()
    if (!token || !user) return rejectWithValue('No token')
    return { user, accessToken: token }
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
      state.user = { ...state.user, ...action.payload }
      tokenStorage.setUser(state.user)
    },
  },
  extraReducers: (builder) => {
    const pending   = (state) => { state.loading = true; state.error = null }
    const rejected  = (state, action) => { state.loading = false; state.error = action.payload }
    const fulfilled = (state, action) => {
      state.loading   = false
      state.user      = action.payload.user
      state.isLoggedIn = true
    }

    builder
      .addCase(register.pending,         pending)
      .addCase(register.fulfilled,       fulfilled)
      .addCase(register.rejected,        rejected)

      .addCase(login.pending,            pending)
      .addCase(login.fulfilled,          fulfilled)
      .addCase(login.rejected,           rejected)

      .addCase(logout.fulfilled,         (state) => {
        state.user = null; state.isLoggedIn = false
      })

      .addCase(checkAuthStatus.fulfilled, fulfilled)
      .addCase(checkAuthStatus.rejected,  (state) => {
        state.user = null; state.isLoggedIn = false
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
