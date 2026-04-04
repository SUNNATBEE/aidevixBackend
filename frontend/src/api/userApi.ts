// ╔══════════════════════════════════════════════════════════════╗
// ║  userApi.js — XP, Stats, Profile update                     ║
// ║  FIRDAVS  → getUserProfile(), updateUserProfile()            ║
// ║  SUHROB   → getUserStats(), submitQuiz(), getQuizByVideo()   ║
// ║  ABDUVORIS→ addVideoWatchXP()                                ║
// ╚══════════════════════════════════════════════════════════════╝
import axiosInstance from './axiosInstance'

export const userApi = {
  /**
   * FIRDAVS — ProfilePage.jsx
   * Hozirgi login qilgan foydalanuvchi ma'lumotlari
   */
  getMe: () =>
    axiosInstance.get('auth/me'),

  /**
   * SUHROB — LeaderboardPage, ProfilePage
   * Foydalanuvchi XP, level, streak statistikasi
   */
  getUserStats: () =>
    axiosInstance.get('xp/stats'),

  /**
   * ABDUVORIS — Video tugaganida chaqiriladi (+50 XP)
   * @param {string} videoId
   */
  addVideoWatchXP: (videoId) =>
    axiosInstance.post(`xp/video-watched/${videoId}`),

  /**
   * SUHROB — VideoPlaygroundPage quiz qismida
   * @param {string} videoId
   */
  getQuizByVideo: (videoId) =>
    axiosInstance.get(`xp/quiz/video/${videoId}`),

  /**
   * SUHROB — Quiz javoblarini yuborish
   * @param {string} quizId
   * @param {Array} answers - [{questionIndex, selectedOption}]
   */
  submitQuiz: (quizId, answers) =>
    axiosInstance.post(`xp/quiz/${quizId}`, { answers }),

  /**
   * FIRDAVS — ProfilePage edit
   * @param {object} data - { bio, skills, avatar }
   */
  updateProfile: (data) =>
    axiosInstance.put('xp/profile', data),
}
