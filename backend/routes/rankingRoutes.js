const express = require('express');
const router = express.Router();
const { getTopCourses, getTopUsers, getUserPosition, getWeeklyLeaderboard, getWeeklyPrizes } = require('../controllers/rankingController');
const { authenticate } = require('../middleware/auth');

router.get('/courses', getTopCourses);
router.get('/users', getTopUsers);
router.get('/users/:userId/position', authenticate, getUserPosition);
router.get('/weekly', authenticate, getWeeklyLeaderboard);
router.get('/weekly/prizes', getWeeklyPrizes);

module.exports = router;
