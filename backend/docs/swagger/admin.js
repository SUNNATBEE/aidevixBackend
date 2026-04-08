/**
 * @swagger
 * tags:
 *   - name: Admin Panel - Courses
 *     description: "👑 Admin: Kurs boshqaruvi / Управление курсами"
 *   - name: Admin Panel - Videos
 *     description: "👑 Admin: Video boshqaruvi / Управление видео"
 * 
 * /api/admin/courses:
 *   get:
 *     summary: Barcha kurslarni admin sifatida ko'rish / Просмотр курсов
 *     tags: [Admin Panel - Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/admin/users:
 *   get:
 *     summary: Foydalanuvchilarni boshqarish / Управление пользователями
 *     tags: [Admin Panel - Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/admin/system:
 *   get:
 *     summary: Tizim statistikalari / Системная статистика
 *     tags: [Admin Panel - Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
