<<<<<<< Updated upstream
// ============================================================
// OQUVCHI  : SUHROB
// BRANCH   : feature/suhrob-leaderboard
// ROUTE    : /level-up  (aslidа route emas, modal sifatida ishlaydi)
// ============================================================
//
// VAZIFA: Level UP celebration modal/sahifasini yaratish
//
// TRIGGER:
//   - submitQuiz() yoki completeProject() dan keyin
//   - Redux'da justLeveledUp = true bo'lganda avtomatik ko'rsatiladi
//
// MODAL ICHIDA BO'LISHI KERAK:
//
//  1. CONFETTI ANIMATSIYASI:
//     - npm install react-confetti
//     - npm install react-use   (useWindowSize uchun)
//     - <Confetti width={width} height={height} numberOfPieces={400} recycle={false} />
//
//  2. YANGI LEVEL RAQAMI (katta, animatsiyali):
//     - text-8xl font-black text-primary
//     - framer-motion scale spring: 0 → 1.3 → 1
//     - {newLevel} ko'rsatiladi
//
//  3. TABRIK SARLAVHA:
//     - "Tabriklaymiz!" — h2
//     - "Siz yangi unvonga erishdingiz:" — p
//     - "{getLevelName(newLevel)}" — level nomi (primary rang)
//
//  4. STATISTIKA GRID (2x2):
//     - Joriy XP: {xp}
//     - Session XP: +{quizResult?.xpEarned}
//     - Daraja: {newLevel}
//     - Quiz ball: {quizResult?.score}%
//
//  5. YANGI UNVON KARTI:
//     - Yangi level nomi badge'i
//     - primary/10 background, primary/30 border
//
//  6. TUGMALAR:
//     - "Davom etish →" (btn-primary, to'liq kenglik)
//       → dismissLevelUp() + navigate('/courses')
//     - "Telegramda ulashish" (btn-ghost, ko'k)
//       → Telegram share URL ochiladi
//
//  MODAL OVERLAY:
//   - fixed inset-0 bg-black/80 backdrop-blur-sm
//   - z-[9999]
//   - framer-motion AnimatePresence bilan
//
// LEVEL NOMLARI JADVALI:
//   1  → "Yangi Boshlovchi"
//   5  → "Qiziquvchan"
//   10 → "Izlanuvchi"
//   15 → "Bilimdon"
//   20 → "Ekspert"
//   25 → "Mantiq Ustasi"
//   30 → "Grandmaster"
//   40 → "Afsonaviy"
//   50 → "Immortal"
//
// HOOKS:
//   useUserStats() → { xp, newLevel, justLeveledUp, quizResult, dismissLevelUp }
//
// KERAKLI IMPORTLAR:
//   import Confetti from 'react-confetti'           (npm install react-confetti)
//   import { useWindowSize } from 'react-use'       (npm install react-use)
//   import { useUserStats } from '@hooks/useUserStats'
//   import { motion, AnimatePresence } from 'framer-motion'
//   import { useNavigate } from 'react-router-dom'
//   import { HiSparkles } from 'react-icons/hi2'
//   import { FaTelegramPlane } from 'react-icons/fa'
//
// FIGMA: "Aidevix Level Up Celebration" sahifasini qarang
// ============================================================

export default function LevelUpPage() {
  // TODO: SUHROB bu sahifani to'liq yozadi
  return null
=======
// LevelUpPage.jsx — SUHROB
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStats } from '@hooks/useUserStats'
import LevelUpModal from '@components/leaderboard/LevelUpModal'

const LEVEL_NAMES = {
  1: 'Yangi Boshlovchi', 5: 'Qiziquvchan', 10: 'Izlanuvchi',
  15: 'Bilimdon', 20: 'Ekspert', 25: 'Mantiq Ustasi',
  30: 'Grandmaster', 35: 'Ustoz', 40: 'Afsonaviy', 50: 'Immortal',
}
const getLevelName = (level) => {
  if (!level) return 'Yangi Boshlovchi'
  const keys = Object.keys(LEVEL_NAMES).map(Number).sort((a, b) => b - a)
  return LEVEL_NAMES[keys.find((k) => level >= k)] || 'Yangi Boshlovchi'
}

export default function LevelUpPage() {
  const navigate = useNavigate()
  const { xp, newLevel, justLeveledUp, quizResult, dismissLevelUp } = useUserStats()

  useEffect(() => {
    if (!justLeveledUp) {
      navigate('/leaderboard', { replace: true })
    }
  }, [justLeveledUp, navigate])

  const handleClose = () => {
    dismissLevelUp()
    navigate('/courses')
  }

  return (
    <LevelUpModal
      isOpen={justLeveledUp}
      level={newLevel}
      levelName={getLevelName(newLevel)}
      xp={xp}
      quizResult={quizResult}
      onClose={handleClose}
    />
  )
>>>>>>> Stashed changes
}
