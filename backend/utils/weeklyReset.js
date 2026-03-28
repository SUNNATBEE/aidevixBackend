const UserStats = require('../models/UserStats');

/**
 * Haftalik XP reset — har dushanba 00:00 da weeklyXp = 0
 * setInterval bilan har soatda tekshiriladi (cron package kerak emas)
 */
async function startWeeklyReset() {
  const checkReset = async () => {
    const now = new Date();
    // Dushanba (1) va soat 00:00-01:00 orasida
    if (now.getDay() === 1 && now.getHours() === 0) {
      try {
        const result = await UserStats.updateMany(
          {},
          { $set: { weeklyXp: 0, lastWeekReset: new Date() } }
        );
        console.log(`[WeeklyReset] Haftalik XP tozalandi. ${result.modifiedCount} foydalanuvchi yangilandi`);
      } catch (err) {
        console.error('[WeeklyReset] Xato:', err.message);
      }
    }
  };

  // Har soatda tekshir
  setInterval(checkReset, 60 * 60 * 1000);
  console.log('[WeeklyReset] Haftalik reset scheduler ishga tushdi');
}

module.exports = { startWeeklyReset };
