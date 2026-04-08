/**
 * @swagger
 * tags:
 *   - name: Upload
 *     description: 📸 Fayl yuklash (Cloudinary) / Загрузка файлов
 * 
 * /api/upload/image:
 *   post:
 *     summary: Rasm yuklash (Profil avatari yoki kurs rasmi) / Загрузить картинку
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: URL of the uploaded image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: https://res.cloudinary.com/xyz/image/...
 */
