const mongoose = require('mongoose');

const aiNewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 220,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
      maxlength: 420,
    },
    imageUrl: {
      type: String,
      default: null,
      trim: true,
    },
    platform: {
      type: String,
      enum: ['telegram', 'instagram'],
      default: 'telegram',
    },
    href: {
      type: String,
      required: true,
      trim: true,
    },
    cta: {
      type: String,
      default: "To'liq yangilikni ko'rish",
      trim: true,
      maxlength: 120,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startsAt: {
      type: Date,
      default: null,
    },
    endsAt: {
      type: Date,
      default: null,
    },
    clicks: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

aiNewsSchema.index({ isActive: 1, startsAt: 1, endsAt: 1, order: 1, createdAt: -1 });

module.exports = mongoose.model('AiNews', aiNewsSchema);
