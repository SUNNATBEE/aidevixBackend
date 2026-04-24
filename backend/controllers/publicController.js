const User = require('../models/User');
const UserStats = require('../models/UserStats');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Prompt = require('../models/Prompt');

const getLiveActivity = async (_req, res) => {
  try {
    const [enrollments, prompts] = await Promise.all([
      Enrollment.find().sort({ createdAt: -1 }).limit(12).populate('userId', 'username').populate('courseId', 'title'),
      Prompt.find({ isPublic: true }).sort({ createdAt: -1 }).limit(12).populate('author', 'username'),
    ]);

    const activities = [
      ...enrollments.map((e) => ({
        id: `enr-${e._id}`,
        user: e.userId?.username || 'User',
        action: `${e.courseId?.title || 'Kurs'} kursini boshladi`,
        type: 'enrollment',
        createdAt: e.createdAt,
      })),
      ...prompts.map((p) => ({
        id: `prm-${p._id}`,
        user: p.author?.username || 'User',
        action: `yangi prompt ulashdi: ${p.title}`,
        type: 'prompt',
        createdAt: p.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 20);

    return res.json({ success: true, data: { activities } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getTeamMembers = async (_req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('username firstName lastName avatar role aiStack createdAt')
      .sort({ xp: -1, createdAt: 1 })
      .limit(8)
      .lean();

    const ids = users.map((u) => u._id);
    const stats = await UserStats.find({ userId: { $in: ids } })
      .select('userId xp level streak')
      .lean();
    const statsMap = new Map(stats.map((s) => [String(s.userId), s]));

    const members = users.map((u) => {
      const st = statsMap.get(String(u._id));
      return {
        id: String(u._id),
        name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.username,
        username: u.username,
        avatar: u.avatar || null,
        role: u.role || 'user',
        stack: u.aiStack || [],
        xp: st?.xp || 0,
        level: st?.level || 1,
        streak: st?.streak || 0,
      };
    });

    return res.json({ success: true, data: { members } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getRoadmap = async (_req, res) => {
  try {
    const categories = await Course.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    const paths = categories.map((c, i) => ({
      id: c._id || `path-${i}`,
      title: (c._id || 'General').toString().toUpperCase(),
      description: `${c.count} ta faol kurs`,
      icon: '📘',
      steps: [
        {
          title: `${(c._id || 'General').toString()} asoslari`,
          category: c._id || 'all',
          level: 'Boshlang\'ich',
          xp: 200,
          icon: '🟡',
        },
        {
          title: `${(c._id || 'General').toString()} amaliyot`,
          category: c._id || 'all',
          level: 'O\'rta',
          xp: 400,
          icon: '⚡',
        },
      ],
    }));

    return res.json({ success: true, data: { paths } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getLiveActivity,
  getTeamMembers,
  getRoadmap,
};

