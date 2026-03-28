// ╔══════════════════════════════════════════════════════════════╗
// ║  rankingApi.js                                               ║
// ║  NUMTON  → getTopCourses()                                   ║
// ║  SUHROB  → getTopUsers()                                     ║
// ╚══════════════════════════════════════════════════════════════╝
import axiosInstance from './axiosInstance'

export const rankingApi = {
  /**
   * NUMTON ishlatadi — TopCoursesPage.jsx
   * Eng ko'p ko'rilgan kurslar ro'yxati
   * @param {object} params - { limit?: number, category?: string }
   */
  getTopCourses: (params = {}) =>
    axiosInstance.get('/ranking/courses', { params }),

  /**
   * SUHROB ishlatadi — LeaderboardPage.jsx
   * XP bo'yicha tartiblangan foydalanuvchilar
   * @param {object} params - { page?: number, limit?: number }
   */
  getTopUsers: (params = {}) =>
    axiosInstance.get('/ranking/users', { params }),

  /**
   * SUHROB ishlatadi — foydalanuvchi reyting pozitsiyasi
   * @param {string} userId
   */
  getUserPosition: (userId) =>
    axiosInstance.get(`/ranking/users/${userId}/position`),
}
