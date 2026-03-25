const rateLimit = require('express-rate-limit');

// Umumiy API limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 daqiqa
  max: 500,
  message: { success: false, message: 'Juda ko\'p so\'rov. 15 daqiqadan so\'ng qayta urinib ko\'ring.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth uchun limit (register/login test qilish uchun kengaytirildi)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { success: false, message: 'Juda ko\'p urinish. 15 daqiqadan so\'ng qayta urinib ko\'ring.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// To'lov uchun limit
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 soat
  max: 20,
  message: { success: false, message: 'To\'lov uchun juda ko\'p so\'rov.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Upload uchun limit
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Upload uchun juda ko\'p so\'rov.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { apiLimiter, authLimiter, paymentLimiter, uploadLimiter };
