// ╔══════════════════════════════════════════════════════════════╗
// ║  useRanking.js                                               ║
// ║  NUMTON  → useTopCourses()                                   ║
// ║  SUHROB  → useTopUsers()                                     ║
// ╚══════════════════════════════════════════════════════════════╝
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchTopCourses,
  fetchTopUsers,
  selectTopCourses,
  selectCoursesLoading,
  selectTopUsers,
  selectUsersLoading,
  selectUsersPagination,
} from '@store/slices/rankingSlice'

/**
 * NUMTON ishlatadi — TopCoursesPage.jsx
 * @param {object} params - { limit, category }
 */
export const useTopCourses = (params = {}) => {
  const dispatch = useDispatch()
  const courses = useSelector(selectTopCourses)
  const loading = useSelector(selectCoursesLoading)

  useEffect(() => {
    dispatch(fetchTopCourses(params))
  }, [dispatch, params.category, params.limit])

  return { courses, loading }
}

/**
 * SUHROB ishlatadi — LeaderboardPage.jsx
 * @param {object} params - { page, limit }
 */
export const useTopUsers = (params = {}) => {
  const dispatch = useDispatch()
  const users = useSelector(selectTopUsers)
  const loading = useSelector(selectUsersLoading)
  const pagination = useSelector(selectUsersPagination)

  useEffect(() => {
    dispatch(fetchTopUsers(params))
  }, [dispatch, params.page, params.limit])

  const loadMore = (page) => dispatch(fetchTopUsers({ ...params, page }))

  return { users, loading, pagination, loadMore }
}
