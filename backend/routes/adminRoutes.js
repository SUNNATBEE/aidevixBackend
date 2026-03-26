const express = require('express');
const router  = express.Router();
const {
  getDashboardStats, getTopStudents, getCoursesStats,
  getRecentPayments, getUsers, updateUser, deleteUser,
  getInstagramVerifications, reviewInstagramVerification,
} = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/auth');


router.get('/stats', authenticate, requireAdmin, getDashboardStats);

router.get('/top-students', authenticate, requireAdmin, getTopStudents);

router.get('/courses/stats', authenticate, requireAdmin, getCoursesStats);

router.get('/payments', authenticate, requireAdmin, getRecentPayments);

router.get('/users', authenticate, requireAdmin, getUsers);

router.put('/users/:id', authenticate, requireAdmin, updateUser);

router.delete('/users/:id', authenticate, requireAdmin, deleteUser);

router.get('/instagram-verifications', authenticate, requireAdmin, getInstagramVerifications);
router.put('/instagram-verifications/:id', authenticate, requireAdmin, reviewInstagramVerification);

module.exports = router;
