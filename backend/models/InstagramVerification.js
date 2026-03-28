const mongoose = require('mongoose');

/**
 * InstagramVerification — Instagram obuna tasdiqlash so'rovi
 * Admin qo'lda approve yoki reject qiladi
 */
const InstagramVerificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  instagramUsername: {
    type: String,
    required: true,
    trim: true,
  },
  verificationType: {
    type: String,
    enum: ['manual', 'screenshot'],
    default: 'manual',
  },
  screenshotUrl: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  adminNote: {
    type: String,
    default: null,
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  reviewedAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

InstagramVerificationSchema.index({ userId: 1, status: 1 });
InstagramVerificationSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('InstagramVerification', InstagramVerificationSchema);
