// ============================================================
// OQUVCHI  : QUDRAT
// BRANCH   : feature/qudrat-loading
// FAYL     : src/animations/gsap/pageTransitions.js
// ============================================================
//
// VAZIFA: Sahifalar o'rtasida o'tish animatsiyalarini yaratish
//
// EKSPORT QILINADIGAN FUNKSIYALAR:
//
//  1. pageEnter(el)
//     - Sahifa kirganda animatsiya:
//       - { opacity:0, y:15 } → { opacity:1, y:0 }
//       - duration: 0.45, ease: 'power2.out'
//     - Returns: gsap animation instance
//
//  2. pageExit(el)
//     - Sahifadan chiqqanda animatsiya:
//       - gsap.to(el, { opacity:0, y:-10 })
//       - duration: 0.25, ease: 'power2.in'
//     - Returns: gsap animation instance
//
// APP.JSX DA ISHLATISH:
//   import { pageEnter, pageExit } from '@animations/gsap/pageTransitions'
//   import { useRef, useEffect } from 'react'
//   import { useLocation } from 'react-router-dom'
//
//   const pageRef = useRef(null)
//   const location = useLocation()
//
//   useEffect(() => {
//     pageEnter(pageRef.current)
//   }, [location.pathname])
//
//   // JSX:
//   <div ref={pageRef}>
//     <Outlet />
//   </div>
//
// KERAKLI IMPORTLAR:
//   import { gsap } from 'gsap'
// ============================================================

export function pageEnter(el) {
  // TODO: QUDRAT bu funksiyani to'liq yozadi
}

export function pageExit(el) {
  // TODO: QUDRAT bu funksiyani to'liq yozadi
}
