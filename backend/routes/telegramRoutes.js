const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * POST /api/telegram/webhook
 * Telegram bot webhookini qabul qilish
 *
 * Webhookni Telegram ga register qilish:
 * GET https://api.telegram.org/bot{TOKEN}/setWebhook?url={BACKEND_URL}/api/telegram/webhook
 *
 * Foydalanuvchi botga /start <mongoUserId> yuborsa:
 * - telegramUserId va telegramChatId saqlanadi
 * - Tasdiqlash xabari yuboriladi
 */
router.post('/webhook', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.sendStatus(200);

    const chatId = String(message.chat.id);
    const text = message.text || '';
    const telegramUserId = String(message.from.id);

    if (text.startsWith('/start')) {
      const parts = text.split(' ');
      const mongoUserId = parts[1]; // /start <mongoUserId>

      if (mongoUserId) {
        const user = await User.findById(mongoUserId).catch(() => null);
        if (user) {
          user.telegramUserId = telegramUserId;
          user.telegramChatId = chatId;
          await user.save();

          const { sendTelegramMessage } = require('../utils/telegramNotifier');
          await sendTelegramMessage(chatId, '✅ Telegram hisobingiz Aidevix ga ulandi! Endi bildirishnomalar qabul qilasiz.');
        }
      }
    }

    // Telegram'ga har doim 200 qaytarish kerak
    res.sendStatus(200);
  } catch (err) {
    console.error('Telegram webhook error:', err.message);
    res.sendStatus(200);
  }
});

module.exports = router;
