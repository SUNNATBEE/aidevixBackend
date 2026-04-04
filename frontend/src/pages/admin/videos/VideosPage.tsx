import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link';
import { getAllCourses, getCourseVideos, deleteVideo, getVideoStatus } from '@api/adminApi'

const STATUS_BADGE = {
  ready:      'badge-success',
  processing: 'badge-warning',
  pending:    'badge-ghost',
  failed:     'badge-error',
}
const STATUS_LABEL = {
  ready:      '✅ Tayyor',
  processing: '⏳ Jarayonda',
  pending:    '🕐 Kutmoqda',
  failed:     '❌ Xato',
}

export default function VideosPage() {
  const [courses,    setCourses]    = useState([])
  const [courseId,   setCourseId]   = useState('')
  const [videos,     setVideos]     = useState([])
  const [loading,    setLoading]    = useState(false)
  const [deleting,   setDeleting]   = useState(null)
  const [refreshing, setRefreshing] = useState(null)

  // Load course list for filter
  useEffect(() => {
    getAllCourses({ limit: 100 })
      .then(res => {
        const d = res.data.data
        setCourses(d?.courses || d || [])
      })
      .catch(() => {})
  }, [])

  const loadVideos = useCallback(async () => {
    if (!courseId) { setVideos([]); return }
    setLoading(true)
    try {
      const res = await getCourseVideos(courseId)
      const d   = res.data.data
      setVideos(Array.isArray(d) ? d : d?.videos || [])
    } catch {
      setVideos([])
    } finally {
      setLoading(false)
    }
  }, [courseId])

  useEffect(() => { loadVideos() }, [loadVideos])

  const handleDelete = async (video) => {
    if (!window.confirm(`"${video.title}" videoni o'chirasizmi?`)) return
    setDeleting(video._id)
    try {
      await deleteVideo(video._id)
      loadVideos()
    } finally {
      setDeleting(null)
    }
  }

  const handleRefreshStatus = async (video) => {
    setRefreshing(video._id)
    try {
      await getVideoStatus(video._id)
      loadVideos()
    } finally {
      setRefreshing(null)
    }
  }

  const formatDuration = (s) => {
    if (!s) return '—'
    const m = Math.floor(s / 60)
    const ss = s % 60
    return `${m}:${String(ss).padStart(2, '0')}`
  }

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Videolar</h2>
          <p className="text-base-content/50 text-sm mt-0.5">Kurs bo'yicha videolarni boshqaring</p>
        </div>
        <Link href="/admin/videos/upload" className="btn btn-primary btn-sm gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Video yuklash
        </Link>
      </div>

      {/* Course selector */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-base-content/70">Kurs:</label>
        <select
          className="select select-bordered select-sm w-72"
          value={courseId} onChange={e => setCourseId(e.target.value)}
        >
          <option value="">— Kursni tanlang —</option>
          {courses.map(c => (
            <option key={c._id} value={c._id}>{c.title}</option>
          ))}
        </select>
        {courseId && (
          <button onClick={loadVideos} className="btn btn-ghost btn-sm btn-square" title="Yangilash">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>

      {/* Empty state (no course selected) */}
      {!courseId && (
        <div className="card bg-base-200 border border-base-300">
          <div className="flex flex-col items-center justify-center h-48 text-base-content/40">
            <span className="text-4xl mb-2">🎬</span>
            <p>Kursni tanlang</p>
          </div>
        </div>
      )}

      {/* Table */}
      {courseId && (
        <div className="card bg-base-200 border border-base-300 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <span className="loading loading-spinner loading-md text-primary" />
            </div>
          ) : videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-base-content/40">
              <span className="text-4xl mb-2">📭</span>
              <p>Bu kursda video yo'q</p>
              <Link href="/admin/videos/upload" className="btn btn-primary btn-sm mt-3">Video yuklash</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead className="bg-base-300/50">
                  <tr>
                    <th>Tartib</th>
                    <th>Video nomi</th>
                    <th>Bunny ID</th>
                    <th>Status</th>
                    <th>Davomiyligi</th>
                    <th className="text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {videos
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map(v => (
                      <tr key={v._id} className="hover">
                        <td>
                          <span className="badge badge-ghost badge-sm">{v.order ?? '—'}</span>
                        </td>
                        <td>
                          <div>
                            <p className="font-medium text-sm">{v.title}</p>
                            {v.description && (
                              <p className="text-xs text-base-content/40 truncate max-w-[220px]">{v.description}</p>
                            )}
                          </div>
                        </td>
                        <td>
                          {v.bunnyVideoId
                            ? <code className="text-xs bg-base-300 px-1.5 py-0.5 rounded">{v.bunnyVideoId.slice(0, 8)}…</code>
                            : <span className="text-base-content/30 text-xs">—</span>}
                        </td>
                        <td>
                          <div className={`badge badge-sm ${STATUS_BADGE[v.bunnyStatus] || 'badge-ghost'}`}>
                            {STATUS_LABEL[v.bunnyStatus] || v.bunnyStatus || 'pending'}
                          </div>
                        </td>
                        <td className="text-sm">{formatDuration(v.duration)}</td>
                        <td>
                          <div className="flex items-center justify-end gap-1">
                            {v.bunnyVideoId && v.bunnyStatus !== 'ready' && (
                              <button
                                onClick={() => handleRefreshStatus(v)}
                                disabled={refreshing === v._id}
                                className="btn btn-ghost btn-xs"
                                title="Statusni yangilash"
                              >
                                {refreshing === v._id
                                  ? <span className="loading loading-spinner loading-xs" />
                                  : '🔄'}
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(v)}
                              disabled={deleting === v._id}
                              className="btn btn-ghost btn-xs text-error"
                            >
                              {deleting === v._id
                                ? <span className="loading loading-spinner loading-xs" />
                                : '🗑️'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
