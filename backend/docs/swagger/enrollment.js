/**
 * @swagger
 * tags:
 *   - name: Enrollment
 *     description: 📚 Kursga yozilish va progress / Запись на курс и прогресс
 * 
 * /api/enrollments:
 *   get:
 *     summary: Mening kurslarim ro'yxati / Мои курсы
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Kursga yozilish / Записаться на курс
 *     tags: [Enrollment]
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
 *     responses:
 *       201:
 *         description: Yozilish muvaffaqiyatli
 * 
 * /api/enrollments/check/{courseId}:
 *   get:
 *     summary: Kursga yozilganlik holatini tekshirish / Проверка записи
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isEnrolled:
 *                   type: boolean
 */
