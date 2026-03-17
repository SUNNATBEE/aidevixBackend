// ============================================================
// OQUVCHI  : ABDUVOHID
// BRANCH   : feature/abduvohid-home
// ROUTE    : /
// ============================================================
//
// VAZIFA: Bosh sahifani yaratish
//
// Bu sahifada bo'lishi kerak:
//
//  1. HERO SECTION (min-h-screen, fullscreen)
//     - Three.js 3D animatsiya orqa fon uchun (HeroScene.js — QUDRAT yozadi)
//     - Gradient overlay
//     - "Professional dasturlash platformasi" badge
//     - Katta sarlavha: "Kod yozishni o'zbekcha o'rgan"
//     - Subtitle matni
//     - 2 ta CTA tugma: "Kurslarni ko'rish" + "Ro'yxatdan o'tish"
//     - Statistika: 120+ Darslar | 5000+ Talabalar | 6 Kategoriya
//     - Scroll indicator (pastga o'q)
//     - GSAP animatsiyalar: animateHeroEntrance(), animateScrollIndicator()
//
//  2. KATEGORIYALAR SECTION
//     - "Kategoriyalar" sarlavha
//     - 6 ta karta: HTML, CSS, Tailwind, JS, React, Node.js
//     - Har karta: katta emoji + nom
//     - hover: scale-105 + glow effekt
//     - Link: /courses?category=html
//     - GSAP: animateCardsOnScroll() ScrollTrigger bilan
//
//  3. SO'NGGI KURSLAR SECTION
//     - "So'nggi kurslar" sarlavha + "Barchasini ko'rish →" link
//     - CourseFilter komponenti (kategoriya tabs)
//     - CourseGrid komponenti (kurslar grid)
//     - API: GET /api/courses?limit=8
//     - useCourses() hook dan ma'lumot olish
//
//  4. TOP VIDEOLAR SECTION
//     - "Eng ko'p ko'rilgan videolar" sarlavha
//     - 2 ustunli grid (md:grid-cols-2)
//     - VideoCard komponenti — 6 ta top video
//     - "Barcha top videolarni ko'rish →" link
//     - SkeletonCard yuklanayotganda
//
//  5. FOOTER CTA (ixtiyoriy)
//     - "Bugun boshlang!" katta sarlavha
//     - Gradient background
//     - "Bepul ro'yxatdan o'tish" katta tugma
//
// HOOKS:
//   useCourses() → { courses, loading, fetchAll, topCourses, fetchTop }
//   useVideos()  → { topVideos, loading, fetchTop }
//
// ANIMATSIYALAR (animations/gsap/heroAnimations.js va cardAnimations.js):
//   animateHeroEntrance({ badge, title, subtitle, btns, stats })
//   animateScrollIndicator(scrollRef.current)
//   animateStatsCounter(document.querySelectorAll('[data-target]'))
//   animateCardsOnScroll('.category-card')
//   animateSectionTitle(sectionTitleRef.current)
//
// THREE.JS:
//   import { HeroScene } from '@animations/three/HeroScene'
//   const scene = new HeroScene(canvasRef.current)
//   scene.start()   — sahifa ochilganda
//   scene.destroy() — komponent o'chirilganda (cleanup)
//
// FIGMA: "Aidevix Home Page" sahifasini qarang
// ============================================================

export default function HomePage() {
  // TODO: ABDUVOHID bu sahifani to'liq yozadi
  return null
}
