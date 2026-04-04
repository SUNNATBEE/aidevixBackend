import { useEffect, useState } from 'react'
import { getDashboardStats, getTopStudents, getRecentPayments } from '@api/adminApi'

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, icon }) {
  return (
    <div className="card bg-base-200 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
      <div className="card-body p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-base-content/50 uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-3xl font-bold ${color}`}>{value ?? '—'}</p>
            {sub && <p className="text-xs text-base-content/40 mt-1">{sub}</p>}
          </div>
          <div className={`text-3xl opacity-80`}>{icon}</div>
        </div>
      </div>
    </div>
  )
}

// ─── Revenue formatter ────────────────────────────────────────────────────────
const formatRevenue = (n) => {
  if (!n) return '0'
  return new Intl.NumberFormat('uz-UZ').format(n) + ' UZS'
}

export default function DashboardPage() {
  const [stats,    setStats]    = useState(null)
  const [students, setStudents] = useState([])
  const [payments, setPayments] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [s, t, p] = await Promise.all([
          getDashboardStats(),
          getTopStudents(),
          getRecentPayments({ limit: 5 }),
        ])
        setStats(s.data.data)
        setStudents(t.data.data?.students || t.data.data || [])
        setPayments(p.data.data?.payments || p.data.data || [])
      } catch (e) {
        setError(e.response?.data?.message || 'Xato yuz berdi')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  )

  if (error) return (
    <div className="p-6">
      <div className="alert alert-error"><span>{error}</span></div>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-base-content/50 text-sm mt-1">Platformaning umumiy ko'rinishi</p>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Jami foydalanuvchilar"
          value={stats?.users?.total?.toLocaleString()}
          sub={`+${stats?.users?.newThisMonth ?? 0} bu oy`}
          color="text-primary"
          icon="👥"
        />
        <StatCard
          label="Kurslar"
          value={stats?.courses?.total}
          color="text-secondary"
          icon="📚"
        />
        <StatCard
          label="Videolar"
          value={stats?.videos?.total}
          color="text-accent"
          icon="🎬"
        />
        <StatCard
          label="Yozilishlar"
          value={stats?.enrollments?.total?.toLocaleString()}
          sub={`${stats?.enrollments?.completed ?? 0} tugallandi`}
          color="text-success"
          icon="🎓"
        />
      </div>

      {/* ── Revenue card ── */}
      <div className="card bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/20">
        <div className="card-body p-5">
          <p className="text-xs text-base-content/50 uppercase tracking-wider">Jami daromad</p>
          <p className="text-4xl font-bold text-primary">{formatRevenue(stats?.revenue?.total)}</p>
        </div>
      </div>

      {/* ── Tables ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top students */}
        <div className="card bg-base-200 border border-base-300">
          <div className="card-body p-0">
            <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
              <h3 className="font-semibold">🏆 Top O'quvchilar</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Foydalanuvchi</th>
                    <th>XP</th>
                    <th>Daraja</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 && (
                    <tr><td colSpan={4} className="text-center text-base-content/40 py-6">Ma'lumot yo'q</td></tr>
                  )}
                  {students.slice(0, 8).map((s, i) => (
                    <tr key={s._id || i}>
                      <td>
                        <span className={`font-bold ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-orange-600' : 'text-base-content/40'}`}>
                          {i + 1}
                        </span>
                      </td>
                      <td>
                        <div className="font-medium text-sm">{s.username}</div>
                        <div className="text-xs text-base-content/40">{s.email}</div>
                      </td>
                      <td><span className="text-primary font-semibold">{s.xp?.toLocaleString() ?? 0}</span></td>
                      <td><div className="badge badge-sm badge-outline">Lv {s.level ?? 1}</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent payments */}
        <div className="card bg-base-200 border border-base-300">
          <div className="card-body p-0">
            <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
              <h3 className="font-semibold">💳 So'nggi To'lovlar</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Foydalanuvchi</th>
                    <th>Kurs</th>
                    <th>Summa</th>
                    <th>Holat</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 && (
                    <tr><td colSpan={4} className="text-center text-base-content/40 py-6">To'lov yo'q</td></tr>
                  )}
                  {payments.slice(0, 8).map((p, i) => (
                    <tr key={p._id || i}>
                      <td className="text-sm">{p.user?.username || '—'}</td>
                      <td className="text-sm max-w-[120px] truncate">{p.course?.title || '—'}</td>
                      <td className="font-medium text-success text-sm">
                        {p.amount ? new Intl.NumberFormat('uz-UZ').format(p.amount) : '—'}
                      </td>
                      <td>
                        <div className={`badge badge-sm ${
                          p.status === 'completed' ? 'badge-success' :
                          p.status === 'pending'   ? 'badge-warning' : 'badge-error'
                        }`}>
                          {p.status || '—'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
