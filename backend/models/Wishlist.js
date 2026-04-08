const mongoose = require('mongoose');

/**
 * Wishlist — Saqlangan kurslar
 * Foydalanuvchi keyinroq o'qish uchun kurslarni saqlaydi.
 */
const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  courses: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
