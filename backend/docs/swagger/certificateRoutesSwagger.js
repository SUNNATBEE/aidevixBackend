/**
 * @swagger
 * tags:
 *   name: Certificates
 *   description: |
 *     🎓 **Sertifikatlar — PDF yuklab olish va tekshirish**
 *
 *     Kurs 100% tugallanganda sertifikat **avtomatik** beriladi.
 *
 *     ### Sertifikat jarayoni:
 *     1. O'quvchi barcha videolarni ko'radi → `progressPercent = 100`
 *     2. Sertifikat avtomatik yaratiladi (unikal kod bilan)
 *     3. Email yuboriladi
 *     4. O'quvchi `GET /my` orqali ko'radi va `GET /{code}/download` orqali PDF yuklab oladi
 *
 *     ### Tekshirish (ochiq):
 *     Sertifikat kodi bo'yicha haqiqiyligini tekshirish — token talab qilinmaydi.
 *     Bu istalgan kishi uchun ochiq: ish beruvchi, universitet, va h.k.
 *
 *     ---
 *
 *     🎓 **Сертификаты — скачивание PDF и проверка подлинности**
 */

/**
 * @swagger
 * /api/certificates/my:
 *   get:
 *     summary: 🎓 Mening sertifikatlarim
 *     description: |
 *       Foydalanuvchi olgan barcha sertifikatlar ro'yxati.
 *       Kurs ma'lumotlari (title, thumbnail, category) ham qaytariladi.
 *
 *       ### Frontend misol:
 *       ```javascript
 *       const { data } = await axiosInstance.get('/api/certificates/my')
 *       // data.data.certificates — sertifikatlar massivi
 *       ```
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sertifikatlar ro'yxati
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
 *                     certificates:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           certificateCode:
 *                             type: string
 *                             example: "A1B2C3D4E5F6G7H8"
 *                           recipientName:
 *                             type: string
 *                             example: "Jamshid K."
 *                           courseName:
 *                             type: string
 *                             example: "React.js Frontend Development"
 *                           courseId:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               title:
 *                                 type: string
 *                                 example: "React.js Frontend Development"
 *                               thumbnail:
 *                                 type: string
 *                               category:
 *                                 type: string
 *                                 example: "react"
 *                           issuedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2026-03-17T10:00:00.000Z"
 *                           pdfUrl:
 *                             type: string
 *                             nullable: true
 *                             example: "https://res.cloudinary.com/aidevix/raw/upload/v1/certificates/A1B2C3D4.pdf"
 *       401:
 *         description: Token yo'q yoki eskirgan
 */

/**
 * @swagger
 * /api/certificates/verify/{code}:
 *   get:
 *     summary: ✅ Sertifikatni tekshirish (ochiq)
 *     description: |
 *       Sertifikat kodini kiritib haqiqiyligini tekshirish.
 *       **Token talab qilinmaydi** — istalgan kishi tekshirishi mumkin.
 *
 *       Bu endpoint ish beruvchilar, universitetlar yoki boshqa shaxslar uchun mo'ljallangan.
 *
 *       ### Misol URL:
 *       ```
 *       GET /api/certificates/verify/A1B2C3D4E5F6G7H8
 *       ```
 *     tags: [Certificates]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Sertifikat kodi (16 belgili hex)
 *         example: "A1B2C3D4E5F6G7H8"
 *     responses:
 *       200:
 *         description: Sertifikat haqiqiy
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
 *                     valid:
 *                       type: boolean
 *                       example: true
 *                     recipientName:
 *                       type: string
 *                       example: "Jamshid K."
 *                     courseName:
 *                       type: string
 *                       example: "React.js Frontend Development"
 *                     issuedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-03-17T10:00:00.000Z"
 *                     code:
 *                       type: string
 *                       example: "A1B2C3D4E5F6G7H8"
 *       404:
 *         description: Sertifikat topilmadi yoki noto'g'ri kod
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Sertifikat topilmadi yoki noto'g'ri kod"
 */

/**
 * @swagger
 * /api/certificates/{code}/download:
 *   get:
 *     summary: 📥 PDF sertifikat yuklab olish
 *     description: |
 *       Sertifikatni PDF formatda yuklab olish. Faqat o'z sertifikatingizni yuklab olishingiz mumkin.
 *
 *       Agar PDF hali yaratilmagan bo'lsa — avtomatik generatsiya qilinadi va Cloudinary ga yuklanadi.
 *       Keyingi murojaatlarda cache'dan qaytariladi.
 *
 *       ### Frontend misol:
 *       ```javascript
 *       const { data } = await axiosInstance.get(`/api/certificates/${code}/download`)
 *       // data.data.downloadUrl — PDF URL
 *       window.open(data.data.downloadUrl, '_blank')
 *       ```
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Sertifikat kodi
 *         example: "A1B2C3D4E5F6G7H8"
 *     responses:
 *       200:
 *         description: PDF yuklab olish havolasi
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
 *                     downloadUrl:
 *                       type: string
 *                       example: "https://res.cloudinary.com/aidevix/raw/upload/v1/certificates/A1B2C3D4.pdf"
 *       404:
 *         description: Sertifikat topilmadi
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Sertifikat topilmadi"
 *       500:
 *         description: PDF yaratishda xato
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "PDF yaratishda xato"
 *       401:
 *         description: Token yo'q yoki eskirgan
 */
