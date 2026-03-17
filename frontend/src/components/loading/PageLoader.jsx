// ============================================================
// OQUVCHI  : QUDRAT
// BRANCH   : feature/qudrat-loading
// FAYL     : src/components/loading/PageLoader.jsx
// ============================================================
//
// VAZIFA: Lazy-loaded sahifalar yuklanayotganda ko'rsatiladigan
//         to'liq ekran loader (Suspense fallback sifatida)
//
// TARKIBI:
//   - fixed inset-0 bg-base-100 z-50
//   - Markazda: Aidevix logosi + spinner yoki kichik animatsiya
//   - DaisyUI loading-spinner yoki Three.js mini sahna
//
// ISHLATISH (AppRouter.jsx da):
//   import PageLoader from '@components/loading/PageLoader'
//   <Suspense fallback={<PageLoader />}>
//     {/* Lazy sahifalar */}
//   </Suspense>
//
// KERAKLI IMPORTLAR:
//   import { motion } from 'framer-motion'
// ============================================================

const PageLoader = () => {
  // TODO: QUDRAT bu komponentni to'liq yozadi
  return null
}

export default PageLoader
