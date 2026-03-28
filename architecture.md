# Aidevix Backend — Arxitektura

O'zbek dasturchilar uchun onlayn koding kurslar platformasi. Telegram+Instagram obuna → video darslar (Bunny.net signed embed). Payme/Click to'lov. XP/level/streak gamifikatsiya.

## Tech Stack
- **Runtime**: Node.js 20+, CommonJS
- **Framework**: Express 5.2.1, port 5000
- **Database**: MongoDB Atlas (Mongoose 8.6.1) — `cluster0.idzurbe.mongodb.net/aidevix`
- **Video**: Bunny.net Stream (signed embed URL, SHA256 token, 2h TTL)
- **Payments**: Payme (JSON-RPC), Click (prepare/complete)
- **Auth**: JWT access (15m) + refresh (7d), bcrypt 12 rounds
- **Upload**: Multer + Cloudinary (avatar, thumbnail, certificate PDF)
- **Email**: Nodemailer (welcome, enrollment, certificate, streak reminder)
- **Deploy**: Railway (backend), Vercel (frontend)

## Papka Tuzilishi
```
backend/
├── index.js                     # Entry point, Express app, middleware, routes, error handler
├── .env                         # Secrets (MONGODB_URI, JWT, BUNNY, TELEGRAM, SWAGGER, PAYME, CLICK)
├── config/
│   ├── database.js              # mongoose.connect (Atlas, custom DNS, pool=10)
│   ├── jwt.js                   # ACCESS/REFRESH_TOKEN_SECRET, expiry
│   ├── swagger.js               # swagger-jsdoc spec (40KB)
│   └── swaggerAdmin.js          # Admin panel swagger
├── middleware/
│   ├── auth.js                  # authenticate (JWT Bearer), requireAdmin (role=admin)
│   ├── rateLimiter.js           # apiLimiter(500/15m), authLimiter(50/15m), paymentLimiter, uploadLimiter
│   ├── subscriptionCheck.js     # checkSubscriptions — real-time Telegram/Instagram obuna tekshirish
│   ├── swaggerAuth.js           # HTTP Basic auth (SWAGGER_USERNAME/PASSWORD)
│   ├── validateObjectId.js      # MongoDB ObjectId format validatsiya (param → 400)
│   ├── uploadMiddleware.js      # Multer + CloudinaryStorage (avatar 400x400, thumbnail 800x450)
│   └── paymentVerification.js   # verifyPaymeAuth (Basic), verifyClickSign (MD5 HMAC)
├── models/                      # 19 Mongoose model
│   ├── User.js                  # username*, email*, password (select:false), socialSubscriptions{instagram,telegram}, role(user|admin), isActive, telegramUserId/ChatId
│   ├── Course.js                # title*, description*, price*, instructor→User, videos→[Video], category(html|css|javascript|react|typescript|nodejs|general), viewCount, studentsCount, rating(0-5), level, isFree, totalDuration
│   ├── Video.js                 # title*, course→Course, order, duration, bunnyVideoId, bunnyStatus(pending|processing|ready|failed), viewCount, materials[{name,url}], sectionId→Section, questions[{userId,text,answer}]
│   ├── Enrollment.js            # userId*→User, courseId*→Course, paymentStatus(free|pending|paid|refunded), watchedVideos[{videoId,watchedAt,watchedSeconds}], progressPercent(0-100), isCompleted, completedAt. Index: unique(userId,courseId)
│   ├── UserStats.js             # userId* unique→User, xp, level, streak, lastActivityDate, videosWatched, quizzesCompleted, badges[{name,icon,earnedAt}], bio, skills[], avatar, weeklyXp, streakFreezes(max5). Methods: calculateLevel(), getLevelProgress(), getLevelTitle()
│   ├── Payment.js               # userId→User, courseId→Course, amount, provider(payme|click|manual), status(pending|completed|failed|refunded|cancelled|expired), providerTransactionId, paidAt, paymeCreateTime/PerformTime/CancelTime/CancelReason, clickTransId/PaydocId
│   ├── Section.js               # courseId→Course, title, order, videos→[Video], isActive
│   ├── Certificate.js           # userId→User, courseId→Course, enrollmentId→Enrollment, certificateCode(unique), recipientName, courseName, pdfUrl. Index: unique(userId,courseId)
│   ├── Quiz.js                  # videoId→Video, courseId→Course, title, questions[{question,options[2-4],correctAnswer(0-3),xpReward=10}], passingScore=70
│   ├── QuizResult.js            # userId→User, quizId→Quiz, videoId, courseId, score(0-100), xpEarned, passed, answers[{questionIndex,selectedOption,isCorrect}]. Index: unique(userId,quizId)
│   ├── Project.js               # courseId→Course, title, description, level, tasks[{order,title,description,hint,xpReward=20}], technologies[], xpReward=200, completedBy[{userId,completedAt,score,githubUrl}]
│   ├── DailyChallenge.js        # title, type(watch_video|complete_quiz|streak|enroll_course|rate_course), targetCount, xpReward=50, date(YYYY-MM-DD unique). + UserChallengeProgress model (userId,challengeId,currentCount,isCompleted,xpEarned)
│   ├── Follow.js                # followerId→User, followingId→User. Index: unique(followerId,followingId)
│   ├── Wishlist.js              # userId(unique)→User, courses[{courseId→Course,addedAt}]
│   ├── CourseRating.js          # userId→User, courseId→Course, rating(1-5), review(max500). Index: unique(userId,courseId)
│   ├── VideoLink.js             # DEPRECATED. video→Video, user→User, telegramLink, isUsed, expiresAt
│   ├── VideoQuestion.js         # videoId→Video, courseId→Course, userId→User, question(max1000), answer, answeredBy→User, isAnswered
│   ├── InstagramVerification.js # userId→User, instagramUsername, verificationType(manual|screenshot), status(pending|approved|rejected), reviewedBy→User
│   └── XPTransaction.js         # userId→User, amount, reason, metadata
├── controllers/                 # 16 controller — har biri try/catch, {success,data/message} format
│   ├── authController.js        # register, login, refreshToken, logout, getMe
│   ├── courseController.js       # getAllCourses(filter/search/sort/pagination), getCourse, getTopCourses, getCategories, getRecommendedCourses, getUserRecommendedCourses, getAutocomplete, getFilterCounts, createCourse, updateCourse, deleteCourse, rateCourse
│   ├── videoController.js        # getCourseVideos, getVideo(signed embed), useVideoLink(deprecated), createVideo(+Bunny slot), updateVideo, deleteVideo, searchVideos, askQuestion, getVideoQuestions, answerQuestion, getUploadCredentialsForVideo, checkVideoStatus, linkToBunny
│   ├── adminController.js        # getDashboardStats, getTopStudents, getCoursesStats, getRecentPayments, getUsers(search/filter), updateUser(role/isActive), deleteUser, getInstagramVerifications, reviewInstagramVerification
│   ├── paymentController.js      # initiatePayment(→paymentUrl), getMyPayments, getPaymentStatus. Payme: CheckPerformTransaction, CreateTransaction, PerformTransaction, CancelTransaction, CheckTransaction, GetStatement. Click: clickPrepare, clickComplete. To'lov → Enrollment upsert + studentsCount++
│   ├── xpController.js           # getUserStats, addVideoWatchXP(+50,streak), submitQuiz(+10/correct,+100/pass), getQuizByVideo, updateProfile(bio/skills/avatar), useStreakFreeze, addStreakFreeze, getWeeklyLeaderboard, getXPHistory, getStreakStatus
│   ├── enrollmentController.js   # enrollCourse(free only), getMyEnrollments, markVideoWatched(progress calc, auto-certificate), getCourseProgress
│   ├── subscriptionController.js # verifyInstagram, verifyTelegram(getChatMember), getSubscriptionStatus, setTelegramId, getRealtimeStatus, requestInstagramVerification
│   ├── rankingController.js      # getTopCourses(viewCount), getTopUsers(xp+rankTitle), getUserPosition, getWeeklyLeaderboard
│   ├── projectController.js      # getProjectsByCourse, getProject, completeProject(+XP), createProject, updateProject, deleteProject(soft)
│   ├── certificateController.js  # getMyCertificates, verifyCertificate(by code, public), downloadCertificate(PDFKit→Cloudinary)
│   ├── challengeController.js    # getTodayChallenge, updateChallengeProgress(+XP on complete), createChallenge(admin)
│   ├── followController.js       # followUser, unfollowUser, getFollowStats, getMyFollowers, getMyFollowing
│   ├── wishlistController.js     # addToWishlist, removeFromWishlist, getWishlist
│   ├── sectionController.js      # getCourseSections, createSection, addVideoToSection, updateSection, deleteSection
│   └── uploadController.js       # uploadAvatar(→UserStats.avatar), uploadThumbnail(→Course.thumbnail)
├── routes/                      # 17 route file
│   ├── authRoutes.js            # POST register/login/refresh-token/logout, GET me
│   ├── courseRoutes.js          # GET /,/top,/categories,/recommended,/autocomplete,/filter-counts,/:id,/:id/recommended. POST /,/:id/rate. PUT/DELETE /:id. validateObjectId on :id
│   ├── videoRoutes.js           # GET /course/:courseId,/search,/:id(+checkSubscriptions),/:id/upload-credentials,/:id/status,/:id/questions. POST /,/:id/questions,/link/:linkId/use. PUT/DELETE/PATCH /:id. validateObjectId on :id
│   ├── adminRoutes.js           # All require authenticate+requireAdmin. GET /stats,/top-students,/courses/stats,/payments,/users,/instagram-verifications. PUT/DELETE /users/:id, PUT /instagram-verifications/:id
│   ├── paymentRoutes.js         # POST /initiate(auth), /payme(verifyPaymeAuth), /click/prepare(verifyClickSign), /click/complete(verifyClickSign). GET /my(auth), /:id/status(auth)
│   ├── xpRoutes.js              # GET /stats,/quiz/video/:videoId,/weekly-leaderboard,/history,/streak-status. POST /video-watched/:videoId,/quiz/:quizId,/streak-freeze,/streak-freeze/add. PUT /profile
│   ├── enrollmentRoutes.js      # POST /:courseId. GET /my, /:courseId/progress. POST /:courseId/watch/:videoId
│   ├── subscriptionRoutes.js    # POST /verify-instagram,/verify-telegram,/telegram-id,/instagram-verification. GET /status,/realtime
│   ├── rankingRoutes.js         # GET /courses,/users,/users/:userId/position,/weekly
│   ├── projectRoutes.js         # GET /course/:courseId,/:id. POST /,/:id/complete. PUT/DELETE /:id
│   ├── certificateRoutes.js     # GET /my,/verify/:code,/:code/download
│   ├── sectionRoutes.js         # GET /course/:courseId. POST /,/:sectionId/videos/:videoId. PUT/DELETE /:id
│   ├── challengeRoutes.js       # GET /today. POST /progress,/admin
│   ├── followRoutes.js          # POST /:userId. DELETE /:userId. GET /:userId/stats,/my/followers,/my/following
│   ├── wishlistRoutes.js        # POST /:courseId. DELETE /:courseId. GET /
│   ├── uploadRoutes.js          # POST /avatar(uploadAvatar middleware), /thumbnail/:courseId(uploadThumbnail+admin)
│   └── telegramRoutes.js        # POST /webhook — /start <mongoUserId> → save telegramUserId+chatId
├── utils/
│   ├── jwt.js                   # generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken
│   ├── bunny.js                 # createBunnyVideo, deleteBunnyVideo, getBunnyVideoInfo, generateSignedEmbedUrl(SHA256: BUNNY_TOKEN_KEY+videoId+expiry), getUploadCredentials, parseBunnyStatus(0-5→string)
│   ├── checkSubscriptions.js    # performSubscriptionCheck(user) — Instagram: DB fallback (no API token), Telegram: getChatMember real-time
│   ├── socialVerification.js    # verifyInstagramSubscription(placeholder→false), verifyTelegramSubscription(getChatMember), checkTelegramSubscription(both channels)
│   ├── badgeService.js          # 19 badge rules (video/quiz/streak/xp/level thresholds), awardBadges(userId) auto-checks
│   ├── emailService.js          # sendWelcomeEmail, sendLevelUpEmail, sendCertificateEmail, sendEnrollmentEmail, sendStreakReminderEmail, sendQuizResultEmail
│   ├── telegramNotifier.js      # sendTelegramMessage(chatId,html), notifyBadge, notifyLevelUp, notifyStreakReminder, notifyCourseComplete
│   ├── recommendationService.js # getRecommendedCourses(userId) — enrollment categories → same category, high rated, exclude enrolled
│   ├── weeklyReset.js           # startWeeklyReset — setInterval 1h, Monday 00:00 → weeklyXp=0 for all
│   └── certificateGenerator.js  # generateCertificatePDF(PDFKit landscape A4) → uploadCertificatePDF(Cloudinary raw/pdf)
└── seeders/
    └── seedCourses.js           # 35KB seed data

## Key Patterns
- **API response**: `{ success: true/false, data: {...}, message: "..." }`
- **Frontend unwrap**: thunks always `return data.data` (double-wrapped)
- **Errors**: backend Uzbek strings → `state.error` → react-hot-toast
- **CommonJS**: `require/module.exports` everywhere (no ESM)
- **Express 5**: `req.query` is read-only, mongoSanitize on body/params only
- **Trust proxy**: `app.set('trust proxy', 1)` for Railway rate-limit
- **Background ops**: `.exec()` / `.catch(()=>{})` for non-critical operations (viewCount++, emails)

## XP Tizimi
| Harakat | XP | Izoh |
|---|---|---|
| Video ko'rish | +50 | streak ham yangilanadi |
| Quiz to'g'ri javob | +10 | har bir savol uchun |
| Quiz o'tish (≥70%) | +100 | bonus |
| Loyiha tugatish | +200 | project.xpReward |
| Kunlik vazifa | +50 | challenge.xpReward |

- **Level**: `Math.floor(xp / 1000) + 1`
- **Streak freeze**: max 5, 2 kun gap bo'lsa 1 freeze sarflanadi
- **Weekly reset**: har dushanba 00:00 weeklyXp = 0
- **Rank titles**: RECRUIT → CORPORAL → SERGEANT → LIEUTENANT → CAPTAIN → COMMANDER → VICE-ADMIRAL → GRANDMASTER

## Env Variables
```
MONGODB_URI, PORT=5000, NODE_ENV
ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRE=15m, REFRESH_TOKEN_EXPIRE=7d
TELEGRAM_BOT_TOKEN, TELEGRAM_CHANNEL_USERNAME=aidevix, TELEGRAM_PRIVATE_CHANNEL_USERNAME=sunnatbee_lessons
BUNNY_LIBRARY_ID, BUNNY_STREAM_API_KEY, BUNNY_TOKEN_KEY
SWAGGER_USERNAME=Aidevix, SWAGGER_PASSWORD=sunnatbee
FRONTEND_URL, BACKEND_URL
CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
PAYME_MERCHANT_ID, PAYME_SECRET_KEY
CLICK_SERVICE_ID, CLICK_SECRET_KEY
EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS
```

## Commands
```bash
cd backend && npm run dev      # nodemon (development)
cd backend && npm start        # node index.js (production)
cd backend && npm run seed     # seed courses
```

## Admin Credentials
- **Swagger**: Aidevix / sunnatbee
- **Admin user**: yusupovsunnatbek32@gmail.com / Admin1234 (role=admin)
```
