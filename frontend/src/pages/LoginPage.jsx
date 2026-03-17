// ============================================================
// OQUVCHI  : FIRDAVS
// BRANCH   : feature/firdavs-auth
// ROUTE    : /login
// ============================================================
//
// VAZIFA: Login (kirish) sahifasini yaratish
//
// Bu sahifada bo'lishi kerak:
//
//  LAYOUT:
//   - min-h-screen, dark background
//   - Markazlashgan karta (max-w-md)
//   - Chap tomonda: 3D particle sahna (QUDRAT yozadi — joy qoldiring)
//   - O'ng tomonda: Login forma
//
//  KARTA ICHIDA:
//   - Aidevix logosi (tepada, markazda)
//   - "Tizimga kirish" sarlavha
//   - LoginForm komponenti (@components/auth/LoginForm.jsx)
//   - GSAP kirish animatsiyasi (karta pastdan yuqoriga)
//
//  MUHIM MANTIQ:
//   - Agar foydalanuvchi allaqachon tizimga kirgan bo'lsa (isLoggedIn = true),
//     uni bosh sahifaga yo'naltirish kerak:
//     if (isLoggedIn) return <Navigate to="/" replace />
//
// HOOKS:
//   useAuth() → { isLoggedIn }  —  @hooks/useAuth.js dan
//
// KERAKLI IMPORTLAR:
//   import { Navigate, Link } from 'react-router-dom'
//   import LoginForm from '@components/auth/LoginForm'
//   import { useAuth } from '@hooks/useAuth'
//   import { gsap } from 'gsap'
//
// FIGMA: "Aidevix Login Page" sahifasini qarang
// ============================================================

export default function LoginPage() {
  // TODO: FIRDAVS bu sahifani to'liq yozadi
  return null
}
