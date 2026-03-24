<<<<<<< Updated upstream
// ============================================================
// OQUVCHI  : SUHROB
// BRANCH   : feature/suhrob-leaderboard
// FAYL     : src/components/leaderboard/LevelUpModal.jsx
// ============================================================
//
// VAZIFA: Foydalanuvchi yangi levelga chiqqanda ko'rsatiladigan
//         modal overlay
//
// MODAL TARKIBI:
//   1. Confetti animatsiyasi (npm install react-confetti)
//   2. Yangi level raqami (katta, framer-motion scale spring)
//   3. "Tabriklaymiz!" sarlavha + level nomi
//   4. Statistika: Joriy XP, Session XP, Daraja, Quiz ball
//   5. "Davom etish →" tugmasi → onClose()
//   6. "Telegramda ulashish" tugmasi
//
// OVERLAY:
//   - fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999]
//   - framer-motion AnimatePresence
//
// PROPS:
//   - isOpen: boolean
//   - level: number — yangi level
//   - levelName: string — "Mantiq Ustasi" kabi
//   - xp: number — jami XP
//   - onClose: function
//
// KERAKLI IMPORTLAR:
//   import Confetti from 'react-confetti'           (npm install react-confetti)
//   import { useWindowSize } from 'react-use'       (npm install react-use)
//   import { motion, AnimatePresence } from 'framer-motion'
// ============================================================

const LevelUpModal = ({ isOpen, level, levelName, xp, onClose }) => {
  // TODO: SUHROB bu komponentni to'liq yozadi
  return null
=======
// LevelUpModal.jsx — SUHROB
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import { HiSparkles } from 'react-icons/hi2'
import { FaTelegramPlane } from 'react-icons/fa'

const LevelUpModal = ({ isOpen, level, levelName, xp, quizResult, onClose }) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handler = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const handleShare = () => {
    const text = `Aidevix platformasida ${level}-darajaga yetdim! "${levelName}" unvonini oldim! 🎉`
    window.open(`https://t.me/share/url?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            numberOfPieces={350}
            gravity={0.12}
            recycle={false}
            colors={['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']}
          />

          <motion.div
            initial={{ scale: 0.5, y: 60, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 280 }}
            className="relative bg-[#0f1117] border border-primary/40 rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl"
            style={{ boxShadow: '0 0 40px rgba(99,102,241,0.25), 0 0 80px rgba(99,102,241,0.1)' }}
          >
            {/* Sparkles */}
            <div className="absolute top-4 right-4 text-yellow-400 animate-pulse">
              <HiSparkles size={22} />
            </div>
            <div className="absolute top-4 left-4 text-indigo-400 animate-pulse" style={{ animationDelay: '0.5s' }}>
              <HiSparkles size={18} />
            </div>
            <div className="absolute bottom-24 right-6 text-pink-400 animate-pulse" style={{ animationDelay: '1s' }}>
              <HiSparkles size={14} />
            </div>

            {/* Level badge */}
            <div className="flex flex-col items-center mb-4">
              <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/50 flex flex-col items-center justify-center">
                <span className="text-[10px] text-primary/70 uppercase tracking-widest">Daraja</span>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-4xl font-black text-white leading-none"
                >
                  {level}
                </motion.span>
              </div>
            </div>

            {/* Title */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <h2 className="text-2xl font-bold text-white">Tabriklaymiz!</h2>
              <p className="text-base-content/60 text-sm mt-1">Siz yangi unvonga erishdingiz:</p>
              <p className="text-primary font-bold text-lg mt-1">"{levelName}"</p>
            </motion.div>

            {/* Jami XP block */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="mt-5 bg-base-300/30 rounded-xl p-4 text-left"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-primary text-lg">⚡</span>
                  <span className="text-xs text-base-content/50 uppercase tracking-wider">Jami XP</span>
                </div>
                <span className="text-xs text-success font-semibold">
                  +{quizResult?.xpEarned ? Math.round((quizResult.xpEarned / (xp || 1)) * 100) : 5}%
                </span>
              </div>
              <p className="text-2xl font-black text-white">{(xp || 0).toLocaleString()}</p>
            </motion.div>

            {/* Stats grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              className="mt-3 grid grid-cols-2 gap-3"
            >
              <div className="bg-base-300/30 rounded-xl p-3 text-left">
                <p className="text-xs text-base-content/50 uppercase tracking-wider mb-1">Sessiya XP</p>
                <p className="font-black text-success text-xl">+{quizResult?.xpEarned || 0}</p>
                <p className="text-xs text-success/60">+100%</p>
                <div className="w-full h-1 bg-base-300 rounded-full mt-2">
                  <div className="h-full bg-success rounded-full w-full" />
                </div>
              </div>
              <div className="bg-base-300/30 rounded-xl p-3 text-left">
                <p className="text-xs text-base-content/50 uppercase tracking-wider mb-1">Vulduzlar</p>
                <p className="font-black text-white text-xl">{quizResult?.score || 50}</p>
                <p className="text-xs text-yellow-400/70">+{quizResult?.correctAnswers || 2}</p>
                <div className="w-full h-1 bg-base-300 rounded-full mt-2">
                  <div className="h-full bg-yellow-400 rounded-full w-3/4" />
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-xs text-base-content/40 mt-4 leading-relaxed"
            >
              Siz bugungi darslarda ajoyib natija ko'rsatdingiz! O'rganishda davom eting va yangi cho'qqilarni zabt eting.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05 }}
              className="flex flex-col gap-3 mt-6"
            >
              <button
                onClick={onClose}
                className="btn btn-primary w-full rounded-xl text-base font-bold"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              >
                Davom etish →
              </button>
              <button onClick={handleShare} className="btn btn-ghost btn-sm gap-2 text-base-content/50 hover:text-blue-400">
                <FaTelegramPlane /> Ulashish (Telegram)
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
>>>>>>> Stashed changes
}

export default LevelUpModal
