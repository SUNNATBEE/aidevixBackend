// ============================================================
// OQUVCHI  : SUHROB
// BRANCH   : feature/suhrob-leaderboard
// FAYL     : src/components/leaderboard/UserXPCard.jsx
// ============================================================
//
// VAZIFA: Leaderboard sahifasida hozirgi foydalanuvchining
//         o'z reytingini ko'rsatuvchi karta
//
// KARTA TARKIBI (Figma "SIZNING REYTINGINGIZ"):
//
//  CHAP:
//   - "{rank}-O'RIN" — juda katta raqam (text-4xl+ font-black)
//   - "SIZNING REYTINGINGIZ" subtitle
//   - "Top {topPercent}%" (agar mavjud bo'lsa)
//
//  O'NG:
//   - "{xp} XP" — primary rang
//   - "🔥 {streak} kun streak"
//
//  PASTDA:
//   - Progress bar → keyingi levelgacha foiz
//   - "{xp % 1000} / 1000 XP" matni
//
// STIL:
//   - card bg-gradient-to-r from-primary/20 to-secondary/20
//   - border border-primary/30
//
// PROPS:
//   - xp: number
//   - level: number
//   - levelProgress: number (0-100)
//   - streak: number
//   - rank: number | '—'
//   - topPercent: number | null
//
// KERAKLI IMPORTLAR:
//   import { FaFire } from 'react-icons/fa'
// ============================================================

const UserXPCard = ({ xp = 0, level = 1, levelProgress = 0, streak = 0, rank = '—', topPercent = null }) => {
  // TODO: SUHROB bu komponentni to'liq yozadi
  return null
}

export default UserXPCard
