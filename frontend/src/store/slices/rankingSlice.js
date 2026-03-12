// ╔══════════════════════════════════════════════════════════════╗
// ║  rankingSlice.js                                             ║
// ║  NUMTON  → topCourses state                                  ║
// ║  SUHROB  → topUsers state                                    ║
// ╚══════════════════════════════════════════════════════════════╝
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { rankingApi } from '@api/rankingApi'

// ─── Async Thunks ─────────────────────────────────────────────

/**
 * NUMTON ishlatadi — TopCoursesPage.jsx
 */
export const fetchTopCourses = createAsyncThunk(
  'ranking/fetchTopCourses',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await rankingApi.getTopCourses(params)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Xato yuz berdi')
    }
  },
)

/**
 * SUHROB ishlatadi — LeaderboardPage.jsx
 */
export const fetchTopUsers = createAsyncThunk(
  'ranking/fetchTopUsers',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await rankingApi.getTopUsers(params)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Xato yuz berdi')
    }
  },
)

// ─── Slice ────────────────────────────────────────────────────

const rankingSlice = createSlice({
  name: 'ranking',
  initialState: {
    // NUMTON uchun
    topCourses: [],
    coursesTotal: 0,
    coursesLoading: false,
    coursesError: null,

    // SUHROB uchun
    topUsers: [],
    usersPagination: null,
    usersLoading: false,
    usersError: null,
  },
  reducers: {
    clearRankingErrors: (state) => {
      state.coursesError = null
      state.usersError = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Top Courses
      .addCase(fetchTopCourses.pending, (state) => {
        state.coursesLoading = true
        state.coursesError = null
      })
      .addCase(fetchTopCourses.fulfilled, (state, action) => {
        state.coursesLoading = false
        state.topCourses = action.payload.courses
        state.coursesTotal = action.payload.total
      })
      .addCase(fetchTopCourses.rejected, (state, action) => {
        state.coursesLoading = false
        state.coursesError = action.payload
      })

      // Top Users
      .addCase(fetchTopUsers.pending, (state) => {
        state.usersLoading = true
        state.usersError = null
      })
      .addCase(fetchTopUsers.fulfilled, (state, action) => {
        state.usersLoading = false
        state.topUsers = action.payload.users
        state.usersPagination = action.payload.pagination
      })
      .addCase(fetchTopUsers.rejected, (state, action) => {
        state.usersLoading = false
        state.usersError = action.payload
      })
  },
})

export const { clearRankingErrors } = rankingSlice.actions
export default rankingSlice.reducer

// ─── Selectors ────────────────────────────────────────────────
export const selectTopCourses = (state) => state.ranking.topCourses
export const selectCoursesLoading = (state) => state.ranking.coursesLoading
export const selectTopUsers = (state) => state.ranking.topUsers
export const selectUsersLoading = (state) => state.ranking.usersLoading
export const selectUsersPagination = (state) => state.ranking.usersPagination
