// ============================================================
// OQUVCHI  : FIRDAVS
// BRANCH   : feature/firdavs-auth
// FAYL     : src/components/auth/LoginForm.jsx
// ============================================================
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { IoMail, IoLockClosed, IoEye, IoEyeOff } from 'react-icons/io5'
import { login, selectAuthLoading, selectAuthError, clearError } from '@store/slices/authSlice'

export default function LoginForm() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const location  = useLocation()
  const loading   = useSelector(selectAuthLoading)
  const authError = useSelector(selectAuthError)
  const [showPass, setShowPass] = useState(false)

  const from = location.state?.from?.pathname || '/'

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    dispatch(clearError())
    const result = await dispatch(login(data))
    if (login.fulfilled.match(result)) {
      navigate(from, { replace: true })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {authError && (
        <div className="alert alert-error text-sm py-2">
          <span>{authError}</span>
        </div>
      )}

      {/* Email */}
      <div className="form-control">
        <label className="label py-1"><span className="label-text">Email</span></label>
        <label className="input input-bordered flex items-center gap-2">
          <IoMail className="text-base-content/40 shrink-0" />
          <input
            type="email"
            placeholder="email@example.com"
            className="grow bg-transparent outline-none"
            {...register('email', {
              required: 'Email kiritish shart',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Yaroqli email kiriting' }
            })}
          />
        </label>
        {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className="form-control">
        <label className="label py-1"><span className="label-text">Parol</span></label>
        <label className="input input-bordered flex items-center gap-2">
          <IoLockClosed className="text-base-content/40 shrink-0" />
          <input
            type={showPass ? 'text' : 'password'}
            placeholder="••••••••"
            className="grow bg-transparent outline-none"
            {...register('password', {
              required: 'Parol kiritish shart',
              minLength: { value: 6, message: 'Kamida 6 ta belgi' }
            })}
          />
          <button type="button" onClick={() => setShowPass(p => !p)} className="text-base-content/40 hover:text-base-content">
            {showPass ? <IoEyeOff /> : <IoEye />}
          </button>
        </label>
        {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
      </div>

      {/* Submit */}
      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? <span className="loading loading-spinner loading-sm" /> : 'Kirish'}
      </button>

      <p className="text-center text-sm text-base-content/60">
        Hisobingiz yo'qmi?{' '}
        <Link to="/register" className="text-primary hover:underline">Ro'yxatdan o'ting</Link>
      </p>
    </form>
  )
}
