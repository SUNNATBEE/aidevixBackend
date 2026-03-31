import { gsap } from 'gsap'

// ============================================================
// OQUVCHI  : QUDRAT
// BRANCH   : feature/qudrat-loading
// FAYL     : src/animations/gsap/pageTransitions.js
// ============================================================

/**
 * Entrance animation for pages
 * @param {HTMLElement} el 
 */
export function pageEnter(el) {
  if (!el) return

  // Kill any existing animations on this element
  gsap.killTweensOf(el)

  return gsap.fromTo(el, 
    { 
      opacity: 0, 
      y: 15,
      filter: "blur(5px)"
    }, 
    { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      duration: 0.5, 
      ease: 'power2.out',
      clearProps: 'all' // Clean up inline styles after animation
    }
  )
}

/**
 * Exit animation for pages
 * @param {HTMLElement} el 
 */
export function pageExit(el) {
  if (!el) return

  return gsap.to(el, { 
    opacity: 0, 
    y: -10, 
    filter: "blur(5px)",
    duration: 0.3, 
    ease: 'power2.in' 
  })
}
