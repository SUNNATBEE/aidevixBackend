const express = require('express');
const router  = express.Router();
const { getPublicProfile, getHomeStats } = require('../controllers/userController');

router.get('/home-stats', getHomeStats);
router.get('/:username/public', getPublicProfile);

module.exports = router;
