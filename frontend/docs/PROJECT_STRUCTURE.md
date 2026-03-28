# 📐 Aidevix — To'liq Fayl Strukturasi

## 👥 Kim Nimani Yozadi

```
AidevixBackend/
│
├── backend/                              ← 🔧 Backend (O'qituvchi tomonidan yozilgan)
│   ├── models/
│   │   ├── User.js                       # ✅ O'qituvchi — Foydalanuvchi modeli
│   │   ├── Course.js                     # ✅ O'qituvchi — Kurs modeli (viewCount, rating qo'shildi)
│   │   ├── Video.js                      # ✅ O'qituvchi — Video modeli
│   │   ├── VideoLink.js                  # ✅ O'qituvchi — Bir martalik link modeli
│   │   ├── UserStats.js                  # ✅ O'qituvchi — XP, level, streak modeli
│   │   ├── Quiz.js                       # ✅ O'qituvchi — Quiz savollari modeli
│   │   └── QuizResult.js                 # ✅ O'qituvchi — Quiz natijalari modeli
│   │
│   ├── controllers/
│   │   ├── authController.js             # ✅ O'qituvchi
│   │   ├── courseController.js           # ✅ O'qituvchi
│   │   ├── videoController.js            # ✅ O'qituvchi
│   │   ├── subscriptionController.js     # ✅ O'qituvchi
│   │   ├── rankingController.js          # ✅ O'qituvchi — Top kurslar + Top userlar
│   │   └── xpController.js              # ✅ O'qituvchi — XP tizimi
│   │
│   ├── routes/
│   │   ├── authRoutes.js                 # ✅ O'qituvchi
│   │   ├── courseRoutes.js               # ✅ O'qituvchi
│   │   ├── videoRoutes.js                # ✅ O'qituvchi
│   │   ├── subscriptionRoutes.js         # ✅ O'qituvchi
│   │   ├── rankingRoutes.js              # ✅ O'qituvchi — /api/ranking/*
│   │   └── xpRoutes.js                   # ✅ O'qituvchi — /api/xp/*
│   │
│   ├── middleware/
│   │   ├── auth.js                       # ✅ O'qituvchi
│   │   ├── subscriptionCheck.js          # ✅ O'qituvchi
│   │   └── swaggerAuth.js               # ✅ O'qituvchi
│   │
│   ├── config/
│   │   ├── database.js                   # ✅ O'qituvchi
│   │   ├── jwt.js                        # ✅ O'qituvchi
│   │   ├── swagger.js                    # ✅ O'qituvchi
│   │   └── swaggerAdmin.js               # ✅ O'qituvchi
│   │
│   └── index.js                          # ✅ O'qituvchi — Express app
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axiosInstance.js          # ✅ O'qituvchi — JWT interceptor
│   │   │   ├── authApi.js                # ✅ O'qituvchi
│   │   │   ├── courseApi.js              # ✅ O'qituvchi
│   │   │   ├── videoApi.js               # ✅ O'qituvchi
│   │   │   ├── subscriptionApi.js        # ✅ O'qituvchi
│   │   │   ├── rankingApi.js             # ✅ O'qituvchi — NUMTON + SUHROB ishlatadi
│   │   │   └── userApi.js                # ✅ O'qituvchi — FIRDAVS + SUHROB ishlatadi
│   │   │
│   │   ├── store/
│   │   │   ├── index.js                  # ✅ O'qituvchi — Redux store
│   │   │   └── slices/
│   │   │       ├── authSlice.js          # ✅ O'qituvchi — FIRDAVS ishlatadi
│   │   │       ├── courseSlice.js        # ✅ O'qituvchi — DONIYOR ishlatadi
│   │   │       ├── videoSlice.js         # ✅ O'qituvchi — ABDUVORIS ishlatadi
│   │   │       ├── subscriptionSlice.js  # ✅ O'qituvchi — AZIZ ishlatadi
│   │   │       ├── rankingSlice.js       # ✅ O'qituvchi — NUMTON + SUHROB ishlatadi
│   │   │       └── userStatsSlice.js     # ✅ O'qituvchi — SUHROB + FIRDAVS ishlatadi
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js                # ✅ O'qituvchi — FIRDAVS ishlatadi
│   │   │   ├── useCourses.js             # ✅ O'qituvchi — DONIYOR ishlatadi
│   │   │   ├── useVideos.js              # ✅ O'qituvchi — ABDUVORIS ishlatadi
│   │   │   ├── useSubscription.js        # ✅ O'qituvchi — AZIZ ishlatadi
│   │   │   ├── useRanking.js             # ✅ O'qituvchi — NUMTON + SUHROB ishlatadi
│   │   │   └── useUserStats.js           # ✅ O'qituvchi — SUHROB + FIRDAVS ishlatadi
│   │   │
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx             # 👨‍💻 FIRDAVS — Login sahifasi
│   │   │   ├── RegisterPage.jsx          # 👨‍💻 FIRDAVS — Ro'yxatdan o'tish sahifasi
│   │   │   ├── ProfilePage.jsx           # 👨‍💻 FIRDAVS — Foydalanuvchi profili
│   │   │   │
│   │   │   ├── HomePage.jsx              # 👨‍💻 ABDUVOHID — Bosh sahifa
│   │   │   │
│   │   │   ├── CoursesPage.jsx           # 👨‍💻 DONIYOR — Barcha kurslar
│   │   │   ├── CourseDetailPage.jsx      # 👨‍💻 DONIYOR — Kurs tafsiloti
│   │   │   │
│   │   │   ├── VideoPage.jsx             # 👨‍💻 ABDUVORIS — Video + Telegram link
│   │   │   ├── VideoPlaygroundPage.jsx   # 👨‍💻 ABDUVORIS — Video + Kod muharrir
│   │   │   │
│   │   │   ├── SubscriptionPage.jsx      # 👨‍💻 AZIZ — Obuna jarayoni
│   │   │   │
│   │   │   ├── TopCoursesPage.jsx        # 👨‍💻 NUMTON — Top kurslar reytingi
│   │   │   │
│   │   │   ├── LeaderboardPage.jsx       # 👨‍💻 SUHROB — Global foydalanuvchi reytingi
│   │   │   ├── LevelUpPage.jsx           # 👨‍💻 SUHROB — Level UP sahifasi
│   │   │   │
│   │   │   └── NotFoundPage.jsx          # 👨‍💻 BOISXON — 404 sahifasi
│   │   │
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx         # 👨‍💻 FIRDAVS
│   │   │   │   ├── RegisterForm.jsx      # 👨‍💻 FIRDAVS
│   │   │   │   └── ProtectedRoute.jsx    # ✅ O'qituvchi — O'zgartirma!
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx            # 👨‍💻 ABDUVOHID
│   │   │   │   ├── Footer.jsx            # 👨‍💻 ABDUVOHID
│   │   │   │   └── ScrollToTop.jsx       # ✅ O'qituvchi
│   │   │   │
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx            # ✅ O'qituvchi
│   │   │   │   ├── Input.jsx             # ✅ O'qituvchi
│   │   │   │   ├── Modal.jsx             # ✅ O'qituvchi
│   │   │   │   ├── Badge.jsx             # ✅ O'qituvchi
│   │   │   │   ├── StarRating.jsx        # ✅ O'qituvchi
│   │   │   │   └── Loader.jsx            # ✅ O'qituvchi
│   │   │   │
│   │   │   ├── courses/
│   │   │   │   ├── CourseCard.jsx        # 👨‍💻 DONIYOR (o'zgartirsa bo'ladi)
│   │   │   │   ├── CourseFilter.jsx      # 👨‍💻 DONIYOR
│   │   │   │   ├── CourseGrid.jsx        # 👨‍💻 DONIYOR
│   │   │   │   └── CourseSkeleton.jsx    # 👨‍💻 DONIYOR (QUDRAT yaratgan bilan almashtirish mumkin)
│   │   │   │
│   │   │   ├── videos/
│   │   │   │   ├── VideoCard.jsx         # 👨‍💻 ABDUVORIS
│   │   │   │   ├── VideoLinkModal.jsx    # 👨‍💻 ABDUVORIS (allaqachon bor, yaxshilash)
│   │   │   │   └── VideoRating.jsx       # 👨‍💻 ABDUVORIS
│   │   │   │
│   │   │   ├── subscription/
│   │   │   │   ├── TelegramVerify.jsx    # 👨‍💻 AZIZ
│   │   │   │   ├── InstagramVerify.jsx   # 👨‍💻 AZIZ
│   │   │   │   └── SubscriptionGate.jsx  # ✅ O'qituvchi (o'zgartirma!)
│   │   │   │
│   │   │   ├── ranking/
│   │   │   │   └── CourseRankCard.jsx    # 👨‍💻 NUMTON
│   │   │   │
│   │   │   ├── leaderboard/
│   │   │   │   ├── LeaderboardTable.jsx  # 👨‍💻 SUHROB
│   │   │   │   ├── LevelUpModal.jsx      # 👨‍💻 SUHROB
│   │   │   │   └── UserXPCard.jsx        # 👨‍💻 SUHROB (yangi fayl yaratish kerak)
│   │   │   │
│   │   │   └── loading/
│   │   │       ├── LoadingScreen.jsx     # 👨‍💻 QUDRAT — 3D loading animatsiya
│   │   │       ├── PageLoader.jsx        # 👨‍💻 QUDRAT — Suspense fallback
│   │   │       └── SkeletonCard.jsx      # 👨‍💻 QUDRAT — Content skeleton
│   │   │
│   │   ├── animations/
│   │   │   ├── three/
│   │   │   │   └── HeroScene.js          # 👨‍💻 QUDRAT (yaxshilaydi) + ABDUVOHID ishlatadi
│   │   │   └── gsap/
│   │   │       ├── heroAnimations.js     # 👨‍💻 QUDRAT (yaxshilaydi)
│   │   │       ├── cardAnimations.js     # ✅ O'qituvchi
│   │   │       └── pageTransitions.js    # 👨‍💻 QUDRAT (yaxshilaydi)
│   │   │
│   │   ├── utils/
│   │   │   ├── tokenStorage.js           # ✅ O'qituvchi — O'zgartirma!
│   │   │   └── constants.js              # ✅ O'qituvchi
│   │   │
│   │   ├── router/
│   │   │   └── AppRouter.jsx             # ✅ O'qituvchi — barcha routelar bor
│   │   │
│   │   ├── App.jsx                       # ✅ O'qituvchi
│   │   ├── main.jsx                      # ✅ O'qituvchi
│   │   └── styles/
│   │       └── index.css                 # ✅ O'qituvchi
│   │
│   ├── package.json                      # ✅ O'qituvchi
│   ├── vite.config.js                    # ✅ O'qituvchi
│   ├── tailwind.config.js                # ✅ O'qituvchi
│   └── index.html                        # ✅ O'qituvchi
│
└── docs/
    ├── PROJECT_STRUCTURE.md              # ← Shu fayl
    └── students/
        ├── FIRDAVS.md                    # Firdavs uchun vazifa
        ├── ABDUVORIS.md                  # Abduvoris uchun vazifa
        ├── DONIYOR.md                    # Doniyor uchun vazifa
        ├── AZIZ.md                       # Aziz uchun vazifa
        ├── NUMTON.md                     # Numton uchun vazifa
        ├── SUHROB.md                     # Suhrob uchun vazifa
        ├── ABDUVOHID.md                  # Abduvohid uchun vazifa
        ├── BOISXON.md                    # Boisxon uchun vazifa
        └── QUDRAT.md                     # Qudrat uchun vazifa
```

---

## 🌿 Git Workflow (Barcha O'quvchilar Uchun)

```bash
# 1. Reponi clone qilish
git clone https://github.com/[repo]/AidevixBackend.git
cd AidevixBackend

# 2. O'z branchini yaratish (FAQAT BIR MARTA)
git checkout -b feature/[ism]-[sahifa]
# Masalan: git checkout -b feature/firdavs-auth

# 3. Har kuni ishdan oldin main'dan yangilash
git fetch origin
git merge origin/main

# 4. O'z kodni commit qilish
git add frontend/src/pages/LoginPage.jsx  # Faqat o'z fayllarini qo'sh!
git commit -m "feat: login sahifasi tayyor"
git push origin feature/firdavs-auth

# 5. Pull Request ochish (GitHub'da)
# feature/firdavs-auth → main
```

---

## 🚫 QOIDALAR

1. **`main` branchga to'g'ridan-to'g'ri kod yozma!**
2. **Boshqa o'quvchi fayllarini o'zgartirma!**
3. **Har bir o'zgarishdan keyin commit qil!**
4. **PR ochishdan oldin barcha xatolarni to'g'irla!**

---

## 🔗 Muhim Linklar

| Resurs | URL |
|--------|-----|
| Swagger API | `http://localhost:5000/api-docs` (admin / admin123) |
| Admin Swagger | `http://localhost:5000/admin-docs` (admin / admin123) |
| Frontend | `http://localhost:3000` |
| Backend | `http://localhost:5000` |

---

## 🛣️ Barcha Route'lar

| URL | Sahifa | O'quvchi |
|-----|--------|---------|
| `/` | HomePage | ABDUVOHID |
| `/login` | LoginPage | FIRDAVS |
| `/register` | RegisterPage | FIRDAVS |
| `/profile` | ProfilePage | FIRDAVS |
| `/courses` | CoursesPage | DONIYOR |
| `/courses/:id` | CourseDetailPage | DONIYOR |
| `/videos/:id` | VideoPage | ABDUVORIS |
| `/videos/:id/playground` | VideoPlaygroundPage | ABDUVORIS |
| `/subscription` | SubscriptionPage | AZIZ |
| `/top` | TopCoursesPage | NUMTON |
| `/leaderboard` | LeaderboardPage | SUHROB |
| `/level-up` | LevelUpPage | SUHROB |
| `*` | NotFoundPage | BOISXON |
