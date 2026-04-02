/**
 * Asinxron funksiyalarni wrapper qilish uchun (try-catch yozmaslik uchun)
 * Senior dasturchilar Controller larda ortiqcha boilerplate (takrorlanuvchi kod) kamaytirish uchun ishlatadi.
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
