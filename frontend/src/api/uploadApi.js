import axiosInstance from './axiosInstance'

export const uploadApi = {
  uploadAvatar: async (file) => {
    const formData = new FormData()
    formData.append('avatar', file)

    // axiosInstance default Content-Type: application/json bo'lgani uchun,
    // multipart/form-data uchun axios o'zi to'g'ri boundary qo'shadi.
    return axiosInstance.post('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

