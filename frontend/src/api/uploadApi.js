import axiosInstance from './axiosInstance'

export const uploadApi = {
  uploadAvatar: async (file) => {
    const formData = new FormData()
    formData.append('avatar', file)

    // axiosInstance default Content-Type: application/json bo'lgani uchun, uni olib tashlaymiz.
    return axiosInstance.post('/upload/avatar', formData, {
      headers: { 'Content-Type': undefined },
    })
  },
}

