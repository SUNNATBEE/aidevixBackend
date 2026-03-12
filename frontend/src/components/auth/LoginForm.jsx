import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { IoMail, IoLockClosed, IoEye, IoEyeOff } from 'react-icons/io5'
import { useState } from 'react'

import { login, selectAuthLoading, selectAuthError, clearError } from '@store/slices/authSlice'
import Input from '@components/common/Input'
import Button from '@components/common/Button'
import { ROUTES } from '@utils/constants'

export default function LoginForm() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const location  = useLocation()
  const loading   = useSelector(selectAuthLoading)
  const authError = useSelector(selectAuthError)
  const [showPass, setShowPass] = useState(false)

  const from = location.state?.from?.pathname || ROUTES.HOME

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    dispatch(clearError())
    const result = await dispatch(login(data))
    if (!result.error) navigate(from, { replace: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Global error */}
      {authError && (
        <div className="alert alert-error rounded-xl py-2 px-4 text-sm">
          {authError}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        placeholder="email@example.com"
        icon={<IoMail />}
        error={errors.email?.message}
        {...register('email', {
          required: 'Email kiritish shart',
          pattern: { value: /\S+@\S+\.\S+/, message: 'Email noto\'g\'ri' },
        })}
      />

      <Input
        label="Parol"
        type={showPass ? 'text' : 'password'}
        placeholder="Parolingizni kiriting"
        icon={<IoLockClosed />}
        iconRight={
          <button type="button" onClick={() => setShowPass((v) => !v)}>
            {showPass ? <IoEyeOff /> : <IoEye />}
          </button>
        }
        error={errors.password?.message}
        {...register('password', {
          required: 'Parol kiritish shart',
          minLength: { value: 6, message: 'Parol kamida 6 ta belgi' },
        })}
      />

      <Button type="submit" loading={loading} className="w-full" size="lg">
        Kirish
      </Button>

      <p className="text-center text-sm text-zinc-400">
        Hisobingiz yo'qmi?{' '}
        <Link to={ROUTES.REGISTER} className="text-primary-400 hover:underline font-medium">
          Ro'yxatdan o'ting
        </Link>
      </p>
    </form>
  )
}
