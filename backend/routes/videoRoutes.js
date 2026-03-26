const express = require('express');
const router = express.Router();
const {
  getCourseVideos,
  getVideo,
  useVideoLink,
  createVideo,
  updateVideo,
  deleteVideo,
  searchVideos,
  askQuestion,
  getVideoQuestions,
  answerQuestion,
  getUploadCredentialsForVideo,
  checkVideoStatus,
  linkToBunny,
} = require('../controllers/videoController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { checkSubscriptions } = require('../middleware/subscriptionCheck');

// ════════════════════════════════════════════════════════════════
// GET /api/videos/course/:courseId
// ════════════════════════════════════════════════════════════════
router.get('/course/:courseId', getCourseVideos);

router.get('/search', authenticate, searchVideos);

// ════════════════════════════════════════════════════════════════
// GET /api/videos/:id
// ════════════════════════════════════════════════════════════════
router.get('/:id', authenticate, checkSubscriptions, getVideo);

// ════════════════════════════════════════════════════════════════
// POST /api/videos/link/:linkId/use
// ════════════════════════════════════════════════════════════════
router.post('/link/:linkId/use', authenticate, useVideoLink);

// ════════════════════════════════════════════════════════════════
// POST /api/videos  |  PUT /api/videos/:id  |  DELETE /api/videos/:id
// ════════════════════════════════════════════════════════════════
router.post('/', authenticate, requireAdmin, createVideo);

router.put('/:id', authenticate, requireAdmin, updateVideo);
router.delete('/:id', authenticate, requireAdmin, deleteVideo);

// ════════════════════════════════════════════════════════════════
// Bunny.net endpoints (Admin only)
// ════════════════════════════════════════════════════════════════

router.get('/:id/upload-credentials', authenticate, requireAdmin, getUploadCredentialsForVideo);

router.get('/:id/status', authenticate, requireAdmin, checkVideoStatus);

router.patch('/:id/link-bunny', authenticate, requireAdmin, linkToBunny);

router.get('/:id/questions', getVideoQuestions);
router.post('/:id/questions', authenticate, askQuestion);

router.post('/:id/questions/:questionId/answer', authenticate, requireAdmin, answerQuestion);

module.exports = router;
