// ╔══════════════════════════════════════════════════════════════╗
// ║  UserXPCard.jsx                                              ║
// ║  OQUVCHI: SUHROB                                             ║
// ║  Branch:  feature/suhrob-leaderboard                         ║
// ║  Vazifa:  Foydalanuvchining XP va level kartasi              ║
// ╚══════════════════════════════════════════════════════════════╝

/**
 * Props:
 * - xp: number — jami XP
 * - level: number — hozirgi level
 * - levelProgress: number (0-100) — keyingi levelga foiz
 * - streak: number — kunlik streak
 * - rank: number — global reyting pozitsiyasi
 * - topPercent: number — top necha foizda
 *
 * Ko'rsatilishi kerak (Figma "SIZNING REYTINGINGIZ"):
 * - O'rin raqami (katta, chapda)
 * - "SIZNING REYTINGINGIZ" sarlavha
 * - XP, Streak, Badges raqamlari
 * - Progress bar (keyingi levelgacha)
 */

const UserXPCard = ({ xp = 0, level = 1, levelProgress = 0, streak = 0, rank = '—', topPercent = null }) => {
  // TODO: SUHROB shu yerga UserXP kartasi yozadi
  return (
    <div className="card bg-base-200 p-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-4xl font-black">{rank}-o'RIN</p>
          <p className="text-sm opacity-60">SIZNING REYTINGINGIZ</p>
          {topPercent && <p className="text-sm opacity-60">Top {topPercent}%</p>}
        </div>
        <div className="text-right">
          <p className="text-primary font-bold">{xp.toLocaleString()} XP</p>
          <p>🔥 {streak} kun</p>
        </div>
      </div>
      <progress className="progress progress-primary w-full mt-3" value={levelProgress} max={100} />
    </div>
  )
}

export default UserXPCard
