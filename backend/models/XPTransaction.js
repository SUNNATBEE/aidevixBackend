const mongoose = require('mongoose');

/**
 * XPTransaction — XP o'zgarishlari tarixi
 */
const XPTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
}, { timestamps: true });

XPTransactionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('XPTransaction', XPTransactionSchema);
