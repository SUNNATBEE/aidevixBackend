const mongoose = require('mongoose');

/**
 * UserStats Model
 * Foydalanuvchining XP, level, streak, badges va boshqa statistikalarini saqlaydi.
 * Suhrob tomonidan ishlatiladigan endpoint'lar uchun asosiy model.
 */
const userStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  xp: {
    type: Number,
    default: 0,
    min: 0,
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
  },
  // Daily streak (ketma-ket faol kunlar soni)
  streak: {
    type: Number,
    default: 0,
    min: 0,
  },
  lastActivityDate: {
    type: Date,
    default: null,
  },
  // Ko'rilgan videolar soni
  videosWatched: {
    type: Number,
    default: 0,
  },
  // Yechilgan quiz/testlar soni
  quizzesCompleted: {
    type: Number,
    default: 0,
  },
  // Badges (yutuqlar)
  badges: [
    {
      name: { type: String, required: true },
      icon: { type: String, default: '🏆' },
      earnedAt: { type: Date, default: Date.now },
    },
  ],
  // Reaction history (emoji reaction'lar tarixi)
  reactionHistory: [
    {
      emoji: String,
      count: { type: Number, default: 0 },
    },
  ],
  // Bio va ko'nikmalar (Firdavs profile page uchun ham ishlatiladi)
  bio: {
    type: String,
    default: '',
    maxlength: 300,
  },
  skills: [
    {
      type: String,
      trim: true,
    },
  ],
  // Avatar URL (Telegram yoki upload qilingan)
  avatar: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

// Level hisoblash: har 1000 XP = 1 level
userStatsSchema.methods.calculateLevel = function () {
  return Math.floor(this.xp / 1000) + 1;
};

// Level progress percentage (0-100)
userStatsSchema.methods.getLevelProgress = function () {
  const xpInCurrentLevel = this.xp % 1000;
  return Math.round((xpInCurrentLevel / 1000) * 100);
};

module.exports = mongoose.model('UserStats', userStatsSchema);
