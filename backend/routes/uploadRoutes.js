const express = require('express');
const router  = express.Router();
const { uploadAvatar: uploadAvatarCtrl, uploadThumbnail: uploadThumbnailCtrl } = require('../controllers/uploadController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { uploadAvatar, uploadThumbnail } = require('../middleware/uploadMiddleware');
const { uploadLimiter } = require('../middleware/rateLimiter');

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: 📸 Fayl yuklash (Cloudinary)
 */

/**
 * @swagger
 * /api/upload/avatar:
 *   post:
 *     summary: 📸 Avatar yuklash
 *     description: |
 *       Foydalanuvchi profil rasmi yuklash. Max: 2MB. Format: JPG, PNG, WEBP.
 *       Rasm avtomatik 400x400 px ga crop qilinadi va Cloudinary ga saqlanadi.
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
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar yangilandi
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Avatar yangilandi"
 *               data:
 *                 avatarUrl: "https://res.cloudinary.com/aidevix/image/upload/v1/aidevix/avatars/user123.jpg"
 */
router.post('/avatar', authenticate, uploadLimiter, uploadAvatar.single('avatar'), uploadAvatarCtrl);

/**
 * @swagger
 * /api/upload/thumbnail/{courseId}:
 *   post:
 *     summary: 🖼️ Kurs thumbnail yuklash (Admin)
 *     description: |
 *       Kurs uchun muqova rasm yuklash. Max: 5MB. 800x450 px ga crop qilinadi.
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Thumbnail yangilandi
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 thumbnailUrl: "https://res.cloudinary.com/aidevix/image/upload/v1/aidevix/thumbnails/course123.jpg"
 */
router.post('/thumbnail/:courseId', authenticate, requireAdmin, uploadLimiter, uploadThumbnail.single('thumbnail'), uploadThumbnailCtrl);

module.exports = router;
