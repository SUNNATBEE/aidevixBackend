import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectCourseVideos, selectTopVideos, selectCurrentVideo,
  selectVideoLink, selectVideoLoading, selectVideoError,
  fetchCourseVideos, fetchVideo, fetchTopVideos, clearCurrentVideo,
} from '@store/slices/videoSlice'

export function useVideos() {
  const dispatch = useDispatch()

  return {
    courseVideos:  useSelector(selectCourseVideos),
    topVideos:     useSelector(selectTopVideos),
    current:       useSelector(selectCurrentVideo),
    videoLink:     useSelector(selectVideoLink),
    loading:       useSelector(selectVideoLoading),
    error:         useSelector(selectVideoError),

    fetchByCourse: (courseId) => dispatch(fetchCourseVideos(courseId)),
    fetchById:     (id)       => dispatch(fetchVideo(id)),
    fetchTop:      (limit)    => dispatch(fetchTopVideos(limit)),
    clearCurrent:  ()         => dispatch(clearCurrentVideo()),
  }
}

export function useVideo(id) {
  const { current, videoLink, loading, error, fetchById, clearCurrent } = useVideos()

  useEffect(() => {
    if (id) fetchById(id)
    return () => clearCurrent()
  }, [id])

  return { video: current, videoLink, loading, error }
}
