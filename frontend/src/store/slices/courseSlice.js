import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { courseApi } from '@api/courseApi'

// ─── Async Thunks ─────────────────────────────────────────────

export const fetchCourses = createAsyncThunk(
  'courses/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await courseApi.getAll(params)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Kurslarni yuklashda xato')
    }
  },
)

export const fetchCourseById = createAsyncThunk(
  'courses/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await courseApi.getById(id)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Kursni yuklashda xato')
    }
  },
)

export const fetchTopCourses = createAsyncThunk(
  'courses/fetchTop',
  async (limit, { rejectWithValue }) => {
    try {
      const { data } = await courseApi.getTop(limit)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  },
)

// ─── Slice ────────────────────────────────────────────────────

const initialState = {
  list:           [],
  topCourses:     [],
  current:        null,
  total:          0,
  loading:        false,
  error:          null,
  filters: {
    category:     'all',
    search:       '',
    sort:         'newest',
    page:         1,
  },
}

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 }
    },
    setPage: (state, action) => {
      state.filters.page = action.payload
    },
    clearCurrent: (state) => {
      state.current = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending,  (state) => { state.loading = true; state.error = null })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false
        state.list    = action.payload.courses || action.payload
        state.total   = action.payload.total || action.payload.length
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false; state.error = action.payload
      })

      .addCase(fetchCourseById.pending,  (state) => { state.loading = true })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false; state.current = action.payload.course || action.payload
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false; state.error = action.payload
      })

      .addCase(fetchTopCourses.fulfilled, (state, action) => {
        state.topCourses = action.payload.courses || action.payload
      })
  },
})

export const { setFilter, setPage, clearCurrent } = courseSlice.actions
export default courseSlice.reducer

// Selectors
export const selectCourses    = (state) => state.courses.list
export const selectTopCourses = (state) => state.courses.topCourses
export const selectCurrent    = (state) => state.courses.current
export const selectFilters    = (state) => state.courses.filters
export const selectCoursesLoading = (state) => state.courses.loading
