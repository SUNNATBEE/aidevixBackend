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
const validateObjectId = require('../middleware/validateObjectId');

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
router.get('/:id', validateObjectId(), getCourse);

router.get('/:id/recommended', validateObjectId(), getRecommendedCourses);

router.put('/:id', validateObjectId(), authenticate, requireAdmin, updateCourse);
router.delete('/:id', validateObjectId(), authenticate, requireAdmin, deleteCourse);

router.post('/:id/rate', validateObjectId(), authenticate, rateCourse);

module.exports = router;
