/**
 * @swagger
 * /api/videos/{id}:
 *   get:
 *     summary: Videoni ko'rish (Obuna tekshiriladi) / Просмотр видео
 *     tags: [Videos]
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
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VideoResponse'
 * 
 * /api/videos/{id}/progress:
 *   post:
 *     summary: Video ko'rish progressini saqlash / Сохранить прогресс
 *     tags: [Videos]
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
 *               watchedSeconds:
 *                 type: number
 *     responses:
 *       200:
 *         description: Progress updated
 */
