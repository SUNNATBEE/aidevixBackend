const mongoose = require('mongoose');

/**
 * DailyChallenge — Kunlik vazifalar
 * Har kuni yangi vazifa, bajarsa bonus XP
 */
const dailyChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['watch_video', 'complete_quiz', 'streak', 'enroll_course', 'rate_course', 'use_ai_tool', 'share_prompt'],
    required: true,
  },
  // Maqsad miqdori (masalan: 3 ta video ko'rish)
  targetCount: {
    type: Number,
    default: 1,
  },
  xpReward: {
    type: Number,
    default: 50,
  },
  // Qaysi sanaga tegishli
  date: {
    type: String, // 'YYYY-MM-DD' format
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

/**
 * UserChallengeProgress — Foydalanuvchi kunlik vazifa bajarish holati
 */
const userChallengeProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DailyChallenge',
    required: true,
  },
  currentCount: {
    type: Number,
    default: 0,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  xpEarned: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

userChallengeProgressSchema.index({ userId: 1, challengeId: 1 }, { unique: true });

const DailyChallenge = mongoose.model('DailyChallenge', dailyChallengeSchema);
const UserChallengeProgress = mongoose.model('UserChallengeProgress', userChallengeProgressSchema);

module.exports = { DailyChallenge, UserChallengeProgress };
