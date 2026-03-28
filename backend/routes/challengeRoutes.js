const express = require('express');
const router  = express.Router();
const { getTodayChallenge, updateChallengeProgress, createChallenge } = require('../controllers/challengeController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/today', authenticate, getTodayChallenge);
router.post('/progress', authenticate, updateChallengeProgress);
router.post('/admin', authenticate, requireAdmin, createChallenge);

module.exports = router;
