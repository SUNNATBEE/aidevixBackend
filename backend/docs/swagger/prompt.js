/**
 * @swagger
 * tags:
 *   - name: Prompt Library
 *     description: ⚡ AI Prompt kutubxonasi — yaratish, like, featured / Библиотека AI промптов
 *
 * /api/prompts:
 *   get:
 *     summary: Barcha promptlar ro'yxati (filter, search, pagination)
 *     description: |
 *       🇺🇿 Prompt kutubxonasidan promptlarni olish. Kategoriya, tool, qidiruv va saralash bo'yicha filter.
 *       🇷🇺 Получение промптов из библиотеки. Фильтр по категории, инструменту, поиску и сортировке.
 *
 *       **📱 React Native:** Bu endpoint public — auth talab qilinmaydi.
 *     tags: [Prompt Library]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [coding, debugging, vibe_coding, claude, cursor, copilot, architecture, refactoring, testing, documentation, other]
 *         description: Prompt kategoriyasi
 *       - in: query
 *         name: tool
 *         schema:
 *           type: string
 *           enum: [Claude Code, Cursor, GitHub Copilot, ChatGPT, Gemini, Windsurf, Any]
 *         description: AI tool bo'yicha filter
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, popular, views]
 *           default: newest
 *         description: "newest=eng yangi, popular=ko'p like, views=ko'p ko'rilgan"
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Qidiruv so'zi (title va content ichidan) / Поисковый запрос
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
 *           default: 12
 *         description: Har sahifadagi promptlar soni
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Prompt'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *
 *   post:
 *     summary: Yangi prompt yaratish (+30 XP)
 *     description: |
 *       🇺🇿 Yangi prompt yaratadi va +30 XP beradi. Auth talab qilinadi.
 *       🇷🇺 Создаёт новый промпт и начисляет +30 XP. Требуется авторизация.
 *
 *       **📱 React Native:** `Authorization: Bearer <token>` header kerak.
 *     tags: [Prompt Library]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 150
 *                 example: "React componentni lazy load qilish"
 *                 description: Prompt sarlavhasi (max 150 belgi)
 *               content:
 *                 type: string
 *                 maxLength: 5000
 *                 example: "Menga React componentni React.lazy va Suspense bilan lazy load qilib beruvchi kod yoz. Error boundary ham qo'sh."
 *                 description: Prompt matni (max 5000 belgi)
 *               description:
 *                 type: string
 *                 maxLength: 300
 *                 example: "React.lazy va Suspense yordamida performance yaxshilash"
 *                 description: Qisqa tavsif (max 300 belgi)
 *               category:
 *                 type: string
 *                 enum: [coding, debugging, vibe_coding, claude, cursor, copilot, architecture, refactoring, testing, documentation, other]
 *                 example: coding
 *               tool:
 *                 type: string
 *                 enum: [Claude Code, Cursor, GitHub Copilot, ChatGPT, Gemini, Windsurf, Any]
 *                 example: Claude Code
 *               tags:
 *                 type: array
 *                 maxItems: 5
 *                 items:
 *                   type: string
 *                   maxLength: 30
 *                 example: ["react", "lazy-load", "performance"]
 *                 description: Teglar (max 5 ta, har biri max 30 belgi)
 *     responses:
 *       201:
 *         description: Prompt yaratildi (+30 XP)
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
 *                   example: "Prompt muvaffaqiyatli yaratildi! +30 XP"
 *                 data:
 *                   $ref: '#/components/schemas/Prompt'
 *       401:
 *         description: Token topilmadi / Не авторизован
 *
 * /api/prompts/featured:
 *   get:
 *     summary: Featured (tanlangan) promptlar
 *     description: |
 *       🇺🇿 Admin tomonidan featured qilingan promptlar (max 6 ta).
 *       🇷🇺 Промпты, отмеченные администратором как избранные (макс. 6).
 *
 *       **📱 React Native:** Public endpoint — auth kerak emas.
 *     tags: [Prompt Library]
 *     responses:
 *       200:
 *         description: Featured promptlar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   maxItems: 6
 *                   items:
 *                     $ref: '#/components/schemas/Prompt'
 *
 * /api/prompts/{id}:
 *   get:
 *     summary: Bitta promptni ko'rish (viewsCount++)
 *     description: |
 *       🇺🇿 Promptni ID bo'yicha olish. Har ko'rganda viewsCount +1 oshadi.
 *       🇷🇺 Получение промпта по ID. При каждом просмотре viewsCount увеличивается на 1.
 *     tags: [Prompt Library]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Prompt ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Prompt ma'lumotlari
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Prompt'
 *       404:
 *         description: Prompt topilmadi
 *
 *   delete:
 *     summary: Promptni o'chirish (owner yoki admin)
 *     description: |
 *       🇺🇿 Faqat prompt egasi yoki admin o'chira oladi.
 *       🇷🇺 Удалить может только автор промпта или администратор.
 *     tags: [Prompt Library]
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
 *         description: O'chirildi
 *       403:
 *         description: Ruxsat yo'q (faqat owner/admin)
 *       404:
 *         description: Prompt topilmadi
 *
 * /api/prompts/{id}/like:
 *   post:
 *     summary: Like/Unlike toggle
 *     description: |
 *       🇺🇿 Promptga like bosish yoki olib tashlash (toggle). Auth kerak.
 *       🇷🇺 Поставить/убрать лайк (переключатель). Требуется авторизация.
 *
 *       **📱 React Native:** Optimistic UI — oldin UI yangilang, keyin API chaqiring.
 *     tags: [Prompt Library]
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
 *         description: Like holati o'zgardi
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
 *                   example: "Like qo'shildi"
 *                 data:
 *                   type: object
 *                   properties:
 *                     liked:
 *                       type: boolean
 *                       example: true
 *                       description: "true=like qo'shildi, false=like olib tashlandi"
 *                     likesCount:
 *                       type: number
 *                       example: 15
 *       401:
 *         description: Auth kerak
 *
 * /api/prompts/{id}/feature:
 *   patch:
 *     summary: "Promptni featured qilish/olib tashlash (Admin)"
 *     description: |
 *       🇺🇿 Admin promptni featured qiladi yoki olib tashlaydi.
 *       🇷🇺 Администратор может отметить/снять промпт как избранный.
 *     tags: [Prompt Library]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               featured:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Featured holati o'zgartirildi
 *       403:
 *         description: Faqat admin
 */
