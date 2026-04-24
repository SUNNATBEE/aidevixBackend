const mongoose = require('mongoose');

const bugReportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, required: true, trim: true, maxlength: 8000 },
    pageUrl: { type: String, trim: true, maxlength: 800, default: '' },
    suggestion: { type: String, trim: true, maxlength: 4000, default: '' },
    status: {
      type: String,
      enum: ['pending', 'rejected', 'bug_ok', 'done'],
      default: 'pending',
      index: true,
    },
    bugXpGranted: { type: Boolean, default: false },
    suggestionXpGranted: { type: Boolean, default: false },
    adminNote: { type: String, maxlength: 1000, default: '' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

bugReportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('BugReport', bugReportSchema);
