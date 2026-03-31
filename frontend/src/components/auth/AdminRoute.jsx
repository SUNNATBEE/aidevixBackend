import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsLoggedIn, selectUser } from '@store/slices/authSlice'

export default function AdminRoute() {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const user       = useSelector(selectUser)

  if (!isLoggedIn)             return <Navigate to="/login"  replace />
  if (user?.role !== 'admin')  return <Navigate to="/"       replace />

  return <Outlet />
}
