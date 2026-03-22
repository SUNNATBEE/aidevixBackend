const https = require('https');

/**
 * Telegram botdan foydalanuvchi chatiga xabar yuborish
 * Foydalanuvchi avval botga /start yuborganda chatId saqlanadi
 */
async function sendTelegramMessage(chatId, message) {
  if (!chatId || !process.env.TELEGRAM_BOT_TOKEN) return false;

  return new Promise((resolve) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const body = JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    });

    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${botToken}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      resolve(res.statusCode === 200);
    });

    req.on('error', () => resolve(false));
    req.write(body);
    req.end();
  });
}

async function notifyBadge(telegramChatId, badgeName) {
  return sendTelegramMessage(telegramChatId, `🏆 Tabriklaymiz! Siz <b>${badgeName}</b> belgisini oldingiz!`);
}

async function notifyLevelUp(telegramChatId, level) {
  return sendTelegramMessage(telegramChatId, `⬆️ Siz <b>${level}</b>-darajaga ko'tarildingiz!`);
}

async function notifyStreakReminder(telegramChatId, streak) {
  return sendTelegramMessage(telegramChatId, `🔥 Bugun faol bo'ling! Streak: <b>${streak} kun</b>`);
}

async function notifyCourseComplete(telegramChatId, courseName) {
  return sendTelegramMessage(telegramChatId, `🎓 <b>${courseName}</b> kursini tugatdingiz! Tabriklaymiz!`);
}

module.exports = { sendTelegramMessage, notifyBadge, notifyLevelUp, notifyStreakReminder, notifyCourseComplete };
