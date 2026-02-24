const mongoose = require('mongoose');

const videoLinkSchema = new mongoose.Schema({
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  telegramLink: {
    type: String,
    required: [true, 'Telegram link is required'],
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  usedAt: {
    type: Date,
    default: null,
  },
  expiresAt: {
    type: Date,
    default: null, // Optional expiration
  },
}, {
  timestamps: true,
});

// Index for faster queries
videoLinkSchema.index({ user: 1, video: 1 });
videoLinkSchema.index({ isUsed: 1 });

module.exports = mongoose.model('VideoLink', videoLinkSchema);
