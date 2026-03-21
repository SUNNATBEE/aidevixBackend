// ============================================================
// OQUVCHI  : FIRDAVS
// BRANCH   : feature/firdavs-auth
// ROUTE    : /login
// ============================================================
import { useEffect, useRef } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { gsap } from 'gsap'
import LoginForm from '@components/auth/LoginForm'
import { useAuth } from '@hooks/useAuth'

export default function LoginPage() {
  const { isLoggedIn } = useAuth()
  const cardRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
    )
  }, [])

  if (isLoggedIn) return <Navigate to="/" replace />

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-4">
      <div ref={cardRef} className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-content font-bold text-lg">&lt;/&gt;</span>
            </div>
            <span className="text-2xl font-bold text-primary">Aidevix</span>
          </Link>
          <h1 className="text-2xl font-bold mt-4">Tizimga kirish</h1>
          <p className="text-base-content/50 text-sm mt-1">Hisobingizga kiring</p>
        </div>

        <div className="card bg-base-200 border border-base-300 shadow-lg">
          <div className="card-body p-6">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
