// ============================================================
// OQUVCHI  : BOISXON
// BRANCH   : feature/boisxon-404
// ROUTE    : /* (catch-all — AppRouter.jsx oxirida)
// ============================================================
//
// VAZIFA: 404 xato sahifasini yaratish
//
// Bu sahifada bo'lishi kerak:
//
//  LAYOUT:
//   - min-h-screen, flex items-center justify-center
//   - Orqa fon bezaklari (ixtiyoriy: 3 ta blur circle, absolute position)
//
//  1. KATTA "404" RAQAMI:
//     - Juda katta: text-[120px] md:text-[150px]
//     - gradient-text CSS klassi (qizil → binafsha gradient)
//     - font-black font-display
//     - framer-motion scale spring animatsiya: 0 → 1.3 → 1
//     - YOKI GSAP: gsap.fromTo(ref, {scale:0, opacity:0}, {scale:1, ...})
//
//  2. ANIMATSIYALI ELEMENT (tanlash):
//     - Variant 1: Floating emoji 🚀 yoki 🔍 (yuqori-pastga bounce)
//     - Variant 2: SVG robot/astronavt rasmi
//     - Variant 3: CSS animatsiyali aylana (animate-ping)
//
//  3. MATNLAR (framer-motion stagger):
//     - "Sahifa topilmadi" — h1 (text-2xl bold)
//     - "Siz izlagan sahifa mavjud emas yoki ko'chirilgan." — p
//
//  4. TUGMALAR (3 ta):
//     - [ 🏠 Bosh sahifa ]    — Link to="/"   (btn-primary)
//     - [ ← Orqaga qayting ] — onClick={() => navigate(-1)} (btn-outline)
//     - [ 📚 Kurslar ]        — Link to="/courses" (btn-ghost)
//     - Responsive: mobile'da vertikal, desktop'da gorizontal
//
//  5. FOYDALI HAVOLALAR (ixtiyoriy):
//     - "Foydali havolalar:" kichik sarlavha
//     - 🏆 Reyting | ⭐ Top kurslar | 👤 Profil
//
//  ANIMATSIYA KETMA-KETLIGI (framer-motion delays):
//    0.0s — "404" scale spring
//    0.3s — illustratsiya fade-in
//    0.5s — sarlavha slide-up
//    0.7s — tavsif matni slide-up
//    0.9s — tugmalar slide-up
//
// KERAKLI IMPORTLAR:
//   import { Link, useNavigate } from 'react-router-dom'
//   import { motion } from 'framer-motion'
//   import { gsap } from 'gsap'    (ixtiyoriy)
//   import { useRef, useEffect } from 'react'
//
// FIGMA: "Aidevix 404 Error Page" sahifasini qarang
// ============================================================

export default function NotFoundPage() {
  // TODO: BOISXON bu sahifani to'liq yozadi
  return null
}
