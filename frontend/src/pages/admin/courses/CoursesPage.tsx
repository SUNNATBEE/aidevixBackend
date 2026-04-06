import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAllCourses, deleteCourse } from '@api/adminApi'
import { CATEGORIES } from '@utils/constants'

const LEVEL_BADGE = { beginner: 'badge-info', intermediate: 'badge-warning', advanced: 'badge-error' }
const LEVEL_LABEL = { beginner: 'Boshlang\'ich', intermediate: 'O\'rta', advanced: 'Murakkab' }

export default function CoursesPage() {
  const navigate = useRouter()
  const [courses,   setCourses]   = useState([])
  const [total,     setTotal]     = useState(0)
  const [page,      setPage]      = useState(1)
  const [search,    setSearch]    = useState('')
  const [category,  setCategory]  = useState('')
  const [loading,   setLoading]   = useState(true)
  const [deleting,  setDeleting]  = useState(null)
  const limit = 12

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const res = await getAllCourses({ page, limit, search: search || undefined, category: category || undefined })
      const d = res.data.data
      setCourses(d?.courses || d || [])
      setTotal(d?.total ?? 0)
    } catch {
      setCourses([])
    } finally {
      setLoading(false)
    }
  }, [page, search, category])

  useEffect(() => { load() }, [load])

  // Reset to page 1 on filter change
  useEffect(() => { setPage(1) }, [search, category])

  const handleDelete = async (course) => {
    if (!window.confirm(`"${course.title}" kursini o'chirasizmi?`)) return
    setDeleting(course._id)
    try {
      await deleteCourse(course._id)
      load()
    } finally {
      setDeleting(null)
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Kurslar</h2>
          <p className="text-base-content/50 text-sm mt-0.5">Jami {total} ta kurs</p>
        </div>
        <Link href="/admin/courses/new" className="btn btn-primary btn-sm gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yangi kurs
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text" placeholder="Kurs qidirish..."
          className="input input-bordered input-sm w-60"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <select
          className="select select-bordered select-sm w-44"
          value={category} onChange={e => setCategory(e.target.value)}
        >
          <option value="">Barcha kategoriyalar</option>
          {CATEGORIES.filter(c => c.id !== 'all').map(c => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card bg-base-200 border border-base-300 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <span className="loading loading-spinner loading-md text-primary" />
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-base-content/40">
            <span className="text-4xl mb-2">📭</span>
            <p>Kurs topilmadi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead className="bg-base-300/50">
                <tr>
                  <th className="w-8">#</th>
                  <th>Kurs nomi</th>
                  <th>Kategoriya</th>
                  <th>Daraja</th>
                  <th>Narx</th>
                  <th>Videolar</th>
                  <th>Yozilishlar</th>
                  <th className="text-right">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c, i) => {
                  const cat = CATEGORIES.find(x => x.id === c.category)
                  return (
                    <tr key={c._id} className="hover">
                      <td className="text-base-content/40 text-xs">{(page - 1) * limit + i + 1}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          {c.thumbnail ? (
                            <img src={c.thumbnail} alt="" className="w-10 h-7 object-cover rounded" />
                          ) : (
                            <div className="w-10 h-7 bg-base-300 rounded flex items-center justify-center text-base-content/30 text-xs">📚</div>
                          )}
                          <div>
                            <p className="font-medium text-sm leading-tight">{c.title}</p>
                            {c.instructor && <p className="text-xs text-base-content/40">{typeof c.instructor === 'object' ? c.instructor.username : c.instructor}</p>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-sm">{cat?.icon} {cat?.label || c.category}</span>
                      </td>
                      <td>
                        <div className={`badge badge-sm ${LEVEL_BADGE[c.level] || 'badge-ghost'}`}>
                          {LEVEL_LABEL[c.level] || c.level || '—'}
                        </div>
                      </td>
                      <td className="font-medium text-sm">
                        {c.price ? new Intl.NumberFormat('uz-UZ').format(c.price) + ' UZS' : <span className="badge badge-success badge-sm">Bepul</span>}
                      </td>
                      <td className="text-center">
                        <span className="badge badge-ghost badge-sm">{c.videosCount ?? c.videos?.length ?? '—'}</span>
                      </td>
                      <td className="text-center">
                        <span className="text-sm">{c.enrollmentsCount ?? '—'}</span>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => router.push(`/admin/courses/${c._id}/edit`)}
                            className="btn btn-ghost btn-xs"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(c)}
                            disabled={deleting === c._id}
                            className="btn btn-ghost btn-xs text-error"
                          >
                            {deleting === c._id
                              ? <span className="loading loading-spinner loading-xs" />
                              : '🗑️'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button className="btn btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i} onClick={() => setPage(i + 1)}
              className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-ghost'}`}
            >{i + 1}</button>
          ))}
          <button className="btn btn-sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
        </div>
      )}
    </div>
  )
}
