// ============================================================
//  LevelUpPage.jsx
//  KIM YOZADI : SUHROB
//  BRANCH     : feature/suhrob-leaderboard
//  ROUTE      : /level-up
// ============================================================
//
//  BU SAHIFADA NIMA BO'LISHI KERAK:
//  ─────────────────────────────────────────────────────────
//  Bu sahifa aslidа "route" emas, modal sifatida ko'rinadi.
//  Foydalanuvchi yangi levelga o'tganda avtomatik chiqadi.
//
//  TRIGGER: submitQuiz() yoki completeProject() dan keyin
//           Redux'da justLeveledUp = true bo'lganda
//
//  MODAL ICHIDA:
//    ✨ Confetti animatsiyasi (butun ekran)
//    [ 25 ]  — yangi level raqami (katta, animatsiyali)
//    "Tabriklaymiz! Siz N-unvoniga erishdingiz!"
//    "Mantiq Ustasi" — level nomi
//    ┌─────────────────────────────────┐
//    │ Joriy XP: 12,500  Sessions XP: +450 │
//    │ Daraja:     +3    Savollar:     50  │
//    └─────────────────────────────────┘
//    [ Yangi ko'nikma kartasi ] (agar badge berilgan bo'lsa)
//    [ Davom etish → ] (primary tugma)
//    [ Ulashish/Telegram ] (ghost tugma)
//
//  FIGMA: "Aidevix Level Up Celebration" (o'ng pastki)
// ============================================================

// 📦 IMPORTLAR
import { useEffect }                        from 'react'
import { useNavigate }                      from 'react-router-dom'
import { motion, AnimatePresence }          from 'framer-motion'  // Animatsiya
import Confetti                             from 'react-confetti'  // npm install react-confetti
import { useWindowSize }                    from 'react-use'       // npm install react-use
import { HiSparkles }                       from 'react-icons/hi2'
import { FaTelegramPlane }                  from 'react-icons/fa'

// Redux — justLeveledUp va newLevel state
import { useUserStats } from '@hooks/useUserStats'
// clearLevelUp() dispatch qiladi → modal yashiriladi

// ── Level nomi jadvali ──────────────────────────────────────
const LEVEL_NAMES = {
  1:  'Yangi Boshlovchi',
  5:  'Qiziquvchan',
  10: 'Izlanuvchi',
  15: 'Bilimdon',
  20: 'Ekspert',
  25: 'Mantiq Ustasi',
  30: 'Grandmaster',
  35: 'Ustoz',
  40: 'Afsonaviy',
  50: 'Immortal',
}

const getLevelName = (level) => {
  if (!level) return 'Yangi Boshlovchi'
  const keys = Object.keys(LEVEL_NAMES).map(Number).sort((a, b) => b - a)
  const found = keys.find((k) => level >= k)
  return LEVEL_NAMES[found] || 'Yangi Boshlovchi'
}

// ─────────────────────────────────────────────────────────────────────────────
export default function LevelUpPage() {
  const navigate = useNavigate()

  // react-use: confetti o'lchami uchun
  // npm install react-use
  const { width, height } = useWindowSize()

  // ── Redux state ───────────────────────────────────────────────────────────
  const {
    xp, level, newLevel, justLeveledUp,
    quizResult,          // { xpEarned, level, levelProgress, score, passed }
    dismissLevelUp,      // clearLevelUp() dispatch qiladi
  } = useUserStats()

  // ── Sahifa ochilganda tekshirish ──────────────────────────────────────────
  useEffect(() => {
    // Agar level-up bo'lmagan holda bu sahifaga kirilsa — qaytarish
    // (masalan, URL ga qo'lda kirilgan bo'lsa)
    if (!justLeveledUp) {
      // navigate('/leaderboard')
      // Bu qatorni aktiv qiling agar modal emas route bo'lsa
    }
  }, [justLeveledUp, navigate])

  // ── "Davom etish" bosimi ──────────────────────────────────────────────────
  const handleContinue = () => {
    dismissLevelUp()      // Redux state ni tozalash
    navigate('/courses')  // Kurslar sahifasiga qaytarish
  }

  // ── Telegramda ulashish ───────────────────────────────────────────────────
  const handleShare = () => {
    // TODO: Telegram share URL yarating
    // Misol: https://t.me/share/url?url=...&text=...
    const text = `Aidevix platformasida ${newLevel}-darajaga yetdim! "${getLevelName(newLevel)}" unvonini oldim! 🎉`
    window.open(`https://t.me/share/url?text=${encodeURIComponent(text)}`, '_blank')
  }

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {/* Modal overlay — justLeveledUp true bo'lganda ko'rinadi */}
      {/*
        TODO: Bu komponent LeaderboardPage'da shunaqa ishlatiladi:
        <LevelUpPage /> — avto modal sifatida trigger bo'ladi
        YO
        <LevelUpModal isOpen={justLeveledUp} ... /> — LevelUpModal orqali
      */}
      {justLeveledUp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          {/* ── Confetti ── */}
          {/*
            react-confetti: npm install react-confetti react-use
            Butun sahifada rangli konfetti animatsiyasi
          */}
          <Confetti
            width={width}
            height={height}
            numberOfPieces={400}
            gravity={0.12}
            recycle={false}
            colors={['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']}
          />

          {/* ── Modal card ── */}
          <motion.div
            initial={{ scale: 0.5, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            className="relative bg-base-200 border border-primary/30 rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl shadow-primary/20"
          >
            {/* Yulduzcha bezaklari */}
            {/*
              TODO: Chiroyli bezak uchun absolute positioned stars/sparks
              react-icons HiSparkles yoki SVG stars
            */}
            <div className="absolute top-4 right-4 text-yellow-400 animate-spin-slow">
              <HiSparkles size={24} />
            </div>
            <div className="absolute top-4 left-4 text-indigo-400 animate-pulse">
              <HiSparkles size={20} />
            </div>

            {/* ── Yangi level raqami ── */}
            {/*
              TODO: Katta, animatsiyali level raqami
              Figma'da: quyuq ko'k background'da katta oq raqam
              Scale animatsiyasi: 0 → 1.2 → 1
            */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ delay: 0.3, duration: 0.6, times: [0, 0.7, 1] }}
              className="text-8xl font-black text-primary mb-2"
            >
              {newLevel}
            </motion.div>

            {/* ── Tabrik sarlavha ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold">Tabriklaymiz!</h2>
              <p className="text-base-content/70 mt-1">
                Siz yangi unvonga erishdingiz:
              </p>
              <p className="text-primary font-bold text-lg mt-1">
                "{getLevelName(newLevel)}"
              </p>
            </motion.div>

            {/* ── Statistika ── */}
            {/*
              TODO: Quiz natijasidan olingan statistika ko'rsating
              quizResult.xpEarned, quizResult.score
            */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-2 gap-3 mt-6 bg-base-300/50 rounded-xl p-4"
            >
              <div>
                <p className="text-xs text-base-content/60">Joriy XP</p>
                <p className="font-bold text-primary">{xp?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-base-content/60">Session XP</p>
                <p className="font-bold text-success">
                  +{quizResult?.xpEarned || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-base-content/60">Daraja</p>
                <p className="font-bold">{newLevel}</p>
              </div>
              <div>
                <p className="text-xs text-base-content/60">Quiz ball</p>
                <p className="font-bold">{quizResult?.score || 0}%</p>
              </div>
            </motion.div>

            {/* ── Yangi badge kartasi ── */}
            {/*
              TODO: Yangi badge berilgan bo'lsa ko'rsating
              Masalan: "JavaScript Master" badge'i
            */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-4 bg-primary/10 border border-primary/30 rounded-xl p-3"
            >
              <p className="text-xs text-base-content/60">Yangi unvon</p>
              <p className="font-semibold text-sm">{getLevelName(newLevel)}</p>
            </motion.div>

            {/* ── Tugmalar ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="flex flex-col gap-3 mt-6"
            >
              {/* Davom etish */}
              <button
                onClick={handleContinue}
                className="btn btn-primary w-full"
              >
                Davom etish →
              </button>

              {/* Telegram ulashish */}
              {/*
                TODO: Telegram share URL ochiladi
                FaTelegramPlane ikonkasi bilan
              */}
              <button
                onClick={handleShare}
                className="btn btn-ghost btn-sm gap-2 text-blue-400"
              >
                <FaTelegramPlane />
                Telegramda ulashish
              </button>
            </motion.div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
