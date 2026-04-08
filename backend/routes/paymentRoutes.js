const express = require('express');
const router  = express.Router();
const { initiatePayment, getMyPayments, getPaymentStatus, handlePayme, clickPrepare, clickComplete } = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/rateLimiter');
router.post('/initiate', authenticate, paymentLimiter, initiatePayment);
router.get('/my', authenticate, getMyPayments);
router.post('/payme', paymentLimiter, handlePayme);
router.post('/click/prepare', paymentLimiter, clickPrepare);
router.post('/click/complete', paymentLimiter, clickComplete);
router.get('/:id/status', authenticate, getPaymentStatus);

module.exports = router;
