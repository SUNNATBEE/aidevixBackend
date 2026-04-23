const User = require('../models/User');
const UserStats = require('../models/UserStats');

/**
 * @desc  Foydalanuvchining ochiq profili (achievement showcase)
 * @route GET /api/users/:username/public
 * @access Public
 */
const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username, isActive: true })
      .select('username firstName lastName avatar aiStack createdAt role jobTitle')
      .lean();

    if (!user) {
      return res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });
    }

    const stats = await UserStats.findOne({ userId: user._id })
      .select('xp level streak badges bio skills weeklyXp')
      .lean();

    const totalUsers = await UserStats.countDocuments();
    const rank = stats
      ? (await UserStats.countDocuments({ xp: { $gt: stats.xp || 0 } })) + 1
      : totalUsers;

    const getRankTitle = (level = 1) => {
      if (level >= 90) return 'GRANDMASTER';
      if (level >= 75) return 'VICE-ADMIRAL';
      if (level >= 60) return 'COMMANDER';
      if (level >= 45) return 'CAPTAIN';
      if (level >= 30) return 'LIEUTENANT';
      if (level >= 15) return 'SERGEANT';
      if (level >= 5)  return 'CORPORAL';
      return 'RECRUIT';
    };

    res.json({
      success: true,
      data: {
        user: {
          username:  user.username,
          firstName: user.firstName,
          lastName:  user.lastName,
          avatar:    user.avatar,
          aiStack:   user.aiStack || [],
          jobTitle:  user.jobTitle,
          joinedAt:  user.createdAt,
        },
        stats: {
          xp:               stats?.xp || 0,
          level:            stats?.level || 1,
          streak:           stats?.streak || 0,
          weeklyXp:         stats?.weeklyXp || 0,
          badges:           stats?.badges || [],
          bio:              stats?.bio || '',
          skills:           stats?.skills || [],
        },
        ranking: {
          rank,
          total:      totalUsers,
          rankTitle:  getRankTitle(stats?.level || 1),
          topPercent: Math.round((rank / totalUsers) * 100),
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getPublicProfile };
