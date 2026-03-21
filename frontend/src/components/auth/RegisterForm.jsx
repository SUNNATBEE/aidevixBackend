// ============================================================
// OQUVCHI  : FIRDAVS
// BRANCH   : feature/firdavs-auth
// FAYL     : src/components/auth/RegisterForm.jsx
// ============================================================
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { IoPerson, IoMail, IoLockClosed, IoEye, IoEyeOff } from 'react-icons/io5'
import { register as registerUser, selectAuthLoading, selectAuthError, clearError } from '@store/slices/authSlice'

export default function RegisterForm() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const loading   = useSelector(selectAuthLoading)
  const authError = useSelector(selectAuthError)
  const [showPass,    setShowPass]    = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const onSubmit = async ({ username, email, password }) => {
    dispatch(clearError())
    const result = await dispatch(registerUser({ username, email, password }))
    if (registerUser.fulfilled.match(result)) {
      navigate('/subscription', { replace: true })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {authError && (
        <div className="alert alert-error text-sm py-2">
          <span>{authError}</span>
        </div>
      )}

      {/* Username */}
      <div className="form-control">
        <label className="label py-1"><span className="label-text">Foydalanuvchi nomi</span></label>
        <label className="input input-bordered flex items-center gap-2">
          <IoPerson className="text-base-content/40 shrink-0" />
          <input
            type="text" placeholder="username"
            className="grow bg-transparent outline-none"
            {...register('username', {
              required: 'Username kiritish shart',
              minLength: { value: 3, message: 'Kamida 3 ta belgi' },
              maxLength: { value: 30, message: 'Ko\'pi 30 ta belgi' },
              pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Faqat harf, raqam va _' }
            })}
          />
        </label>
        {errors.username && <p className="text-error text-xs mt-1">{errors.username.message}</p>}
      </div>

      {/* Email */}
      <div className="form-control">
        <label className="label py-1"><span className="label-text">Email</span></label>
        <label className="input input-bordered flex items-center gap-2">
          <IoMail className="text-base-content/40 shrink-0" />
          <input
            type="email" placeholder="email@example.com"
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
            type={showPass ? 'text' : 'password'} placeholder="••••••••"
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

      {/* Confirm password */}
      <div className="form-control">
        <label className="label py-1"><span className="label-text">Parolni tasdiqlang</span></label>
        <label className="input input-bordered flex items-center gap-2">
          <IoLockClosed className="text-base-content/40 shrink-0" />
          <input
            type={showConfirm ? 'text' : 'password'} placeholder="••••••••"
            className="grow bg-transparent outline-none"
            {...register('confirm', {
              required: 'Parolni tasdiqlang',
              validate: v => v === watch('password') || 'Parollar mos emas'
            })}
          />
          <button type="button" onClick={() => setShowConfirm(p => !p)} className="text-base-content/40 hover:text-base-content">
            {showConfirm ? <IoEyeOff /> : <IoEye />}
          </button>
        </label>
        {errors.confirm && <p className="text-error text-xs mt-1">{errors.confirm.message}</p>}
      </div>

      {/* Submit */}
      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? <span className="loading loading-spinner loading-sm" /> : "Ro'yxatdan o'tish"}
      </button>

      <p className="text-center text-sm text-base-content/60">
        Hisobingiz bormi?{' '}
        <Link to="/login" className="text-primary hover:underline">Kiring</Link>
      </p>
    </form>
  )
}
