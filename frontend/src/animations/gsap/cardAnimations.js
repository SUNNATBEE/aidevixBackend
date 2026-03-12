import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * animateCardsOnScroll — staggered entrance when cards enter viewport
 * @param {string|HTMLElement} selector - CSS selector or NodeList
 */
export function animateCardsOnScroll(selector) {
  return gsap.fromTo(
    selector,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: selector,
        start: 'top 85%',
        once: true,
      },
    },
  )
}

/**
 * animateSectionTitle — fade-in from left for section headings
 */
export function animateSectionTitle(el) {
  if (!el) return
  return gsap.fromTo(
    el,
    { opacity: 0, x: -30 },
    {
      opacity: 1,
      x: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    },
  )
}

/**
 * animateStatsCounter — count-up animation for numeric stats
 * @param {HTMLElement[]} els - array of elements with data-target attribute
 */
export function animateStatsCounter(els) {
  els.forEach((el) => {
    const target = parseInt(el.dataset.target, 10) || 0
    const counter = { val: 0 }

    gsap.to(counter, {
      val: target,
      duration: 2,
      ease: 'power1.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => { el.textContent = Math.round(counter.val).toLocaleString() },
    })
  })
}
