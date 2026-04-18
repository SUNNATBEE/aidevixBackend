const axios = require('axios');

/**
 * ═══════════════════════════════════════════════════════════════════
 * AIDEVIX TELEGRAM BOT — Senior Professional Implementation
 * ═══════════════════════════════════════════════════════════════════
 */

let botInstance = null;

class AidevixBot {
  constructor(token) {
    this.token = token;
    this.apiUrl = `https://api.telegram.org/bot${token}`;
    this.offset = 0;
  }

  /** Long Polling ishga tushirish */
  async startPolling() {
    console.log('🤖 Aidevix Senior Bot ishga tushdi...');
    while (true) {
      try {
        const response = await axios.get(`${this.apiUrl}/getUpdates`, {
          params: { offset: this.offset, timeout: 30 },
        });

        const updates = response.data.result;
        for (const update of updates) {
          this.offset = update.update_id + 1;
          await this._handleUpdate(update);
        }
      } catch (error) {
        console.error('Polling error:', error.message);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  async _handleUpdate(update) {
    if (update.message) {
      const { chat, from, text } = update.message;
      const chatId = chat.id;
      const userId = from.id;
      const firstName = from.first_name;
      const username = from.username;

      if (!text) return;

      if (text.startsWith('/start')) {
        const parts = text.split(' ');
        if (parts.length > 1) {
          return this._handleVerifyToken(chatId, userId, username, parts[1]);
        }
        return this._cmdStart(chatId, userId, firstName, username);
      }

      switch (text.split(' ')[0]) {
        case '/id': await this.sendMessage(chatId, `🆔 Sizning Telegram ID: <code>${userId}</code>`, { parse_mode: 'HTML' }); break;
        case '/login': await this._cmdLogin(chatId, userId, firstName); break;
        case '/stats': await this._cmdStats(chatId, userId, firstName); break;
        case '/referral': await this._cmdReferral(chatId, userId, firstName); break;
        case '/postnews': await this._cmdPostNews(chatId, userId); break;
        case '/help': await this._cmdHelp(chatId, firstName); break;
      }
    }

    if (update.callback_query) {
      const { id, data, from, message } = update.callback_query;
      const chatId = message?.chat?.id;
      const userId = from.id;
      const firstName = from.first_name;

      switch (data) {
        case 'cb_magic_login': await this._cmdLogin(chatId, userId, firstName); break;
        case 'cb_get_stats': await this._cmdStats(chatId, userId, firstName); break;
        case 'cb_get_referral': await this._cmdReferral(chatId, userId, firstName); break;
        case 'news_react_fire': await this.answerCallbackQuery(id, 'Olov bo\'ldi! 🔥'); break;
        case 'news_react_rocket': await this.answerCallbackQuery(id, 'Rahmat! 🚀'); break;
        case 'news_react_bulb': await this.answerCallbackQuery(id, 'Foydali bo\'ldi! 💡'); break;
      }
      await this.answerCallbackQuery(id, ''); 
    }
  }

  // ═══════════════════════════ COMMANDS ═══════════════════════════

  async _cmdStart(chatId, userId, firstName) {
    const frontendUrl = this._getFrontendUrl();
    const msg =
      `🚀 <b>Aidevix Akademiyasi — Kelajak Markaziga Xush Kelibsiz!</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `👋 Salom, <b>${firstName}</b>!\n\n` +
      `Siz zamonaviy IT va Sun'iy Intellekt olamiga kirish eshigidasiz.\n\n` +
      `🔑 <b>Sizning Shaxsiy ID:</b>\n` +
      `┌─────────────────────┐\n` +
      `│  <code>${userId}</code>\n` +
      `└─────────────────────┘\n\n` +
      `⚡ <b>Imkoniyatlar:</b>\n` +
      `• AI sohasidagi eng so'nggi trendlar\n` +
      `• Prompt Engineering sirlari\n` +
      `• Professional sertifikatlar\n\n` +
      `👇 <b>Akademiyaga kirish uchun quyidagi tugmani bosing:</b>`;

    const keyboard = {
      inline_keyboard: [
        [{ text: '🚀 Akademiyaga kirish (Mini App)', web_app: { url: frontendUrl } }],
        [{ text: '📊 Statistikam', callback_data: 'cb_get_stats' }, { text: '👥 Taklifnomalar', callback_data: 'cb_get_referral' }],
        [{ text: '📢 AI Kanal', url: 'https://t.me/aidevix' }, { text: '🔐 Shaxsiy kabinet', callback_data: 'cb_magic_login' }]
      ]
    };

    await this.sendMessage(chatId, msg, { parse_mode: 'HTML', reply_markup: keyboard });
  }

  async _cmdStats(chatId, userId, firstName) {
    try {
      const User = require('../models/User');
      const UserStats = require('../models/UserStats');
      const user = await User.findOne({ $or: [{ telegramUserId: String(userId) }, { 'socialSubscriptions.telegram.telegramUserId': String(userId) }] });

      if (!user) return this.sendMessage(chatId, `⚠️ Ro'yxatdan o'ting: <a href="https://aidevix.uz">aidevix.uz</a>`, { parse_mode: 'HTML' });

      const stats = await UserStats.findOne({ userId: user._id });
      const rankEmoji = { AMATEUR: '🥉', CANDIDATE: '🥈', JUNIOR: '🥇', MIDDLE: '⭐', SENIOR: '🌟', MASTER: '💎', LEGEND: '👑' };
      const level = stats?.level || 1;
      const progress = '▓'.repeat(Math.min(level % 10 || 1, 10)) + '░'.repeat(Math.max(0, 10 - (level % 10 || 1)));

      const msg =
        `📊 <b>Aidevix Dashboard | ${user.firstName || user.username}</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `👤 <b>Daraja:</b> ${rankEmoji[user.rankTitle] || '🏅'} ${user.rankTitle || 'AMATEUR'}\n` +
        `📈 <b>Level:</b> ${level} [${progress}]\n` +
        `⚡ <b>XP:</b> ${(user.xp || 0).toLocaleString()}\n\n` +
        `📝 <b>Aktivlik:</b>\n• Darslar: <b>${stats?.videosWatched || 0} ta</b>\n• Testlar: <b>${stats?.quizzesCompleted || 0} ta</b>\n🔥 <b>Streak:</b> ${user.streak || 0} kun`;

      await this.sendMessage(chatId, msg, { parse_mode: 'HTML' });
    } catch (e) { this.sendMessage(chatId, '❌ Xatolik yuz berdi.'); }
  }

  async _cmdReferral(chatId, userId) {
    try {
      const User = require('../models/User');
      const user = await User.findOne({ $or: [{ telegramUserId: String(userId) }] });
      if (!user) return this.sendMessage(chatId, "⚠️ Ro'yxatdan o'ting: aidevix.uz");

      const refLink = `${this._getFrontendUrl()}/register?ref=${user.referralCode || user._id}`;
      const msg = 
        `👥 <b>Aidevix Referal Dasturi</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `🏅 <b>Sizning holatingiz:</b>\n• Taklif qilinganlar: <b>${user.referralsCount || 0} ta</b>\n• Jami bonus: <b>${(user.referralsCount || 0) * 500} XP</b>\n\n` +
        `🔗 <b>Shaxsiy taklif havolangiz:</b>\n<code>${refLink}</code>`;

      await this.sendMessage(chatId, msg, { parse_mode: 'HTML' });
    } catch (e) {}
  }

  /** /help — Barcha buyruqlar */
  async _cmdHelp(chatId) {
    const msg =
      `📖 <b>Aidevix Bot Buyruqlari</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `🔹 /start — Boshlash\n` +
      `🔹 /stats — Statistikam\n` +
      `🔹 /referral — Taklifnomalar\n` +
      `🔹 /login — Tizimga kirish\n` +
      `🔹 /id — ID ko'rish\n\n` +
      `🌐 aidevix.uz | @aidevix`;
    await this.sendMessage(chatId, msg, { parse_mode: 'HTML' });
  }

  async _cmdLogin(chatId, userId) {
    try {
      const User = require('../models/User');
      const user = await User.findOne({ telegramUserId: String(userId) });
      if (!user) return this.sendMessage(chatId, "⚠️ Hisob topilmadi.");

      const jwt = require('jsonwebtoken');
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
      const loginLink = `${this._getFrontendUrl()}/auth/telegram-login?token=${token}`;

      const keyboard = { inline_keyboard: [[{ text: '🔓 Saytga kirish', url: loginLink }]] };
      await this.sendMessage(chatId, `🔐 <b>Magic Login</b>\n\nTugmani bosing va tizimga parolsiz kiring.`, { parse_mode: 'HTML', reply_markup: keyboard });
    } catch (e) {}
  }

  async _cmdPostNews(chatId, userId) {
    const adminId = (process.env.TELEGRAM_ADMIN_CHAT_ID || '697727022').trim();
    if (String(userId) !== adminId) return this.sendMessage(chatId, "⛔ Kirish taqiqlangan.");
    
    try {
      const { postNewsToChannel } = require('./newsScheduler');
      await this.sendMessage(chatId, "⏳ Yangiliklar yuborilmoqda...");
      await postNewsToChannel();
      await this.sendMessage(chatId, "✅ Muvaffaqiyatli yuborildi.");
    } catch (e) { this.sendMessage(chatId, "❌ Xatolik."); }
  }

  // ═══════════════════════════ NOTIFICATIONS ═══════════════════════════

  async sendCertificateNotification(chatId, cert) {
    const msg = `🎓 <b>Tabriklaymiz!</b>\n\nSiz <b>"${cert.courseName}"</b> kursini yakunladingiz va sertifikat oldingiz! 🏆\nKodi: <code>${cert.certificateCode}</code>`;
    await this.sendMessage(chatId, msg, { parse_mode: 'HTML' });

    const channel = process.env.TELEGRAM_CHANNEL_USERNAME;
    if (channel) {
      const cMsg = `🎉 <b>Yangi bitiruvchi!</b>\n\nO'quvchimiz <b>${cert.recipientName}</b> "${cert.courseName}" kursini tamomladi! 🥇\n🚀 O'rganishda davom eting: <a href="https://aidevix.uz">aidevix.uz</a>`;
      await this.sendMessage(channel.startsWith('@') ? channel : `@${channel}`, cMsg, { parse_mode: 'HTML' });
    }
  }

  // ═══════════════════════════ UTILS ═══════════════════════════

  _getFrontendUrl() {
    return (process.env.FRONTEND_URL || '').split(',')[0].trim() || 'https://aidevix.uz';
  }

  async sendMessage(chatId, text, opts = {}) {
    try { await axios.post(`${this.apiUrl}/sendMessage`, { chat_id: chatId, text, ...opts }); } catch (e) {}
  }

  async answerCallbackQuery(id, text) {
    try { await axios.post(`${this.apiUrl}/answerCallbackQuery`, { callback_query_id: id, text }); } catch (e) {}
  }
}

const initTelegramBot = () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  botInstance = new AidevixBot(token);
  botInstance.startPolling();
};

const getBot = () => botInstance;

module.exports = { initTelegramBot, getBot };
