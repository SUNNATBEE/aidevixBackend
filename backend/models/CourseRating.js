const mongoose = require('mongoose');

const CourseRatingSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  rating:   { type: Number, required: true, min: 1, max: 5 },
  review:   { type: String, maxlength: 500, default: null },
}, { timestamps: true });

CourseRatingSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('CourseRating', CourseRatingSchema);
