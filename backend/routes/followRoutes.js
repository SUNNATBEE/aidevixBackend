const express = require('express');
const router  = express.Router();
const { followUser, unfollowUser, getFollowStats, getMyFollowers, getMyFollowing } = require('../controllers/followController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Follow
 *   description: 👥 Foydalanuvchilar o'rtasida obuna
 */

/**
 * @swagger
 * /api/follow/{userId}:
 *   post:
 *     summary: ➕ Foydalanuvchiga obuna bo'lish
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
 *         description: Obuna bo'lindi
 *   delete:
 *     summary: ➖ Obunani bekor qilish
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
 *         description: Obuna bekor qilindi
 */
router.post('/:userId',   authenticate, followUser);
router.delete('/:userId', authenticate, unfollowUser);

/**
 * @swagger
 * /api/follow/{userId}/stats:
 *   get:
 *     summary: 📊 Followers va following statistikasi
 *     tags: [Follow]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statistika
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 followers: 120
 *                 following: 45
 *                 isFollowing: false
 */
router.get('/:userId/stats', getFollowStats);

/**
 * @swagger
 * /api/follow/my/followers:
 *   get:
 *     summary: 👥 Mening followerlarim
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Followerlar ro'yxati
 */
router.get('/my/followers', authenticate, getMyFollowers);

/**
 * @swagger
 * /api/follow/my/following:
 *   get:
 *     summary: 👤 Men kuzatayotganlar
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Following ro'yxati
 */
router.get('/my/following', authenticate, getMyFollowing);

module.exports = router;
