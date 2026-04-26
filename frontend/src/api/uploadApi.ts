import axiosInstance from './axiosInstance'

export const uploadApi = {
  uploadAvatar: async (file) => {
    const formData = new FormData()
    formData.append('avatar', file)

    // Do not set Content-Type manually for FormData.
    // Browser/XHR will add the correct multipart boundary automatically.
    return axiosInstance.post('upload/avatar', formData)
  },
}

