/**
 * @swagger
 * tags:
 *   - name: XP & Gamification
 *     description: 🎮 XP tizimi, streak, badge, level
 * 
 * /api/xp/status:
 *   get:
 *     summary: Foydalanuvchi XP holati (level, streak) / Статус XP
 *     tags: [XP & Gamification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserStats'
 * 
 * /api/xp/history:
 *   get:
 *     summary: XP olish tarixi / История получения XP
 *     tags: [XP & Gamification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
