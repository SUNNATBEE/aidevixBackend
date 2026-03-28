const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourse,
  getTopCourses,
  getCategories,
  getRecommendedCourses,
  getUserRecommendedCourses,
  getAutocomplete,
  getFilterCounts,
  createCourse,
  updateCourse,
  deleteCourse,
  rateCourse,
} = require('../controllers/courseController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// ════════════════════════════════════════════════════════════════
// GET /api/courses  |  POST /api/courses
// ════════════════════════════════════════════════════════════════
router.get('/',                getAllCourses);
router.get('/top',             getTopCourses);
router.get('/categories',      getCategories);
router.get('/recommended',     authenticate, getUserRecommendedCourses);
router.get('/autocomplete',    getAutocomplete);
router.get('/filter-counts',   getFilterCounts);
router.post('/', authenticate, requireAdmin, createCourse);

// ════════════════════════════════════════════════════════════════
// GET /api/courses/:id  |  PUT /api/courses/:id  |  DELETE /api/courses/:id
// ════════════════════════════════════════════════════════════════
router.get('/:id', getCourse);

router.get('/:id/recommended', getRecommendedCourses);

router.put('/:id', authenticate, requireAdmin, updateCourse);
router.delete('/:id', authenticate, requireAdmin, deleteCourse);

router.post('/:id/rate', authenticate, rateCourse);

module.exports = router;
