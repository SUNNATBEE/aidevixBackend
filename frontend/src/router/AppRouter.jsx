import { Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { lazy, Suspense } from 'react'

import Navbar       from '@components/layout/Navbar'
import Footer       from '@components/layout/Footer'
import ScrollToTop  from '@components/layout/ScrollToTop'
import ProtectedRoute from '@components/auth/ProtectedRoute'
import Loader       from '@components/common/Loader'

// ── Public pages (lazy) ───────────────────────────────────────────────────────
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
const ForgotPasswordPage   = lazy(() => import('@pages/ForgotPasswordPage'))
const VerifyCodePage       = lazy(() => import('@pages/VerifyCodePage'))
const ResetPasswordPage    = lazy(() => import('@pages/ResetPasswordPage'))
const NotFoundPage         = lazy(() => import('@pages/NotFoundPage'))

// ── Admin pages (lazy) ───────────────────────────────────────────────────────
const AdminLayout = lazy(() => import('@pages/admin/AdminLayout'))

// ── Public layout wrapper ─────────────────────────────────────────────────────
function PublicLayout() {
  const location = useLocation()

  useEffect(() => {
    gsap.fromTo(
      '#page-wrapper',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
    )
  }, [location.pathname])

  const hideLayoutPaths = ['/login', '/register', '/forgot-password', '/verify-code', '/reset-password']
  const shouldHideLayout = hideLayoutPaths.includes(location.pathname)

  return (
    <>
      <ScrollToTop />
      {!shouldHideLayout && <Navbar />}

      <main id="page-wrapper" className="min-h-screen">
        <Outlet />
      </main>

      {!shouldHideLayout && <Footer />}
    </>
  )
}
// ─────────────────────────────────────────────────────────────────────────────
export default function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<Loader fullScreen />}>
        <Routes>

          {/* ── Admin routes (own full-page layout, no Navbar/Footer) ── */}
          <Route path="/admin/*" element={<AdminLayout />} />

          {/* ── Public routes (Navbar + Footer) ── */}
          <Route element={<PublicLayout />}>
            <Route path="/"              element={<HomePage />} />
            <Route path="/courses"       element={<CoursesPage />} />
            <Route path="/courses/:id"   element={<CourseDetailPage />} />
            <Route path="/top"           element={<TopCoursesPage />} />   {/* NUMTON */}
            <Route path="/leaderboard"   element={<LeaderboardPage />} />  {/* SUHROB */}
            <Route path="/login"         element={<LoginPage />} />
            <Route path="/register"      element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-code"   element={<VerifyCodePage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected (login required) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile"               element={<ProfilePage />} />
              <Route path="/subscription"          element={<SubscriptionPage />} />
              <Route path="/videos/:id"              element={<VideoPage />} />           {/* ABDUVORIS */}
              <Route path="/videos/:id/playground"   element={<VideoPlaygroundPage />} />  {/* ABDUVORIS */}
              <Route path="/level-up"                element={<LevelUpPage />} />          {/* SUHROB */}
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>

        </Routes>
      </Suspense>
    </>
  )
}
