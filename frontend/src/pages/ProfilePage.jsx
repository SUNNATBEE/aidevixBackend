// ============================================================
//  ProfilePage.jsx
//  KIM YOZADI : FIRDAVS
//  BRANCH     : feature/firdavs-auth
//  ROUTE      : /profile
// ============================================================
//
//  BU SAHIFADA NIMA BO'LISHI KERAK:
//  ─────────────────────────────────────────────────────────
//  LAYOUT: Responsive grid (md: 2 ustun, lg: 3 ustun)
//
//  1. PROFIL HEADER (katta banner — to'liq kenglik):
//    ┌─────────────────────────────────────────────────────┐
//    │ [Avatar — katta harf yoki rasm]                     │
//    │ username (katta, bold)  •  email                    │
//    │ [🏆 Level 12] [Bilimdon] badge                      │
//    │ XP Progress bar:                                    │
//    │   1,200 / 2,000 XP  [████████──] 60%               │
//    │ [🔥 7 kun streak]   [📅 Bugun faol]                 │
//    └─────────────────────────────────────────────────────┘
//    — Avatar: harf yoki rasm (useUserStats.avatar)
//    — Level nomi: getLevelName(level) funksiyasidan
//    — XP progress bar: (xp % 1000) / 1000 * 100 %
//    — Streak: useUserStats().streak
//
//  2. STATISTIKA KARTALAR (2x2 grid):
//    ┌─────────────┬─────────────┐
//    │ 🎬 Videolar │ 📝 Quizlar  │
//    │   47 ta     │   23 ta     │
//    ├─────────────┼─────────────┤
//    │ 💫 Jami XP  │ 🏆 Badges  │
//    │  4,200 XP   │   8 ta     │
//    └─────────────┴─────────────┘
//    — framer-motion: stagger animatsiya (0.1s kechikish)
//    — hover: scale-105
//
//  3. FOYDALANUVCHI MA'LUMOTLARI:
//    ┌─────────────────────────────┐
//    │ 👤 Ma'lumotlarim            │
//    │ Username: firdavs123        │
//    │ Email: firdavs@gmail.com   │
//    │ Role: Foydalanuvchi         │
//    │ Ro'yxat: 12 mart, 2026      │
//    │ [ ✏️ Tahrirlash ] tugmasi  │
//    └─────────────────────────────┘
//    — [ Tahrirlash ] → modal ochadi (PUT /api/xp/profile)
//    — Modal ichida: username, bio, skills tahrirlash
//
//  4. OBUNA HOLATI:
//    ┌─────────────────────────────┐
//    │ Obuna holati               │
//    │ [Telegram] Faol ✓          │
//    │ [Instagram] Tasdiqlanmagan │
//    │ [ Obunani boshqarish → ]  │
//    └─────────────────────────────┘
//
//  5. KUNLIK STREAK TAQVIMI (optional, Firdavs ixtiyori):
//    — Oxirgi 30 kun ko'rinishi (GitHub heatmap uslubida)
//    — Faol kunlar: yashil, nofaol: kulrang
//
//  6. TAHRIRLASH MODAL (TODO):
//    — DaisyUI dialog yoki framer-motion modal
//    — Username input
//    — Bio textarea
//    — Skills multi-input
//    — Avatar upload (ixtiyoriy)
//    — [ Saqlash ] tugmasi → PUT /api/xp/profile
//
//  HOOKS:
//    useSelector(selectUser) → { username, email, role, createdAt }
//    useSelector(selectTelegramSub) → { subscribed }
//    useSelector(selectInstagramSub) → { subscribed }
//    useUserStats() → { xp, level, levelProgress, streak, badges,
//                       videosWatched, quizzesCompleted, updateProfile }
//
//  API:
//    GET /api/xp/stats     → UserStats model (xp, level, streak, badges...)
//    PUT /api/xp/profile   → { username, bio, skills, avatar }
// ============================================================

// 📦 IMPORTLAR
import { useState }                     from 'react'
import { Link }                         from 'react-router-dom'
import { useSelector }                  from 'react-redux'
import { motion, AnimatePresence }      from 'framer-motion'
import {
  IoPerson, IoMail, IoCalendar, IoShield,
  IoPencil, IoCheckmarkCircle, IoClose,
} from 'react-icons/io5'
import { FaTelegram }                   from 'react-icons/fa'
import { IoLogoInstagram }              from 'react-icons/io5'

// Redux selectors
import { selectUser }          from '@store/slices/authSlice'
import { selectTelegramSub, selectInstagramSub } from '@store/slices/subscriptionSlice'

// Hooks
import { useUserStats }  from '@hooks/useUserStats'  // XP tizimi

// Utils
import { formatDate }  from '@utils/formatDate'
import { ROUTES }      from '@utils/constants'

// Utils: Level nomi
const LEVEL_NAMES = {
  1: 'Yangi Boshlovchi', 5: 'Qiziquvchan', 10: 'Izlanuvchi',
  15: 'Bilimdon', 20: 'Ekspert', 25: 'Mantiq Ustasi',
  30: 'Grandmaster', 40: 'Afsonaviy', 50: 'Immortal',
}
const getLevelName = (level) => {
  if (!level) return 'Yangi Boshlovchi'
  const keys = Object.keys(LEVEL_NAMES).map(Number).sort((a, b) => b - a)
  const found = keys.find((k) => level >= k)
  return LEVEL_NAMES[found] || 'Yangi Boshlovchi'
}

// ─────────────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  // ── Redux state ───────────────────────────────────────────────────────────
  const user      = useSelector(selectUser)
  const telegram  = useSelector(selectTelegramSub)
  const instagram = useSelector(selectInstagramSub)

  // ── XP / Level / Streak ──────────────────────────────────────────────────
  const {
    xp, level, levelProgress, streak, badges,
    videosWatched, quizzesCompleted,
    updateProfile,
  } = useUserStats()

  // ── Tahrirlash modal state ────────────────────────────────────────────────
  const [editOpen, setEditOpen]       = useState(false)
  /*
    TODO: Tahrirlash form state:
    const [editForm, setEditForm] = useState({
      username: user?.username || '',
      bio: '',
      skills: [],
    })
  */

  // ── XP progress hisobi ────────────────────────────────────────────────────
  // Har 1000 XP = 1 level. Progress: (xp % 1000) / 1000 * 100
  const xpInCurrentLevel = (xp || 0) % 1000
  const xpProgressPercent = Math.round(xpInCurrentLevel / 1000 * 100)

  if (!user) return null

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">

        {/* ─── 1. Profil header (katta banner) ──────────────────────────── */}
        {/*
          TODO: Katta profil banner dizayn:
          — Avatar (katta, daire, harf yoki rasm)
          — Ism + email
          — Level + Level nomi badge
          — XP progress bar (animated)
          — Streak badge
          — framer-motion fade-in
        */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-base-200 p-8 mb-6 text-center md:text-left"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            {/*
              TODO: Avatar dizayn:
              — Katta daire (w-24 h-24)
              — Harf: user.username[0].toUpperCase()
              — Gradient background (primary to secondary)
              — Rasm bo'lsa: img tag
            */}
            <div className="avatar placeholder">
              <div className="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-full w-24 h-24">
                <span className="text-4xl font-black">
                  {user.username?.[0]?.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Ma'lumotlar */}
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start mb-1">
                <h1 className="text-2xl font-black">{user.username}</h1>
                {/* Level badge */}
                <span className="badge badge-primary gap-1">
                  🏆 Level {level || 1}
                </span>
                {/* Level nomi */}
                <span className="badge badge-ghost text-xs">
                  {getLevelName(level)}
                </span>
              </div>

              <p className="text-base-content/60 text-sm mb-4">{user.email}</p>

              {/* XP Progress bar */}
              {/*
                TODO: Chiroyli XP progress bar:
                — "1,200 / 2,000 XP" label
                — Animated progress bar
                — Keyingi level XP qancha qolgani
              */}
              <div className="w-full max-w-sm mx-auto md:mx-0">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-base-content/60">XP Progress</span>
                  <span className="font-bold text-primary">
                    {xpInCurrentLevel.toLocaleString()} / 1,000 XP
                  </span>
                </div>
                <div className="h-3 bg-base-300 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgressPercent}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  />
                </div>
                <p className="text-xs text-base-content/50 mt-1">
                  Keyingi levelgacha: {(1000 - xpInCurrentLevel).toLocaleString()} XP
                </p>
              </div>

              {/* Streak badge */}
              <div className="flex gap-2 mt-3 flex-wrap justify-center md:justify-start">
                {streak > 0 && (
                  <span className="badge badge-warning gap-1">
                    🔥 {streak} kun streak
                  </span>
                )}
                <span className="badge badge-outline text-xs">
                  📅 Bugun faol
                </span>
                {badges?.length > 0 && (
                  <span className="badge badge-accent gap-1">
                    🏅 {badges.length} badge
                  </span>
                )}
              </div>
            </div>

            {/* Tahrirlash tugmasi */}
            <button
              onClick={() => setEditOpen(true)}
              className="btn btn-outline btn-sm gap-2 self-start"
            >
              <IoPencil /> Tahrirlash
            </button>
          </div>
        </motion.div>

        {/* ─── 2 + 3 — Statistika + Ma'lumotlar grid ────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">

          {/* 2. Statistika kartalar */}
          {/*
            TODO: 4 ta statistika kartasi (2x2 grid):
            — 🎬 Ko'rilgan videolar: videosWatched
            — 📝 Yechilgan quizlar: quizzesCompleted
            — 💫 Jami XP: xp
            — 🏆 Badges: badges.length
            — framer-motion stagger animatsiya
            — hover: scale-105 + shadow
          */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card bg-base-200 p-6"
          >
            <h2 className="font-bold mb-4 flex items-center gap-2">
              📊 Statistika
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '🎬', label: 'Ko\'rilgan videolar', value: videosWatched || 0, color: 'text-primary' },
                { icon: '📝', label: 'Yechilgan quizlar',  value: quizzesCompleted || 0, color: 'text-secondary' },
                { icon: '💫', label: 'Jami XP',            value: (xp || 0).toLocaleString(), color: 'text-warning' },
                { icon: '🏅', label: 'Badgelar',           value: badges?.length || 0, color: 'text-success' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-base-300 rounded-xl p-4 text-center cursor-default"
                >
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-base-content/60">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 3. Foydalanuvchi ma'lumotlari */}
          {/*
            TODO: Ma'lumotlar karti:
            — Username, Email, Role, Ro'yxat sanasi
            — Har biri: ikonka + label + qiymat
            — [ Tahrirlash ] tugmasi pastda
          */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-base-200 p-6"
          >
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <IoPerson className="text-primary" /> Ma'lumotlarim
            </h2>

            <div className="space-y-3">
              {[
                { icon: <IoPerson />,   label: 'Username',        value: user.username },
                { icon: <IoMail />,     label: 'Email',           value: user.email },
                { icon: <IoShield />,   label: 'Role',            value: user.role === 'admin' ? '👑 Admin' : '👤 Foydalanuvchi' },
                { icon: <IoCalendar />, label: 'Ro\'yxat sanasi', value: formatDate(user.createdAt) },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 text-sm">
                  <span className="text-primary w-5">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-base-content/50 text-xs">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/*
              TODO: Tahrirlash tugmasi pastga:
              onClick → setEditOpen(true)
            */}
            <button
              onClick={() => setEditOpen(true)}
              className="btn btn-outline btn-sm w-full mt-4 gap-2"
            >
              <IoPencil /> Profilni tahrirlash
            </button>
          </motion.div>
        </div>

        {/* ─── 4. Obuna holati ──────────────────────────────────────────── */}
        {/*
          TODO: Obuna holati karti:
          — Telegram: Faol ✓ (yashil) yoki Tasdiqlanmagan (sariq)
          — Instagram: Faol ✓ (yashil) yoki Tasdiqlanmagan (sariq)
          — "Obunani boshqarish →" link
        */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card bg-base-200 p-6 mb-6"
        >
          <h2 className="font-bold mb-4">Obuna holati</h2>

          <div className="space-y-3">
            {[
              {
                icon: <FaTelegram className="text-blue-400 text-xl" />,
                label: 'Telegram',
                sub: telegram,
              },
              {
                icon: <IoLogoInstagram className="text-pink-400 text-xl" />,
                label: 'Instagram',
                sub: instagram,
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-base-300">
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <span className={`text-xs font-bold flex items-center gap-1 ${item.sub?.subscribed ? 'text-success' : 'text-warning'}`}>
                  {item.sub?.subscribed ? (
                    <><IoCheckmarkCircle /> Faol</>
                  ) : (
                    '⚠️ Tasdiqlanmagan'
                  )}
                </span>
              </div>
            ))}
          </div>

          <Link to={ROUTES.SUBSCRIPTION} className="btn btn-outline btn-sm w-full mt-4">
            Obunani boshqarish →
          </Link>
        </motion.div>

        {/* ─── 5. Streak taqvimi (optional) ────────────────────────────── */}
        {/*
          TODO: Oxirgi 30 kun activity heatmap (ixtiyoriy):
          — GitHub-uslubida kichik kvadratlar
          — Faol kunlar: bg-primary, nofaol: bg-base-300
          — Har bir kvadrat = 1 kun

          Misol:
          <div className="card bg-base-200 p-6">
            <h2 className="font-bold mb-4">📅 Faollik taqvimi</h2>
            <div className="grid grid-cols-10 gap-1">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-sm ${
                    Math.random() > 0.5 ? 'bg-primary/70' : 'bg-base-300'
                  }`}
                  title={`Kun ${i+1}`}
                />
              ))}
            </div>
          </div>
        */}

        {/* ─── Tahrirlash MODAL ─────────────────────────────────────────── */}
        {/*
          TODO: DaisyUI dialog yoki framer-motion modal:
          — editOpen state bilan boshqariladi
          — Form: username input, bio textarea, skills
          — [ Saqlash ] → updateProfile(form) dispatch qiladi
          — PUT /api/xp/profile
        */}
        <AnimatePresence>
          {editOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              onClick={(e) => e.target === e.currentTarget && setEditOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="card bg-base-200 p-6 max-w-md w-full mx-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Profilni tahrirlash</h3>
                  <button onClick={() => setEditOpen(false)} className="btn btn-ghost btn-sm btn-circle">
                    <IoClose />
                  </button>
                </div>

                {/*
                  TODO: Tahrirlash form:
                  — Username input
                  — Bio textarea
                  — Skills (comma-separated yoki chip input)
                  — Avatar upload (ixtiyoriy)
                  — [ Saqlash ] tugmasi
                  — [ Bekor qilish ] tugmasi

                  const handleSave = async () => {
                    await updateProfile({ username, bio, skills })
                    setEditOpen(false)
                  }
                */}
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label"><span className="label-text">Username</span></label>
                    <input
                      type="text"
                      defaultValue={user.username}
                      className="input input-bordered"
                      placeholder="username"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text">Bio</span></label>
                    <textarea
                      className="textarea textarea-bordered"
                      placeholder="O'zingiz haqingizda..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button className="btn btn-primary flex-1">Saqlash</button>
                  <button onClick={() => setEditOpen(false)} className="btn btn-ghost flex-1">Bekor</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
