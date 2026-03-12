const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Video title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number, // in seconds
    default: 0,
  },
  thumbnail: {
    type: String,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  // Ko'rishlar soni (statistika uchun)
  viewCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  // Video materiallari (PDF, zip fayllar)
  materials: [
    {
      name: { type: String },
      url: { type: String },
    },
  ],
  // Savollar (Q&A)
  questions: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String },
      createdAt: { type: Date, default: Date.now },
      answer: { type: String, default: null },
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Video', videoSchema);
