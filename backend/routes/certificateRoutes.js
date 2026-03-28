const express = require('express');
const router  = express.Router();
const { getMyCertificates, verifyCertificate, downloadCertificate } = require('../controllers/certificateController');
const { authenticate } = require('../middleware/auth');

router.get('/my', authenticate, getMyCertificates);
router.get('/verify/:code', verifyCertificate);
router.get('/:code/download', authenticate, downloadCertificate);

module.exports = router;
