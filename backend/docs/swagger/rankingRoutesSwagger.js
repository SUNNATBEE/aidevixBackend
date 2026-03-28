/**
 * @swagger
 * tags:
 *   name: Ranking
 *   description: |
 *     🏆 **Reyting — Top kurslar, top foydalanuvchilar, haftalik leaderboard**
 *
 *     ### Rank unvonlari (level asosida):
 *     | Level | Unvon | Rang |
 *     |-------|-------|------|
 *     | 90+   | GRANDMASTER | 🟡 Oltin |
 *     | 75-89 | VICE-ADMIRAL | 🔴 Qizil |
 *     | 60-74 | COMMANDER | 🟣 Binafsha |
 *     | 45-59 | CAPTAIN | 🔵 Ko'k |
 *     | 30-44 | LIEUTENANT | 🟢 Yashil |
 *     | 15-29 | SERGEANT | 🟠 To'q sariq |
 *     | 5-14  | CORPORAL | ⚪ Oq |
 *     | 1-4   | RECRUIT | ⚫ Qora |
 *
 *     ### Frontend uchun:
 *     - **LeaderboardPage.jsx** → `GET /api/ranking/users` (Suhrob)
 *     - **TopCoursesPage.jsx** → `GET /api/ranking/courses` (Numton)
 *     - **ProfilePage.jsx** → `GET /api/ranking/users/{userId}/position`
 *     - **WeeklyBoard** → `GET /api/ranking/weekly`
 *
 *     ---
 *
 *     🏆 **Рейтинги — Топ курсы, топ пользователи, недельный лидерборд**
 */

/**
 * @swagger
 * /api/ranking/courses:
 *   get:
 *     summary: 🏆 Eng ko'p ko'rilgan kurslar reytingi
 *     description: |
 *       Eng ko'p ko'rilgan kurslarni `viewCount` bo'yicha tartiblangan holda qaytaradi.
 *       Kategoriya bo'yicha filter qo'llash mumkin.
 *
 *       ### Frontend misol (Numton uchun):
 *       ```javascript
 *       import { rankingApi } from '@api/rankingApi'
 *       const { data } = await rankingApi.getTopCourses({ limit: 10, category: 'javascript' })
 *       // data.data.courses — tartiblangan kurslar
 *       ```
 *     tags: [Ranking]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nechta kurs qaytarish
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [html, css, javascript, react, typescript, nodejs, general]
 *         description: Kategoriya bo'yicha filter
 *     responses:
 *       200:
 *         description: Top kurslar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     courses:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           title:
 *                             type: string
 *                             example: "JavaScript Dasturlash"
 *                           description:
 *                             type: string
 *                           thumbnail:
 *                             type: string
 *                           price:
 *                             type: number
 *                             example: 299000
 *                           category:
 *                             type: string
 *                             example: "javascript"
 *                           viewCount:
 *                             type: number
 *                             example: 15420
 *                           rating:
 *                             type: number
 *                             example: 4.9
 *                           ratingCount:
 *                             type: number
 *                             example: 85
 *                           instructor:
 *                             type: object
 *                             properties:
 *                               username:
 *                                 type: string
 *                                 example: "aidevix_admin"
 *                               email:
 *                                 type: string
 *                           videos:
 *                             type: array
 *                             description: Video IDlar massivi (soni uchun .length ishlating)
 *                     total:
 *                       type: number
 *                       example: 10
 */

/**
 * @swagger
 * /api/ranking/users:
 *   get:
 *     summary: 🥇 Eng ko'p XP to'plagan foydalanuvchilar
 *     description: |
 *       XP bo'yicha tartiblangan foydalanuvchilar reytingi.
 *       Har bir foydalanuvchida **rankTitle** (GRANDMASTER, VICE-ADMIRAL...) qaytariladi.
 *       Skills bo'yicha filter qo'llash mumkin (Figma leaderboard tabs uchun).
 *
 *       ### Frontend misol (Suhrob uchun):
 *       ```javascript
 *       // JavaScript tab bosilganda:
 *       const { data } = await rankingApi.getTopUsers({ category: 'javascript', page: 1, limit: 20 })
 *       // data.data.users — ranked users
 *       // data.data.pagination — sahifalash
 *       ```
 *     tags: [Ranking]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Nechta foydalanuvchi qaytarish
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sahifa raqami
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [javascript, react, python, typescript, nodejs, html, css]
 *         description: Skills bo'yicha filter
 *     responses:
 *       200:
 *         description: Top foydalanuvchilar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/RankedUser'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 */

/**
 * @swagger
 * /api/ranking/users/{userId}/position:
 *   get:
 *     summary: 📍 Foydalanuvchining reyting pozitsiyasi
 *     description: |
 *       Bitta foydalanuvchining global reytingdagi o'rni, level, unvon va top foizini qaytaradi.
 *
 *       ### Frontend misol:
 *       ```javascript
 *       const { data } = await axiosInstance.get(`/api/ranking/users/${userId}/position`)
 *       // data.data.rank — o'rni (masalan: 5)
 *       // data.data.rankTitle — "CAPTAIN"
 *       // data.data.topPercent — top 3%
 *       ```
 *     tags: [Ranking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Foydalanuvchi ID
 *     responses:
 *       200:
 *         description: Foydalanuvchi pozitsiyasi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     rank:
 *                       type: number
 *                       example: 5
 *                       description: Global reyting o'rni
 *                     total:
 *                       type: number
 *                       example: 150
 *                       description: Jami foydalanuvchilar
 *                     xp:
 *                       type: number
 *                       example: 42500
 *                     level:
 *                       type: number
 *                       example: 45
 *                     rankTitle:
 *                       type: string
 *                       example: "CAPTAIN"
 *                     topPercent:
 *                       type: number
 *                       example: 3
 *                       description: Top necha foiz (masalan 3 = top 3%)
 *       404:
 *         description: User stats topilmadi
 *       401:
 *         description: Token yo'q yoki eskirgan
 */

/**
 * @swagger
 * /api/ranking/weekly:
 *   get:
 *     summary: 📅 Haftalik leaderboard
 *     description: |
 *       Bu hafta eng ko'p XP to'plagan 10 foydalanuvchi.
 *       `weeklyXp` har hafta avtomatik nollanadi.
 *       Joriy foydalanuvchining shaxsiy o'rni ham qaytariladi.
 *
 *       ### Frontend misol:
 *       ```javascript
 *       const { data } = await axiosInstance.get('/api/ranking/weekly')
 *       // data.data.leaderboard — top 10
 *       // data.data.myRank — mening o'rnim
 *       // data.data.myWeeklyXp — mening haftalik XP
 *       ```
 *     tags: [Ranking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Haftalik leaderboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     leaderboard:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           rank:
 *                             type: number
 *                             example: 1
 *                           user:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               username:
 *                                 type: string
 *                                 example: "jamshid_k"
 *                           weeklyXp:
 *                             type: number
 *                             example: 850
 *                           level:
 *                             type: number
 *                             example: 45
 *                           streak:
 *                             type: number
 *                             example: 7
 *                     myRank:
 *                       type: number
 *                       nullable: true
 *                       example: 3
 *                       description: Joriy foydalanuvchi o'rni (null agar stats yo'q)
 *                     myWeeklyXp:
 *                       type: number
 *                       example: 350
 *       401:
 *         description: Token yo'q yoki eskirgan
 */
