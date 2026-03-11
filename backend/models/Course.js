const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
  },
  thumbnail: {
    type: String,
    default: null,
  },
  price: {
    type: Number,
    required: [true, 'Course price is required'],
    min: [0, 'Price cannot be negative'],
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  category: {
    type: String,
    default: 'general',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Course', courseSchema);
