import { redirect } from 'next/navigation';
import { useSelector } from 'react-redux'
import { selectIsLoggedIn, selectUser } from '@store/slices/authSlice'

export default function AdminRoute() {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const user       = useSelector(selectUser)

  if (!isLoggedIn)             return /* redirect("/login"  replace /) */
  if (user?.role !== 'admin')  return /* redirect("/"       replace /) */

  return <Outlet />
}
