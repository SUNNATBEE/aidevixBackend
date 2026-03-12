import { useEffect, useRef } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { gsap } from 'gsap'

import RegisterForm from '@components/auth/RegisterForm'
import { useAuth } from '@hooks/useAuth'
import { ROUTES } from '@utils/constants'

export default function RegisterPage() {
  const { isLoggedIn } = useAuth()
  const cardRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 30, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.2)' },
    )
  }, [])

  if (isLoggedIn) return <Navigate to={ROUTES.HOME} replace />

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-hero-gradient pt-16 pb-10">
      <div ref={cardRef} className="glass-card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold font-mono">AI</span>
            </div>
            <span className="font-display font-bold text-2xl gradient-text">Aidevix</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Ro'yxatdan o'tish</h1>
          <p className="text-zinc-400 text-sm mt-1">Yangi hisob yarating</p>
        </div>

        <RegisterForm />
      </div>
    </div>
  )
}
