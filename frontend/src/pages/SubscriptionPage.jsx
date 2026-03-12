// ============================================================
//  SubscriptionPage.jsx
//  KIM YOZADI : AZIZ
//  BRANCH     : feature/aziz-subscription
//  ROUTE      : /subscription
// ============================================================
//
//  BU SAHIFADA NIMA BO'LISHI KERAK:
//  ─────────────────────────────────────────────────────────
//  3 BOSQICHLI OBUNA JARAYONI:
//
//  BOSQICH 1 — Telegram:
//    ┌─────────────────────────────────────────────┐
//    │ [Telegram ikonasi - katta ko'k]             │
//    │ "Telegram kanalimizga obuna bo'ling"        │
//    │ "@aidevix — 5,200+ a'zo"                    │
//    │ [ → Telegram kanalga o'tish ]               │  ← tashqi link
//    │ [ ✅ Obunani tasdiqlash ]                    │  ← POST /verify/telegram
//    │ ✓ "Tasdiqlandi" (muvaffaqiyatda yashil)    │
//    └─────────────────────────────────────────────┘
//
//  BOSQICH 2 — Instagram:
//    ┌─────────────────────────────────────────────┐
//    │ [Instagram ikonasi - gradient]              │
//    │ "Instagram sahifamizga obuna bo'ling"       │
//    │ "@aidevix.uz — 3,100+ kuzatuvchi"           │
//    │ [ → Instagram sahifaga o'tish ]             │  ← tashqi link
//    │ [ ✅ Obunani tasdiqlash ]                    │  ← POST /verify/instagram
//    │ ✓ "Tasdiqlandi" (muvaffaqiyatda yashil)    │
//    └─────────────────────────────────────────────┘
//
//  PROGRESS BAR (uchun):
//    0/2 → 1/2 → 2/2
//    — progress-steps yoki linear progress bar
//    — DaisyUI: <ul class="steps">...</ul>
//
//  BOSQICH 3 — Muvaffaqiyat holat:
//    ┌─────────────────────────────────────────────┐
//    │ ✅ (katta yashil ikonasi)                   │
//    │ "Tabriklaymiz!"                             │
//    │ "Barcha obunalar tasdiqlandi!"              │
//    │ "Endi barcha videolarni ko'rishingiz mumkin"│
//    │ [ Kurslarga o'tish → ]                     │
//    └─────────────────────────────────────────────┘
//    — framer-motion: confetti yoki scale animatsiya
//
//  SARLAVHA QISMI:
//    — "Ijtimoiy tarmoqlarga obuna" — h1
//    — "Videolarni ko'rish uchun ..." — subtitle
//    — Progress steps (DaisyUI steps)
//
//  HOOKS:
//    useSubscription() → { allVerified, telegram, instagram, refetch, verify }
//    — telegram.subscribed → true/false
//    — instagram.subscribed → true/false
//    — allVerified → ikkala obuna ham tasdiqlangan
//
//  KOMPONENTLAR:
//    TelegramVerify — mavjud (AZIZ qayta dizayn qilishi mumkin)
//    InstagramVerify — mavjud
//
//  API:
//    GET  /api/subscriptions/status            → obuna holati
//    POST /api/subscriptions/verify/telegram   → Telegram tasdiqlash
//    POST /api/subscriptions/verify/instagram  → Instagram tasdiqlash
//
//  FIGMA: "Aidevix Subscription" sahifasini qarang
// ============================================================

// 📦 IMPORTLAR
import { useEffect, useState }      from 'react'
import { Link }                     from 'react-router-dom'
import { motion, AnimatePresence }  from 'framer-motion'
import { IoCheckmarkCircle }        from 'react-icons/io5'
import { FaTelegram }               from 'react-icons/fa'
import { IoLogoInstagram }          from 'react-icons/io5'

// Redux hook — obuna holati
import { useSubscription }  from '@hooks/useSubscription'
import { ROUTES }           from '@utils/constants'
import Button               from '@components/common/Button'

// Komponentlar (AZIZ qayta dizayn qilishi mumkin)
import TelegramVerify   from '@components/subscription/TelegramVerify'
import InstagramVerify  from '@components/subscription/InstagramVerify'

// ─────────────────────────────────────────────────────────────────────────────
export default function SubscriptionPage() {
  // ── Redux hook ────────────────────────────────────────────────────────────
  // useSubscription() — subscriptionSlice dan ma'lumot qaytaradi
  const { allVerified, telegram, instagram, refetch } = useSubscription()

  // ── Sahifa ochilganda statusni yangilash ──────────────────────────────────
  useEffect(() => {
    refetch()
    window.scrollTo(0, 0)
  }, [])

  // ── Tasdiqlangan obunalar soni ────────────────────────────────────────────
  // 0 → 1 → 2 (progress uchun)
  const verifiedCount = [telegram.subscribed, instagram.subscribed].filter(Boolean).length

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8 pt-24 max-w-2xl">

        {/* ─── Sarlavha ─────────────────────────────────────────────────── */}
        {/*
          TODO: Chiroyli sarlavha qism:
          — Katta ikonasi (tarmoq ikonasi yoki ikkala logo)
          — "Ijtimoiy tarmoqlarga obuna" h1
          — Subtitle matni
          — framer-motion fade-in animatsiya
        */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-3xl font-black mb-3">Ijtimoiy tarmoqlarga obuna</h1>
          <p className="text-base-content/60 leading-relaxed max-w-md mx-auto">
            Videolarni ko'rish uchun quyidagi kanallarga obuna bo'lish shart.
            Obuna bekor qilinsa, video ko'rish imkoni ham bekor bo'ladi.
          </p>
        </motion.div>

        {/* ─── Progress steps ───────────────────────────────────────────── */}
        {/*
          TODO: DaisyUI steps komponenti:
          <ul className="steps w-full mb-8">
            <li className={`step ${verifiedCount >= 1 ? 'step-primary' : ''}`}>Telegram</li>
            <li className={`step ${verifiedCount >= 2 ? 'step-primary' : ''}`}>Instagram</li>
            <li className={`step ${allVerified ? 'step-primary' : ''}`}>Tayyor!</li>
          </ul>

          YOKI linear progress bar:
          0/2 → 1/2 → 2/2
        */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          {/* DaisyUI steps */}
          <ul className="steps w-full">
            <li className={`step ${verifiedCount >= 1 ? 'step-primary' : ''}`}>Telegram</li>
            <li className={`step ${verifiedCount >= 2 ? 'step-primary' : ''}`}>Instagram</li>
            <li className={`step ${allVerified ? 'step-primary' : ''}`}>Tayyor!</li>
          </ul>
        </motion.div>

        {/* ─── Muvaffaqiyat holati ──────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {allVerified ? (
            // ── BARCHA OBUNALAR TASDIQLANGAN ─────────────────────────────
            /*
              TODO: Muvaffaqiyat holati dizayn:
              — Katta ✅ animatsiyali ikonasi (scale spring)
              — "Tabriklaymiz!" sarlavha
              — "Barcha obunalar tasdiqlandi!" matni
              — framer-motion confetti (ixtiyoriy)
              — "Kurslarga o'tish →" tugmasi
            */
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="card bg-base-200 p-10 text-center space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <IoCheckmarkCircle className="text-7xl text-success mx-auto" />
              </motion.div>

              <h2 className="text-2xl font-black">Tabriklaymiz! 🎉</h2>
              <p className="text-base-content/70">
                Barcha obunalar tasdiqlandi! Endi barcha videolarni ko'rishingiz mumkin.
              </p>

              {/* TODO: Qo'shimcha statistika: "45 ta video sizni kutmoqda" */}

              <Link to={ROUTES.COURSES} className="btn btn-primary btn-lg gap-2 mt-2">
                Kurslarga o'tish →
              </Link>
            </motion.div>

          ) : (
            // ── OBUNA JARAYONI ────────────────────────────────────────────
            <motion.div
              key="process"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              {/* Progress bar */}
              {/*
                TODO: Progress bar dizayn:
                — "Obuna holati: N/2" label
                — Rangli progress bar (primary gradient)
                — Animatsiyali (transition-all duration-500)
              */}
              <div className="card bg-base-200 p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-base-content/60">Obuna holati</span>
                  <span className="font-bold text-primary">{verifiedCount} / 2</span>
                </div>
                <div className="w-full h-3 bg-base-300 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(verifiedCount / 2) * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  />
                </div>
              </div>

              {/* ── Telegram Verify ─────────────────────────────────────── */}
              {/*
                TODO: TelegramVerify komponentini qayta dizayn qiling:
                ┌─────────────────────────────────────┐
                │ [🔵 Telegram] Telegram kanal         │
                │ @aidevix — 5,200+ a'zo               │
                │ holat: [✅ Tasdiqlandi] YOKI [⚠️ Yo'q]│
                │ [ → Kanalga o'tish ] (outline)      │
                │ [ ✅ Tasdiqlashni tekshirish ]       │
                └─────────────────────────────────────┘
                props: telegram.subscribed → tasdiqlangan holat
              */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <TelegramVerify />
              </motion.div>

              {/* ── Instagram Verify ─────────────────────────────────────── */}
              {/*
                TODO: InstagramVerify komponentini qayta dizayn qiling:
                ┌─────────────────────────────────────┐
                │ [📸 Instagram] Instagram sahifa      │
                │ @aidevix.uz — 3,100+ kuzatuvchi      │
                │ holat: [✅ Tasdiqlandi] YOKI [⚠️ Yo'q]│
                │ [ → Sahifaga o'tish ] (outline)     │
                │ [ ✅ Tasdiqlashni tekshirish ]       │
                └─────────────────────────────────────┘
              */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <InstagramVerify />
              </motion.div>

              {/* ── Eslatma matni ─────────────────────────────────────────── */}
              {/*
                TODO: Quyi eslatma:
                — Obuna bekor qilsa nima bo'lishini tushuntiring
                — "Real-time tekshiriladi" ma'lumot
              */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xs text-base-content/50 text-center leading-relaxed"
              >
                Obuna holatingiz real-time tekshiriladi.{' '}
                Obunani bekor qilsangiz, video ko'rish imkoni ham avtomatik bekor bo'ladi.
              </motion.p>

              {/* ── Re-verify tugmasi ─────────────────────────────────────── */}
              {/*
                TODO: "Holатni yangilash" tugmasi:
                — refetch() chaqiradi
                — Yuklanayotganda spinner
              */}
              <div className="text-center">
                <button
                  onClick={refetch}
                  className="btn btn-ghost btn-sm text-base-content/60"
                >
                  🔄 Holatni yangilash
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
