const express = require('express');
const router  = express.Router();
const { initiatePayment, getMyPayments, getPaymentStatus, handlePayme, clickPrepare, clickComplete } = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/rateLimiter');
const { verifyPaymeAuth, verifyClickSign } = require('../middleware/paymentVerification');

router.post('/initiate', authenticate, paymentLimiter, initiatePayment);
router.get('/my', authenticate, getMyPayments);
router.post('/payme', paymentLimiter, verifyPaymeAuth, handlePayme);
router.post('/click/prepare', paymentLimiter, verifyClickSign, clickPrepare);
router.post('/click/complete', paymentLimiter, verifyClickSign, clickComplete);
router.get('/:id/status', authenticate, getPaymentStatus);

module.exports = router;
