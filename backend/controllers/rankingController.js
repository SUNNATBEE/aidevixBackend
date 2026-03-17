const Course = require('../models/Course');
const UserStats = require('../models/UserStats');
const User = require('../models/User');

/**
 * Level asosida rank unvonini hisoblash
 * Figma leaderboard da ko'rsatiladigan unvonlar: GRANDMASTER, VICE-ADMIRAL, COMMANDER...
 */
const getRankTitle = (level) => {
  if (level >= 90) return 'GRANDMASTER';
  if (level >= 75) return 'VICE-ADMIRAL';
  if (level >= 60) return 'COMMANDER';
  if (level >= 45) return 'CAPTAIN';
  if (level >= 30) return 'LIEUTENANT';
  if (level >= 15) return 'SERGEANT';
  if (level >= 5)  return 'CORPORAL';
  return 'RECRUIT';
};

/**
 * @desc  Eng ko'p ko'rilgan kurslar reytingi (Numton uchun)
 * @route GET /api/ranking/courses
 * @access Public
 */
const getTopCourses = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category || null;

    const filter = { isActive: true };
    if (category) filter.category = category;

    const courses = await Course.find(filter)
      .populate('instructor', 'username email')
      .sort({ viewCount: -1, rating: -1 })
      .limit(limit)
      .select('title description thumbnail price category viewCount rating ratingCount instructor videos createdAt');

    res.json({
      success: true,
      data: {
        courses,
        total: courses.length,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc  Eng yuqori XP to'plagan foydalanuvchilar reytingi (Suhrob uchun)
 * @route GET /api/ranking/users
 * @access Public
 */
const getTopUsers = async (req, res) => {
  try {
    const limit    = parseInt(req.query.limit) || 20;
    const page     = parseInt(req.query.page)  || 1;
    const category = req.query.category || null; // e.g. javascript, react, python
    const skip     = (page - 1) * limit;

    // Category filter: UserStats.skills array ichida qidiruv
    const filter = category
      ? { skills: { $regex: new RegExp(category, 'i') } }
      : {};

    const total = await UserStats.countDocuments(filter);

    const topUsers = await UserStats.find(filter)
      .sort({ xp: -1, level: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username email createdAt')
      .select('userId xp level streak badges videosWatched quizzesCompleted avatar bio skills');

    // Rank raqami va unvon qo'shish
    const rankedUsers = topUsers.map((u, index) => ({
      rank:             skip + index + 1,
      rankTitle:        getRankTitle(u.level),
      user:             u.userId,
      xp:               u.xp,
      level:            u.level,
      streak:           u.streak,
      badges:           u.badges,
      videosWatched:    u.videosWatched,
      quizzesCompleted: u.quizzesCompleted,
      avatar:           u.avatar,
      bio:              u.bio,
      skills:           u.skills,
    }));

    res.json({
      success: true,
      data: {
        users: rankedUsers,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc  Bitta foydalanuvchining reyting pozitsiyasi
 * @route GET /api/ranking/users/:userId/position
 * @access Private
 */
const getUserPosition = async (req, res) => {
  try {
    const { userId } = req.params;

    const userStats = await UserStats.findOne({ userId });
    if (!userStats) {
      return res.status(404).json({ success: false, message: 'User stats not found' });
    }

    // Bu userdan yuqori XP'ga ega foydalanuvchilar soni = rank - 1
    const rank = (await UserStats.countDocuments({ xp: { $gt: userStats.xp } })) + 1;
    const total = await UserStats.countDocuments();

    res.json({
      success: true,
      data: {
        rank,
        total,
        xp:         userStats.xp,
        level:      userStats.level,
        rankTitle:  getRankTitle(userStats.level),
        topPercent: Math.round((rank / total) * 100),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getTopCourses, getTopUsers, getUserPosition };
