// ╔══════════════════════════════════════════════════════════════╗
// ║  LoadingScreen.jsx                                           ║
// ║  OQUVCHI: QUDRAT                                             ║
// ║  Branch:  feature/qudrat-loading                             ║
// ║  Vazifa:  Sahifa birinchi marta ochilganda ko'rsatiladigan   ║
// ║           to'liq ekran loading (Three.js 3D animatsiya)      ║
// ╚══════════════════════════════════════════════════════════════╝

/**
 * Bu komponent main.jsx yoki App.jsx da ishlatiladi:
 * - Birinchi render'da 2-3 soniya ko'rsatiladi
 * - Keyin smooth exit animatsiya bilan yashiriladi
 *
 * Three.js sahna g'oyasi:
 * - Floating geometric shapes (kub, sfera, tetraedra)
 * - Aidevix logosi 3D particles bilan yig'iladi
 * - Dark space background + neon glow efekti
 *
 * Texnologiyalar:
 * - @react-three/fiber
 * - @react-three/drei (OrbitControls, Float, Text3D)
 * - GSAP (timeline animatsiya)
 * - framer-motion (exit)
 *
 * Ishlatish:
 * // main.jsx da:
 * import LoadingScreen from '@components/loading/LoadingScreen'
 */

import { useState, useEffect } from 'react'

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // TODO: QUDRAT real Three.js loading bilan almashtiradi
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer)
          setTimeout(onComplete, 300)
          return 100
        }
        return p + 5
      })
    }, 80)
    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-base-100 flex flex-col items-center justify-center z-[9999]">
      {/* TODO: QUDRAT Three.js Canvas shu yerga qo'yadi */}
      <div className="text-4xl font-bold text-primary mb-8">Aidevix</div>
      <div className="w-64 bg-base-300 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-4 text-base-content/50 text-sm">{progress}%</p>
    </div>
  )
}

export default LoadingScreen
