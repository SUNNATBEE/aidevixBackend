const express = require('express');
const router = express.Router();
const { getAllCourses, getCourse, createCourse, updateCourse, deleteCourse } = require('../controllers/courseController');
const { authenticate, requireAdmin } = require('../middleware/auth');

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses (Public)
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     courses:
 *                       type: array
 *                       items:
 *                         type: object
 *                     count:
 *                       type: number
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a new course (Admin only)
 *     tags: [Courses]
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
 *               - description
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *                 example: JavaScript Fundamentals
 *               description:
 *                 type: string
 *                 example: Learn JavaScript from scratch
 *               price:
 *                 type: number
 *                 example: 99.99
 *               thumbnail:
 *                 type: string
 *                 example: https://example.com/thumbnail.jpg
 *               category:
 *                 type: string
 *                 example: programming
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Server error
 */
router.get('/', getAllCourses);
router.post('/', authenticate, requireAdmin, createCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get single course by ID (Public)
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course retrieved successfully
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update course (Admin only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               thumbnail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Course updated successfully
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
 *   delete:
 *     summary: Delete course (Admin only)
 *     tags: [Courses]
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
 *         description: Course deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getCourse);
router.put('/:id', authenticate, requireAdmin, updateCourse);
router.delete('/:id', authenticate, requireAdmin, deleteCourse);

module.exports = router;
