import { gsap } from 'gsap'

/**
 * animateHeroEntrance — runs on Hero section mount
 * Animates: badge → title → subtitle → CTA buttons → stats
 *
 * @param {Object} refs - { badge, title, subtitle, btns, stats }
 */
export function animateHeroEntrance({ badge, title, subtitle, btns, stats }) {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  if (badge)    tl.fromTo(badge,    { opacity: 0, y: -20 },           { opacity: 1, y: 0, duration: 0.5 })
  if (title)    tl.fromTo(title,    { opacity: 0, y: 40 },            { opacity: 1, y: 0, duration: 0.8 }, '-=0.2')
  if (subtitle) tl.fromTo(subtitle, { opacity: 0, y: 30 },            { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
  if (btns)     tl.fromTo(btns,     { opacity: 0, y: 20, scale: 0.9 },{ opacity: 1, y: 0, scale: 1, duration: 0.5 }, '-=0.2')
  if (stats)    tl.fromTo(stats.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, stagger: 0.15, duration: 0.5 }, '-=0.1')

  return tl
}

/**
 * animateScrollIndicator — bouncing scroll arrow
 * @param {HTMLElement} el
 */
export function animateScrollIndicator(el) {
  if (!el) return
  gsap.to(el, {
    y: 10,
    repeat: -1,
    yoyo: true,
    duration: 0.8,
    ease: 'power1.inOut',
  })
}
