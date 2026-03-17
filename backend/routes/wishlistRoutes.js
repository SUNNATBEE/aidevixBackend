const express = require('express');
const router  = express.Router();
const { addToWishlist, removeFromWishlist, getWishlist } = require('../controllers/wishlistController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: ❤️ Saqlangan kurslar
 */

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: ❤️ Mening wishlistim
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Saqlangan kurslar
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 courses:
 *                   - courseId:
 *                       title: "React.js Frontend Development"
 *                       category: "react"
 *                       rating: 4.9
 *                     addedAt: "2026-03-17T10:00:00.000Z"
 */
router.get('/', authenticate, getWishlist);

/**
 * @swagger
 * /api/wishlist/{courseId}:
 *   post:
 *     summary: ➕ Wishlistga qo'shish
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
 *         description: Qo'shildi
 *       400:
 *         description: Allaqachon mavjud
 *   delete:
 *     summary: ➖ Wishlistdan o'chirish
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
 *         description: O'chirildi
 */
router.post('/:courseId',   authenticate, addToWishlist);
router.delete('/:courseId', authenticate, removeFromWishlist);

module.exports = router;
