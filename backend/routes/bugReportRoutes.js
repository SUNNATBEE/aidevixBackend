const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { bugReportLimiter } = require('../middleware/rateLimiter');
const { createBugReport, myBugReports } = require('../controllers/bugReportController');

router.post('/', authenticate, bugReportLimiter, createBugReport);
router.get('/me', authenticate, myBugReports);

module.exports = router;
