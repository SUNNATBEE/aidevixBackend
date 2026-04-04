/**
 * @swagger
 * tags:
 *   - name: Projects
 *     description: 🏗️ Kurs loyihalari — amaliy mashqlar
 * 
 * /api/projects/course/{courseId}:
 *   get:
 *     summary: Kurs loyihalari ro'yxati / Проекты курса
 *     tags: [Projects]
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
