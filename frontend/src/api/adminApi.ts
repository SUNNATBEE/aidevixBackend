import axiosInstance from './axiosInstance'
import type { AxiosResponse } from 'axios'

/** Backend javobi: { success, data: T } */
export function unwrapAdmin<T>(res: AxiosResponse<{ success?: boolean; data: T }>): T {
  return res.data.data
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const getDashboardStats  = ()       => axiosInstance.get('admin/stats')
export const getTopStudents     = ()       => axiosInstance.get('admin/top-students')
export const getCoursesStats    = ()       => axiosInstance.get('admin/courses/stats')
export const getRecentPayments  = (params) => axiosInstance.get('admin/payments', { params })

// ─── Users ────────────────────────────────────────────────────────────────────
export const getUsers    = (params)      => axiosInstance.get('admin/users', { params })
export const updateUser  = (id, data)    => axiosInstance.put(`admin/users/${id}`, data)
export const deleteUser  = (id)          => axiosInstance.delete(`admin/users/${id}`)

// ─── Courses ─────────────────────────────────────────────────────────────────
export const getAllCourses  = (params)   => axiosInstance.get('courses', { params })
export const getCourseById = (id)        => axiosInstance.get(`courses/${id}`)
export const createCourse  = (data)      => axiosInstance.post('courses', data)
export const updateCourse  = (id, data)  => axiosInstance.put(`courses/${id}`, data)
export const deleteCourse  = (id)        => axiosInstance.delete(`courses/${id}`)

// ─── Videos ──────────────────────────────────────────────────────────────────
export const getCourseVideos       = (courseId)          => axiosInstance.get(`videos/course/${courseId}`)
export const createVideo           = (data)              => axiosInstance.post('videos', data)
export const updateVideo           = (id, data)          => axiosInstance.put(`videos/${id}`, data)
export const deleteVideo           = (id)                => axiosInstance.delete(`videos/${id}`)
export const getUploadCredentials  = (id)                => axiosInstance.get(`videos/${id}/upload-credentials`)
export const getVideoStatus        = (id)                => axiosInstance.get(`videos/${id}/status`)
export const linkVideoToBunny      = (id, bunnyVideoId)  => axiosInstance.patch(`videos/${id}/link-bunny`, { bunnyVideoId })

// ─── Users (detail) ──────────────────────────────────────────────────────────
export const getUserDetail = (id: string) => axiosInstance.get(`admin/users/${id}`)

// ─── Analytics ───────────────────────────────────────────────────────────────
export const getAnalytics = () => axiosInstance.get('admin/analytics')

// ─── Global search ───────────────────────────────────────────────────────────
export const globalSearch = (q: string) => axiosInstance.get('admin/search', { params: { q } })

// ─── Course enrollment stats ─────────────────────────────────────────────────
export const getCourseEnrollmentStats = (courseId: string) =>
  axiosInstance.get(`admin/courses/${courseId}/enrollments`)

// ─── Telegram ────────────────────────────────────────────────────────────────
export const sendTelegramMessage = (message: string, parseMode?: string) =>
  axiosInstance.post('admin/telegram', { message, parseMode })

// ─── Bulk Bunny GUID link ─────────────────────────────────────────────────────
export const bulkLinkBunny = (links: { videoId: string; bunnyVideoId: string }[]) =>
  axiosInstance.post('admin/videos/bulk-link', { links })

// ─── Reorder videos ──────────────────────────────────────────────────────────
export const reorderVideos = (videos: { id: string; order: number }[]) =>
  axiosInstance.put('admin/videos/reorder', { videos })

// ─── Thumbnail upload ─────────────────────────────────────────────────────────
export const uploadThumbnail = (courseId: string, file: File) => {
  const fd = new FormData()
  fd.append('thumbnail', file)
  return axiosInstance.post(`upload/thumbnail/${courseId}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

// ─── Challenges (admin) ─────────────────────────────────────────────────────
export const createDailyChallenge = (body: {
  title: string
  description?: string
  type: string
  targetCount?: number
  xpReward?: number
  date: string
}) => axiosInstance.post('challenges/admin', body)
