/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: |
 *     📸 **Fayl yuklash (Cloudinary)**
 *
 *     Rasmlarni Cloudinary CDN ga yuklash.
 *
 *     ### Limitlar:
 *     - **Avatar**: max 2MB, JPG/PNG/WEBP, 400x400 px ga crop
 *     - **Thumbnail**: max 5MB, 800x450 px ga crop
 *     - Rate limit qo'llanadi
 *
 *     ### Frontend misol (avatar):
 *     ```javascript
 *     const formData = new FormData()
 *     formData.append('avatar', file)
 *     const { data } = await axiosInstance.post('/api/upload/avatar', formData, {
 *       headers: { 'Content-Type': 'multipart/form-data' }
 *     })
 *     // data.data.avatarUrl — yangi avatar URL
 *     ```
 */

/**
 * @swagger
 * /api/upload/avatar:
 *   post:
 *     summary: 📸 Avatar yuklash
 *     description: |
 *       Foydalanuvchi profil rasmi yuklash.
 *       Rasm Cloudinary ga yuklanadi va `UserStats.avatar` yangilanadi.
 *       Agar UserStats mavjud bo'lmasa — avtomatik yaratiladi.
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [avatar]
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: "Rasm fayl (max 2MB: JPG, PNG, WEBP)"
 *     responses:
 *       200:
 *         description: Avatar yangilandi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Avatar yangilandi"
 *                 data:
 *                   type: object
 *                   properties:
 *                     avatarUrl:
 *                       type: string
 *                       example: "https://res.cloudinary.com/aidevix/image/upload/v1/aidevix/avatars/user123.jpg"
 *       400:
 *         description: Rasm tanlanmadi
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Rasm tanlanmadi"
 *       401:
 *         description: Token yo'q yoki eskirgan
 */

/**
 * @swagger
 * /api/upload/thumbnail/{courseId}:
 *   post:
 *     summary: 🖼️ Kurs thumbnail yuklash (Admin)
 *     description: |
 *       Kurs uchun muqova rasm yuklash.
 *       Rasm Cloudinary ga yuklanadi va `Course.thumbnail` yangilanadi.
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Kurs ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [thumbnail]
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: "Rasm fayl (max 5MB: JPG, PNG, WEBP)"
 *     responses:
 *       200:
 *         description: Thumbnail yangilandi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Thumbnail yangilandi"
 *                 data:
 *                   type: object
 *                   properties:
 *                     thumbnailUrl:
 *                       type: string
 *                       example: "https://res.cloudinary.com/aidevix/image/upload/v1/aidevix/thumbnails/course123.jpg"
 *       400:
 *         description: Rasm tanlanmadi
 *       404:
 *         description: Kurs topilmadi
 *       401:
 *         description: Token yo'q yoki admin emas
 */
