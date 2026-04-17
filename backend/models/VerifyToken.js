const mongoose = require('mongoose');

const verifyTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  telegramUserId: {
    type: String,
    default: null,
  },
  telegramUsername: {
    type: String,
    default: null,
  },
  linked: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // TTL — 5 daqiqadan keyin avtomatik o'chiriladi
  },
});

module.exports = mongoose.model('VerifyToken', verifyTokenSchema);
