// ============================================================
// OQUVCHI  : QUDRAT
// BRANCH   : feature/qudrat-loading
// FAYL     : src/animations/gsap/heroAnimations.js
// ============================================================
//
// VAZIFA: Hero sektsiyasi kirish animatsiyalarini GSAP bilan yaratish
//
// EKSPORT QILINADIGAN FUNKSIYALAR:
//
//  1. animateHeroEntrance({ badge, title, subtitle, btns, stats })
//     - GSAP timeline bilan ketma-ket animatsiya:
//       a) badge:    { opacity:0, y:-20 } → { opacity:1, y:0 }       (0.5s)
//       b) title:    { opacity:0, y:40  } → { opacity:1, y:0 }       (0.8s, overlap -=0.2)
//       c) subtitle: { opacity:0, y:30  } → { opacity:1, y:0 }       (0.6s, overlap -=0.4)
//       d) btns:     { opacity:0, y:20, scale:0.9 } → { ...scale:1 } (0.5s, overlap -=0.2)
//       e) stats:    stagger 0.15s har bir child uchun
//     - ease: 'power3.out'
//     - Returns: gsap.timeline() instance
//
//  2. animateScrollIndicator(el)
//     - Pastga-yuqoriga bounce animatsiyasi (gsap.to):
//       - y: 10, repeat:-1, yoyo:true, duration:0.8
//       - ease: 'power1.inOut'
//
// HOMEPAGE'DA ISHLATISH:
//   import { animateHeroEntrance, animateScrollIndicator } from '@animations/gsap/heroAnimations'
//   import { useEffect, useRef } from 'react'
//
//   const titleRef = useRef(null)
//   const btnsRef  = useRef(null)
//
//   useEffect(() => {
//     animateHeroEntrance({
//       title: titleRef.current,
//       btns: btnsRef.current,
//     })
//   }, [])
//
// KERAKLI IMPORTLAR:
//   import { gsap } from 'gsap'
// ============================================================

export function animateHeroEntrance({ badge, title, subtitle, btns, stats }) {
  // TODO: QUDRAT bu funksiyani to'liq yozadi
}

export function animateScrollIndicator(el) {
  // TODO: QUDRAT bu funksiyani to'liq yozadi
}
