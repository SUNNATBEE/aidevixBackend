/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: |
 *     💳 **To'lov tizimi — Payme va Click**
 *
 *     Aidevix platformasida pullik kurslar uchun **Payme** yoki **Click** orqali to'lov qilish mumkin.
 *
 *     ### To'lov jarayoni (Frontend uchun):
 *     1. `POST /api/payments/initiate` → `paymentUrl` oling
 *     2. Foydalanuvchini `paymentUrl` ga yo'naltiring (Payme/Click sahifasi)
 *     3. To'lov muvaffaqiyatli bo'lganda webhook avtomatik chaqiriladi
 *     4. `GET /api/payments/{id}/status` orqali holatni tekshiring
 *
 *     ### To'lov holatlari:
 *     | Status | Tavsif |
 *     |--------|--------|
 *     | `pending` | To'lov kutilmoqda (30 daqiqa ichida expired bo'ladi) |
 *     | `completed` | To'lov muvaffaqiyatli — kursga avtomatik yoziladi |
 *     | `expired` | 30 daqiqada to'lanmadi |
 *     | `cancelled` | Bekor qilindi |
 *     | `failed` | Xatolik yuz berdi |
 *
 *     ### Muhim:
 *     - To'lov muvaffaqiyatli bo'lganda **Enrollment** avtomatik yaratiladi
 *     - **studentsCount** avtomatik oshiriladi
 *     - Bir kurs uchun faqat bitta aktiv `pending` to'lov bo'lishi mumkin
 *
 *     ---
 *
 *     💳 **Система оплаты — Payme и Click**
 *
 *     На платформе Aidevix можно оплачивать курсы через **Payme** или **Click**.
 */

/**
 * @swagger
 * /api/payments/initiate:
 *   post:
 *     summary: 💳 To'lovni boshlash
 *     description: |
 *       Pullik kursga to'lov linkini olish. Provider sifatida `payme` yoki `click` tanlang.
 *       Qaytarilgan `paymentUrl` ga foydalanuvchini yo'naltiring.
 *
 *       **Duplikat himoya:** Agar mavjud `pending` to'lov bo'lsa, yangi yaratilmaydi — mavjudi qaytariladi.
 *
 *       ### Frontend misol:
 *       ```javascript
 *       const { data } = await axiosInstance.post('/api/payments/initiate', {
 *         courseId: '65f100000000000000000001',
 *         provider: 'payme'  // yoki 'click'
 *       })
 *       // data.data.paymentUrl ga redirect qiling
 *       window.location.href = data.data.paymentUrl
 *       ```
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [courseId]
 *             properties:
 *               courseId:
 *                 type: string
 *                 example: "65f100000000000000000001"
 *                 description: Kurs ID
 *               provider:
 *                 type: string
 *                 enum: [payme, click]
 *                 default: payme
 *                 description: To'lov provayderi
 *     responses:
 *       201:
 *         description: To'lov boshlandi
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
 *                   example: "To'lov boshlandi"
 *                 data:
 *                   type: object
 *                   properties:
 *                     payment:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "65f1a2b3c4d5e6f7a8b9c0d5"
 *                         amount:
 *                           type: number
 *                           example: 349000
 *                         provider:
 *                           type: string
 *                           example: "payme"
 *                         status:
 *                           type: string
 *                           example: "pending"
 *                     paymentUrl:
 *                       type: string
 *                       example: "https://checkout.paycom.uz/base64encoded..."
 *                       description: Foydalanuvchini shu URL ga yo'naltiring
 *       200:
 *         description: Mavjud pending to'lov qaytarildi (dublikat oldini olish)
 *       400:
 *         description: courseId yo'q / Kurs bepul / Allaqachon sotib olingan
 *         content:
 *           application/json:
 *             examples:
 *               noCourseId:
 *                 summary: courseId majburiy
 *                 value: { success: false, message: "courseId majburiy" }
 *               freeCourse:
 *                 summary: Bepul kurs
 *                 value: { success: false, message: "Bu kurs bepul" }
 *               alreadyPaid:
 *                 summary: Allaqachon sotib olingan
 *                 value: { success: false, message: "Siz bu kursni allaqachon sotib olgansiz" }
 *       404:
 *         description: Kurs topilmadi
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Kurs topilmadi"
 *       401:
 *         description: Token yo'q yoki eskirgan
 */

/**
 * @swagger
 * /api/payments/my:
 *   get:
 *     summary: 📋 Mening to'lovlarim tarixi
 *     description: |
 *       Foydalanuvchining barcha to'lovlari, eng yangisi birinchi.
 *       Pagination qo'llab-quvvatlanadi.
 *
 *       ### Frontend misol:
 *       ```javascript
 *       const { data } = await axiosInstance.get('/api/payments/my?page=1&limit=10')
 *       // data.data.payments — to'lovlar massivi
 *       // data.data.pagination — sahifalash
 *       ```
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sahifa raqami
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Bir sahifada nechta (max 100)
 *     responses:
 *       200:
 *         description: To'lovlar ro'yxati
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
 *                     payments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "65f1a2b3c4d5e6f7a8b9c0d5"
 *                           amount:
 *                             type: number
 *                             example: 349000
 *                           currency:
 *                             type: string
 *                             example: "UZS"
 *                           provider:
 *                             type: string
 *                             example: "payme"
 *                           status:
 *                             type: string
 *                             example: "completed"
 *                           paidAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2026-03-17T10:00:00.000Z"
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
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Token yo'q yoki eskirgan
 */

/**
 * @swagger
 * /api/payments/{id}/status:
 *   get:
 *     summary: 📊 To'lov holatini tekshirish
 *     description: |
 *       Bitta to'lovning hozirgi holatini ko'rish.
 *       Agar `pending` to'lov 30 daqiqadan oshgan bo'lsa — avtomatik `expired` ga o'tkaziladi.
 *
 *       ### Frontend misol:
 *       ```javascript
 *       const { data } = await axiosInstance.get(`/api/payments/${paymentId}/status`)
 *       if (data.data.payment.status === 'completed') {
 *         // Kursga o'tish
 *       } else if (data.data.payment.status === 'expired') {
 *         // Qayta to'lov qilish
 *       }
 *       ```
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: To'lov ID (Payment._id)
 *     responses:
 *       200:
 *         description: To'lov holati
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
 *                     payment:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         amount:
 *                           type: number
 *                           example: 349000
 *                         provider:
 *                           type: string
 *                           example: "payme"
 *                         status:
 *                           type: string
 *                           enum: [pending, completed, expired, cancelled, failed]
 *                           example: "completed"
 *                         courseId:
 *                           type: object
 *                           properties:
 *                             title:
 *                               type: string
 *                               example: "React.js Frontend Development"
 *                             price:
 *                               type: number
 *                               example: 349000
 *                         paidAt:
 *                           type: string
 *                           format: date-time
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *       404:
 *         description: To'lov topilmadi
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "To'lov topilmadi"
 *       401:
 *         description: Token yo'q yoki eskirgan
 */

/**
 * @swagger
 * /api/payments/payme:
 *   post:
 *     summary: 🏦 Payme JSON-RPC webhook
 *     description: |
 *       **Payme to'lov tizimidan avtomatik chaqiriladigan webhook.**
 *       Frontend bu endpoint'ni TO'G'RIDAN-TO'G'RI chaqirmaydi.
 *
 *       Qo'llab-quvvatlanadigan metodlar:
 *       - `CheckPerformTransaction` — to'lov mumkinligini tekshirish
 *       - `CreateTransaction` — tranzaksiya yaratish
 *       - `PerformTransaction` — to'lovni amalga oshirish
 *       - `CancelTransaction` — to'lovni bekor qilish
 *       - `CheckTransaction` — tranzaksiya holatini tekshirish
 *       - `GetStatement` — hisobot olish
 *
 *       ### Xavfsizlik:
 *       - Basic Auth bilan himoyalangan (PAYME_MERCHANT_KEY)
 *       - Summa va order_id tekshiriladi
 *       - Atomic operatsiyalar (race condition himoyasi)
 *     tags: [Payments]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               method:
 *                 type: string
 *                 example: "CheckPerformTransaction"
 *               params:
 *                 type: object
 *                 properties:
 *                   account:
 *                     type: object
 *                     properties:
 *                       order_id:
 *                         type: string
 *                         example: "65f1a2b3c4d5e6f7a8b9c0d5"
 *                   amount:
 *                     type: number
 *                     example: 34900000
 *                     description: Tiyinda (so'm * 100)
 *               id:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: JSON-RPC javob
 *         content:
 *           application/json:
 *             examples:
 *               checkSuccess:
 *                 summary: CheckPerformTransaction — muvaffaqiyat
 *                 value: { result: { allow: true }, id: 1 }
 *               createSuccess:
 *                 summary: CreateTransaction — muvaffaqiyat
 *                 value: { result: { create_time: 1711000000000, transaction: "65f1a2b3c4d5e6f7a8b9c0d5", state: 1 }, id: 1 }
 *               performSuccess:
 *                 summary: PerformTransaction — muvaffaqiyat
 *                 value: { result: { transaction: "65f1a2b3c4d5e6f7a8b9c0d5", perform_time: 1711000000000, state: 2 }, id: 1 }
 *               error:
 *                 summary: Xatolik
 *                 value: { error: { code: -31050, message: "To'lov topilmadi" }, id: 1 }
 */

/**
 * @swagger
 * /api/payments/click/prepare:
 *   post:
 *     summary: 💳 Click prepare webhook
 *     description: |
 *       **Click to'lov tizimidan chaqiriladigan prepare webhook.**
 *       Frontend bu endpoint'ni to'g'ridan-to'g'ri chaqirmaydi.
 *
 *       - Action = 0 bo'lishi kerak
 *       - To'lov summa va holati tekshiriladi
 *       - Click imzo (sign) middleware bilan tekshiriladi
 *     tags: [Payments]
 *     security: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               click_trans_id:
 *                 type: number
 *               merchant_trans_id:
 *                 type: string
 *                 description: Payment._id
 *               amount:
 *                 type: number
 *               action:
 *                 type: number
 *                 example: 0
 *     responses:
 *       200:
 *         description: Prepare javob
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value: { click_trans_id: 12345, merchant_trans_id: "65f1a2b3c4d5e6f7a8b9c0d5", error: 0, error_note: "Success" }
 *               notFound:
 *                 value: { error: -5, error_note: "To'lov topilmadi" }
 */

/**
 * @swagger
 * /api/payments/click/complete:
 *   post:
 *     summary: ✅ Click complete webhook
 *     description: |
 *       **Click to'lov tizimidan chaqiriladigan complete webhook.**
 *       To'lov muvaffaqiyatli bo'lganda:
 *       - Payment status → `completed`
 *       - Enrollment avtomatik yaratiladi
 *       - studentsCount oshiriladi
 *
 *       Xatolik bo'lganda (error < 0):
 *       - Payment status → `failed`
 *     tags: [Payments]
 *     security: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               click_trans_id:
 *                 type: number
 *               merchant_trans_id:
 *                 type: string
 *               click_paydoc_id:
 *                 type: number
 *               error:
 *                 type: number
 *                 description: "0 = muvaffaqiyat, < 0 = xatolik"
 *     responses:
 *       200:
 *         description: Complete javob
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value: { click_trans_id: 12345, merchant_trans_id: "65f1a2b3c4d5e6f7a8b9c0d5", error: 0, error_note: "Success" }
 */
