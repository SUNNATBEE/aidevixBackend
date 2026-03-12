import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectCourses, selectTopCourses, selectCurrent, selectFilters, selectCoursesLoading,
  fetchCourses, fetchCourseById, fetchTopCourses, setFilter, setPage, clearCurrent,
} from '@store/slices/courseSlice'

/** useCourses — hook for courses state + actions */
export function useCourses() {
  const dispatch = useDispatch()

  return {
    courses:    useSelector(selectCourses),
    topCourses: useSelector(selectTopCourses),
    current:    useSelector(selectCurrent),
    filters:    useSelector(selectFilters),
    loading:    useSelector(selectCoursesLoading),

    fetchAll:   (params) => dispatch(fetchCourses(params)),
    fetchById:  (id)     => dispatch(fetchCourseById(id)),
    fetchTop:   (limit)  => dispatch(fetchTopCourses(limit)),
    setFilter:  (filter) => dispatch(setFilter(filter)),
    setPage:    (page)   => dispatch(setPage(page)),
    clearCurrent: ()     => dispatch(clearCurrent()),
  }
}

/** useCourse — auto-fetch a single course by ID */
export function useCourse(id) {
  const { current, loading, fetchById, clearCurrent } = useCourses()

  useEffect(() => {
    if (id) fetchById(id)
    return () => clearCurrent()
  }, [id])

  return { course: current, loading }
}
