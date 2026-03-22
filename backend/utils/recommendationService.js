const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

/**
 * Foydalanuvchi uchun tavsiya etilgan kurslar
 * Strategiya:
 * 1. Yozilgan kurslarning kategoriyalarini aniqlash
 * 2. Shu kategoriyalardagi yuqori rated kurslarni qaytarish
 * 3. Yozilgan kurslarni chiqarib tashlash
 * 4. Enrollment yo'q bo'lsa — eng popular kurslarni qaytarish
 */
async function getRecommendedCourses(userId, limit = 6) {
  try {
    const enrollments = await Enrollment.find({ userId }).select('courseId').lean();
    const enrolledCourseIds = enrollments.map(e => e.courseId);

    let categories = [];
    if (enrolledCourseIds.length > 0) {
      const enrolledCourses = await Course.find({ _id: { $in: enrolledCourseIds } })
        .select('category')
        .lean();
      categories = [...new Set(enrolledCourses.map(c => c.category))];
    }

    const query = { isActive: true, _id: { $nin: enrolledCourseIds } };
    if (categories.length > 0) {
      query.category = { $in: categories };
    }

    const recommended = await Course.find(query)
      .sort({ rating: -1, viewCount: -1 })
      .limit(limit)
      .select('title thumbnail category price rating viewCount')
      .lean();

    // Yetarli bo'lmasa, popular kurslarni qo'sh
    if (recommended.length < limit) {
      const moreIds = [...enrolledCourseIds, ...recommended.map(c => c._id)];
      const popular = await Course.find({ isActive: true, _id: { $nin: moreIds } })
        .sort({ viewCount: -1 })
        .limit(limit - recommended.length)
        .select('title thumbnail category price rating viewCount')
        .lean();
      recommended.push(...popular);
    }

    return recommended;
  } catch (err) {
    console.error('Recommendation error:', err.message);
    return [];
  }
}

module.exports = { getRecommendedCourses };
