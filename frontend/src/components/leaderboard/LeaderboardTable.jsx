// ╔══════════════════════════════════════════════════════════════╗
// ║  LeaderboardTable.jsx                                        ║
// ║  OQUVCHI: SUHROB                                             ║
// ║  Branch:  feature/suhrob-leaderboard                         ║
// ║  Vazifa:  Top foydalanuvchilar jadval komponenti             ║
// ╚══════════════════════════════════════════════════════════════╝

/**
 * Props:
 * - users: array — [{ rank, user, xp, level, streak, badges, avatar }]
 * - currentUserId: string — hozirgi login qilgan user ID
 * - loading: boolean
 *
 * Ko'rsatilishi kerak:
 * - Rank raqami (4+ uchun)
 * - Avatar rasm
 * - Ism, level nomi
 * - XP miqdori
 * - Badges (yutuqlar ikonalari)
 * - Badge (Aidevix brand badge)
 * - Hozirgi user qatori ajratib ko'rsatilsin (highlight)
 *
 * Figma: "GLOBAL AUTHORITY" jadvalning pastki qismi (#4, #5, #6, #7)
 */

const LeaderboardTable = ({ users = [], currentUserId, loading }) => {
  // TODO: SUHROB shu yerga leaderboard jadval yozadi
  return (
    <div>
      {loading && <p>Yuklanmoqda...</p>}
      {users.map((u) => (
        <div key={u.rank}>
          #{u.rank} — {u.user?.username} — {u.xp} XP
        </div>
      ))}
    </div>
  )
}

export default LeaderboardTable
