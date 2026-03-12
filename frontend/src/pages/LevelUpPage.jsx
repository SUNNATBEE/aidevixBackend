// ╔══════════════════════════════════════════════════════════════╗
// ║  LevelUpPage.jsx                                             ║
// ║  OQUVCHI: SUHROB                                             ║
// ║  Branch:  feature/suhrob-leaderboard                         ║
// ║  Vazifa:  Level up celebration page/modal                    ║
// ╚══════════════════════════════════════════════════════════════╝

/**
 * Bu sahifada ko'rsatilishi kerak:
 * - "Tabriklaymiz! Siz N-darajaga yetdingiz" animatsiyali ekran
 * - Yangi level raqami (katta, animatsiyali)
 * - Yangi level nomi (masalan "Mantiq Ustasi")
 * - To'plangan XP va tasklar statistikasi
 * - "Davom etish" tugmasi → courses sahifasiga qaytaradi
 * - "Ulashish/Telegram" tugmasi
 * - Confetti yoki particle animatsiya
 *
 * Figma dizayn: "Aidevix Level Up Celebration" (o'ng pastki)
 *
 * Ishlatish kerak bo'lgan hook:
 * import { useUserStats } from '@hooks/useUserStats'
 * const { justLeveledUp, newLevel, dismissLevelUp } = useUserStats()
 *
 * Redux state:
 * state.userStats.justLeveledUp
 * state.userStats.newLevel
 *
 * Texnologiyalar:
 * - framer-motion (kirish animatsiyasi uchun)
 * - canvas-confetti yoki react-confetti (npm install react-confetti)
 */

const LevelUpPage = () => {
  return (
    <div>
      {/* TODO: SUHROB shu yerga level-up celebration UI yozadi */}
      <p>LevelUpPage — SUHROB yozadi</p>
    </div>
  )
}

export default LevelUpPage
