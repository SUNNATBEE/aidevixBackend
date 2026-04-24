const express = require('express');
const router = express.Router();
const { getLiveActivity, getTeamMembers, getRoadmap } = require('../controllers/publicController');

router.get('/live-activity', getLiveActivity);
router.get('/team', getTeamMembers);
router.get('/roadmap', getRoadmap);

module.exports = router;

