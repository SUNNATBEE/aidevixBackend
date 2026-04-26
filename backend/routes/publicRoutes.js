const express = require('express');
const router = express.Router();
const { getLiveActivity, getTeamMembers, getRoadmap } = require('../controllers/publicController');
const { getPublicAiNews, trackAiNewsClick } = require('../controllers/aiNewsController');

router.get('/live-activity', getLiveActivity);
router.get('/team', getTeamMembers);
router.get('/roadmap', getRoadmap);
router.get('/ai-news', getPublicAiNews);
router.post('/ai-news/:id/click', trackAiNewsClick);

module.exports = router;

