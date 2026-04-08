const express = require('express');
const router  = express.Router();
const { uploadAvatar: uploadAvatarCtrl, uploadThumbnail: uploadThumbnailCtrl } = require('../controllers/uploadController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { uploadAvatar, uploadThumbnail } = require('../middleware/uploadMiddleware');
const { uploadLimiter } = require('../middleware/rateLimiter');

router.post('/avatar', authenticate, uploadLimiter, uploadAvatar.single('avatar'), uploadAvatarCtrl);
router.post('/thumbnail/:courseId', authenticate, requireAdmin, uploadLimiter, uploadThumbnail.single('thumbnail'), uploadThumbnailCtrl);

module.exports = router;
