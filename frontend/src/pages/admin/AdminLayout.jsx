import { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser, selectIsLoggedIn, login, logout } from '@store/slices/authSlice'

import DashboardPage    from './DashboardPage'
import CoursesPage      from './courses/CoursesPage'
import CourseFormPage   from './courses/CourseFormPage'
import VideosPage       from './videos/VideosPage'
import VideoUploadPage  from './videos/VideoUploadPage'
import UsersPage        from './users/UsersPage'

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)
const CoursesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)
const VideosIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
)
const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)
const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)
const MenuIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV = [
  { path: '/admin',         label: 'Dashboard',          Icon: DashboardIcon, end: true  },
  { path: '/admin/courses', label: 'Kurslar',             Icon: CoursesIcon,   end: false },
  { path: '/admin/videos',  label: 'Videolar',            Icon: VideosIcon,    end: false },
  { path: '/admin/users',   label: 'Foydalanuvchilar',   Icon: UsersIcon,     end: false },
]

// ─── Admin Login Form ─────────────────────────────────────────────────────────
function AdminLoginForm() {
  const dispatch = useDispatch()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result = await dispatch(login({ email, password }))
    if (login.rejected.match(result)) {
      setError(result.payload || 'Login yoki parol xato')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-primary-content font-bold text-xl">&lt;/&gt;</span>
          </div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-base-content/50 text-sm mt-1">Faqat adminlar kira oladi</p>
        </div>
        <div className="card bg-base-200 border border-base-300 shadow-lg">
          <div className="card-body p-6 space-y-4">
            {error && <div className="alert alert-error text-sm py-2"><span>{error}</span></div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label py-1"><span className="label-text">Email</span></label>
                <input
                  type="email" className="input input-bordered" required
                  placeholder="admin@email.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label py-1"><span className="label-text">Parol</span></label>
                <input
                  type="password" className="input input-bordered" required
                  placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? <span className="loading loading-spinner loading-sm" /> : 'Kirish'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const user      = useSelector(selectUser)
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const dispatch  = useDispatch()
  const navigate  = useNavigate()

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/')
  }

  // Not logged in or not admin → show login form
  if (!isLoggedIn || user?.role !== 'admin') {
    return <AdminLoginForm />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-base-100">

      {/* ── Sidebar ── */}
      <aside className={`flex flex-col bg-base-200 border-r border-base-300 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>

        {/* Logo + collapse btn */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-base-300 min-h-[64px]">
          {!collapsed && (
            <div>
              <span className="font-bold text-primary text-lg tracking-wide">Aidevix</span>
              <span className="block text-[10px] text-base-content/40 uppercase tracking-widest">Admin Panel</span>
            </div>
          )}
          <button onClick={() => setCollapsed(p => !p)}
            className="btn btn-ghost btn-sm btn-square ml-auto">
            <MenuIcon />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {NAV.map(({ path, label, Icon, end }) => (
            <NavLink key={path} to={path} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium
                ${isActive
                  ? 'bg-primary text-primary-content shadow'
                  : 'text-base-content/60 hover:text-base-content hover:bg-base-300'
                }`
              }
            >
              <Icon />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="border-t border-base-300 p-3">
          {!collapsed && (
            <div className="flex items-center gap-2 mb-2 px-1">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-8">
                  <span className="text-xs">{user?.username?.[0]?.toUpperCase()}</span>
                </div>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.username}</p>
                <p className="text-xs text-base-content/40 truncate">{user?.email}</p>
              </div>
            </div>
          )}
          <button onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-error hover:bg-error/10 transition-colors text-sm">
            <LogoutIcon />
            {!collapsed && <span>Chiqish</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="h-16 bg-base-100 border-b border-base-300 flex items-center px-6 gap-4 shrink-0">
          <h1 className="font-semibold text-base-content/80 text-sm">Admin Panel</h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="badge badge-primary badge-outline">Admin</div>
            <span className="text-sm text-base-content/60">{user?.username}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-base-100">
          <Routes>
            <Route index                    element={<DashboardPage />}   />
            <Route path="courses"           element={<CoursesPage />}     />
            <Route path="courses/new"       element={<CourseFormPage />}  />
            <Route path="courses/:id/edit"  element={<CourseFormPage />}  />
            <Route path="videos"            element={<VideosPage />}      />
            <Route path="videos/upload"     element={<VideoUploadPage />} />
            <Route path="users"             element={<UsersPage />}       />
          </Routes>
        </main>
      </div>
    </div>
  )
}
