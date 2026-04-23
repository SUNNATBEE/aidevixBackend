// @ts-nocheck
'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'
import { selectAuthLoading, selectIsLoggedIn } from '@store/slices/authSlice'
import { ROUTES } from '@utils/constants'

/**
 * ProtectedRoute — redirects to /login if user is not authenticated.
 * Saves the intended URL so user can be redirected back after login.
 */
export default function ProtectedRoute({ children }: { children?: ReactNode }) {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const loading = useSelector(selectAuthLoading)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading || isLoggedIn) return
    router.replace(`${ROUTES.LOGIN}?next=${encodeURIComponent(pathname || ROUTES.HOME)}`)
  }, [loading, isLoggedIn, pathname, router])

  if (loading) {
    return null
  }

  if (!isLoggedIn) {
    return null
  }

  return children ?? null
}
