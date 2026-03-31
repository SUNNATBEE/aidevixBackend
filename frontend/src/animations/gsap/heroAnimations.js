import { gsap } from 'gsap'

// ============================================================
// OQUVCHI  : QUDRAT
// BRANCH   : feature/qudrat-loading
// FAYL     : src/animations/gsap/heroAnimations.js
// ============================================================

/**
 * Animates the entrance of the Hero section elements
 * @param {Object} elements - Refs to hero elements
 */
export function animateHeroEntrance({ badge, title, subtitle, btns, stats }) {
  const tl = gsap.timeline({
    defaults: { ease: 'power3.out', duration: 0.8 }
  })

  // Start with a small delay
  tl.delay(0.2)

  if (badge) {
    tl.fromTo(badge, 
      { opacity: 0, y: -20 }, 
      { opacity: 1, y: 0, duration: 0.5 }
    )
  }

  if (title) {
    tl.fromTo(title, 
      { opacity: 0, y: 40 }, 
      { opacity: 1, y: 0 }, 
      "-=0.3"
    )
  }

  if (subtitle) {
    tl.fromTo(subtitle, 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.6 }, 
      "-=0.5"
    )
  }

  if (btns) {
    const btnElements = btns.children || btns
    tl.fromTo(btnElements, 
      { opacity: 0, y: 20, scale: 0.9 }, 
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        stagger: 0.1,
        duration: 0.5 
      }, 
      "-=0.4"
    )
  }

  if (stats) {
    const statElements = stats.children || stats
    tl.fromTo(statElements, 
      { opacity: 0, y: 20 }, 
      { 
        opacity: 1, 
        y: 0, 
        stagger: 0.15,
        ease: 'back.out(1.7)'
      }, 
      "-=0.3"
    )
  }

  return tl
}

/**
 * Animates a floating scroll indicator
 * @param {HTMLElement} el 
 */
export function animateScrollIndicator(el) {
  if (!el) return

  return gsap.to(el, {
    y: 10,
    opacity: 0.6,
    repeat: -1,
    yoyo: true,
    duration: 1.2,
    ease: 'power1.inOut'
  })
}
