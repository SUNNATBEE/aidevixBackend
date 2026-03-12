// ╔══════════════════════════════════════════════════════════════╗
// ║  LeaderboardPage.jsx                                         ║
// ║  OQUVCHI: SUHROB                                             ║
// ║  Branch:  feature/suhrob-leaderboard                         ║
// ║  Vazifa:  Top foydalanuvchilar XP reytingini ko'rsatish      ║
// ╚══════════════════════════════════════════════════════════════╝

/**
 * Bu sahifada ko'rsatilishi kerak:
 * - Global leaderboard jadval (rank, avatar, name, level, xp, badges)
 * - Podium (1-2-3 o'rinlar alohida stilga ega)
 * - Kategoriya bo'yicha filter (JavaScript, React, Python, ...)
 * - Hozirgi user o'z pozitsiyasini ko'rsin
 * - "Ko'proq yuklash" tugmasi (pagination)
 * - XP Engine ko'rsatish: video (+50), quiz (+100), challenge bonus
 *
 * Figma dizayn: "Aidevix Top Courses Ranking" (o'ng qism - GLOBAL AUTHORITY)
 *
 * Ishlatish kerak bo'lgan hook:
 * import { useTopUsers } from '@hooks/useRanking'
 * import { useUserStats } from '@hooks/useUserStats'
 *
 * Redux state:
 * state.ranking.topUsers
 * state.ranking.usersPagination
 *
 * API endpoint:
 * GET /api/ranking/users?page=1&limit=20
 * GET /api/ranking/users/:userId/position
 */

const LeaderboardPage = () => {
  return (
    <div>
      {/* TODO: SUHROB shu yerga leaderboard UI yozadi */}
      <p>LeaderboardPage — SUHROB yozadi</p>
    </div>
  )
}

export default LeaderboardPage
