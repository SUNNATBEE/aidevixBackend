const express = require('express');
const router = express.Router();
const { getAllCourses, getCourse, createCourse, updateCourse, deleteCourse } = require('../controllers/courseController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourse);

// Admin routes
router.post('/', authenticate, requireAdmin, createCourse);
router.put('/:id', authenticate, requireAdmin, updateCourse);
router.delete('/:id', authenticate, requireAdmin, deleteCourse);

module.exports = router;
