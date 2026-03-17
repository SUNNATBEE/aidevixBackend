// ============================================================
// OQUVCHI  : ABDUVOHID
// BRANCH   : feature/abduvohid-home
// FAYL     : src/components/layout/Navbar.jsx
// ============================================================
//
// VAZIFA: Navigatsiya panelini (Navbar) yaratish
//
// NAVBAR TARKIBI:
//
//  1. LOGO (chap tomon):
//     - "Aidevix" text yoki logo
//     - font-black text-primary
//     - Link to="/"
//
//  2. MARKAZIY MENYU (faqat desktop'da: hidden lg:flex):
//     - Kurslar → /courses
//     - Top kurslar → /top-courses
//     - Leaderboard → /leaderboard
//     - DaisyUI: menu menu-horizontal gap-2
//
//  3. O'NG TOMON — 2 holat:
//
//     a) KIRISH BO'LMAGAN (isLoggedIn = false):
//        - "Kirish"          → Link to="/login"   (btn btn-ghost btn-sm)
//        - "Ro'yxatdan o'tish" → Link to="/register" (btn btn-primary btn-sm)
//
//     b) KIRGAN (isLoggedIn = true):
//        - Avatar + dropdown:
//          - Profil     → /profile
//          - Obuna holati → /subscription
//          - Ajratgich (divider)
//          - Chiqish    → dispatch(logout()) + navigate('/')
//
//  4. MOBIL HAMBURGER (lg:hidden):
//     - Ochiq/yopiq holat (useState)
//     - Barcha linklar dropdown yoki drawer'da vertikal
//
//  STICKY + GLASSMORPHISM:
//   - fixed top-0 left-0 right-0 z-40
//   - bg-base-100/80 backdrop-blur-md
//   - border-b border-base-content/10
//   - scroll bo'lganda bg-dark-base/90 shadow-card (onScroll effect)
//
// GSAP kirish animatsiyasi (ixtiyoriy):
//   - gsap.fromTo(navRef.current, { y: -80, opacity: 0 }, { y: 0, opacity: 1 })
//
// HOOKS:
//   useSelector(selectUser)       → { username, avatar }
//   useSelector(selectIsLoggedIn) → true/false
//   useDispatch() + logout()      → Chiqish
//   useNavigate()                 → yo'naltirish
//
// KERAKLI IMPORTLAR:
//   import { Link, NavLink, useNavigate } from 'react-router-dom'
//   import { useSelector, useDispatch } from 'react-redux'
//   import { selectUser, selectIsLoggedIn, logout } from '@store/slices/authSlice'
//   import { useState, useEffect, useRef } from 'react'
//   import { gsap } from 'gsap'  (ixtiyoriy)
// ============================================================

export default function Navbar() {
  // TODO: ABDUVOHID bu komponentni to'liq yozadi
  return null
}
