/**
 * @swagger
 * tags:
 *   - name: Wishlist
 *     description: ❤️ Saqlangan kurslar / Список желаний
 * 
 * /api/wishlist:
 *   get:
 *     summary: Mening saqlangan kurslarim / Мой список желаний
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
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
 *     summary: Kursni saqlanganlarga qo'shish / Добавить в список
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Added
 * 
 * /api/wishlist/{courseId}:
 *   delete:
 *     summary: Kursni saqlanganlardan o'chirish / Удалить из списка
 *     tags: [Wishlist]
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
 *         description: Removed
 */
