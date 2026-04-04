import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
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

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)

const NAV = [
  { path: '/admin',         label: 'Dashboard',          Icon: DashboardIcon, end: true  },
  { path: '/admin/courses', label: 'Kurslar',             Icon: CoursesIcon,   end: false },
]

function AdminLoginForm() {
  const dispatch = useDispatch() as any
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result = await dispatch(login({ email, password }))
    if (login.rejected.match(result)) {
      setError(result.payload as string || 'Login yoki parol xato')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="w-full max-w-sm">
        <div className="card bg-base-200 border border-base-300 shadow-lg">
          <div className="card-body p-6 space-y-4 text-white">
            <h1 className="text-xl font-bold text-center">Admin Login</h1>
            {error && <div className="alert alert-error text-sm py-2"><span>{error}</span></div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="email" className="input input-bordered w-full bg-white text-black" required placeholder="Admin Email" value={email} onChange={e => setEmail(e.target.value)} />
              <input type="password" className="input input-bordered w-full bg-white text-black" required placeholder="Parol" value={password} onChange={e => setPassword(e.target.value)} />
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>Kirish</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children?: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)
  const user      = useSelector(selectUser)
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const dispatch  = useDispatch() as any
  const router    = useRouter()

  useEffect(() => { setIsMounted(true) }, [])

  const handleLogout = async () => {
    await dispatch(logout())
    router.push('/')
  }

  if (!isMounted) return null

  if (!isLoggedIn || user?.role !== 'admin') {
    return <AdminLoginForm />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-base-100">
      <aside className="w-64 bg-base-200 border-r border-base-300 flex flex-col">
          <div className="p-4 border-b border-base-300 font-bold text-primary">Aidevix Admin</div>
          <nav className="flex-1 p-2 space-y-1">
            {NAV.map(n => (
              <button key={n.path} onClick={() => router.push(n.path)} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-base-300 transition-colors">
                <n.Icon /> {n.label}
              </button>
            ))}
          </nav>
          <button onClick={handleLogout} className="p-4 border-t border-base-300 text-error flex items-center gap-2 hover:bg-error/10">
            <LogoutIcon /> Chiqish
          </button>
      </aside>
      <main className="flex-1 overflow-y-auto bg-base-100 p-6">
          {children || <DashboardPage />}
      </main>
    </div>
  )
}
