/**
 * @swagger
 * tags:
 *   - name: Projects
 *     description: |
 *       🏗️ **Kurs loyihalari — amaliy mashqlar**
 *
 *       Har bir kursda amaliy loyihalar mavjud. O'quvchilar loyihani bajarib XP olishadi.
 *
 *       ### Loyiha tuzilishi:
 *       - `title` — loyiha nomi
 *       - `technologies` — ishlatilgan texnologiyalar (HTML, CSS, JS...)
 *       - `tasks` — bosqichma-bosqich vazifalar
 *       - `xpReward` — bajarilganda beriladigan XP
 *       - `estimatedTime` — taxminiy vaqt (daqiqalarda)
 *
 *       ### Frontend misol:
 *       ```javascript
 *       // Kurs loyihalarini olish
 *       const { data } = await axiosInstance.get(`/api/projects/course/${courseId}`)
 *       // data.data.projects — loyihalar (isCompleted bilan agar login)
 *
 *       // Loyihani bajarish
 *       const result = await axiosInstance.post(`/api/projects/${projectId}/complete`, {
 *         githubUrl: 'https://github.com/user/project'
 *       })
 *       // result.data.data.xpEarned, .totalXp, .level
 *       ```
 *   - name: Admin Panel - Projects
 *     description: 👑 Admin loyiha boshqaruvi — yaratish, yangilash, o'chirish
 */

/**
 * @swagger
 * /api/projects/course/{courseId}:
 *   get:
 *     summary: 📋 Kurs loyihalari ro'yxati
 *     description: |
 *       Berilgan kurs uchun barcha faol loyihalar.
 *       Agar foydalanuvchi login bo'lsa — har bir loyihada `isCompleted` ko'rsatiladi.
 *       `completedBy` massivi yashiriladi (shaxsiy ma'lumot).
 *     tags: [Projects]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Kurs ID
 *     responses:
 *       200:
 *         description: Loyihalar ro'yxati
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
 *                     projects:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           title:
 *                             type: string
 *                             example: "Portfolio Sahifasi"
 *                           description:
 *                             type: string
 *                             example: "HTML va CSS bilan shaxsiy portfolio yarating"
 *                           level:
 *                             type: string
 *                             enum: [beginner, intermediate, advanced]
 *                             example: "beginner"
 *                           order:
 *                             type: number
 *                             example: 0
 *                           technologies:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["HTML5", "CSS3"]
 *                           requirements:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["HTML asoslari darslarini ko'ring"]
 *                           tasks:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 order:
 *                                   type: number
 *                                 title:
 *                                   type: string
 *                                 description:
 *                                   type: string
 *                                 hint:
 *                                   type: string
 *                                 xpReward:
 *                                   type: number
 *                           estimatedTime:
 *                             type: number
 *                             example: 120
 *                             description: Daqiqalarda
 *                           xpReward:
 *                             type: number
 *                             example: 300
 *                           isCompleted:
 *                             type: boolean
 *                             example: false
 *                             description: Faqat login bo'lgan user uchun ko'rsatiladi
 */

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: 📖 Bitta loyiha tafsiloti
 *     description: |
 *       Loyihaning to'liq ma'lumotlari (tasks, technologies, requirements).
 *       Kurs ma'lumotlari ham populate qilinadi.
 *     tags: [Projects]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Loyiha ID
 *     responses:
 *       200:
 *         description: Loyiha tafsiloti
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
 *                     project:
 *                       $ref: '#/components/schemas/Project'
 *       404:
 *         description: Loyiha topilmadi
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Loyiha topilmadi"
 */

/**
 * @swagger
 * /api/projects/{id}/complete:
 *   post:
 *     summary: ✅ Loyihani bajarildi deb belgilash (+XP)
 *     description: |
 *       Foydalanuvchi loyihani bajarganda chaqiriladi.
 *       GitHub URL ixtiyoriy — agar berilsa saqlangan.
 *
 *       ### Natijalar:
 *       - `xpReward` miqdorida XP beriladi
 *       - Level yangilanadi
 *       - `levelProgress` qaytariladi
 *
 *       ### Muhim:
 *       - Bir loyihani ikki marta bajarib bo'lmaydi (400 xato)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Loyiha ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               githubUrl:
 *                 type: string
 *                 example: "https://github.com/username/portfolio"
 *                 description: GitHub repo URL (ixtiyoriy)
 *     responses:
 *       200:
 *         description: Loyiha bajarildi, XP berildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Loyiha bajarildi! XP qo'shildi."
 *                 data:
 *                   type: object
 *                   properties:
 *                     xpEarned:
 *                       type: number
 *                       example: 300
 *                       description: Bu loyiha uchun berilgan XP
 *                     totalXp:
 *                       type: number
 *                       example: 4550
 *                       description: Jami XP
 *                     level:
 *                       type: number
 *                       example: 13
 *                     levelProgress:
 *                       type: number
 *                       example: 45
 *                       description: Keyingi levelgacha foiz (0-100)
 *       400:
 *         description: Allaqachon bajarilgan
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Bu loyihani allaqachon bajargansiz"
 *       404:
 *         description: Loyiha topilmadi
 *       401:
 *         description: Token yo'q yoki eskirgan
 */

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: 👑 Yangi loyiha yaratish (Admin)
 *     tags: [Admin Panel - Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [courseId, title]
 *             properties:
 *               courseId:
 *                 type: string
 *                 example: "65f100000000000000000001"
 *               title:
 *                 type: string
 *                 example: "Portfolio Sahifasi"
 *               description:
 *                 type: string
 *                 example: "HTML va CSS bilan shaxsiy portfolio yarating"
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *                 example: "beginner"
 *               order:
 *                 type: number
 *                 example: 0
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["HTML5", "CSS3"]
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["HTML asoslari darslarini ko'ring"]
 *               estimatedTime:
 *                 type: number
 *                 example: 120
 *                 description: Daqiqalarda
 *               xpReward:
 *                 type: number
 *                 example: 300
 *               tasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     order:
 *                       type: number
 *                       example: 0
 *                     title:
 *                       type: string
 *                       example: "index.html yarating"
 *                     description:
 *                       type: string
 *                       example: "Asosiy HTML strukturasi"
 *                     hint:
 *                       type: string
 *                       example: "<!DOCTYPE html> bilan boshlang"
 *                     xpReward:
 *                       type: number
 *                       example: 60
 *     responses:
 *       201:
 *         description: Loyiha yaratildi
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
 *                     project:
 *                       $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validatsiya xatosi
 *       401:
 *         description: Token yo'q yoki admin emas
 */

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: ✏️ Loyihani yangilash (Admin)
 *     tags: [Admin Panel - Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *               xpReward:
 *                 type: number
 *               tasks:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Loyiha yangilandi
 *       404:
 *         description: Loyiha topilmadi
 *       401:
 *         description: Token yo'q yoki admin emas
 *   delete:
 *     summary: 🗑️ Loyihani o'chirish (Admin)
 *     description: Soft delete — isActive false ga o'tkaziladi
 *     tags: [Admin Panel - Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Loyiha o'chirildi
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Loyiha o'chirildi"
 *       404:
 *         description: Loyiha topilmadi
 *       401:
 *         description: Token yo'q yoki admin emas
 */
