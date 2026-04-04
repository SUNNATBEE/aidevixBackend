import { useRef, useEffect, useState } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion'
import { gsap } from 'gsap'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
})

export default function NotFoundPage() {
  const navigate = useRouter()
  const numRef = useRef(null)

  // ✅ Yordam popup state
  const [openHelp, setOpenHelp] = useState(false)

  useEffect(() => {
    gsap.fromTo(
      numRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }
    )
  }, [])

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0b0f1a] overflow-hidden px-4">

      {/* Glow */}
      <div className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full top-20 left-20"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full bottom-20 right-20"></div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-xl w-full">

        {/* 404 */}
        <div
          ref={numRef}
          className="text-[140px] md:text-[180px] font-black leading-none"
          style={{
            background: 'linear-gradient(135deg, #e11d48, #6366f1, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </div>

        <motion.h1
          className="text-2xl md:text-3xl font-bold text-white mt-4"
          {...fadeUp(0.3)}
        >
          Sahifa topilmadi
        </motion.h1>

        <motion.p
          className="text-gray-400 mt-2 text-base md:text-lg"
          {...fadeUp(0.45)}
        >
          Siz qidirayotgan sahifa mavjud emas yoki ko‘chirilgan bo‘lishi mumkin.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-6"
          {...fadeUp(0.6)}
        >
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-lg hover:scale-105 transition"
          >
            Bosh sahifa
          </Link>

          <button
            onClick={() => router.push(-1)}
            className="px-6 py-3 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800 transition"
          >
            ← Ortga qaytish
          </button>
        </motion.div>

        {/* Yordam portali */}
        <motion.p
          className="text-sm text-gray-500 mt-6"
          {...fadeUp(0.75)}
        >
          Yordam kerakmi?{' '}
          <button
            onClick={() => setOpenHelp(true)}
            className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition"
          >
            Yordam portali
          </button>
        </motion.p>

      </div>

      {/* ✅ POPUP / MODAL */}
      {openHelp && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#111827] p-6 rounded-2xl w-[90%] max-w-sm text-center shadow-xl relative">

            {/* Close */}
            <button
              onClick={() => setOpenHelp(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-white mb-4">
              Yordam markazi
            </h2>

            <p className="text-gray-400 mb-4">
              Biz bilan bog‘laning:
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="tel:+998901234567"
                className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg transition"
              >
                📞 +998 99 193 99 66
              </a>

              <a
                href="mailto:support@aidevix.com"
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition"
              >
                📧 support@gmail.com
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}