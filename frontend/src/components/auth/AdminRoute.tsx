// @ts-nocheck
'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { selectAuthLoading, selectIsLoggedIn, selectUser } from '@store/slices/authSlice'

export default function AdminRoute({ children }: { children?: ReactNode }) {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const loading = useSelector(selectAuthLoading)
  const user       = useSelector(selectUser)
  const router = useRouter()

  if (loading) {
    return null
  }

  if (!isLoggedIn) {
    router.replace('/login')
    return null
  }

  if (user?.role !== 'admin') {
    router.replace('/')
    return null
  }

  return children ?? null
}
