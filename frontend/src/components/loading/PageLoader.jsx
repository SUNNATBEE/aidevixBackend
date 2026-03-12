// ╔══════════════════════════════════════════════════════════════╗
// ║  PageLoader.jsx                                              ║
// ║  OQUVCHI: QUDRAT                                             ║
// ║  Branch:  feature/qudrat-loading                             ║
// ║  Vazifa:  Sahifa yuklanayotganda full-screen 3D loader       ║
// ╚══════════════════════════════════════════════════════════════╝

/**
 * Bu komponentda ko'rsatilishi kerak:
 * - To'liq ekran dark overlay (bg-base-100)
 * - Three.js yoki Canvas animatsiya (logo shakli)
 * - "Aidevix" logosi animatsiyali paydo bo'lishi
 * - Loading progress bar (0% → 100%)
 * - GSAP yoki framer-motion bilan smooth kirish/chiqish
 *
 * Ishlatish:
 * import PageLoader from '@components/loading/PageLoader'
 * // App.jsx yoki AppRouter.jsx da Suspense fallback sifatida
 * <Suspense fallback={<PageLoader />}>
 *
 * Texnologiyalar:
 * - Three.js (@react-three/fiber + @react-three/drei)
 * - GSAP
 * - framer-motion (exit animation uchun)
 */

const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-base-100 flex items-center justify-center z-50">
      {/* TODO: QUDRAT shu yerga 3D loading animatsiya yozadi */}
      <div className="loading loading-spinner loading-lg text-primary"></div>
    </div>
  )
}

export default PageLoader
