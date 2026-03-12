import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { gsap } from 'gsap'

import Navbar from '@components/layout/Navbar'
import Footer from '@components/layout/Footer'
import ScrollToTop from '@components/layout/ScrollToTop'
import ProtectedRoute from '@components/auth/ProtectedRoute'

// Pages (lazy loaded for code splitting)
import { lazy, Suspense } from 'react'
import Loader from '@components/common/Loader'

const HomePage          = lazy(() => import('@pages/HomePage'))
const CoursesPage       = lazy(() => import('@pages/CoursesPage'))
const CourseDetailPage  = lazy(() => import('@pages/CourseDetailPage'))
const VideoPage         = lazy(() => import('@pages/VideoPage'))
const LoginPage         = lazy(() => import('@pages/LoginPage'))
const RegisterPage      = lazy(() => import('@pages/RegisterPage'))
const ProfilePage       = lazy(() => import('@pages/ProfilePage'))
const SubscriptionPage  = lazy(() => import('@pages/SubscriptionPage'))
const TopCoursesPage       = lazy(() => import('@pages/TopCoursesPage'))
const LeaderboardPage      = lazy(() => import('@pages/LeaderboardPage'))       // SUHROB
const LevelUpPage          = lazy(() => import('@pages/LevelUpPage'))           // SUHROB
const VideoPlaygroundPage  = lazy(() => import('@pages/VideoPlaygroundPage'))   // ABDUVORIS
const NotFoundPage         = lazy(() => import('@pages/NotFoundPage'))

export default function AppRouter() {
  const location = useLocation()

  // Page transition animation on route change
  useEffect(() => {
    gsap.fromTo(
      '#page-wrapper',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
    )
  }, [location.pathname])

  return (
    <>
      <ScrollToTop />
      <Navbar />

      <main id="page-wrapper" className="min-h-screen">
        <Suspense fallback={<Loader fullScreen />}>
          <Routes>
            {/* Public routes */}
            <Route path="/"              element={<HomePage />} />
            <Route path="/courses"       element={<CoursesPage />} />
            <Route path="/courses/:id"   element={<CourseDetailPage />} />
            <Route path="/top"           element={<TopCoursesPage />} />   {/* NUMTON */}
            <Route path="/leaderboard"  element={<LeaderboardPage />} />  {/* SUHROB */}
            <Route path="/login"         element={<LoginPage />} />
            <Route path="/register"      element={<RegisterPage />} />

            {/* Protected routes (login required) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile"            element={<ProfilePage />} />
              <Route path="/subscription"       element={<SubscriptionPage />} />
              <Route path="/videos/:id"              element={<VideoPage />} />           {/* ABDUVORIS */}
              <Route path="/videos/:id/playground" element={<VideoPlaygroundPage />} />  {/* ABDUVORIS */}
              <Route path="/level-up"               element={<LevelUpPage />} />          {/* SUHROB */}
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </>
  )
}
