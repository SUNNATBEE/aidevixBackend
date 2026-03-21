// ============================================================
// OQUVCHI  : FIRDAVS
// BRANCH   : feature/firdavs-auth
// FAYL     : src/components/auth/RegisterForm.jsx
// ============================================================
//
// VAZIFA: Ro'yxatdan o'tish formasi komponentini yaratish
//
// FORMA ELEMENTLARI:
//
//  1. SERVER XATOSI:
//     - authError bo'lsa alert alert-error
//
//  2. USERNAME INPUT:
//     - Label: "Foydalanuvchi nomi"
//     - placeholder: "username"
//     - IoPerson ikonkasi
//     - Validation: required, minLength:3, maxLength:30
//     - Faqat harf, raqam, _ : pattern: /^[a-zA-Z0-9_]+$/
//
//  3. EMAIL INPUT:
//     - type="email"
//     - IoMail ikonkasi
//     - Validation: required, valid email pattern
//
//  4. PAROL INPUT:
//     - type password/text toggle
//     - IoLockClosed ikonkasi + ko'rish/yashirish
//     - Validation: required, minLength: 6
//
//  5. PAROLNI TASDIQLASH:
//     - validate: (v) => v === watch('password') || 'Parollar mos emas'
//
//  6. RO'YXATDAN O'TISH TUGMASI:
//     - "Ro'yxatdan o'tish" — btn btn-primary w-full
//     - loading bo'lganda disabled + spinner
//
//  7. KIRISH HAVOLASI:
//     - "Hisobingiz bormi? Kiring" → Link to="/login"
//
// LOGIKA:
//   - onSubmit → dispatch(register({ username, email, password }))
//   - Muvaffaqiyatli → navigate('/subscription')
//   - Xato → authError ko'rsatiladi
//
// KERAKLI IMPORTLAR:
//   import { useForm } from 'react-hook-form'
//   import { useDispatch, useSelector } from 'react-redux'
//   import { Link, useNavigate } from 'react-router-dom'
//   import { IoPerson, IoMail, IoLockClosed, IoEye, IoEyeOff } from 'react-icons/io5'
//   import { useState } from 'react'
//   import { register as registerUser, selectAuthLoading, selectAuthError, clearError } from '@store/slices/authSlice'
//   import { ROUTES } from '@utils/constants'
// ============================================================

export default function RegisterForm() {
  // TODO: FIRDAVS bu komponentni to'liq yozadi
  return null
}
