import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux'
import { selectUser, selectIsLoggedIn, login, logout } from '@store/slices/authSlice'

import DashboardPage    from './DashboardPage'
import CoursesPage      from './courses/CoursesPage'

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
const ExternalIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
)
const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)

const NAV = [
  { path: '/admin',         label: 'Dashboard',          Icon: DashboardIcon  },
  { path: '/admin/courses', label: 'Kurslar',             Icon: CoursesIcon    },
]

const EXTERNAL_LINKS = [
  { label: 'Google Search Console', href: 'https://search.google.com/search-console?resource_id=https://www.aidevix.uz/' },
  { label: 'API Dokumentatsiya',    href: 'https://aidevix-backend-production.up.railway.app/api-docs/' },
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
    try {
      const result = await dispatch(login({ email, password }))
      if (login.rejected.match(result)) {
        setError(result.payload as string || 'Login yoki parol xato')
      }
    } catch (err: any) {
      setError('Login jarayonida xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="w-full max-w-sm px-4">
        <div className="card bg-base-200 border border-base-300 shadow-xl overflow-hidden rounded-3xl">
          <div className="card-body p-8 space-y-6 text-white">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <span className="text-primary font-black text-2xl">A</span>
              </div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-white/40 text-sm mt-1">Xush kelibsiz, admin</p>
            </div>
            
            {error && <div className="alert alert-error text-xs py-3 rounded-xl"><span>{error}</span></div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label py-1"><span className="label-text text-white/60 text-xs">EMAIL</span></label>
                <input type="email" className="input input-bordered w-full bg-white/5 border-white/10 text-white rounded-xl focus:border-primary" required placeholder="admin@email.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="form-control">
                <label className="label py-1"><span className="label-text text-white/60 text-xs">PAROL</span></label>
                <input type="password" className="input input-bordered w-full bg-white/5 border-white/10 text-white rounded-xl focus:border-primary" required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary w-full h-12 rounded-xl normal-case font-bold mt-2" disabled={loading}>
                {loading ? <span className="loading loading-spinner"></span> : 'Tizimga kirish'}
              </button>
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
    <div className="flex h-screen overflow-hidden bg-base-100 font-sans text-white">
      <aside className="w-64 bg-base-200 border-r border-base-300 flex flex-col shrink-0">
          <div className="p-6 border-b border-base-300">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg"></div>
                <span className="font-black text-xl tracking-tight text-white italic">Aidevix</span>
             </div>
             <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">Management Console</p>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-4">
              <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] mb-4 px-2">Asosiy menyu</p>
              <nav className="space-y-1">
                {NAV.map(n => (
                  <button 
                    key={n.path} 
                    onClick={() => router.push(n.path)} 
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all text-sm font-medium
                      ${router.pathname === n.path ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
                  >
                    <n.Icon /> {n.label}
                  </button>
                ))}
              </nav>

              <div className="mt-10">
                <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] mb-4 px-2">Tashqi havolalar</p>
                <div className="space-y-1">
                  {EXTERNAL_LINKS.map(link => (
                    <a 
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 w-full px-4 py-3 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all text-xs font-medium border border-transparent hover:border-white/5"
                    >
                      <span className="truncate">{link.label}</span>
                      <ExternalIcon />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-base-300 bg-base-200/50">
            <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-error hover:bg-error/10 transition-colors text-sm font-medium">
              <LogoutIcon /> Chiqish
            </button>
          </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-base-300 flex items-center px-8 bg-base-200/30 backdrop-blur-3xl">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
              <h2 className="font-bold text-white uppercase tracking-widest text-[10px] opacity-60">Admin Dashboard</h2>
           </div>
           
           <div className="ml-auto flex items-center gap-4">
              <div className="text-right">
                 <p className="text-xs font-bold text-white leading-none">{user?.username || 'Admin'}</p>
                 <p className="text-[9px] text-white/30 uppercase tracking-tighter mt-1">Superadmin</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary shadow-inner">
                 {user?.username?.[0]?.toUpperCase() || 'A'}
              </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#0a0a0b] p-8">
            <div className="max-w-7xl mx-auto">
              {children || <DashboardPage />}
            </div>
        </main>
      </div>
    </div>
  )
}
