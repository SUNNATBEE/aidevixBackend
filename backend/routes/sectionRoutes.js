const express = require('express');
const router  = express.Router();
const { getCourseSections, createSection, addVideoToSection, updateSection, deleteSection } = require('../controllers/sectionController');
const { authenticate, requireAdmin } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Sections
 *   description: 📂 Kurs bo'limlari (Figma Course Details da ko'rsatiladi)
 */

/**
 * @swagger
 * /api/sections/course/{courseId}:
 *   get:
 *     summary: 📂 Kurs bo'limlari va videolari
 *     description: Kursning barcha bo'limlari va har bir bo'limdagi videolar.
 *     tags: [Sections]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bo'limlar ro'yxati
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 sections:
 *                   - _id: "sectionId1"
 *                     title: "1-Bo'lim: Python asoslari"
 *                     order: 0
 *                     videos:
 *                       - title: "1-Dars: Python nima?"
 *                         duration: 900
 *                         order: 0
 */
router.get('/course/:courseId', getCourseSections);

/**
 * @swagger
 * /api/sections:
 *   post:
 *     summary: ➕ Bo'lim yaratish (Admin)
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [courseId, title]
 *             properties:
 *               courseId:
 *                 type: string
 *               title:
 *                 type: string
 *                 example: "1-Bo'lim: Asoslar"
 *               description:
 *                 type: string
 *               order:
 *                 type: number
 *                 example: 0
 *     responses:
 *       201:
 *         description: Bo'lim yaratildi
 */
router.post('/', authenticate, requireAdmin, createSection);

/**
 * @swagger
 * /api/sections/{sectionId}/videos/{videoId}:
 *   post:
 *     summary: ➕ Bo'limga video qo'shish (Admin)
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video bo'limga qo'shildi
 */
router.post('/:sectionId/videos/:videoId', authenticate, requireAdmin, addVideoToSection);

/**
 * @swagger
 * /api/sections/{id}:
 *   put:
 *     summary: ✏️ Bo'limni yangilash (Admin)
 *     tags: [Sections]
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
 *         description: Bo'lim yangilandi
 *   delete:
 *     summary: 🗑️ Bo'limni o'chirish (Admin)
 *     tags: [Sections]
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
 *         description: Bo'lim o'chirildi
 */
router.put('/:id',    authenticate, requireAdmin, updateSection);
router.delete('/:id', authenticate, requireAdmin, deleteSection);

module.exports = router;
