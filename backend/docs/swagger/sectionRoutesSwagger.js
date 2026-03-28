/**
 * @swagger
 * tags:
 *   - name: Sections
 *     description: |
 *       📂 **Kurs bo'limlari — videolarni guruhlash**
 *
 *       Kurslar bo'limlarga bo'linadi. Har bir bo'limda bir nechta video bo'ladi.
 *       Figma'dagi Course Details sahifasida accordion ko'rinishida ko'rsatiladi.
 *
 *       ### Tuzilma:
 *       ```
 *       Kurs
 *       ├── 1-Bo'lim: Asoslar
 *       │   ├── Video 1: Kirish
 *       │   └── Video 2: O'rnatish
 *       └── 2-Bo'lim: Amaliyot
 *           ├── Video 3: Birinchi loyiha
 *           └── Video 4: Deploy
 *       ```
 *
 *       ### Frontend misol:
 *       ```javascript
 *       const { data } = await axiosInstance.get(`/api/sections/course/${courseId}`)
 *       // data.data.sections — bo'limlar (har birida .videos massivi)
 *       ```
 *   - name: Admin Panel - Sections
 *     description: 👑 Admin bo'lim boshqaruvi — yaratish, video qo'shish, yangilash, o'chirish
 */

/**
 * @swagger
 * /api/sections/course/{courseId}:
 *   get:
 *     summary: 📂 Kurs bo'limlari va videolari
 *     description: |
 *       Kursning barcha faol bo'limlari va har bir bo'limdagi faol videolar.
 *       Bo'limlar `order` bo'yicha, videolar ham `order` bo'yicha tartiblangan.
 *       Token talab qilinmaydi.
 *     tags: [Sections]
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
 *         description: Bo'limlar ro'yxati
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
 *                     sections:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           title:
 *                             type: string
 *                             example: "1-Bo'lim: Python asoslari"
 *                           description:
 *                             type: string
 *                             example: "Asosiy tushunchalar va o'rnatish"
 *                           order:
 *                             type: number
 *                             example: 0
 *                           videos:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                 title:
 *                                   type: string
 *                                   example: "1-Dars: Python nima?"
 *                                 duration:
 *                                   type: number
 *                                   example: 900
 *                                   description: Soniyalarda
 *                                 order:
 *                                   type: number
 *                                   example: 0
 *                                 thumbnail:
 *                                   type: string
 *                                   nullable: true
 */

/**
 * @swagger
 * /api/sections:
 *   post:
 *     summary: ➕ Bo'lim yaratish (Admin)
 *     tags: [Admin Panel - Sections]
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
 *                 example: "1-Bo'lim: Asoslar"
 *               description:
 *                 type: string
 *                 example: "Kirish darslari"
 *               order:
 *                 type: number
 *                 example: 0
 *                 default: 0
 *     responses:
 *       201:
 *         description: Bo'lim yaratildi
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
 *                   example: "Bo'lim yaratildi"
 *                 data:
 *                   type: object
 *                   properties:
 *                     section:
 *                       $ref: '#/components/schemas/Section'
 *       400:
 *         description: courseId va title majburiy
 *       401:
 *         description: Token yo'q yoki admin emas
 */

/**
 * @swagger
 * /api/sections/{sectionId}/videos/{videoId}:
 *   post:
 *     summary: ➕ Bo'limga video qo'shish (Admin)
 *     description: |
 *       Mavjud video'ni bo'limga biriktirish. Ikki tomonlama bog'lanadi:
 *       - `Section.videos[]` ga qo'shiladi
 *       - `Video.sectionId` yangilanadi
 *     tags: [Admin Panel - Sections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Bo'lim ID
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: Video ID
 *     responses:
 *       200:
 *         description: Video bo'limga qo'shildi
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Video bo'limga qo'shildi"
 *       404:
 *         description: Bo'lim topilmadi
 *       401:
 *         description: Token yo'q yoki admin emas
 */

/**
 * @swagger
 * /api/sections/{id}:
 *   put:
 *     summary: ✏️ Bo'limni yangilash (Admin)
 *     description: Faqat ruxsat berilgan maydonlar yangilanadi (title, description, order, isActive)
 *     tags: [Admin Panel - Sections]
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
 *                 example: "Yangi nom"
 *               description:
 *                 type: string
 *               order:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Bo'lim yangilandi
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
 *                   example: "Bo'lim yangilandi"
 *                 data:
 *                   type: object
 *                   properties:
 *                     section:
 *                       $ref: '#/components/schemas/Section'
 *       404:
 *         description: Bo'lim topilmadi
 *       401:
 *         description: Token yo'q yoki admin emas
 *   delete:
 *     summary: 🗑️ Bo'limni o'chirish (Admin)
 *     description: Hard delete — bo'lim butunlay o'chiriladi
 *     tags: [Admin Panel - Sections]
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
 *         description: Bo'lim o'chirildi
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Bo'lim o'chirildi"
 *       404:
 *         description: Bo'lim topilmadi
 *       401:
 *         description: Token yo'q yoki admin emas
 */
