import { useEffect, useState, useCallback } from 'react'
import { getUsers, updateUser, deleteUser } from '@api/adminApi'

const ROLE_BADGE = { admin: 'badge-error', user: 'badge-ghost' }

export default function UsersPage() {
  const [users,    setUsers]    = useState([])
  const [total,    setTotal]    = useState(0)
  const [page,     setPage]     = useState(1)
  const [search,   setSearch]   = useState('')
  const [role,     setRole]     = useState('')
  const [loading,  setLoading]  = useState(true)
  const [editing,  setEditing]  = useState(null)   // { user, role }
  const [saving,   setSaving]   = useState(false)
  const [deleting, setDeleting] = useState(null)
  const limit = 15

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const res = await getUsers({ page, limit, search: search || undefined, role: role || undefined })
      const d = res.data.data
      setUsers(d?.users || d || [])
      setTotal(d?.total ?? 0)
    } catch {
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [page, search, role])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(1) }, [search, role])

  const handleSaveRole = async () => {
    if (!editing) return
    setSaving(true)
    try {
      await updateUser(editing.user._id, { role: editing.role })
      setEditing(null)
      load()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (user) => {
    if (!window.confirm(`"${user.username}" foydalanuvchini o'chirasizmi?`)) return
    setDeleting(user._id)
    try {
      await deleteUser(user._id)
      load()
    } finally {
      setDeleting(null)
    }
  }

  const totalPages = Math.ceil(total / limit)
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('uz-UZ') : '—'

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Foydalanuvchilar</h2>
        <p className="text-base-content/50 text-sm mt-0.5">Jami {total} ta foydalanuvchi</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text" placeholder="Qidirish (username / email)..."
          className="input input-bordered input-sm w-72"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <select
          className="select select-bordered select-sm w-36"
          value={role} onChange={e => setRole(e.target.value)}
        >
          <option value="">Barcha rollar</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div className="card bg-base-200 border border-base-300 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <span className="loading loading-spinner loading-md text-primary" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-base-content/40">
            <span className="text-4xl mb-2">👤</span>
            <p>Foydalanuvchi topilmadi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead className="bg-base-300/50">
                <tr>
                  <th>#</th>
                  <th>Foydalanuvchi</th>
                  <th>Rol</th>
                  <th>Telegram</th>
                  <th>Instagram</th>
                  <th>XP / Daraja</th>
                  <th>Ro'yxat sanasi</th>
                  <th className="text-right">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u._id} className="hover">
                    <td className="text-base-content/40 text-xs">{(page - 1) * limit + i + 1}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="avatar placeholder">
                          <div className="bg-primary/20 text-primary rounded-full w-8">
                            <span className="text-xs font-bold">{u.username?.[0]?.toUpperCase()}</span>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{u.username}</p>
                          <p className="text-xs text-base-content/40">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={`badge badge-sm ${ROLE_BADGE[u.role] || 'badge-ghost'}`}>
                        {u.role}
                      </div>
                    </td>
                    <td>
                      {u.socialSubscriptions?.telegram?.subscribed
                        ? <span className="badge badge-success badge-sm">✓</span>
                        : <span className="badge badge-ghost badge-sm">—</span>}
                    </td>
                    <td>
                      {u.socialSubscriptions?.instagram?.subscribed
                        ? <span className="badge badge-success badge-sm">✓</span>
                        : <span className="badge badge-ghost badge-sm">—</span>}
                    </td>
                    <td>
                      <span className="text-primary font-semibold text-sm">{u.xp ?? 0} XP</span>
                      <span className="text-xs text-base-content/40 ml-1">Lv{u.level ?? 1}</span>
                    </td>
                    <td className="text-sm text-base-content/60">{formatDate(u.createdAt)}</td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditing({ user: u, role: u.role })}
                          className="btn btn-ghost btn-xs"
                          title="Rolni o'zgartirish"
                        >✏️</button>
                        <button
                          onClick={() => handleDelete(u)}
                          disabled={deleting === u._id || u.role === 'admin'}
                          className="btn btn-ghost btn-xs text-error"
                          title={u.role === 'admin' ? 'Adminni o\'chirib bo\'lmaydi' : 'O\'chirish'}
                        >
                          {deleting === u._id
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button className="btn btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => (
            <button
              key={i} onClick={() => setPage(i + 1)}
              className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-ghost'}`}
            >{i + 1}</button>
          ))}
          <button className="btn btn-sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
        </div>
      )}

      {/* Edit Role Modal */}
      {editing && (
        <div className="modal modal-open">
          <div className="modal-box max-w-sm">
            <h3 className="font-bold text-lg mb-4">Rolni o'zgartirish</h3>
            <p className="text-sm text-base-content/60 mb-3">
              <span className="font-semibold">{editing.user.username}</span> ({editing.user.email})
            </p>
            <select
              className="select select-bordered w-full"
              value={editing.role}
              onChange={e => setEditing(p => ({ ...p, role: e.target.value }))}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setEditing(null)}>Bekor</button>
              <button className="btn btn-primary" onClick={handleSaveRole} disabled={saving}>
                {saving ? <span className="loading loading-spinner loading-xs" /> : 'Saqlash'}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setEditing(null)} />
        </div>
      )}
    </div>
  )
}
