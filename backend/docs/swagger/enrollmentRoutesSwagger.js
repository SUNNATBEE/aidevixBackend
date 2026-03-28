/**
 * @swagger
 * tags:
 *   name: Enrollment
 *   description: |
 *     📚 **Kursga yozilish va progress kuzatish**
 *
 *     ### Yozilish jarayoni:
 *     - **Bepul kurslar:** `POST /api/enrollments/{courseId}` — to'g'ridan-to'g'ri yoziladi
 *     - **Pullik kurslar:** Avval `POST /api/payments/initiate` → to'lov → avtomatik enrollment
 *
 *     ### Progress tizimi:
 *     - Har bir video ko'rilganda `POST /enrollments/{courseId}/watch/{videoId}` chaqiriladi
 *     - `progressPercent` avtomatik hisoblanadi (ko'rilgan videolar / jami videolar * 100)
 *     - **100% bo'lganda** sertifikat avtomatik beriladi va email yuboriladi
 *
 *     ### Frontend misol:
 *     ```javascript
 *     import axiosInstance from '@api/axiosInstance'
 *
 *     // Bepul kursga yozilish
 *     await axiosInstance.post(`/api/enrollments/${courseId}`)
 *
 *     // Mening kurslarim
 *     const { data } = await axiosInstance.get('/api/enrollments/my')
 *     // data.data.enrollments
 *
 *     // Video ko'rganda
 *     await axiosInstance.post(`/api/enrollments/${courseId}/watch/${videoId}`, {
 *       watchedSeconds: 720
 *     })
 *     ```
 *
 *     ---
 *
 *     📚 **Запись на курс и отслеживание прогресса**
 */

/**
 * @swagger
 * /api/enrollments/{courseId}:
 *   post:
 *     summary: 📚 Kursga yozilish
 *     description: |
 *       Bepul kurslarga to'g'ridan-to'g'ri yozilish. Pullik kurslar uchun avval to'lov kerak (402 qaytaradi).
 *
 *       Muvaffaqiyatli yozilganda:
 *       - Enrollment yaratiladi (`paymentStatus: 'free'`)
 *       - `studentsCount` oshiriladi
 *       - Email yuboriladi (background)
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Kurs ID
 *         example: "65f100000000000000000001"
 *     responses:
 *       201:
 *         description: Muvaffaqiyatli yozildi
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
 *                   example: "Kursga muvaffaqiyatli yozildingiz"
 *                 data:
 *                   type: object
 *                   properties:
 *                     enrollment:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         userId:
 *                           type: string
 *                         courseId:
 *                           type: string
 *                         paymentStatus:
 *                           type: string
 *                           example: "free"
 *                         progressPercent:
 *                           type: number
 *                           example: 0
 *                         isCompleted:
 *                           type: boolean
 *                           example: false
 *       400:
 *         description: Allaqachon yozilgan
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Siz bu kursga allaqachon yozilgansiz"
 *       402:
 *         description: To'lov talab qilinadi (pullik kurs)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Bu kurs pullik. Avval to'lov qiling"
 *                 data:
 *                   type: object
 *                   properties:
 *                     price:
 *                       type: number
 *                       example: 349000
 *                       description: Kurs narxi so'mda
 *                     courseId:
 *                       type: string
 *       404:
 *         description: Kurs topilmadi yoki faol emas
 *       401:
 *         description: Token yo'q yoki eskirgan
 */

/**
 * @swagger
 * /api/enrollments/my:
 *   get:
 *     summary: 📋 Mening kurslarim ro'yxati
 *     description: |
 *       Foydalanuvchi yozilgan barcha kurslar va ularning progressi.
 *       Kurs ma'lumotlari (title, thumbnail, category, instructor) ham populate qilinadi.
 *
 *       ### Frontend misol:
 *       ```javascript
 *       const { data } = await axiosInstance.get('/api/enrollments/my')
 *       const enrollments = data.data.enrollments
 *       // Har bir enrollment.courseId — to'liq kurs ob'ekti
 *       ```
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Yozilgan kurslar ro'yxati
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
 *                     enrollments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           courseId:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               title:
 *                                 type: string
 *                                 example: "HTML Asoslari"
 *                               thumbnail:
 *                                 type: string
 *                               category:
 *                                 type: string
 *                                 example: "html"
 *                               level:
 *                                 type: string
 *                                 example: "beginner"
 *                               rating:
 *                                 type: number
 *                                 example: 4.8
 *                               price:
 *                                 type: number
 *                                 example: 99000
 *                               instructor:
 *                                 type: object
 *                                 properties:
 *                                   username:
 *                                     type: string
 *                                     example: "aidevix_admin"
 *                                   jobTitle:
 *                                     type: string
 *                                     example: "Senior Developer"
 *                           paymentStatus:
 *                             type: string
 *                             example: "free"
 *                           progressPercent:
 *                             type: number
 *                             example: 65
 *                           isCompleted:
 *                             type: boolean
 *                             example: false
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *       401:
 *         description: Token yo'q yoki eskirgan
 */

/**
 * @swagger
 * /api/enrollments/{courseId}/progress:
 *   get:
 *     summary: 📊 Kurs progressi
 *     description: |
 *       Foydalanuvchining kurs bo'yicha progressi.
 *       Agar yozilmagan bo'lsa `enrolled: false` qaytaradi.
 *
 *       ### Frontend misol:
 *       ```javascript
 *       const { data } = await axiosInstance.get(`/api/enrollments/${courseId}/progress`)
 *       if (data.data.enrolled) {
 *         console.log(`Progress: ${data.data.progressPercent}%`)
 *       }
 *       ```
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Kurs ID
 *     responses:
 *       200:
 *         description: Progress ma'lumotlari
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
 *                     enrolled:
 *                       type: boolean
 *                       example: true
 *                       description: Kursga yozilganmi
 *                     progressPercent:
 *                       type: number
 *                       example: 65
 *                       description: 0-100 foiz
 *                     isCompleted:
 *                       type: boolean
 *                       example: false
 *                     watchedVideos:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["65f1a2b3c4d5e6f7a8b9c0d3", "65f1a2b3c4d5e6f7a8b9c0d4"]
 *                       description: Ko'rilgan video IDlar
 *                     completedAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *       401:
 *         description: Token yo'q yoki eskirgan
 */

/**
 * @swagger
 * /api/enrollments/{courseId}/watch/{videoId}:
 *   post:
 *     summary: ✅ Videoni ko'rildi deb belgilash
 *     description: |
 *       Foydalanuvchi video ko'rganda chaqiriladi. Progress avtomatik hisoblanadi.
 *
 *       ### Muhim:
 *       - Agar 100% bo'lsa — **sertifikat avtomatik beriladi** va email yuboriladi
 *       - Badge tekshiruvi ham amalga oshiriladi (yangi badge olinsa `newBadges` qaytaradi)
 *       - Agar video allaqachon ko'rilgan bo'lsa — faqat `watchedSeconds` yangilanadi (max)
 *
 *       ### Frontend misol:
 *       ```javascript
 *       // Video tugaganda yoki vaqti-vaqti bilan
 *       const { data } = await axiosInstance.post(
 *         `/api/enrollments/${courseId}/watch/${videoId}`,
 *         { watchedSeconds: 720 }
 *       )
 *       if (data.data.isCompleted) {
 *         toast.success('Tabriklaymiz! Kurs tugallandi! 🎉')
 *       }
 *       if (data.data.newBadges?.length) {
 *         toast.success(`Yangi badge: ${data.data.newBadges[0].name}`)
 *       }
 *       ```
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Kurs ID
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: Video ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               watchedSeconds:
 *                 type: number
 *                 example: 720
 *                 description: Necha soniya ko'rildi (ixtiyoriy)
 *     responses:
 *       200:
 *         description: Progress yangilandi
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
 *                     progressPercent:
 *                       type: number
 *                       example: 70
 *                     isCompleted:
 *                       type: boolean
 *                       example: false
 *                     newBadges:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "10 ta video ko'rdi"
 *                           icon:
 *                             type: string
 *                             example: "🎬"
 *       404:
 *         description: Kursga yozilmagan
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Siz bu kursga yozilmagansiz"
 *       401:
 *         description: Token yo'q yoki eskirgan
 */
