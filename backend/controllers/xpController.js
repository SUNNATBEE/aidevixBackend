const UserStats = require('../models/UserStats');
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const { awardBadges } = require('../utils/badgeService');

/**
 * @desc  Foydalanuvchi statsini olish
 * @route GET /api/xp/stats
 * @access Private
 */
const getUserStats = async (req, res) => {
  try {
    let stats = await UserStats.findOne({ userId: req.user.id });

    // Agar stats mavjud bo'lmasa, yangi yaratamiz
    if (!stats) {
      stats = await UserStats.create({ userId: req.user.id });
    }

    const levelProgress = stats.getLevelProgress();
    const currentLevel = stats.calculateLevel();

    // Level yangilash (agar o'zgargan bo'lsa)
    if (stats.level !== currentLevel) {
      stats.level = currentLevel;
      await stats.save();
    }

    res.json({
      success: true,
      data: {
        xp: stats.xp,
        level: stats.level,
        levelProgress,
        xpToNextLevel: 1000 - (stats.xp % 1000),
        streak: stats.streak,
        lastActivityDate: stats.lastActivityDate,
        badges: stats.badges,
        videosWatched: stats.videosWatched,
        quizzesCompleted: stats.quizzesCompleted,
        bio: stats.bio,
        skills: stats.skills,
        avatar: stats.avatar,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc  Video ko'rishda XP berish (video tugaganda chaqiriladi)
 * @route POST /api/xp/video-watched/:videoId
 * @access Private
 */
const addVideoWatchXP = async (req, res) => {
  try {
    const XP_FOR_VIDEO = 50;

    let stats = await UserStats.findOne({ userId: req.user.id });
    if (!stats) {
      stats = await UserStats.create({ userId: req.user.id });
    }

    stats.xp += XP_FOR_VIDEO;
    stats.weeklyXp = (stats.weeklyXp || 0) + XP_FOR_VIDEO;
    stats.videosWatched += 1;
    stats.level = stats.calculateLevel();

    // Streak yangilash
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (stats.lastActivityDate) {
      const last = new Date(stats.lastActivityDate);
      last.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        stats.streak += 1; // Ketma-ket kun
      } else if (diffDays > 1) {
        // Streak freeze tekshiruvi
        if ((stats.streakFreezes || 0) > 0 && diffDays === 2) {
          stats.streakFreezes -= 1;
          stats.streakFreezeUsedAt = new Date();
          // streak saqlanadi
        } else {
          stats.streak = 1; // Streak uzildi
        }
      }
      // diffDays === 0 bo'lsa — bugun allaqachon faol bo'lgan, streak o'zgarmaydi
    } else {
      stats.streak = 1;
    }

    stats.lastActivityDate = new Date();
    await stats.save();

    // Badge auto-award
    awardBadges(req.user.id).catch(() => {});

    res.json({
      success: true,
      data: {
        xpEarned: XP_FOR_VIDEO,
        totalXp: stats.xp,
        level: stats.level,
        streak: stats.streak,
        levelProgress: stats.getLevelProgress(),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc  Quiz natijasini saqlash va XP berish
 * @route POST /api/xp/quiz/:quizId
 * @access Private
 */
const submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body; // [{questionIndex, selectedOption}]

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz topilmadi' });
    }

    // Oldindan yechildimi?
    const existing = await QuizResult.findOne({ userId: req.user.id, quizId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Bu quizni allaqachon yechgansiz',
        data: { score: existing.score, xpEarned: existing.xpEarned },
      });
    }

    // Javoblarni tekshirish
    let correctCount = 0;
    let totalXP = 0;
    const resultAnswers = answers.map((a) => {
      const question = quiz.questions[a.questionIndex];
      const isCorrect = question && question.correctAnswer === a.selectedOption;
      if (isCorrect) {
        correctCount++;
        totalXP += question.xpReward || 10;
      }
      return {
        questionIndex: a.questionIndex,
        selectedOption: a.selectedOption,
        isCorrect: !!isCorrect,
      };
    });

    const score = quiz.questions.length > 0
      ? Math.round((correctCount / quiz.questions.length) * 100)
      : 0;
    const passed = score >= quiz.passingScore;

    // Bonus XP: o'tsa qo'shimcha 100 XP
    if (passed) totalXP += 100;

    // QuizResult saqlash
    const result = await QuizResult.create({
      userId: req.user.id,
      quizId,
      videoId: quiz.videoId,
      courseId: quiz.courseId,
      score,
      xpEarned: totalXP,
      passed,
      answers: resultAnswers,
    });

    // UserStats yangilash
    let stats = await UserStats.findOne({ userId: req.user.id });
    if (!stats) {
      stats = await UserStats.create({ userId: req.user.id });
    }

    stats.xp += totalXP;
    stats.weeklyXp = (stats.weeklyXp || 0) + totalXP;
    stats.quizzesCompleted += 1;
    stats.level = stats.calculateLevel();
    stats.lastActivityDate = new Date();
    await stats.save();

    // Badge auto-award
    awardBadges(req.user.id).catch(() => {});

    res.json({
      success: true,
      data: {
        score,
        passed,
        correctCount,
        totalQuestions: quiz.questions.length,
        xpEarned: totalXP,
        totalXp: stats.xp,
        level: stats.level,
        levelProgress: stats.getLevelProgress(),
        answers: resultAnswers,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc  Video uchun quizni olish
 * @route GET /api/xp/quiz/video/:videoId
 * @access Private
 */
const getQuizByVideo = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ videoId: req.params.videoId, isActive: true })
      .select('-questions.correctAnswer'); // To'g'ri javobni bermaymiz

    if (!quiz) {
      return res.json({ success: true, data: null, message: 'Bu video uchun quiz mavjud emas' });
    }

    // Yechilganmi tekshirish
    const solved = await QuizResult.findOne({ userId: req.user.id, quizId: quiz._id });

    res.json({
      success: true,
      data: {
        quiz,
        alreadySolved: !!solved,
        previousScore: solved ? solved.score : null,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc  Foydalanuvchi profilini yangilash (bio, skills, avatar)
 * @route PUT /api/xp/profile
 * @access Private
 */
const updateProfile = async (req, res) => {
  try {
    const { bio, skills, avatar } = req.body;

    let stats = await UserStats.findOne({ userId: req.user.id });
    if (!stats) {
      stats = await UserStats.create({ userId: req.user.id });
    }

    if (bio !== undefined) stats.bio = bio;
    if (skills !== undefined) stats.skills = skills;
    if (avatar !== undefined) stats.avatar = avatar;

    await stats.save();

    res.json({
      success: true,
      data: {
        bio: stats.bio,
        skills: stats.skills,
        avatar: stats.avatar,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc  Streak freeze ishlatish (1 ta freeze sarflaydi)
 * @route POST /api/xp/streak-freeze
 * @access Private
 */
const useStreakFreeze = async (req, res) => {
  try {
    let stats = await UserStats.findOne({ userId: req.user.id });
    if (!stats) {
      return res.status(404).json({ success: false, message: 'Stats topilmadi' });
    }

    if ((stats.streakFreezes || 0) <= 0) {
      return res.status(400).json({ success: false, message: 'Streak freeze qolmadi (max 5 ta)' });
    }

    stats.streakFreezes -= 1;
    stats.streakFreezeUsedAt = new Date();
    await stats.save();

    res.json({
      success: true,
      message: 'Streak freeze ishlatildi',
      data: { streakFreezes: stats.streakFreezes, streak: stats.streak },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc  Streak freeze qo'shish (Admin yoki sovg'a sifatida)
 * @route POST /api/xp/streak-freeze/add
 * @access Private
 */
const addStreakFreeze = async (req, res) => {
  try {
    const { userId } = req.body;
    const targetId = userId || req.user.id;

    let stats = await UserStats.findOne({ userId: targetId });
    if (!stats) {
      stats = await UserStats.create({ userId: targetId });
    }

    const MAX_FREEZES = 5;
    if ((stats.streakFreezes || 0) >= MAX_FREEZES) {
      return res.status(400).json({ success: false, message: `Maksimal ${MAX_FREEZES} ta streak freeze bo'lishi mumkin` });
    }

    stats.streakFreezes = (stats.streakFreezes || 0) + 1;
    await stats.save();

    res.json({
      success: true,
      message: 'Streak freeze qo\'shildi',
      data: { streakFreezes: stats.streakFreezes },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc  Haftalik liderlar jadvali (weeklyXp bo'yicha)
 * @route GET /api/xp/weekly-leaderboard
 * @access Public
 */
const getWeeklyLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const leaders = await UserStats.find({ weeklyXp: { $gt: 0 } })
      .sort({ weeklyXp: -1 })
      .limit(limit)
      .populate('userId', 'username');

    res.json({
      success: true,
      data: {
        leaderboard: leaders.map((s, i) => ({
          rank: i + 1,
          user: s.userId,
          weeklyXp: s.weeklyXp || 0,
          level: s.level,
          streak: s.streak,
        })),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getUserStats,
  addVideoWatchXP,
  submitQuiz,
  getQuizByVideo,
  updateProfile,
  useStreakFreeze,
  addStreakFreeze,
  getWeeklyLeaderboard,
};
