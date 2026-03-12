// ╔══════════════════════════════════════════════════════════════╗
// ║  LevelUpModal.jsx                                            ║
// ║  OQUVCHI: SUHROB                                             ║
// ║  Branch:  feature/suhrob-leaderboard                         ║
// ║  Vazifa:  Level UP bo'lganda modal yoki full-screen overlay  ║
// ╚══════════════════════════════════════════════════════════════╝

/**
 * Props:
 * - isOpen: boolean
 * - level: number — yangi level raqami
 * - levelName: string — "Mantiq Ustasi" kabi nom
 * - xp: number — jami XP
 * - onClose: function
 *
 * Ko'rsatilishi kerak:
 * - Dark overlay + glowing border modal
 * - Level raqami katta animatsiyali (framer-motion scale up)
 * - Confetti effekt (react-confetti library)
 * - Statistika: Sessions XP, Savollar soni, level diff
 * - "Davom etish →" tugmasi
 * - "Ulashish/Telegram" tugmasi
 *
 * Figma: "Aidevix Level Up Celebration"
 *
 * npm install react-confetti
 */

const LevelUpModal = ({ isOpen, level, levelName, xp, onClose }) => {
  if (!isOpen) return null

  // TODO: SUHROB shu yerga level-up modal yozadi
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-base-200 rounded-2xl p-8 text-center max-w-sm w-full">
        <div className="text-6xl font-bold text-primary">{level}</div>
        <p className="text-xl mt-2">Tabriklaymiz! {levelName}</p>
        <button onClick={onClose} className="btn btn-primary mt-6">
          Davom etish →
        </button>
      </div>
    </div>
  )
}

export default LevelUpModal
