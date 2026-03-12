import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { IoArrowDown, IoPlay } from 'react-icons/io5'

import { HeroScene } from '@animations/three/HeroScene'
import { animateHeroEntrance, animateScrollIndicator } from '@animations/gsap/heroAnimations'
import { animateCardsOnScroll, animateSectionTitle, animateStatsCounter } from '@animations/gsap/cardAnimations'
import CourseGrid from '@components/courses/CourseGrid'
import CourseFilter from '@components/courses/CourseFilter'
import { useCourses } from '@hooks/useCourses'
import { useVideos } from '@hooks/useVideos'
import VideoCard from '@components/videos/VideoCard'
import { CATEGORIES, ROUTES } from '@utils/constants'

export default function HomePage() {
  // Refs for GSAP
  const badgeRef    = useRef(null)
  const titleRef    = useRef(null)
  const subRef      = useRef(null)
  const btnsRef     = useRef(null)
  const statsRef    = useRef(null)
  const scrollRef   = useRef(null)
  const canvasRef   = useRef(null)
  const sceneRef    = useRef(null)

  // Redux
  const { courses, loading, fetchAll, fetchTop, topCourses } = useCourses()
  const { topVideos, fetchTop: fetchTopVideos }               = useVideos()

  useEffect(() => {
    fetchAll({ limit: 8 })
    fetchTop(6)
    fetchTopVideos(6)
  }, [])

  // Three.js hero scene
  useEffect(() => {
    if (canvasRef.current) {
      sceneRef.current = new HeroScene(canvasRef.current)
      sceneRef.current.start()
    }
    return () => sceneRef.current?.destroy()
  }, [])

  // GSAP hero entrance
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

  // Scroll animations for sections
  useEffect(() => {
    animateStatsCounter(document.querySelectorAll('[data-target]'))
    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  return (
    <div className="overflow-x-hidden">
      {/* ───── HERO ───── */}
      <section className="relative min-h-screen flex items-center justify-center bg-hero-gradient overflow-hidden">
        {/* Three.js canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" id="hero-canvas" />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-base/20 to-dark-base pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 section-container text-center pt-20 pb-10">
          {/* Badge */}
          <div ref={badgeRef} className="inline-flex items-center gap-2 mb-6
                px-4 py-2 rounded-full bg-primary-500/15 border border-primary-500/30 text-primary-300 text-sm">
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
            Professional dasturlash platformasi
          </div>

          {/* Title */}
          <h1 ref={titleRef} className="section-title text-5xl md:text-7xl lg:text-8xl mb-6 max-w-5xl mx-auto">
            <span className="gradient-text">Kod yozishni</span>
            <br />
            o'zbekcha o'rgan
          </h1>

          {/* Subtitle */}
          <p ref={subRef} className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            HTML, CSS, JavaScript, React, TypeScript, Node.js — barchasi professional
            o'zbek tilidagi darslarda. Video darslar, real loyihalar, jonli qo'llab-quvvatlash.
          </p>

          {/* CTA */}
          <div ref={btnsRef} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to={ROUTES.COURSES} className="btn-neon btn btn-lg gap-2">
              <IoPlay /> Kurslarni ko'rish
            </Link>
            <Link to={ROUTES.REGISTER} className="btn btn-outline btn-primary btn-lg">
              Bepul ro'yxatdan o'tish
            </Link>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { label: 'Darslar',      target: 120 },
              { label: 'Talabalar',    target: 5000 },
              { label: 'Kategoriyalar', target: 6 },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold gradient-text font-display"
                     data-target={stat.target}>0</div>
                <div className="text-xs text-zinc-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div ref={scrollRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-500">
          <IoArrowDown className="text-2xl" />
        </div>
      </section>

      {/* ───── CATEGORIES ───── */}
      <section className="py-20 section-container">
        <h2 className="section-title text-center mb-4">Kategoriyalar</h2>
        <p className="text-center text-zinc-400 mb-10">
          Qaysi texnologiyani o'rganmoqchisiz?
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
            <Link
              key={cat.id}
              to={`${ROUTES.COURSES}?category=${cat.id}`}
              className="glass-card p-6 text-center card-hover group"
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <div className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors">
                {cat.label}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ───── FEATURED COURSES ───── */}
      <section className="py-20 bg-dark-surface">
        <div className="section-container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">So'nggi kurslar</h2>
            <Link to={ROUTES.COURSES} className="text-primary-400 hover:underline text-sm">
              Barchasini ko'rish →
            </Link>
          </div>
          <CourseFilter />
          <div className="mt-8">
            <CourseGrid courses={courses} loading={loading} />
          </div>
        </div>
      </section>

      {/* ───── TOP VIDEOS ───── */}
      <section className="py-20 section-container">
        <h2 className="section-title text-center mb-4">Eng ko'p ko'rilgan videolar</h2>
        <p className="text-center text-zinc-400 mb-10">Barcha talabalar tomonidan yuqori baholangan darslar</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {topVideos.slice(0, 6).map((video, i) => (
            <VideoCard key={video._id} video={video} index={i} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to={ROUTES.TOP} className="btn btn-outline btn-primary">
            Barcha top videolarni ko'rish
          </Link>
        </div>
      </section>
    </div>
  )
}
