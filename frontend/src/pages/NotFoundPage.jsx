// ============================================================
//  NotFoundPage.jsx
//  KIM YOZADI : BOISXON
//  BRANCH     : feature/boisxon-404
//  ROUTE      : /* (catch-all, AppRouter.jsx oxirida)
// ============================================================
//
//  BU SAHIFADA NIMA BO'LISHI KERAK:
//  ─────────────────────────────────────────────────────────
//  FULLSCREEN markazlashgan konteyner (min-h-screen flex center)
//
//  1. "404" — KATTA ANIMATSIYALI MATN:
//       — Font hajmi: 120px–150px
//       — gradient-text CSS klassi (qizil-binafsha gradient)
//       — framer-motion: scale(0) → scale(1.2) → scale(1) spring
//       — GSAP: fromTo opacity/scale (alternativa)
//
//  2. ILUSTRATSIYA yoki ANIMATSIYALI ELEMENT:
//       — SVG "yo'qolgan astronavt" yoki robot
//       — CSS: yuqori-pastga floating animatsiya (keyframes)
//       — Yoki 3 ta aylana (bg-blur, animatsiyali)
//
//  3. MATNLAR:
//       — "Sahifa topilmadi" — h1 (2xl bold)
//       — "Siz izlagan sahifa mavjud emas yoki ko'chirilgan." — p
//       — framer-motion: stagger children (0.1s kechikish)
//
//  4. TUGMALAR (uchta):
//       [ 🏠 Bosh sahifa ]   — Link to="/"
//       [ ← Orqaga qayting ] — onClick={() => navigate(-1)}
//       [ 📚 Kurslar ]        — Link to="/courses"
//       — framer-motion: pastdan yuqoriga animatsiya
//
//  5. QO'SHIMCHA (optional):
//       "Qiziqarli sahifalar:" bilan:
//       — /courses — Barcha kurslar
//       — /leaderboard — Reyting
//       — /top-courses — Top kurslar
//
//  ANIMATSIYA KETMA-KETLIGI:
//    0.0s — "404" scale spring
//    0.3s — SVG/ilustratsiya fade-in
//    0.5s — "Sahifa topilmadi" slide-up
//    0.7s — Tavsif matni slide-up
//    0.9s — Tugmalar slide-up
//
//  GSAP ishlatish:
//    gsap.fromTo(ref, {opacity:0, scale:0.9}, {opacity:1, scale:1, duration:0.5, ease:'back.out(1.2)'})
//
//  FIGMA: "Aidevix 404 Error" sahifasi
// ============================================================

// 📦 IMPORTLAR
import { Link, useNavigate }            from 'react-router-dom'
import { useEffect, useRef }            from 'react'
import { motion, AnimatePresence }      from 'framer-motion'  // npm install framer-motion
import { gsap }                         from 'gsap'
import { ROUTES }                       from '@utils/constants'

// ─────────────────────────────────────────────────────────────────────────────
export default function NotFoundPage() {
  const navigate  = useNavigate()
  const numberRef = useRef(null)
  const wrapRef   = useRef(null)

  // ── GSAP kirish animatsiyasi ───────────────────────────────────────────────
  useEffect(() => {
    // Butun konteyner fade + scale
    gsap.fromTo(
      wrapRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.2)' },
    )
    /*
      TODO: Qo'shimcha GSAP animatsiyalar:
      — "404" raqami uchun alohida scale animatsiya
      — numberRef elementini animate qilish
      gsap.fromTo(numberRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, delay: 0.1, ease: 'elastic.out(1, 0.5)' }
      )
    */
  }, [])

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-base-100">
      {/*
        TODO: Orqa fon bezaklari qo'shing:
        — 3 ta katta blur circle (absolute, pointer-events-none)
        — rang: primary/20, accent/10
        Misol:
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-error/10 rounded-full blur-3xl pointer-events-none" />
      */}

      <div ref={wrapRef} className="text-center max-w-md w-full relative">

        {/* ── "404" katta raqam ─────────────────────────────────────────── */}
        {/*
          TODO: Chiroyli gradient-text 404 raqami:
          — gradient-text CSS klassi (qizil → binafsha)
          — Juda katta: text-[120px] md:text-[160px]
          — font-black font-display
          — framer-motion scale spring: 0 → 1.3 → 1
          — GSAP bilan ham animatsiya qilishingiz mumkin (ref orqali)
        */}
        <motion.div
          ref={numberRef}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.3, 1], opacity: 1 }}
          transition={{ duration: 0.7, times: [0, 0.6, 1], type: 'spring', damping: 10 }}
          className="text-[120px] md:text-[150px] font-black leading-none mb-4 gradient-text font-display"
        >
          404
        </motion.div>

        {/* ── Ilustratsiya ──────────────────────────────────────────────── */}
        {/*
          TODO: Chiroyli SVG yoki emoji animatsiya:
          VARIANT 1 — Floating emoji:
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="text-6xl mb-6"
            >
              🚀
            </motion.div>

          VARIANT 2 — SVG robot/astronaut:
            <div className="w-48 h-48 mx-auto mb-6 animate-bounce">
              <img src="/images/404-robot.svg" alt="404" />
            </div>

          VARIANT 3 — CSS animatsiyali aylana:
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
              <div className="absolute inset-4 rounded-full bg-primary/20 flex items-center justify-center text-4xl">
                😵
              </div>
            </div>
        */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          {/* TODO: Mana shu qatorni o'zingiz to'ldiring */}
          <motion.span
            animate={{ y: [-8, 8, -8] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="text-7xl inline-block"
          >
            🔍
          </motion.span>
        </motion.div>

        {/* ── Matnlar ───────────────────────────────────────────────────── */}
        {/*
          TODO: Stagger animatsiya:
          — "Sahifa topilmadi" h1
          — Tavsif p
          — framer-motion variants bilan stagger qilish

          Misol:
          const containerVariants = {
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }
          const itemVariants = {
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }
        */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="text-2xl md:text-3xl font-bold mb-3"
        >
          Sahifa topilmadi
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="text-base-content/60 mb-8 leading-relaxed"
        >
          Siz izlagan sahifa mavjud emas yoki ko'chirilgan.
          <br />
          Quyidagi havolalardan birini sinab ko'ring.
        </motion.p>

        {/* ── Tugmalar ──────────────────────────────────────────────────── */}
        {/*
          TODO: 3 ta tugma:
          1. "Bosh sahifa" — btn-primary (to'liq kenglik yoki auto)
          2. "← Orqaga qayting" — btn-outline navigate(-1)
          3. "Kurslar" — btn-ghost

          framer-motion: pastdan yuqoriga, delay 0.65s
          Responsive: mobile'da vertikal, desktop'da gorizontal
        */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          {/* Bosh sahifa */}
          <Link to={ROUTES.HOME} className="btn btn-primary gap-2">
            🏠 Bosh sahifa
          </Link>

          {/* Orqaga */}
          {/*
            TODO: navigate(-1) — brauzerdagi oldingi sahifaga qaytadi
            Agar oldingi sahifa yo'q bo'lsa → navigate(ROUTES.HOME)
          */}
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline btn-primary gap-2"
          >
            ← Orqaga qayting
          </button>

          {/* Kurslar */}
          <Link to={ROUTES.COURSES} className="btn btn-ghost gap-2">
            📚 Kurslar
          </Link>
        </motion.div>

        {/* ── Qo'shimcha havolalar (optional) ──────────────────────────── */}
        {/*
          TODO: "Qiziqarli sahifalar:" bilan popular links ro'yxati
          — /leaderboard — 🏆 Reyting
          — /top-courses — ⭐ Top Kurslar
          — /profile — 👤 Profil

          Misol:
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
            className="mt-8 pt-6 border-t border-base-300"
          >
            <p className="text-sm text-base-content/40 mb-3">Foydali havolalar:</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link to="/leaderboard" className="link link-primary text-sm">🏆 Reyting</Link>
              <Link to="/top-courses" className="link link-primary text-sm">⭐ Top kurslar</Link>
            </div>
          </motion.div>
        */}

      </div>
    </div>
  )
}
