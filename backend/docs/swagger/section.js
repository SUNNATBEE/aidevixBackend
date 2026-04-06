/**
 * @swagger
 * tags:
 *   - name: Sections
 *     description: 📂 Kurs bo'limlari — videolarni guruhlash
 * 
 * /api/sections/course/{courseId}:
 *   get:
 *     summary: Kurs bo'limlari ro'yxati / Секции курса
 *     tags: [Sections]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
