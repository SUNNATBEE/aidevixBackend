/**
 * @swagger
 * tags:
 *   - name: Follow
 *     description: 👥 Foydalanuvchilar o'rtasida obuna / Подписки между пользователями
 * 
 * /api/follow/{id}:
 *   post:
 *     summary: Boshqa foydalanuvchiga obuna bo'lish / Подписаться на пользователя
 *     tags: [Follow]
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
 *         description: Followed successfully
 *   delete:
 *     summary: Obunani bekor qilish / Отписаться
 *     tags: [Follow]
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
 *         description: Unfollowed successfully
 * 
 * /api/follow/{id}/followers:
 *   get:
 *     summary: Foydalanuvchining obunachilarini olish / Получить подписчиков
 *     tags: [Follow]
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
 * /api/follow/{id}/following:
 *   get:
 *     summary: Foydalanuvchi kuzatayotganlarni olish / На кого подписан
 *     tags: [Follow]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
