const User       = require('../models/User');
const Course     = require('../models/Course');
const Video      = require('../models/Video');
const UserStats  = require('../models/UserStats');
const Enrollment = require('../models/Enrollment');
const Payment    = require('../models/Payment');

/** @desc  Umumiy statistika | @route GET /api/admin/stats | @access Admin */
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCourses,
      totalVideos,
      totalEnrollments,
      completedEnrollments,
      totalRevenue,
      newUsersThisMonth,
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Course.countDocuments({ isActive: true }),
      Video.countDocuments({ isActive: true }),
      Enrollment.countDocuments(),
      Enrollment.countDocuments({ isCompleted: true }),
      Payment.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      User.countDocuments({ createdAt: { $gte: new Date(new Date().setDate(1)) } }),
    ]);

    res.json({
      success: true,
      data: {
        users:          { total: totalUsers, newThisMonth: newUsersThisMonth },
        courses:        { total: totalCourses },
        videos:         { total: totalVideos },
        enrollments:    { total: totalEnrollments, completed: completedEnrollments },
        revenue:        { total: totalRevenue[0]?.total || 0, currency: 'UZS' },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** @desc  Top o'quvchilar (admin uchun) | @route GET /api/admin/top-students | @access Admin */
const getTopStudents = async (req, res) => {
  try {
    const stats = await UserStats.find()
      .sort({ xp: -1 })
      .limit(10)
      .populate('userId', 'username email createdAt');

    res.json({ success: true, data: { students: stats } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** @desc  Kurslar statistikasi | @route GET /api/admin/courses/stats | @access Admin */
const getCoursesStats = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true })
      .select('title category viewCount rating studentsCount ratingCount price isFree')
      .sort({ viewCount: -1 })
      .limit(20);

    res.json({ success: true, data: { courses } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** @desc  So'nggi to'lovlar | @route GET /api/admin/payments | @access Admin */
const getRecentPayments = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;

    const payments = await Payment.find()
      .populate('userId', 'username email')
      .populate('courseId', 'title price')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Payment.countDocuments();
    res.json({ success: true, data: { payments, pagination: { total, page, limit } } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** @desc  Foydalanuvchilar ro'yxati | @route GET /api/admin/users | @access Admin */
const getUsers = async (req, res) => {
  try {
    const page   = parseInt(req.query.page)   || 1;
    const limit  = parseInt(req.query.limit)  || 20;
    const search = req.query.search || '';

    const filter = { isActive: true };
    if (search) filter.$or = [
      { username: { $regex: search, $options: 'i' } },
      { email:    { $regex: search, $options: 'i' } },
    ];

    const [users, total] = await Promise.all([
      User.find(filter).select('-password -refreshToken').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      User.countDocuments(filter),
    ]);

    res.json({ success: true, data: { users, pagination: { total, page, limit } } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getDashboardStats, getTopStudents, getCoursesStats, getRecentPayments, getUsers };
