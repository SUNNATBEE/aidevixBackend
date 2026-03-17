// ============================================================
// OQUVCHI  : QUDRAT
// BRANCH   : feature/qudrat-loading
// FAYL     : src/animations/gsap/cardAnimations.js
// ============================================================
//
// VAZIFA: Kart va seksiya animatsiyalarini GSAP ScrollTrigger bilan yaratish
//
// EKSPORT QILINADIGAN FUNKSIYALAR:
//
//  1. animateCardsOnScroll(selector)
//     - Viewport'ga kirganida staggered kirish animatsiyasi:
//       - { opacity:0, y:50 } → { opacity:1, y:0 }
//       - duration: 0.6, stagger: 0.1
//       - ScrollTrigger: { trigger: selector, start: 'top 85%', once: true }
//     - Returns: gsap animation instance
//
//  2. animateSectionTitle(el)
//     - Chap tomondan kirish animatsiyasi:
//       - { opacity:0, x:-30 } → { opacity:1, x:0 }
//       - duration: 0.7, ease: 'power2.out'
//       - ScrollTrigger: { trigger: el, start: 'top 88%', once: true }
//
//  3. animateStatsCounter(els)
//     - Raqam sanash animatsiyasi (count-up):
//       - els: HTMLElement array, har biri data-target atributiga ega
//       - gsap.to(counter, { val: target, duration: 2, ease: 'power1.out' })
//       - onUpdate: el.textContent = Math.round(counter.val).toLocaleString()
//       - ScrollTrigger bilan: start: 'top 90%', once: true
//
// ISHLATISH:
//   import { animateCardsOnScroll, animateSectionTitle } from '@animations/gsap/cardAnimations'
//   import { ScrollTrigger } from 'gsap/ScrollTrigger'
//   import { gsap } from 'gsap'
//   gsap.registerPlugin(ScrollTrigger)
//
//   useEffect(() => {
//     animateCardsOnScroll('.course-card')
//     animateSectionTitle(titleRef.current)
//   }, [])
//
// KERAKLI IMPORTLAR:
//   import { gsap } from 'gsap'
//   import { ScrollTrigger } from 'gsap/ScrollTrigger'
// ============================================================

export function animateCardsOnScroll(selector) {
  // TODO: QUDRAT bu funksiyani to'liq yozadi
}

export function animateSectionTitle(el) {
  // TODO: QUDRAT bu funksiyani to'liq yozadi
}

export function animateStatsCounter(els) {
  // TODO: QUDRAT bu funksiyani to'liq yozadi
}
