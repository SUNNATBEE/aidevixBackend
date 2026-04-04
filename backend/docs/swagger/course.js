/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Barcha kurslarni ko'rish / Получить все курсы
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CourseShort'
 *   post:
 *     summary: Yangi kurs yaratish / Создать курс (Admin)
 *     tags: [Admin Panel - Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       201:
 *         description: Created
 * 
 * /api/courses/top:
 *   get:
 *     summary: Top kurslarni olish / Топ курсы
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/courses/categories:
 *   get:
 *     summary: Kategoriyalarni olish / Категории
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/courses/autocomplete:
 *   get:
 *     summary: Qidiruv uchun autocomplete / Автодополнение поиска
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/courses/filter-counts:
 *   get:
 *     summary: Filtrlash bo'yicha sonlar / Counts for filters
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/courses/{id}:
 *   get:
 *     summary: Bitta kursni ko'rish / Просмотр одного курса
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *   put:
 *     summary: Kursni tahrirlash / Редактировать курс (Admin)
 *     tags: [Admin Panel - Courses]
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
 *         description: Updated
 *   delete:
 *     summary: Kursni o'chirish / Удалить курс (Admin)
 *     tags: [Admin Panel - Courses]
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
 *         description: Deleted
 * 
 * /api/courses/{id}/recommended:
 *   get:
 *     summary: Tavsiya etilgan kurslar / Рекомендуемые курсы
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/courses/{id}/rate:
 *   post:
 *     summary: Kursni baholash / Оценить курс
 *     tags: [Courses]
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
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               review:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
