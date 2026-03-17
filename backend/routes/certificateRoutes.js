const express = require('express');
const router  = express.Router();
const { getMyCertificates, verifyCertificate } = require('../controllers/certificateController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Certificates
 *   description: 🎓 Sertifikatlar
 */

/**
 * @swagger
 * /api/certificates/my:
 *   get:
 *     summary: 🎓 Mening sertifikatlarim
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sertifikatlar ro'yxati
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 certificates:
 *                   - certificateCode: "A1B2C3D4"
 *                     recipientName: "Jamshid K."
 *                     courseName: "React.js Frontend Development"
 *                     issuedAt: "2026-03-17T10:00:00.000Z"
 */
router.get('/my', authenticate, getMyCertificates);

/**
 * @swagger
 * /api/certificates/verify/{code}:
 *   get:
 *     summary: ✅ Sertifikatni tekshirish (ochiq)
 *     description: Sertifikat kodini kiritib haqiqiyligini tekshirish. Token talab qilinmaydi.
 *     tags: [Certificates]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Sertifikat kodi (masalan A1B2C3D4E5F6G7H8)
 *     responses:
 *       200:
 *         description: Sertifikat haqiqiy
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 valid: true
 *                 recipientName: "Jamshid K."
 *                 courseName: "React.js Frontend Development"
 *                 issuedAt: "2026-03-17T10:00:00.000Z"
 *       404:
 *         description: Sertifikat topilmadi
 */
router.get('/verify/:code', verifyCertificate);

module.exports = router;
