import axiosInstance from './axiosInstance'

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const getDashboardStats  = ()       => axiosInstance.get('/admin/stats')
export const getTopStudents     = ()       => axiosInstance.get('/admin/top-students')
export const getCoursesStats    = ()       => axiosInstance.get('/admin/courses/stats')
export const getRecentPayments  = (params) => axiosInstance.get('/admin/payments', { params })

// ─── Users ────────────────────────────────────────────────────────────────────
export const getUsers    = (params)      => axiosInstance.get('/admin/users', { params })
export const updateUser  = (id, data)    => axiosInstance.put(`/admin/users/${id}`, data)
export const deleteUser  = (id)          => axiosInstance.delete(`/admin/users/${id}`)

// ─── Courses ─────────────────────────────────────────────────────────────────
export const getAllCourses  = (params)   => axiosInstance.get('/courses', { params })
export const getCourseById = (id)        => axiosInstance.get(`/courses/${id}`)
export const createCourse  = (data)      => axiosInstance.post('/courses', data)
export const updateCourse  = (id, data)  => axiosInstance.put(`/courses/${id}`, data)
export const deleteCourse  = (id)        => axiosInstance.delete(`/courses/${id}`)

// ─── Videos ──────────────────────────────────────────────────────────────────
export const getCourseVideos       = (courseId)          => axiosInstance.get(`/videos/course/${courseId}`)
export const createVideo           = (data)              => axiosInstance.post('/videos', data)
export const updateVideo           = (id, data)          => axiosInstance.put(`/videos/${id}`, data)
export const deleteVideo           = (id)                => axiosInstance.delete(`/videos/${id}`)
export const getUploadCredentials  = (id)                => axiosInstance.get(`/videos/${id}/upload-credentials`)
export const getVideoStatus        = (id)                => axiosInstance.get(`/videos/${id}/status`)
export const linkVideoToBunny      = (id, bunnyVideoId)  => axiosInstance.patch(`/videos/${id}/link-bunny`, { bunnyVideoId })
