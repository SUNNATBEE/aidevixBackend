const express = require('express');
const router  = express.Router();
const { getCourseSections, createSection, addVideoToSection, updateSection, deleteSection } = require('../controllers/sectionController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/course/:courseId', getCourseSections);
router.post('/', authenticate, requireAdmin, createSection);
router.post('/:sectionId/videos/:videoId', authenticate, requireAdmin, addVideoToSection);
router.put('/:id',    authenticate, requireAdmin, updateSection);
router.delete('/:id', authenticate, requireAdmin, deleteSection);

module.exports = router;
