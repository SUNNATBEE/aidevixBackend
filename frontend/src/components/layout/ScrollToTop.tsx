'use client';

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/** Scroll to top on every route change */
export default function ScrollToTop() {
  const pathname = usePathname()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }) }, [pathname])
  return null
}
