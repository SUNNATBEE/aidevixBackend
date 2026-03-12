// ============================================================
//  HomePage.jsx
//  KIM YOZADI : ABDUVOHID
//  BRANCH     : feature/abduvohid-home
//  ROUTE      : /
// ============================================================
//
//  BU SAHIFADA NIMA BO'LISHI KERAK:
//  ─────────────────────────────────────────────────────────
//
//  1. HERO SECTION (fullscreen, min-h-screen):
//    ┌─────────────────────────────────────────────────────┐
//    │  [Three.js canvas — orqa fon uchun 3D sahnа]        │
//    │  gradient overlay (pastga qorayib boruvchi)         │
//    │                                                     │
//    │  [• Professional dasturlash platformasi] ← badge   │
//    │                                                     │
//    │  Kod yozishni                                       │
//    │  o'zbekcha o'rgan    ← gradient-text, katta        │
//    │                                                     │
//    │  HTML, CSS, JavaScript, React ... ← subtitle       │
//    │                                                     │
//    │  [ ▶ Kurslarni ko'rish ]  [ Ro'yxatdan o'tish ]    │
//    │                                                     │
//    │  120+ Darslar  |  5,000+ Talabalar  |  6 Kategoriya│
//    │                                                     │
//    │  ↓ (scroll indicator)                               │
//    └─────────────────────────────────────────────────────┘
//
//    GSAP ANIMATSIYALAR (heroAnimations.js):
//      animateHeroEntrance({ badge, title, subtitle, btns, stats })
//      — Badge: 0.3s, Title: 0.5s, Subtitle: 0.7s, Btns: 0.9s, Stats: 1.1s
//      animateScrollIndicator(scrollRef.current)
//      — Yuqori-pastga bounce animatsiya
//
//    THREE.JS (HeroScene.js):
//      new HeroScene(canvasRef.current) → scene.start() → scene.destroy()
//      — Floating particles / Stars / 3D grid
//
//  2. KATEGORIYALAR SECTION:
//    ┌──────────────────────────────────────────────────────┐
//    │ "Kategoriyalar"                                      │
//    │ "Qaysi texnologiyani o'rganmoqchisiz?"               │
//    │                                                      │
//    │ [🟠 HTML] [🔵 CSS] [💨 Tailwind]                    │
//    │ [🟡 JS]   [⚛️ React] [🟢 Node.js]                   │
//    └──────────────────────────────────────────────────────┘
//    — Har bir karta: emoji + nom
//    — Link: /courses?category=html
//    — hover: scale-105 + glow effect
//    — animateCardsOnScroll() — ScrollTrigger bilan
//
//  3. SO'NGGI KURSLAR SECTION:
//    — "So'nggi kurslar" sarlavha + "Barchasini ko'rish →" link
//    — CourseFilter + CourseGrid komponenti
//    — fetchAll({ limit: 8 }) dan
//    — animateSectionTitle(ref) — ScrollTrigger
//
//  4. TOP VIDEOLAR SECTION:
//    — "Eng ko'p ko'rilgan videolar" sarlavha
//    — fetchTopVideos(6) dan olinadi
//    — 2 ustunli grid (md:grid-cols-2)
//    — VideoCard komponenti
//    — "Barcha top videolarni ko'rish →" link
//
//  5. LEADERBOARD PREVIEW (optional, Abduvohid ixtiyori):
//    — Top 3 foydalanuvchi mini-kartalar
//    — "To'liq reytingni ko'rish →" link
//
//  6. FOOTER CTA SECTION (optional):
//    — "Bugun boshlang!" sarlavha
//    — [ Bepul ro'yxatdan o'tish ] katta tugma
//
//  GSAP ANIMATSIYALAR:
//    animateHeroEntrance()  — Hero kirish
//    animateScrollIndicator() — Scroll ok
//    animateStatsCounter() — Raqamlarni hisoblash (0 → 120)
//    animateCardsOnScroll() — Kategoriya kartalar scroll trigger
//    animateSectionTitle()  — Sarlavhalar scroll trigger
//
//  THREE.JS:
//    HeroScene.js — Orqa fon 3D sahnasi (QUDRAT yozadi)
//
//  FIGMA: "Aidevix Home Page" sahifasini qarang
// ============================================================

// 📦 IMPORTLAR
import { useEffect, useRef }         from 'react'
import { Link }                      from 'react-router-dom'
import { gsap }                      from 'gsap'
import { ScrollTrigger }             from 'gsap/ScrollTrigger'
import { IoArrowDown, IoPlay }       from 'react-icons/io5'
import { motion }                    from 'framer-motion'

// Three.js sahnasi (QUDRAT yozadi)
import { HeroScene } from '@animations/three/HeroScene'

// GSAP animatsiyalar (ABDUVOHID yozadi / mavjud fayllardan)
import { animateHeroEntrance, animateScrollIndicator } from '@animations/gsap/heroAnimations'
import { animateCardsOnScroll, animateSectionTitle, animateStatsCounter } from '@animations/gsap/cardAnimations'

// Komponentlar
import CourseGrid    from '@components/courses/CourseGrid'
import CourseFilter  from '@components/courses/CourseFilter'
import VideoCard     from '@components/videos/VideoCard'
import SkeletonCard  from '@components/loading/SkeletonCard'  // QUDRAT

// Redux hooks
import { useCourses } from '@hooks/useCourses'
import { useVideos }  from '@hooks/useVideos'

// Constants
import { CATEGORIES, ROUTES } from '@utils/constants'

// GSAP plugin ro'yxatdan o'tkazish
gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  // ── Refs (GSAP animatsiyalar uchun) ───────────────────────────────────────
  const badgeRef  = useRef(null)   // "Professional platformasi" badge
  const titleRef  = useRef(null)   // "Kod yozishni o'zbekcha o'rgan"
  const subRef    = useRef(null)   // Subtitle matn
  const btnsRef   = useRef(null)   // CTA tugmalar
  const statsRef  = useRef(null)   // 120+ Darslar...
  const scrollRef = useRef(null)   // Pastga o'q
  const canvasRef = useRef(null)   // Three.js canvas
  const sceneRef  = useRef(null)   // HeroScene instance

  // ── Redux hooks ───────────────────────────────────────────────────────────
  const { courses, loading, fetchAll, fetchTop, topCourses } = useCourses()
  const { topVideos, loading: vLoading, fetchTop: fetchTopVideos } = useVideos()

  // ── Ma'lumotlarni yuklash ─────────────────────────────────────────────────
  useEffect(() => {
    fetchAll({ limit: 8 })
    fetchTop(6)
    fetchTopVideos(6)
  }, [])

  // ── Three.js hero sahnasi ─────────────────────────────────────────────────
  /*
    TODO: HeroScene.js yarating (QUDRAT):
    — Floating particles (yulduzlar)
    — 3D grid animatsiya
    — Mouse interaktivligi (optional)

    Hozircha: HeroScene.js mavjud bo'lmasa, canvas bo'sh qoladi
    Canvas'ni gradient bilan to'ldirish mumkin
  */
  useEffect(() => {
    if (canvasRef.current) {
      try {
        sceneRef.current = new HeroScene(canvasRef.current)
        sceneRef.current.start()
      } catch {
        // HeroScene hali tayyor emas — canvas bo'sh qoladi
      }
    }
    return () => {
      sceneRef.current?.destroy?.()
    }
  }, [])

  // ── GSAP Hero kirish animatsiyasi ─────────────────────────────────────────
  /*
    TODO: animateHeroEntrance() funksiyasini to'ldiring:
    — heroAnimations.js faylida ABDUVOHID yozadi
    — Ketma-ket animatsiya: badge → title → subtitle → btns → stats
    — gsap.timeline() bilan

    Hozircha: mavjud funksiya chaqiriladi
  */
  useEffect(() => {
    animateHeroEntrance({
      badge:    badgeRef.current,
      title:    titleRef.current,
      subtitle: subRef.current,
      btns:     btnsRef.current,
      stats:    statsRef.current,
    })
    animateScrollIndicator(scrollRef.current)
  }, [])

  // ── Scroll animatsiyalar ──────────────────────────────────────────────────
  /*
    TODO: ScrollTrigger animatsiyalar:
    — animateStatsCounter() — raqamlarni hisoblash (0 → 120)
    — animateCardsOnScroll() — kategoriya kartalar
    — animateSectionTitle() — sarlavhalar
  */
  useEffect(() => {
    animateStatsCounter(document.querySelectorAll('[data-target]'))
    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="overflow-x-hidden">

      {/* ─── 1. HERO SECTION ──────────────────────────────────────────── */}
      {/*
        TODO: Hero section to'liq dizayn:
        — min-h-screen
        — Three.js canvas orqa fon
        — Gradient overlay (transparentdan dark-base ga)
        — Markazlashgan kontent
        — Responsive (mobile: smaller text)
      */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-base-300 to-base-100">

        {/* Three.js canvas */}
        {/*
          TODO: canvas'ni absolute position qiling:
          className="absolute inset-0 w-full h-full"
          z-index: 0 (kontent ustida emas)
        */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-50"
          id="hero-canvas"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-base-100/20 to-base-100 pointer-events-none" />

        {/* Kontent */}
        <div className="relative z-10 container mx-auto px-4 text-center pt-20 pb-10">

          {/* Badge */}
          {/*
            TODO: Chiroyli "Professional dasturlash platformasi" badge:
            — Pill shakli (rounded-full)
            — Primary rang border + background
            — Animatsiyali nuqta (pulse)
            — GSAP fade-in delay 0.3s
          */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full
                       bg-primary/15 border border-primary/30 text-primary text-sm opacity-0"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Professional dasturlash platformasi
          </div>

          {/* Sarlavha */}
          {/*
            TODO: Katta gradient sarlavha:
            — text-5xl md:text-7xl lg:text-8xl
            — gradient-text CSS klassi
            — font-black font-display
            — 2 qator: "Kod yozishni" / "o'zbekcha o'rgan"
          */}
          <h1
            ref={titleRef}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 max-w-5xl mx-auto leading-tight opacity-0"
          >
            <span className="gradient-text">Kod yozishni</span>
            <br />
            o'zbekcha o'rgan
          </h1>

          {/* Subtitle */}
          {/*
            TODO: Qisqa, aniq tavsif matni:
            — max-w-2xl mx-auto
            — text-base-content/70
            — Barcha texnologiyalarni sanab o'ting
          */}
          <p
            ref={subRef}
            className="text-base-content/70 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed opacity-0"
          >
            HTML, CSS, JavaScript, React, TypeScript, Node.js — barchasi professional
            o'zbek tilidagi darslarda. Video darslar, real loyihalar, jonli qo'llab-quvvatlash.
          </p>

          {/* CTA tugmalar */}
          {/*
            TODO: 2 ta tugma:
            — [ ▶ Kurslarni ko'rish ] — btn-primary katta, neon effekt
            — [ Bepul ro'yxatdan o'tish ] — btn-outline
            — mobile'da vertikal, desktop'da gorizontal
          */}
          <div
            ref={btnsRef}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16 opacity-0"
          >
            <Link to={ROUTES.COURSES} className="btn btn-primary btn-lg gap-2">
              <IoPlay /> Kurslarni ko'rish
            </Link>
            <Link to={ROUTES.REGISTER} className="btn btn-outline btn-primary btn-lg">
              Bepul ro'yxatdan o'tish
            </Link>
          </div>

          {/* Statistika raqamlari */}
          {/*
            TODO: 3 ta statistika (counter animatsiya):
            — data-target={N} atributi qo'shing (animateStatsCounter uchun)
            — GSAP: 0 dan N gacha hisoblash
            — Divider | bilan ajratish
          */}
          <div
            ref={statsRef}
            className="grid grid-cols-3 gap-8 max-w-lg mx-auto opacity-0"
          >
            {[
              { label: 'Darslar',       target: 120  },
              { label: 'Talabalar',     target: 5000 },
              { label: 'Kategoriyalar', target: 7    },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="text-3xl md:text-4xl font-black gradient-text font-display"
                  data-target={stat.target}
                >
                  0
                </div>
                <div className="text-xs text-base-content/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        {/*
          TODO: Yuqori-pastga bounce animatsiya:
          — animateScrollIndicator() GSAP bilan
          — IoArrowDown ikonasi
        */}
        <div
          ref={scrollRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-base-content/40"
        >
          <IoArrowDown className="text-2xl" />
        </div>
      </section>

      {/* ─── 2. KATEGORIYALAR ─────────────────────────────────────────── */}
      {/*
        TODO: Kategoriyalar section dizayn:
        — "Kategoriyalar" sarlavha (animateSectionTitle bilan)
        — 6 ta karta (2x3 yoki 3x2 grid)
        — Har bir karta: katta emoji + nom + "N ta kurs"
        — hover: scale + glow border
        — animateCardsOnScroll() — ScrollTrigger bilan
        — Link: /courses?category=html
      */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-3xl font-black text-center mb-4">Kategoriyalar</h2>
        <p className="text-center text-base-content/60 mb-10">
          Qaysi texnologiyani o'rganmoqchisiz?
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.filter((c) => c.id !== 'all').map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              <Link
                to={`${ROUTES.COURSES}?category=${cat.id}`}
                className="card bg-base-200 p-6 text-center hover:bg-base-300 hover:border-primary/50
                           border border-base-300 transition-all duration-200 hover:scale-105 group block"
              >
                {/*
                  TODO: Karta ichida:
                  — Katta emoji (text-4xl)
                  — Kategoriya nomi (font-semibold)
                  — "N ta kurs" (kichik, base-content/60)
                  — hover: border-primary, glow effect
                */}
                <div className="text-4xl mb-3">{cat.icon}</div>
                <div className="text-sm font-semibold group-hover:text-primary transition-colors">
                  {cat.label}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── 3. SO'NGGI KURSLAR ───────────────────────────────────────── */}
      {/*
        TODO: Kurslar section dizayn:
        — Sarlavha + "Barchasini ko'rish →" (justify-between)
        — CourseFilter — kategoriya tabs
        — CourseGrid — responsive kurslar grid
        — animateSectionTitle() ScrollTrigger bilan
        — loading bo'lsa SkeletonCard
      */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black">So'nggi kurslar</h2>
            <Link to={ROUTES.COURSES} className="link link-primary text-sm">
              Barchasini ko'rish →
            </Link>
          </div>

          {/*
            TODO: CourseFilter + CourseGrid integrasiyasi:
            — CourseFilter kategoriya bosiganda useCourses().doFilter() chaqiriladi
            — CourseGrid courses, loading props qabul qiladi
          */}
          <CourseFilter />
          <div className="mt-8">
            <CourseGrid courses={courses} loading={loading} />
          </div>
        </div>
      </section>

      {/* ─── 4. TOP VIDEOLAR ──────────────────────────────────────────── */}
      {/*
        TODO: Top videolar section:
        — "Eng ko'p ko'rilgan videolar" sarlavha
        — "Barcha talabalar tomonidan yuqori baholangan darslar" subtitle
        — 2 ustunli grid (md:grid-cols-2)
        — max-w-4xl mx-auto
        — topVideos.slice(0, 6) — 6 ta top video
        — VideoCard komponenti
        — "Barcha top videolarni ko'rish →" link
        — animateCardsOnScroll() ScrollTrigger bilan
      */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-3xl font-black text-center mb-4">Eng ko'p ko'rilgan videolar</h2>
        <p className="text-center text-base-content/60 mb-10">
          Barcha talabalar tomonidan yuqori baholangan darslar
        </p>

        {vLoading ? (
          <SkeletonCard type="video" count={6} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {topVideos.slice(0, 6).map((video, i) => (
              <motion.div
                key={video._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <VideoCard video={video} index={i} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link to={ROUTES.TOP} className="btn btn-outline btn-primary">
            Barcha top videolarni ko'rish
          </Link>
        </div>
      </section>

      {/* ─── 5. LEADERBOARD PREVIEW (optional) ───────────────────────── */}
      {/*
        TODO: Leaderboard mini preview (ABDUVOHID ixtiyoriy):
        — "Top o'quvchilar" sarlavha
        — Top 3 user mini-kartalar (gorizontal)
        — "To'liq reytingni ko'rish →" link

        Misol:
        <section className="py-20 bg-base-200">
          <div className="container mx-auto px-4">
            <h2>🏆 Top o'quvchilar</h2>
            [top users cards]
            <Link to="/leaderboard">To'liq reytingni ko'rish →</Link>
          </div>
        </section>
      */}

      {/* ─── 6. FOOTER CTA (optional) ────────────────────────────────── */}
      {/*
        TODO: Quyi CTA section (ABDUVOHID ixtiyoriy):
        — Gradient background
        — "Bugun boshlang!" katta sarlavha
        — Qisqa tavsif
        — [ Bepul ro'yxatdan o'tish ] katta tugma
      */}

    </div>
  )
}
