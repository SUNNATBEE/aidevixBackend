const { getBot } = require('./telegramBot');

/**
 * Telegram orqali OTP yuborish.
 * Foydalanuvchining telegramUserId (socialSubscriptions.telegram.telegramUserId yoki
 * User.telegramUserId) bo'lishi kerak — ya'ni bot bilan avval /start bosgan bo'lishi shart.
 */
async function sendOtpTelegram(telegramUserId, code) {
  const bot = getBot();
  if (!bot) throw new Error('Telegram bot ishga tushmagan');

  const msg =
    `🔐 <b>Aidevix — Parolni tiklash</b>\n\n` +
    `Tasdiqlash kodingiz: <code>${code}</code>\n\n` +
    `⏱ Kod <b>10 daqiqa</b> davomida amal qiladi.\n` +
    `Agar siz so'ramagan bo'lsangiz, ushbu xabarni e'tiborsiz qoldiring.`;

  await bot.sendMessage(String(telegramUserId), msg, { parse_mode: 'HTML' });
}

module.exports = { sendOtpTelegram };
