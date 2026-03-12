import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsLoggedIn } from '@store/slices/authSlice'
import { ROUTES } from '@utils/constants'

/**
 * ProtectedRoute — redirects to /login if user is not authenticated.
 * Saves the intended URL so user can be redirected back after login.
 */
export default function ProtectedRoute() {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const location   = useLocation()

  if (!isLoggedIn) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  return <Outlet />
}
