// ╔══════════════════════════════════════════════════════════════╗
// ║  userStatsSlice.js                                           ║
// ║  SUHROB  → XP, level, streak state                          ║
// ║  FIRDAVS → bio, skills, avatar state (ProfilePage)          ║
// ╚══════════════════════════════════════════════════════════════╝
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userApi } from '@api/userApi'
import { updateUser } from './authSlice'

export const fetchUserStats = createAsyncThunk(
  'userStats/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await userApi.getUserStats()
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Stats yuklanmadi')
    }
  },
)

export const submitQuizThunk = createAsyncThunk(
  'userStats/submitQuiz',
  async ({ quizId, answers }, { rejectWithValue }) => {
    try {
      const { data } = await userApi.submitQuiz(quizId, answers)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Quiz yuborishda xato')
    }
  },
)

export const updateProfileThunk = createAsyncThunk(
  'userStats/updateProfile',
  async (profileData, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await userApi.updateProfile(profileData)
      if (data.data.user) {
        dispatch(updateUser(data.data.user))
      }
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Profil yangilanmadi')
    }
  },
)

const userStatsSlice = createSlice({
  name: 'userStats',
  initialState: {
    xp: 0,
    level: 1,
    levelProgress: 0,
    xpToNextLevel: 1000,
    streak: 0,
    lastActivityDate: null,
    badges: [],
    videosWatched: 0,
    quizzesCompleted: 0,
    bio: '',
    skills: [],
    avatar: null,
    loading: false,
    error: null,
    // Level-up modal uchun
    justLeveledUp: false,
    newLevel: null,
    // Quiz natijasi
    quizResult: null,
  },
  reducers: {
    clearLevelUp: (state) => {
      state.justLeveledUp = false
      state.newLevel = null
    },
    clearQuizResult: (state) => {
      state.quizResult = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch stats
      .addCase(fetchUserStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading = false
        Object.assign(state, action.payload)
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Submit Quiz
      .addCase(submitQuizThunk.fulfilled, (state, action) => {
        const prev = state.level
        state.xp = action.payload.totalXp
        state.level = action.payload.level
        state.levelProgress = action.payload.levelProgress
        state.quizResult = action.payload
        // Level UP bo'ldimi?
        if (action.payload.level > prev) {
          state.justLeveledUp = true
          state.newLevel = action.payload.level
        }
      })

      // Update Profile
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.bio = action.payload.bio
        state.skills = action.payload.skills
        state.avatar = action.payload.avatar
      })
  },
})

export const { clearLevelUp, clearQuizResult } = userStatsSlice.actions
export default userStatsSlice.reducer

export const selectUserStats = (state) => state.userStats
export const selectXP = (state) => state.userStats.xp
export const selectLevel = (state) => state.userStats.level
export const selectStreak = (state) => state.userStats.streak
export const selectJustLeveledUp = (state) => state.userStats.justLeveledUp
export const selectQuizResult = (state) => state.userStats.quizResult
