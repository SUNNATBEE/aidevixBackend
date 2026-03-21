// ============================================================
// OQUVCHI  : FIRDAVS
// BRANCH   : feature/firdavs-auth
// ROUTE    : /register
// ============================================================
//
// VAZIFA: Ro'yxatdan o'tish sahifasini yaratish
//
// Bu sahifada bo'lishi kerak:
//
//  LAYOUT:
//   - min-h-screen, dark background
//   - Markazlashgan karta (max-w-md)
//
//  KARTA ICHIDA:
//   - Aidevix logosi (tepada)
//   - "Ro'yxatdan o'tish" sarlavha
//   - "Yangi hisob yarating" subtitle
//   - RegisterForm komponenti (@components/auth/RegisterForm.jsx)
//   - GSAP kirish animatsiyasi
//
//  MUHIM MANTIQ:
//   - Agar foydalanuvchi allaqachon kirgan bo'lsa (isLoggedIn = true),
//     uni bosh sahifaga yo'naltirish:
//     if (isLoggedIn) return <Navigate to="/" replace />
//
// HOOKS:
//   useAuth() → { isLoggedIn }  —  @hooks/useAuth.js dan
//
// KERAKLI IMPORTLAR:
//   import { Navigate, Link } from 'react-router-dom'
//   import RegisterForm from '@components/auth/RegisterForm'
//   import { useAuth } from '@hooks/useAuth'
//
// FIGMA: "Aidevix Register Page" sahifasini qarang
// ============================================================

export default function RegisterPage() {
  // TODO: FIRDAVS bu sahifani to'liq yozadi
  return null
}
