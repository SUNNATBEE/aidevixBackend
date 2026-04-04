import { useSelector, useDispatch } from 'react-redux'
import {
  selectUser, selectIsLoggedIn, selectAuthLoading, selectAuthError, selectIsAdmin,
  login, register, logout, clearError,
} from '@store/slices/authSlice'

/**
 * useAuth — convenient hook for auth state + actions
 */
export function useAuth() {
  const dispatch = useDispatch()

  return {
    user:       useSelector(selectUser),
    isLoggedIn: useSelector(selectIsLoggedIn),
    isAdmin:    useSelector(selectIsAdmin),
    loading:    useSelector(selectAuthLoading),
    error:      useSelector(selectAuthError),

    login:      (data) => dispatch(login(data)),
    register:   (data) => dispatch(register(data)),
    logout:     ()     => dispatch(logout()),
    clearError: ()     => dispatch(clearError()),
  }
}
