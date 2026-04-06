import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { videoApi } from '@api/videoApi'

// ─── Async Thunks ─────────────────────────────────────────────

export const fetchCourseVideos = createAsyncThunk(
  'videos/fetchByCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const { data } = await videoApi.getByCourse(courseId)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  },
)

export const fetchVideo = createAsyncThunk(
  'videos/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await videoApi.getById(id)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data)
    }
  },
)

export const fetchTopVideos = createAsyncThunk(
  'videos/fetchTop',
  async (limit, { rejectWithValue }) => {
    try {
      const { data } = await videoApi.getTop(limit)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  },
)

export const rateVideo = createAsyncThunk(
  'videos/rate',
  async ({ id, rating }, { rejectWithValue }) => {
    try {
      const { data } = await videoApi.rate(id, rating)
      return { id, rating: data.data }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  },
)

export const useVideoLink = createAsyncThunk(
  'videos/useLink',
  async (linkId, { rejectWithValue }) => {
    try {
      const { data } = await videoApi.useLink(linkId)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  },
)

// ─── Slice ────────────────────────────────────────────────────

const initialState = {
  courseVideos: [],
  topVideos:    [],
  current:      null,
  videoLink:    null,
  loading:      false,
  linkLoading:  false,
  error:        null,
  ratings:      {},   // { [videoId]: { average, count, userRating } }
}

const videoSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    clearCurrentVideo: (state) => {
      state.current   = null
      state.videoLink = null
      state.error     = null
    },
    clearVideoError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseVideos.pending,   (state) => { state.loading = true })
      .addCase(fetchCourseVideos.fulfilled, (state, action) => {
        state.loading      = false
        state.courseVideos = action.payload.videos || action.payload
      })
      .addCase(fetchCourseVideos.rejected,  (state, action) => {
        state.loading = false; state.error = action.payload
      })

      .addCase(fetchVideo.pending,   (state) => { state.loading = true; state.error = null })
      .addCase(fetchVideo.fulfilled, (state, action) => {
        state.loading   = false
        state.current   = action.payload.video
        state.videoLink = action.payload.videoLink
      })
      .addCase(fetchVideo.rejected,  (state, action) => {
        state.loading = false; state.error = action.payload
      })

      .addCase(fetchTopVideos.fulfilled, (state, action) => {
        state.topVideos = action.payload.videos || action.payload
      })

      .addCase(rateVideo.fulfilled, (state, action) => {
        const { id, rating } = action.payload
        state.ratings[id] = rating
      })

      .addCase(useVideoLink.pending,   (state) => { state.linkLoading = true })
      .addCase(useVideoLink.fulfilled, (state) => { state.linkLoading = false })
      .addCase(useVideoLink.rejected,  (state) => { state.linkLoading = false })
  },
})

export const { clearCurrentVideo, clearVideoError } = videoSlice.actions
export default videoSlice.reducer

// Selectors
export const selectCourseVideos = (state) => state.videos.courseVideos
export const selectTopVideos    = (state) => state.videos.topVideos
export const selectCurrentVideo = (state) => state.videos.current
export const selectVideoLink    = (state) => state.videos.videoLink
export const selectVideoLoading = (state) => state.videos.loading
export const selectVideoError   = (state) => state.videos.error
export const selectRatings      = (state) => state.videos.ratings
