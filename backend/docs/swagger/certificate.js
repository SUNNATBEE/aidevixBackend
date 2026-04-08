/**
 * @swagger
 * tags:
 *   - name: Certificates
 *     description: 🎓 Sertifikatlar — PDF yuklab olish va tekshirish
 * 
 * /api/certificates:
 *   get:
 *     summary: Mening sertifikatlarim / Мои сертификаты
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/certificates/{id}/download:
 *   get:
 *     summary: Sertifikatni PDF shaklida yuklab olish / Скачать PDF
 *     tags: [Certificates]
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
 *         description: PDF file streaming
 * 
 * /api/certificates/verify/{code}:
 *   get:
 *     summary: Sertifikatni haqiqiyligini tekshirish (Ochiq endpoint)
 *     tags: [Certificates]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Certificate'
 */
