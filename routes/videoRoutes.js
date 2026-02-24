const express = require('express');
const router = express.Router();
const { getCourseVideos, getVideo, useVideoLink, createVideo, updateVideo, deleteVideo } = require('../controllers/videoController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { checkSubscriptions } = require('../middleware/subscriptionCheck');

/**
 * @swagger
 * /api/videos/course/{courseId}:
 *   get:
 *     summary: Get all videos for a course (Public)
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Videos retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     videos:
 *                       type: array
 *                     count:
 *                       type: number
 *       500:
 *         description: Server error
 */
router.get('/course/:courseId', getCourseVideos);

/**
 * @swagger
 * /api/videos/{id}:
 *   get:
 *     summary: Get video (Requires active subscriptions - Real-time check)
 *     description: |
 *       This endpoint requires the user to have active subscriptions to both Instagram and Telegram.
 *       Real-time subscription verification is performed before granting access.
 *       If user unsubscribes during video viewing, access will be blocked.
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Video ID
 *     responses:
 *       200:
 *         description: Video retrieved successfully with one-time link
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     video:
 *                       type: object
 *                     videoLink:
 *                       type: object
 *       403:
 *         description: Subscription required or user unsubscribed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Siz obuna bekor qildingiz. Video ko'ra olmaysiz.
 *                 subscriptions:
 *                   type: object
 *                 missingSubscriptions:
 *                   type: array
 *       404:
 *         description: Video not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/:id', authenticate, checkSubscriptions, getVideo);

/**
 * @swagger
 * /api/videos/link/{linkId}/use:
 *   post:
 *     summary: Use video link (Real-time subscription check)
 *     description: |
 *       Marks a video link as used. Real-time subscription verification is performed.
 *       If user unsubscribed, access will be blocked even if link is valid.
 *       Links are one-time use only.
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: linkId
 *         required: true
 *         schema:
 *           type: string
 *         description: Video Link ID
 *     responses:
 *       200:
 *         description: Video link used successfully
 *       400:
 *         description: Link already used or expired
 *       403:
 *         description: Subscription required or user unsubscribed
 *       404:
 *         description: Video link not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/link/:linkId/use', authenticate, useVideoLink);

/**
 * @swagger
 * /api/videos:
 *   post:
 *     summary: Create video (Admin only)
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - courseId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               courseId:
 *                 type: string
 *               order:
 *                 type: number
 *               duration:
 *                 type: number
 *               thumbnail:
 *                 type: string
 *     responses:
 *       201:
 *         description: Video created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.post('/', authenticate, requireAdmin, createVideo);

/**
 * @swagger
 * /api/videos/{id}:
 *   put:
 *     summary: Update video (Admin only)
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               order:
 *                 type: number
 *               duration:
 *                 type: number
 *               thumbnail:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Video updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Video not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete video (Admin only)
 *     tags: [Videos]
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
 *         description: Video deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Video not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticate, requireAdmin, updateVideo);
router.delete('/:id', authenticate, requireAdmin, deleteVideo);

module.exports = router;
