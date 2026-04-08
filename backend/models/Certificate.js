const mongoose = require('mongoose');

/**
 * Certificate — Kurs tugallanganda beriladigan sertifikat
 */
const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  enrollmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true,
  },
  // Noyob sertifikat kodi (tasdiqlash uchun)
  certificateCode: {
    type: String,
    unique: true,
    required: true,
  },
  // Sertifikat egasining ismi (chiqarish vaqtidagi ism)
  recipientName: {
    type: String,
    required: true,
  },
  // Kurs nomi (chiqarish vaqtidagi nom)
  courseName: {
    type: String,
    required: true,
  },
  issuedAt: {
    type: Date,
    default: Date.now,
  },
  // PDF sertifikat Cloudinary URL'i
  pdfUrl: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Bir foydalanuvchi bitta kursdan bitta sertifikat
certificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });
certificateSchema.index({ userId: 1 });
// certificateCode allaqachon { unique: true } bilan schema fieldida index yaratilgan

module.exports = mongoose.model('Certificate', certificateSchema);
