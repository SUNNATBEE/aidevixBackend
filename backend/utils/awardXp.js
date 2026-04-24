const User = require('../models/User');
const UserStats = require('../models/UserStats');

const calculateRank = (xp) => {
  if (xp >= 50000) return 'LEGEND';
  if (xp >= 20000) return 'MASTER';
  if (xp >= 10000) return 'SENIOR';
  if (xp >= 5000) return 'MIDDLE';
  if (xp >= 2000) return 'JUNIOR';
  if (xp >= 500) return 'CANDIDATE';
  return 'AMATEUR';
};

/**
 * User va UserStats da XP qo‘shadi (kunlik mukofot bilan bir xil pattern).
 * @param {import('mongoose').Types.ObjectId} userId
 * @param {number} amount
 */
async function awardXp(userId, amount) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  user.xp = (user.xp || 0) + amount;
  user.rankTitle = calculateRank(user.xp);

  let stats = await UserStats.findOne({ userId: user._id });
  if (!stats) {
    stats = await UserStats.create({ userId: user._id });
  }
  stats.xp += amount;
  stats.weeklyXp = (stats.weeklyXp || 0) + amount;
  stats.level = stats.calculateLevel();
  stats.lastActivityDate = new Date();

  await stats.save();
  await user.save({ validateModifiedOnly: true });

  return { xp: user.xp, level: stats.level };
}

module.exports = { awardXp, calculateRank };
