const express = require('express');
const router = express.Router();
const { getCourseVideos, getVideo, useVideoLink, createVideo, updateVideo, deleteVideo } = require('../controllers/videoController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { checkSubscriptions } = require('../middleware/subscriptionCheck');

// Public routes
router.get('/course/:courseId', getCourseVideos);

// Authenticated routes (require subscriptions)
router.get('/:id', authenticate, checkSubscriptions, getVideo);
router.post('/link/:linkId/use', authenticate, useVideoLink);

// Admin routes
router.post('/', authenticate, requireAdmin, createVideo);
router.put('/:id', authenticate, requireAdmin, updateVideo);
router.delete('/:id', authenticate, requireAdmin, deleteVideo);

module.exports = router;
