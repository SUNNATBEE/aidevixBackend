import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { IoPerson, IoMail, IoLockClosed } from 'react-icons/io5'

import { register as registerUser, selectAuthLoading, selectAuthError, clearError } from '@store/slices/authSlice'
import Input from '@components/common/Input'
import Button from '@components/common/Button'
import { ROUTES } from '@utils/constants'

export default function RegisterForm() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const loading   = useSelector(selectAuthLoading)
  const authError = useSelector(selectAuthError)

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')

  const onSubmit = async (data) => {
    dispatch(clearError())
    const result = await dispatch(registerUser({
      username: data.username,
      email:    data.email,
      password: data.password,
    }))
    if (!result.error) navigate(ROUTES.SUBSCRIPTION)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {authError && (
        <div className="alert alert-error rounded-xl py-2 px-4 text-sm">{authError}</div>
      )}

      <Input
        label="Foydalanuvchi nomi"
        placeholder="username"
        icon={<IoPerson />}
        error={errors.username?.message}
        {...register('username', {
          required:  'Username kiritish shart',
          minLength: { value: 3,  message: 'Kamida 3 ta belgi' },
          maxLength: { value: 30, message: 'Ko\'pi bilan 30 ta belgi' },
          pattern:   { value: /^[a-zA-Z0-9_]+$/, message: 'Faqat harf, raqam va _ ishlatiladi' },
        })}
      />

      <Input
        label="Email"
        type="email"
        placeholder="email@example.com"
        icon={<IoMail />}
        error={errors.email?.message}
        {...register('email', {
          required: 'Email kiritish shart',
          pattern:  { value: /\S+@\S+\.\S+/, message: 'Email noto\'g\'ri' },
        })}
      />

      <Input
        label="Parol"
        type="password"
        placeholder="Kamida 6 ta belgi"
        icon={<IoLockClosed />}
        error={errors.password?.message}
        {...register('password', {
          required:  'Parol kiritish shart',
          minLength: { value: 6, message: 'Kamida 6 ta belgi' },
        })}
      />

      <Input
        label="Parolni tasdiqlang"
        type="password"
        placeholder="Parolni qayta kiriting"
        icon={<IoLockClosed />}
        error={errors.confirmPassword?.message}
        {...register('confirmPassword', {
          required: 'Parolni tasdiqlang',
          validate: (v) => v === password || 'Parollar mos emas',
        })}
      />

      <Button type="submit" loading={loading} className="w-full" size="lg">
        Ro'yxatdan o'tish
      </Button>

      <p className="text-center text-sm text-zinc-400">
        Hisobingiz bormi?{' '}
        <Link to={ROUTES.LOGIN} className="text-primary-400 hover:underline font-medium">
          Kiring
        </Link>
      </p>
    </form>
  )
}
