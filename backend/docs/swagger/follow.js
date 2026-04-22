/**
 * @swagger
 * tags:
 *   - name: Follow
 *     description: 👥 Foydalanuvchilar o'rtasida obuna / Подписки между пользователями
 * 
 * /api/follow/{userId}:
 *   post:
 *     summary: Boshqa foydalanuvchiga obuna bo'lish / Подписаться на пользователя
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unfollowed successfully
 * 
 * /api/follow/{userId}/stats:
 *   get:
 *     summary: Foydalanuvchi obuna statistikasi / Статистика подписок
 *     tags: [Follow]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/follow/my/followers:
 *   get:
 *     summary: Mening obunachilarim / Мои подписчики
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/follow/my/following:
 *   get:
 *     summary: Men kuzatayotganlar / На кого я подписан
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
