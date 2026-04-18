# Frontend Architecture Map

> Aidevix Online Coach — Frontend fayl tuzilmasi
> Stack: Next.js 14 (App Router) + React 18 + Redux Toolkit + Tailwind CSS + TypeScript

---

## Sahifalar (frontend/src/app/)

> Next.js 14 App Router — har bir papka = bir sahifa

### Umumiy

| Fayl | URL | Vazifasi |
|------|-----|----------|
| `page.tsx` | `/` | Bosh sahifa |
| `layout.tsx` | — | Root layout (Providers, Navbar, Footer) |
| `loading.tsx` | — | Global loading holati |
| `not-found.tsx` | `/404` | 404 sahifa |
| `robots.ts` | — | SEO robots.txt |
| `sitemap.ts` | — | SEO sitemap |

### Auth sahifalari

| Fayl | URL | Vazifasi |
|------|-----|----------|
| `login/page.tsx` | `/login` | Kirish |
| `register/page.tsx` | `/register` | Ro'yxatdan o'tish |
| `forgot-password/page.tsx` | `/forgot-password` | Parolni unutdim |
| `verify-code/page.tsx` | `/verify-code` | Email kodni tasdiqlash |
| `reset-password/page.tsx` | `/reset-password` | Yangi parol o'rnatish |
| `auth/telegram-login/page.tsx` | `/auth/telegram-login` | Telegram orqali kirish |

### Asosiy sahifalar

| Fayl | URL | Vazifasi |
|------|-----|----------|
| `courses/page.tsx` | `/courses` | Kurslar ro'yxati |
| `courses/[id]/page.tsx` | `/courses/:id` | Kurs tafsiloti |
| `courses/loading.tsx` | — | Kurslar loading |
| `videos/[id]/page.tsx` | `/videos/:id` | Video ko'rish sahifasi |
| `profile/page.tsx` | `/profile` | Foydalanuvchi profili |
| `leaderboard/page.tsx` | `/leaderboard` | Liderlar jadvali |
| `level-up/page.tsx` | `/level-up` | Level up animatsiya |
| `challenges/page.tsx` | `/challenges` | Kunlik challengelar |
| `referral/page.tsx` | `/referral` | Do'stlarni taklif qilish |

### Obuna va to'lov

| Fayl | URL | Vazifasi |
|------|-----|----------|
| `subscription/page.tsx` | `/subscription` | Obuna holati |
| `pricing/page.tsx` | `/pricing` | Narxlar va tariflar |

### Ma'lumot sahifalari

| Fayl | URL | Vazifasi |
|------|-----|----------|
| `about/page.tsx` | `/about` | Loyiha haqida |
| `blog/page.tsx` | `/blog` | Blog |
| `careers/page.tsx` | `/careers` | Karyera |
| `contact/page.tsx` | `/contact` | Aloqa |
| `help/page.tsx` | `/help` | Yordam markazi |

### Admin panel

| Fayl | URL | Vazifasi |
|------|-----|----------|
| `admin/page.tsx` | `/admin` | Admin bosh sahifa |
| `admin/layout.tsx` | — | Admin layout |
| `admin/courses/page.tsx` | `/admin/courses` | Kurslar boshqaruvi |
| `admin/courses/[id]/page.tsx` | `/admin/courses/:id` | Kurs tahrirlash |

### API Routes

| Fayl | URL | Vazifasi |
|------|-----|----------|
| `api/coach/route.ts` | `/api/coach` | AI Coach backend (server-side) |

---

## Components (frontend/src/components/)

### auth/ — Autentifikatsiya komponentlari

| Fayl | Vazifasi |
|------|----------|
| `LoginForm.tsx` | Login formasi (email + password) |
| `RegisterForm.tsx` | Register formasi |
| `ProtectedRoute.tsx` | Auth himoyali route wrapper |
| `AdminRoute.tsx` | Admin role himoyali route wrapper |

### common/ — Umumiy qayta ishlatiladigan komponentlar

| Fayl | Vazifasi |
|------|----------|
| `AICoach.tsx` | AI yordamchi chatbot UI |
| `Badge.tsx` | Badge ko'rsatish komponenti |
| `Button.tsx` | Umumiy button |
| `Input.tsx` | Umumiy input |
| `Modal.tsx` | Modal dialog |
| `Loader.tsx` | Loading spinner |
| `Skeleton.tsx` | Skeleton placeholder |
| `DailyRewardModal.tsx` | Kunlik mukofot modali |
| `StarRating.tsx` | Yulduzcha reyting |
| `TypedText.tsx` | Typing animatsiya (typewriter effect) |
| `LiveActivityTicker.tsx` | Jonli faoliyat ko'rsatkich |
| `PlaceholderPage.tsx` | Bo'sh sahifa placeholder |
| `AnimationController.tsx` | Animatsiya boshqaruvchi |

### courses/ — Kurs komponentlari

| Fayl | Vazifasi |
|------|----------|
| `CourseCard.tsx` | Kurs kartasi |
| `CourseCardSkeleton.tsx` | Kurs kartasi skeleton |
| `CourseFilter.tsx` | Kurslarni filtrlash |
| `CourseGrid.tsx` | Kurslar grid layout |
| `CourseSkeleton.tsx` | Kurs sahifasi skeleton |

### home/ — Bosh sahifa komponentlari

| Fayl | Vazifasi |
|------|----------|
| `HomeClient.tsx` | Bosh sahifa asosiy client component |
| `HomeSkeleton.tsx` | Bosh sahifa skeleton |
| `ParticleHero.tsx` | Particle animatsiyali hero section |
| `ProBanner.tsx` | Pro obuna banner |
| `ThreeHero.tsx` | Three.js 3D hero |

### layout/ — Layout komponentlari

| Fayl | Vazifasi |
|------|----------|
| `Navbar.tsx` | Navigatsiya paneli (yuqori) |
| `Footer.tsx` | Pastki qism |
| `ClientLayoutWrapper.tsx` | Client-side layout wrapper |
| `ScrollToTop.tsx` | Sahifa tepasiga qaytish tugmasi |
| `SmoothScroll.tsx` | Smooth scroll wrapper |

### leaderboard/ — Liderlar jadvali

| Fayl | Vazifasi |
|------|----------|
| `LeaderboardTable.tsx` | Liderlar jadvali |
| `LevelUpModal.tsx` | Level up tabrik modali |
| `UserXPCard.tsx` | Foydalanuvchi XP kartasi |

### subscription/ — Obuna komponentlari

| Fayl | Vazifasi |
|------|----------|
| `SubscriptionGate.tsx` | Obuna himoyasi (kontent bloklash) |
| `TelegramVerify.tsx` | Telegram obuna tekshiruv |
| `InstagramVerify.tsx` | Instagram obuna tekshiruv |
| `InstagramSubscriptionVerification.tsx` | Instagram tekshiruv to'liq oqim |

### videos/ — Video komponentlari

| Fayl | Vazifasi |
|------|----------|
| `VideoCard.tsx` | Video kartasi |
| `VideoCardSkeleton.tsx` | Video kartasi skeleton |
| `VideoLinkModal.tsx` | Video havola modali |
| `VideoRating.tsx` | Video reyting berish |

### visuals/ — Vizual/animatsiya komponentlari

| Fayl | Vazifasi |
|------|----------|
| `Scene3D.tsx` | Three.js 3D sahna |
| `DataCube.tsx` | 3D kub animatsiya |
| `FloatingCode.tsx` | Suzuvchi kod animatsiya |
| `CodeVideoBackground.tsx` | Kod video fon |
| `VideoBackground.tsx` | Video fon |
| `VisualScene.tsx` | Vizual sahna wrapper |

### loading/ — Loading komponentlari

| Fayl | Vazifasi |
|------|----------|
| `LoadingScreen.tsx` | To'liq ekran loading |
| `PageLoader.tsx` | Sahifa loader |
| `SkeletonCard.tsx` | Skeleton karta |

### ranking/ — Reyting

| Fayl | Vazifasi |
|------|----------|
| `CourseRankCard.tsx` | Kurs reyting kartasi |

### Boshqa

| Fayl | Vazifasi |
|------|----------|
| `Providers.tsx` | Redux + Theme + Context providerlar wrapper |

---

## API Layer (frontend/src/api/)

> Axios orqali backend bilan aloqa

| Fayl | Vazifasi | Asosiy funksiyalar |
|------|----------|--------------------|
| `axiosInstance.ts` | Axios bazaviy instance (interceptors, cookie auth) | baseURL, token refresh, error handling |
| `authApi.ts` | Auth API | `loginUser`, `registerUser`, `refreshToken`, `logoutUser`, `getMe` |
| `courseApi.ts` | Kurslar API | `getCourses`, `getCourseById`, `createCourse` |
| `videoApi.ts` | Videolar API | `getVideos`, `getVideoById` |
| `subscriptionApi.ts` | Obuna API | `checkSubscription`, `verifyTelegram`, `verifyInstagram` |
| `adminApi.ts` | Admin API | Admin CRUD operatsiyalari |
| `rankingApi.ts` | Reyting API | `getRankings` |
| `uploadApi.ts` | Yuklash API | `uploadFile`, `uploadImage` |
| `userApi.ts` | User API | Profil, XP, stats |
| `forgotPasswordApi.ts` | Parol tiklash API | `forgotPassword`, `verifyCode`, `resetPassword` |

---

## Store / Redux (frontend/src/store/)

> Redux Toolkit — global state boshqaruvi

| Fayl | Vazifasi | Asosiy state |
|------|----------|-------------|
| `index.ts` | Store konfiguratsiya | `configureStore` |
| `slices/authSlice.ts` | Auth holati | `user`, `isAuthenticated`, `loading` |
| `slices/courseSlice.ts` | Kurslar holati | `courses`, `currentCourse`, `loading` |
| `slices/videoSlice.ts` | Videolar holati | `videos`, `currentVideo` |
| `slices/subscriptionSlice.ts` | Obuna holati | `isSubscribed`, `subscriptionType` |
| `slices/userStatsSlice.ts` | XP/Stats holati | `xp`, `level`, `streak`, `badges` |
| `slices/rankingSlice.ts` | Reyting holati | `rankings`, `loading` |

---

## Hooks (frontend/src/hooks/)

> Custom React hooklar — API + Store bilan ishlash

| Fayl | Vazifasi |
|------|----------|
| `useAuth.ts` | Login, logout, register, auth tekshiruv |
| `useCourses.ts` | Kurslar olish, filtrlash |
| `useVideos.ts` | Videolar olish |
| `useSubscription.ts` | Obuna holati tekshiruv |
| `useUserStats.ts` | XP, level, streak olish |
| `useRanking.ts` | Reyting olish |

---

## Context (frontend/src/context/)

> React Context — global providerlar

| Fayl | Vazifasi |
|------|----------|
| `ThemeContext.tsx` | Dark/Light tema boshqaruvi |
| `LangContext.tsx` | Til boshqaruvi (uz/en/ru) |
| `SoundContext.tsx` | Ovoz effektlari boshqaruvi |
| `AnimationContext.tsx` | Animatsiya holati boshqaruvi |

---

## Utils (frontend/src/utils/)

> Yordamchi funksiyalar

| Fayl | Vazifasi |
|------|----------|
| `constants.ts` | Doimiy qiymatlar (API URL, ranglar, limitlar) |
| `i18n.ts` | Ko'p tilli tarjimalar |
| `xpLevel.ts` | XP dan level/rank hisoblash |
| `formatDate.ts` | Sana formatlash |
| `formatDuration.ts` | Vaqt davomiyligini formatlash |
| `sounds.ts` | Ovoz effektlari |
| `tokenStorage.ts` | Token saqlash (legacy — ishlatilmasin) |
| `coachAssistant.ts` | AI Coach yordamchi logikasi |
| `forgotPasswordFlow.ts` | Parol tiklash oqimi |

---

## Animations (frontend/src/animations/)

| Fayl | Vazifasi |
|------|----------|
| `gsap/cardAnimations.ts` | Karta animatsiyalari (GSAP) |
| `gsap/heroAnimations.ts` | Hero section animatsiyalari |
| `gsap/pageTransitions.ts` | Sahifa o'tish animatsiyalari |
| `three/HeroScene.ts` | Three.js 3D hero sahnasi |

---

## Styles (frontend/src/styles/)

| Fayl | Vazifasi |
|------|----------|
| `globals.css` | Global CSS + Tailwind direktivalar |
| `animations.css` | CSS animatsiyalar |

---

## Legacy

| Fayl | Vazifasi |
|------|----------|
| `src/pages/_app.tsx` | Eski Pages Router — hali mavjud, o'chirilmagan |
