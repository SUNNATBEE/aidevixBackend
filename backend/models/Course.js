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
    enum: ['html', 'css', 'javascript', 'react', 'typescript', 'nodejs', 'general'],
  },
  // Ko'rishlar soni (Numton - Top Courses Ranking uchun)
  viewCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  // O'quvchilar soni
  studentsCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  // O'rtacha reyting (1-5)
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  // Reyting berganlar soni
  ratingCount: {
    type: Number,
    default: 0,
  },
  // Kurs daraja: beginner | intermediate | advanced
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  // Kurs holati: free | paid
  isFree: {
    type: Boolean,
    default: false,
  },
  // Umumiy darslar davomiyligi (soniyada)
  totalDuration: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

courseSchema.index({ category: 1, isActive: 1 });
courseSchema.index({ viewCount: -1 });
courseSchema.index({ rating: -1 });
courseSchema.index({ createdAt: -1 });
courseSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Course', courseSchema);
