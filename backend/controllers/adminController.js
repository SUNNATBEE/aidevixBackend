const User       = require('../models/User');
const InstagramVerification = require('../models/InstagramVerification');
const Course     = require('../models/Course');
const Video      = require('../models/Video');
const UserStats  = require('../models/UserStats');
const Enrollment = require('../models/Enrollment');
const Payment    = require('../models/Payment');

/** @desc  Umumiy statistika | @route GET /api/admin/stats | @access Admin */
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers, totalCourses, totalVideos,
      totalEnrollments, completedEnrollments,
      totalRevenue, newUsersThisMonth,
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
        users:       { total: totalUsers, newThisMonth: newUsersThisMonth },
        courses:     { total: totalCourses },
        videos:      { total: totalVideos },
        enrollments: { total: totalEnrollments, completed: completedEnrollments },
        revenue:     { total: totalRevenue[0]?.total || 0, currency: 'UZS' },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Statistika olishda xato' });
  }
};

/** @desc  Top o'quvchilar | @route GET /api/admin/top-students | @access Admin */
const getTopStudents = async (req, res) => {
  try {
    const stats = await UserStats.find()
      .sort({ xp: -1 })
      .limit(10)
      .populate('userId', 'username email');

    // Flatten: frontend expects username, email, xp, level at top level
    const students = stats.map(s => ({
      _id:      s._id,
      username: s.userId?.username,
      email:    s.userId?.email,
      xp:       s.xp,
      level:    s.level,
    }));

    res.json({ success: true, data: { students } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Top o\'quvchilarni olishda xato' });
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
    res.status(500).json({ success: false, message: 'Kurslar statistikasini olishda xato' });
  }
};

/** @desc  So'nggi to'lovlar | @route GET /api/admin/payments | @access Admin */
const getRecentPayments = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const payments = await Payment.find()
      .populate('userId',   'username email')
      .populate('courseId', 'title price')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Rename userId→user, courseId→course for frontend
    const data = payments.map(p => ({
      _id:    p._id,
      user:   p.userId,
      course: p.courseId,
      amount: p.amount,
      status: p.status,
      provider: p.provider,
      createdAt: p.createdAt,
    }));

    const total = await Payment.countDocuments();
    res.json({ success: true, data: { payments: data, pagination: { total, page, limit } } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'To\'lovlarni olishda xato' });
  }
};

/** @desc  Foydalanuvchilar ro'yxati | @route GET /api/admin/users | @access Admin */
const getUsers = async (req, res) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = Math.min(parseInt(req.query.limit) || 20, 100);
    const search = req.query.search || '';
    const role   = req.query.role   || '';

    const filter = {};
    if (search) filter.$or = [
      { username: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
      { email:    { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
    ];
    if (role) filter.role = role;

    const [users, total] = await Promise.all([
      User.find(filter).select('-password -refreshToken').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      User.countDocuments(filter),
    ]);

    res.json({ success: true, data: { users, pagination: { total, page, limit } } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Foydalanuvchilarni olishda xato' });
  }
};

/** @desc  Foydalanuvchini tahrirlash | @route PUT /api/admin/users/:id | @access Admin */
const updateUser = async (req, res) => {
  try {
    const allowed = ['role', 'isActive'];
    const update  = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) update[f] = req.body[f]; });

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password -refreshToken');
    if (!user) return res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });

    res.json({ success: true, data: { user } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Foydalanuvchini tahrirlashda xato' });
  }
};

/** @desc  Foydalanuvchini o'chirish | @route DELETE /api/admin/users/:id | @access Admin */
const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'O\'zingizni o\'chira olmaysiz' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });

    res.json({ success: true, message: 'Foydalanuvchi o\'chirildi' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Foydalanuvchini o\'chirishda xato' });
  }
};

/** @desc  Instagram tasdiqlash so'rovlari | @route GET /api/admin/instagram-verifications | @access Admin */
const getInstagramVerifications = async (req, res) => {
  try {
    const { status = 'pending' } = req.query;
    const verifications = await InstagramVerification.find({ status })
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json({ success: true, data: { verifications } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Instagram so\'rovlarini olishda xato' });
  }
};

/** @desc  Instagram tasdiqlashni ko'rib chiqish | @route PUT /api/admin/instagram-verifications/:id | @access Admin */
const reviewInstagramVerification = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status: approved yoki rejected bo\'lishi kerak' });
    }

    const verification = await InstagramVerification.findByIdAndUpdate(
      req.params.id,
      { status, adminNote, reviewedBy: req.user._id, reviewedAt: new Date() },
      { new: true }
    );
    if (!verification) return res.status(404).json({ success: false, message: 'So\'rov topilmadi' });

    if (status === 'approved') {
      await User.findByIdAndUpdate(verification.userId, {
        'socialSubscriptions.instagram.subscribed': true,
        'socialSubscriptions.instagram.username': verification.instagramUsername,
        'socialSubscriptions.instagram.verifiedAt': new Date(),
      });
    }

    res.json({ success: true, message: 'Yangilandi', data: { verification } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Ko\'rib chiqishda xato' });
  }
};

module.exports = { getDashboardStats, getTopStudents, getCoursesStats, getRecentPayments, getUsers, updateUser, deleteUser, getInstagramVerifications, reviewInstagramVerification };
