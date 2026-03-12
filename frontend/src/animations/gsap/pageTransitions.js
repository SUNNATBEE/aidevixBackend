import { gsap } from 'gsap'

/** Page enter animation */
export function pageEnter(el) {
  return gsap.fromTo(
    el,
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
  )
}

/** Page exit animation */
export function pageExit(el) {
  return gsap.to(el, { opacity: 0, y: -10, duration: 0.25, ease: 'power2.in' })
}
