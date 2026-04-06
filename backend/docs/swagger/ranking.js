/**
 * @swagger
 * tags:
 *   - name: Ranking
 *     description: 🏆 Reyting — top kurslar, top foydalanuvchilar, haftalik
 * 
 * /api/ranking/users:
 *   get:
 *     summary: Eng yuqori reytingli o'quvchilar ro'yxati / Топ учеников
 *     tags: [Ranking]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Qancha o'quvchi ma'lumoti kerakligi (masalan, 10)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RankedUser'
 * 
 * /api/ranking/weekly:
 *   get:
 *     summary: Bu haftaning yetakchilari / Лидеры этой недели
 *     tags: [Ranking]
 *     responses:
 *       200:
 *         description: Success
 */
