// @ts-nocheck
'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { selectAuthLoading, selectIsLoggedIn, selectUser } from '@store/slices/authSlice'

export default function AdminRoute({ children }: { children?: ReactNode }) {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const loading = useSelector(selectAuthLoading)
  const user       = useSelector(selectUser)
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!isLoggedIn) {
      router.replace('/login')
      return
    }
    if (user?.role !== 'admin') {
      router.replace('/')
      return
    }
    // Admin without 2FA → force enrollment (matches backend requireAdmin gate)
    if (user?.role === 'admin' && !user?.totpEnabled) {
      router.replace(`/auth/2fa-setup?next=${encodeURIComponent('/admin')}`)
    }
  }, [loading, isLoggedIn, user?.role, user?.totpEnabled, router])

  if (loading) {
    return null
  }

  if (!isLoggedIn) {
    return null
  }

  if (user?.role !== 'admin') {
    return null
  }

  if (user?.role === 'admin' && !user?.totpEnabled) {
    return null
  }

  return children ?? null
}
