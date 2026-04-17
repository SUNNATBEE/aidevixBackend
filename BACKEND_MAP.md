# Backend Architecture Map

> Aidevix Online Coach — Backend fayl tuzilmasi
> Stack: Express 5 + MongoDB/Mongoose + JWT + Swagger

---

## Entry Point

| Fayl | Vazifasi |
|------|----------|
| `backend/index.js` | Asosiy server — Express app, middleware, routes, DB ulanish |
| `backend/package.json` | Dependencies va scripts |

---

## Controllers (backend/controllers/)

> Barcha biznes-logika shu yerda

| Fayl | Vazifasi | Asosiy funksiyalar |
|------|----------|--------------------|
| `authController.js` | Autentifikatsiya | `register`, `login`, `refresh`, `logout`, `getMe`, `forgotPassword`, `verifyCode`, `resetPassword`, `claimDailyReward`, `getReferralStats` |
| `adminController.js` | Admin panel | Foydalanuvchilar boshqaruvi, statistika |
| `courseController.js` | Kurslar | CRUD, kurs ro'yxati, filtrlash |
| `sectionController.js` | Bo'limlar | Kurs ichidagi bo'limlar CRUD |
| `videoController.js` | Videolar | Video CRUD, kurs videolari |
| `enrollmentController.js` | Yozilish | Kursga yozilish, progress tracking |
| `paymentController.js` | To'lov | To'lov yaratish, tasdiqlash |
| `subscriptionController.js` | Obuna | Obuna holati, tekshiruv |
| `xpController.js` | XP tizimi | `getUserStats`, `addVideoWatchXP`, `submitQuiz`, `getQuizByVideo`, `updateProfile`, `useStreakFreeze`, `addStreakFreeze`, `getWeeklyLeaderboard`, `getXPHistory`, `getStreakStatus` |
| `certificateController.js` | Sertifikatlar | Sertifikat yaratish, olish |
| `challengeController.js` | Challengelar | Kunlik challenge |
| `rankingController.js` | Reyting | Foydalanuvchi reytinglari |
| `projectController.js` | Loyihalar | Loyihalar CRUD |
| `followController.js` | Follow | Follow/unfollow |
| `wishlistController.js` | Wishlist | Kurslarni saqlash |
| `uploadController.js` | Yuklash | Fayl/rasm yuklash (BunnyCDN) |

---

## Models (backend/models/)

> MongoDB schema va metodlar

| Fayl | Collection | Asosiy fieldlar |
|------|-----------|-----------------|
| `User.js` | users | username, email, password, xp, streak, rankTitle, referralCode, refreshToken |
| `UserStats.js` | userstats | userId, xp, weeklyXp, level, streak, badges, videosWatched, quizzesCompleted, bio, skills |
| `Course.js` | courses | title, description, instructor, price, thumbnail, isPublished |
| `Section.js` | sections | courseId, title, order |
| `Video.js` | videos | sectionId, courseId, title, url, duration, order |
| `VideoLink.js` | videolinks | videoId, url, type |
| `VideoQuestion.js` | videoquestions | videoId, question, options |
| `Enrollment.js` | enrollments | userId, courseId, progress, completedVideos |
| `Payment.js` | payments | userId, courseId, amount, status, provider |
| `Quiz.js` | quizzes | videoId, courseId, questions, passingScore, isActive |
| `QuizResult.js` | quizresults | userId, quizId, score, xpEarned, passed, answers |
| `Certificate.js` | certificates | userId, courseId, certificateUrl |
| `DailyChallenge.js` | dailychallenges | title, description, xpReward, date |
| `CourseRating.js` | courseratings | userId, courseId, rating, comment |
| `Project.js` | projects | title, description, techStack |
| `Follow.js` | follows | followerId, followingId |
| `Wishlist.js` | wishlists | userId, courseId |
| `VerifyToken.js` | verifytokens | userId, token, type, expiresAt |

---

## Routes (backend/routes/)

> API endpoint yo'llari

| Fayl | Base URL | Ishlatadigan controller |
|------|----------|------------------------|
| `authRoutes.js` | `/api/auth` | authController |
| `adminRoutes.js` | `/api/admin` | adminController |
| `courseRoutes.js` | `/api/courses` | courseController |
| `sectionRoutes.js` | `/api/sections` | sectionController |
| `videoRoutes.js` | `/api/videos` | videoController |
| `enrollmentRoutes.js` | `/api/enrollments` | enrollmentController |
| `paymentRoutes.js` | `/api/payments` | paymentController |
| `subscriptionRoutes.js` | `/api/subscription` | subscriptionController |
| `xpRoutes.js` | `/api/xp` | xpController |
| `certificateRoutes.js` | `/api/certificates` | certificateController |
| `challengeRoutes.js` | `/api/challenges` | challengeController |
| `rankingRoutes.js` | `/api/ranking` | rankingController |
| `projectRoutes.js` | `/api/projects` | projectController |
| `followRoutes.js` | `/api/follow` | followController |
| `wishlistRoutes.js` | `/api/wishlist` | wishlistController |
| `uploadRoutes.js` | `/api/upload` | uploadController |

---

## Middleware (backend/middleware/)

> Request/response interceptorlar

| Fayl | Vazifasi | Qachon ishlatiladi |
|------|----------|-------------------|
| `auth.js` | JWT token tekshiruv, `req.user` set qilish | Himoyalangan barcha routelarda |
| `subscriptionCheck.js` | Obuna holati tekshiruv | Kurs/video ko'rish routelarida |
| `asyncHandler.js` | try/catch wrapper | Barcha controllerlarda |
| `errorMiddleware.js` | Global error handler | `index.js` da oxirgi middleware |
| `rateLimiter.js` | So'rovlar sonini cheklash | Auth routelarida |
| `uploadMiddleware.js` | Multer fayl yuklash | Upload routelarida |
| `validateObjectId.js` | MongoDB ObjectId tekshiruv | Params bilan routelarda |
| `swaggerAuth.js` | Swagger UI himoyasi | `/api-docs` routeda |

---

## Utils (backend/utils/)

> Yordamchi funksiyalar va servislar

| Fayl | Vazifasi |
|------|----------|
| `jwt.js` | `generateAccessToken`, `generateRefreshToken`, `verifyRefreshToken`, `generateResetToken`, `verifyResetToken` |
| `authSecurity.js` | `attachAuthCookies`, `clearAuthCookies`, `hashToken`, `parseCookies` — cookie-based auth |
| `emailService.js` | `sendWelcomeEmail`, `sendResetCodeEmail` — email yuborish |
| `socialVerification.js` | Telegram/Instagram obuna tekshiruv |
| `telegramBot.js` | Telegram bot — bildirishnomalar, verifikatsiya |
| `badgeService.js` | `awardBadges` — avtomatik badge berish |
| `bunny.js` | BunnyCDN integratsiyasi — fayl yuklash/o'chirish |
| `checkSubscriptions.js` | Obuna muddati tekshiruv utility |
| `errorResponse.js` | `ErrorResponse` class — standart xato formati |

---

## Config (backend/config/)

| Fayl | Vazifasi |
|------|----------|
| `database.js` | MongoDB ulanish (mongoose) |
| `jwt.js` | JWT secret va muddatlar |
| `swagger.js` | Swagger/OpenAPI konfiguratsiya |
| `swaggerAdmin.js` | Admin Swagger konfiguratsiya |

---

## Swagger Docs (backend/docs/swagger/)

> Har bir modul uchun API hujjatlar

`admin.js`, `auth.js`, `certificate.js`, `challenge.js`, `course.js`, `enrollment.js`, `follow.js`, `payment.js`, `project.js`, `ranking.js`, `section.js`, `subscription.js`, `upload.js`, `video.js`, `wishlist.js`, `xp.js`

---

## Seeders

| Fayl | Vazifasi |
|------|----------|
| `backend/seeders/seedCourses.js` | Test kurslar yaratish (ALLOW_DESTRUCTIVE_SEED=true kerak) |
