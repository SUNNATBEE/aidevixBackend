// ============================================================
// OQUVCHI  : FIRDAVS
// BRANCH   : feature/firdavs-auth
// FAYL     : src/components/auth/LoginForm.jsx
// ============================================================
//
// VAZIFA: Login formasi komponentini yaratish
//
// FORMA ELEMENTLARI:
//
//  1. SERVER XATOSI:
//     - authError bo'lsa alert alert-error ko'rsatiladi
//
//  2. EMAIL INPUT:
//     - Label: "Email"
//     - type="email", placeholder="email@example.com"
//     - IoMail ikonkasi (chap tomonda)
//     - className="input input-bordered w-full bg-base-200"
//     - Validation: required + valid email pattern
//     - Xato: {errors.email?.message} — text-error text-sm
//
//  3. PAROL INPUT:
//     - Label: "Parol"
//     - type toggled (password ↔ text) — showPass state
//     - IoLockClosed ikonkasi (chap), IoEye/IoEyeOff (o'ng toggle)
//     - Validation: required, minLength: 6
//
//  4. KIRISH TUGMASI:
//     - "Kirish" — btn btn-primary w-full size="lg"
//     - loading holat: disabled + spinner
//
//  5. RO'YXATDAN O'TISH HAVOLASI:
//     - "Hisobingiz yo'qmi? Ro'yxatdan o'ting"
//     - Link to="/register" — text-primary-400
//
// LOGIKA:
//   - react-hook-form: useForm()
//   - onSubmit → dispatch(login(data))
//   - Muvaffaqiyatli bo'lsa: navigate(from) yoki navigate('/')
//   - Xato bo'lsa: authError toast yoki inline ko'rsatiladi
//
// KERAKLI IMPORTLAR:
//   import { useForm } from 'react-hook-form'
//   import { useDispatch, useSelector } from 'react-redux'
//   import { Link, useNavigate, useLocation } from 'react-router-dom'
//   import { IoMail, IoLockClosed, IoEye, IoEyeOff } from 'react-icons/io5'
//   import { useState } from 'react'
//   import { login, selectAuthLoading, selectAuthError, clearError } from '@store/slices/authSlice'
//   import { ROUTES } from '@utils/constants'
// ============================================================

export default function LoginForm() {
  // TODO: FIRDAVS bu komponentni to'liq yozadi
  return null
}
