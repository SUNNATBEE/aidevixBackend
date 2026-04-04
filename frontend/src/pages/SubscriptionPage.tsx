// ============================================================
// OQUVCHI  : AZIZ
// BRANCH   : feature/aziz-subscription
// ROUTE    : /subscription
// ============================================================
//
// VAZIFA: Obuna tasdiqlash sahifasini yaratish (3 bosqichli)
//
// Bu sahifada bo'lishi kerak:
//
//  SARLAVHA QISMI:
//   - Katta ikonasi (🔐 yoki ijtimoiy tarmoq logolari)
//   - "Ijtimoiy tarmoqlarga obuna" — h1
//   - Subtitle matni
//   - framer-motion fade-in
//
//  PROGRESS STEPS (DaisyUI):
//   - <ul className="steps w-full">
//       <li className={`step ${verifiedCount >= 1 ? 'step-primary' : ''}`}>Telegram</li>
//       <li className={`step ${verifiedCount >= 2 ? 'step-primary' : ''}`}>Instagram</li>
//       <li className={`step ${allVerified ? 'step-primary' : ''}`}>Tayyor!</li>
//     </ul>
//
//  BOSQICH 1 — Telegram tasdiqlash (TelegramVerify komponenti):
//   - Telegram ikonasi + sarlavha
//   - "@aidevix — 5,200+ a'zo"
//   - "→ Telegram kanalga o'tish" link
//   - "✅ Tasdiqlashni tekshirish" tugmasi
//   - API: POST /api/subscriptions/verify/telegram
//
//  BOSQICH 2 — Instagram tasdiqlash (InstagramVerify komponenti):
//   - Instagram ikonasi + sarlavha
//   - "@aidevix.uz — 3,100+ kuzatuvchi"
//   - "→ Instagram sahifaga o'tish" link
//   - "✅ Tasdiqlashni tekshirish" tugmasi
//   - API: POST /api/subscriptions/verify/instagram
//
//  BOSQICH 3 — Muvaffaqiyat holat (allVerified = true bo'lsa):
//   - ✅ katta animatsiyali ikonasi (scale spring animatsiya)
//   - "Tabriklaymiz! 🎉" sarlavha
//   - "Barcha obunalar tasdiqlandi!" matni
//   - "Kurslarga o'tish →" tugmasi — Link to="/courses"
//   - framer-motion animatsiya
//
//  QUYI ESLATMA:
//   - "Obuna holatingiz real-time tekshiriladi"
//   - "🔄 Holatni yangilash" tugmasi → refetch()
//
// HOOKS:
//   useSubscription() → { allVerified, telegram, instagram, refetch }
//   - telegram.subscribed  → true/false
//   - instagram.subscribed → true/false
//   - allVerified          → ikkalasi ham tasdiqlangan bo'lsa true
//
// API:
//   GET  /api/subscriptions/status           → obuna holati
//   POST /api/subscriptions/verify/telegram  → Telegram tasdiqlash
//   POST /api/subscriptions/verify/instagram → Instagram tasdiqlash
//
// KERAKLI IMPORTLAR:
//   import { useSubscription } from '@hooks/useSubscription'
//   import TelegramVerify from '@components/subscription/TelegramVerify'
//   import InstagramVerify from '@components/subscription/InstagramVerify'
//   import { motion, AnimatePresence } from 'framer-motion'
//
// FIGMA: "Aidevix Subscription Page" sahifasini qarang
// ============================================================

export default function SubscriptionPage() {
  // TODO: AZIZ bu sahifani to'liq yozadi
  return null
}
