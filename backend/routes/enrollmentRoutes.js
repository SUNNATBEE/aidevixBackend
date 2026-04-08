const express = require('express');
const router  = express.Router();
const { enrollCourse, getMyEnrollments, markVideoWatched, getCourseProgress } = require('../controllers/enrollmentController');
const { authenticate } = require('../middleware/auth');

router.post('/:courseId', authenticate, enrollCourse);
router.get('/my', authenticate, getMyEnrollments);
router.get('/:courseId/progress', authenticate, getCourseProgress);
router.post('/:courseId/watch/:videoId', authenticate, markVideoWatched);

module.exports = router;
