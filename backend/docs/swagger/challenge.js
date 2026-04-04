/**
 * @swagger
 * tags:
 *   - name: Challenges
 *     description: 🎯 Kunlik vazifalar / Ежедневные задания
 * 
 * /api/challenges/daily:
 *   get:
 *     summary: Bugungi vazifalar ro'yxati / Ежедневные задания
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/challenges/{id}/complete:
 *   post:
 *     summary: Vazifani yakunlash / Завершить задание
 *     tags: [Challenges]
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
 *         description: Completed
 */
