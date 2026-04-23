const express = require('express');
const router  = express.Router();
const { getPublicProfile } = require('../controllers/userController');

router.get('/:username/public', getPublicProfile);

module.exports = router;
