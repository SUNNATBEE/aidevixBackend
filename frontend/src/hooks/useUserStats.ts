// ╔══════════════════════════════════════════════════════════════╗
// ║  useUserStats.js                                             ║
// ║  SUHROB  → XP, level, streak ma'lumotlari                   ║
// ║  FIRDAVS → ProfilePage uchun ham ishlatiladi                 ║
// ╚══════════════════════════════════════════════════════════════╝
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchUserStats,
  submitQuizThunk,
  updateProfileThunk,
  clearLevelUp,
  clearQuizResult,
  selectUserStats,
  selectJustLeveledUp,
  selectQuizResult,
} from '@store/slices/userStatsSlice'
import { selectIsLoggedIn } from '@store/slices/authSlice'

export const useUserStats = () => {
  const dispatch = useDispatch()
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const stats = useSelector(selectUserStats)
  const justLeveledUp = useSelector(selectJustLeveledUp)
  const quizResult = useSelector(selectQuizResult)

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUserStats())
    }
  }, [dispatch, isLoggedIn])

  const submitQuiz = (quizId, answers) =>
    dispatch(submitQuizThunk({ quizId, answers }))

  const updateProfile = (data) =>
    dispatch(updateProfileThunk(data))

  const dismissLevelUp = () => dispatch(clearLevelUp())
  const dismissQuizResult = () => dispatch(clearQuizResult())

  return {
    ...stats,
    justLeveledUp,
    quizResult,
    submitQuiz,
    updateProfile,
    dismissLevelUp,
    dismissQuizResult,
  }
}
