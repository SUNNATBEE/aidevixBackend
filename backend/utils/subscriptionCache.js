/**
 * In-memory subscription cache (TTL: 5 daqiqa)
 *
 * Har video loadda Telegram API ga so'rov yuborilishining oldini oladi.
 * Railway single-instance uchun Map yetarli. Multi-instance kerak bo'lsa — Redis.
 *
 * Cache invalidatsiyasi:
 *   - Foydalanuvchi obunadan chiqib verifyTelegram/verifyInstagram qayta chaqirsa
 *   - subscriptionController da invalidateSubscriptionCache(userId) chaqiriladi
 */

const TTL_MS = 5 * 60 * 1000; // 5 daqiqa

/** @type {Map<string, {data: object, expiresAt: number}>} */
const store = new Map();

// Eski yozuvlarni tozalash (memory leak oldini olish) — har 10 daqiqada
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.expiresAt) store.delete(key);
  }
}, 10 * 60 * 1000);

/**
 * @param {string|object} userId
 * @returns {{instagramSubscribed: boolean, telegramSubscribed: boolean}|null}
 */
const get = (userId) => {
  const key   = userId.toString();
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.data;
};

/**
 * @param {string|object} userId
 * @param {{instagramSubscribed: boolean, telegramSubscribed: boolean}} data
 */
const set = (userId, data) => {
  store.set(userId.toString(), {
    data,
    expiresAt: Date.now() + TTL_MS,
  });
};

/** Foydalanuvchi obuna holatini o'zgartirganida cache ni tozalash */
const invalidate = (userId) => {
  store.delete(userId.toString());
};

module.exports = { get, set, invalidate };
