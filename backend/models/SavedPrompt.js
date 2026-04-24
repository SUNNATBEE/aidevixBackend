const mongoose = require('mongoose');

const savedPromptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    prompt: { type: mongoose.Schema.Types.ObjectId, ref: 'Prompt', required: true },
  },
  { timestamps: true }
);

savedPromptSchema.index({ user: 1, prompt: 1 }, { unique: true });

module.exports = mongoose.model('SavedPrompt', savedPromptSchema);
