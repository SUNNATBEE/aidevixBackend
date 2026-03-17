const { DailyChallenge, UserChallengeProgress } = require('../models/DailyChallenge');
const UserStats = require('../models/UserStats');

const todayStr = () => new Date().toISOString().split('T')[0];

/** @desc  Bugungi challenge | @route GET /api/challenges/today | @access Private */
const getTodayChallenge = async (req, res) => {
  try {
    const challenge = await DailyChallenge.findOne({ date: todayStr(), isActive: true });
    if (!challenge)
      return res.json({ success: true, data: { challenge: null, message: 'Bugun uchun vazifa yo\'q' } });

    const progress = await UserChallengeProgress.findOne({ userId: req.user._id, challengeId: challenge._id });

    res.json({
      success: true,
      data: {
        challenge,
        progress: progress || { currentCount: 0, isCompleted: false },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** @desc  Challenge progressini yangilash | @route POST /api/challenges/progress | @access Private */
const updateChallengeProgress = async (req, res) => {
  try {
    const challenge = await DailyChallenge.findOne({ date: todayStr(), isActive: true });
    if (!challenge)
      return res.status(404).json({ success: false, message: 'Bugun uchun vazifa yo\'q' });

    let progress = await UserChallengeProgress.findOne({ userId: req.user._id, challengeId: challenge._id });
    if (!progress)
      progress = new UserChallengeProgress({ userId: req.user._id, challengeId: challenge._id });

    if (progress.isCompleted)
      return res.json({ success: true, message: 'Siz bu vazifani allaqachon bajardingiz', data: { progress } });

    progress.currentCount += 1;

    if (progress.currentCount >= challenge.targetCount) {
      progress.isCompleted  = true;
      progress.completedAt  = new Date();
      progress.xpEarned     = challenge.xpReward;

      // XP qo'shish
      await UserStats.findOneAndUpdate(
        { userId: req.user._id },
        { $inc: { xp: challenge.xpReward, weeklyXp: challenge.xpReward } },
      );
    }

    await progress.save();

    res.json({
      success: true,
      message: progress.isCompleted ? `Vazifa bajarildi! +${challenge.xpReward} XP` : 'Progress yangilandi',
      data: { progress },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** @desc  Challenge yaratish (Admin) | @route POST /api/challenges/admin | @access Admin */
const createChallenge = async (req, res) => {
  try {
    const { title, description, type, targetCount, xpReward, date } = req.body;
    if (!title || !type || !date)
      return res.status(400).json({ success: false, message: 'title, type va date majburiy' });

    const challenge = await DailyChallenge.create({ title, description, type, targetCount, xpReward, date });
    res.status(201).json({ success: true, message: 'Vazifa yaratildi', data: { challenge } });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ success: false, message: 'Bu sana uchun vazifa allaqachon mavjud' });
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getTodayChallenge, updateChallengeProgress, createChallenge };
