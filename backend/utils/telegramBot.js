const axios = require('axios');

/**
 * ═══════════════════════════════════════════════════════════════════
 * AIDEVIX TELEGRAM BOT — Professional Long-Polling Implementation
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Funksiyalar:
 *  1. /start, /id — Foydalanuvchiga ID va xush kelibsiz xabari
 *  2. /login       — Magic Login (parolsiz tizimga kirish)
 *  3. /help        — Barcha buyruqlar ro'yxati
 *  4. Admin bildirishnomalar (yangi to'lov, yangi ro'yxatdan o'tish)
 *  5. Haftalik TOP o'quvchilarni kanalga e'lon qilish (Cron)
 *  6. Sertifikat PDF ni foydalanuvchiga yuborish
 */

let botInstance = null; // Singleton

class AidevixBot {
  constructor(token) {
    this.token = token;
    this.apiUrl = `https://api.telegram.org/bot${token}`;
    this.offset = 0;
    this.isPolling = false;
  }

  // ═══════════════════════════════ POLLING ═══════════════════════════════
  async startPolling() {
    if (this.isPolling) return;
    this.isPolling = true;
    console.log('🤖 Aidevix Telegram Bot ishga tushdi (polling)...');
    this._poll();
  }

  async _poll() {
    if (!this.isPolling) return;
    try {
      const response = await axios.get(`${this.apiUrl}/getUpdates`, {
        params: { offset: this.offset, timeout: 30 },
        timeout: 35000,
      });
      if (response.data?.ok) {
        for (const update of response.data.result) {
          this.offset = update.update_id + 1;
          this._handleUpdate(update).catch(err =>
            console.error('Bot update handler error:', err.message)
          );
        }
      }
    } catch (error) {
      if (error.code !== 'ECONNABORTED' && !error.message?.includes('timeout')) {
        console.error('Bot polling error:', error.message);
      }
    }
    if (this.isPolling) setTimeout(() => this._poll(), 500);
  }

  // ═══════════════════════════ UPDATE HANDLER ═══════════════════════════
  async _handleUpdate(update) {
    // Oddiy xabar (command)
    if (update.message?.text) {
      const text = update.message.text.trim();
      const chatId = update.message.chat.id;
      const userId = update.message.from.id;
      const firstName = update.message.from.first_name || 'Foydalanuvchi';
      const username = update.message.from.username || null;

      if (text.startsWith('/start')) {
        const parts = text.split(' ');
        if (parts.length > 1 && parts[1]) {
          return this._handleVerifyToken(chatId, userId, username, parts[1]);
        }
        return this._cmdStart(chatId, userId, firstName, username);
      }
      if (text.startsWith('/id'))     return this._cmdId(chatId, userId, firstName);
      if (text.startsWith('/login'))  return this._cmdLogin(chatId, userId, firstName);
      if (text.startsWith('/help'))   return this._cmdHelp(chatId, firstName);
      if (text.startsWith('/stats'))  return this._cmdStats(chatId, userId, firstName);
    }
    // Callback query (inline tugma bosilganda)
    if (update.callback_query) {
      return this._handleCallback(update.callback_query);
    }
  }

  // ═══════════════════════════ BUYRUQLAR ═══════════════════════════════

  /** /start — Xush kelibsiz xabari */
  async _cmdStart(chatId, userId, firstName, username) {
    const frontendUrl = this._getFrontendUrl();
    const msg =
      `🚀 <b>Aidevix IT-Ta'lim Platformasi</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `👋 Salom, <b>${firstName}</b>!\n\n` +
      `Aidevix — <b>bepul va sifatli</b> IT kurslar platformasi.\n` +
      `Bizda <b>React, Node.js, AI, Telegram Mini App</b> va boshqa texnologiyalar bo'yicha professional darslar mavjud.\n\n` +
      `🔑 <b>Sizning ID raqamingiz:</b>\n` +
      `┌─────────────────────┐\n` +
      `│  <code>${userId}</code>\n` +
      `└─────────────────────┘\n\n` +
      `<i>Yuqoridagi raqamni saytdagi obuna tasdiqlash sahifasiga kiriting.</i>\n\n` +
      `📋 <b>Buyruqlar:</b>\n` +
      `/id — ID raqamni ko'rish\n` +
      `/login — Parolsiz saytga kirish\n` +
      `/stats — O'z statistikangiz\n` +
      `/help — Yordam`;

    const keyboard = {
      inline_keyboard: [
        [{ text: '🌐 Platformaga kirish', web_app: { url: frontendUrl } }],
        [
          { text: '🆔 ID raqam', callback_data: 'cb_get_id' },
          { text: '🔐 Tizimga kirish', callback_data: 'cb_magic_login' },
        ],
        [
          { text: '📢 Kanal', url: 'https://t.me/aidevix' },
          { text: '📸 Instagram', url: 'https://instagram.com/aidevix' },
        ],
      ],
    };

    await this.sendMessage(chatId, msg, { parse_mode: 'HTML', reply_markup: keyboard });
  }

  /** /start token — Avtomatik bog'lash */
  async _handleVerifyToken(chatId, userId, username, token) {
    try {
      const { linkTelegramByToken } = require('../controllers/subscriptionController');
      const success = await linkTelegramByToken(token, userId, username);

      if (success) {
        const msg = 
          `✅ <b>Muvaffaqiyat!</b>\n\n` +
          `Sizning Telegram hisobingiz platformaga muvaffaqiyatli bog'landi.\n\n` +
          `📢 <b>Endi quyidagi kanalga obuna bo'lganingizni tekshiring:</b>\n` +
          `@${process.env.TELEGRAM_CHANNEL_USERNAME || 'aidevix'}\n\n` +
          `<i>Saytga qayting, tizim avtomatik sizni darslarga yuboradi.</i>`;
        
        const keyboard = {
          inline_keyboard: [[{ text: '📢 Kanalga o\'tish', url: `https://t.me/${process.env.TELEGRAM_CHANNEL_USERNAME || 'aidevix'}` }]]
        };
        await this.sendMessage(chatId, msg, { parse_mode: 'HTML', reply_markup: keyboard });
      } else {
        await this.sendMessage(chatId, `❌ <b>Xatolik!</b>\n\nToken noto'g'ri yoki allaqachon ishlatilgan. Saytdan qaytadan urinib ko'ring.`, { parse_mode: 'HTML' });
      }
    } catch (error) {
      console.error('Bot verify token error:', error.message);
      await this.sendMessage(chatId, `❌ Bog'lashda ichki xatolik yuz berdi.`);
    }
  }

  /** /id — Faqat ID raqam ko'rsatish */
  async _cmdId(chatId, userId, firstName) {
    const msg =
      `🆔 <b>${firstName}</b>, sizning Telegram ID raqamingiz:\n\n` +
      `<code>${userId}</code>\n\n` +
      `<i>Tap qilb nusxalang va saytga kiriting.</i>`;
    await this.sendMessage(chatId, msg, { parse_mode: 'HTML' });
  }

  /** /login — Magic Login (parolsiz kirish) */
  async _cmdLogin(chatId, userId, firstName) {
    try {
      const User = require('../models/User');
      const { generateAccessToken, generateRefreshToken } = require('./jwt');
      const { hashToken } = require('./authSecurity');

      // telegramUserId yoki telegramChatId bo'yicha foydalanuvchini topish
      const user = await User.findOne({
        $or: [
          { telegramUserId: String(userId) },
          { telegramChatId: String(userId) },
          { 'socialSubscriptions.telegram.telegramUserId': String(userId) },
        ],
      });

      if (!user) {
        const msg =
          `⚠️ <b>${firstName}</b>, sizning Telegram ID'ngiz platformada topilmadi.\n\n` +
          `<b>Qanday qilish kerak:</b>\n` +
          `1️⃣ Avval saytda ro'yxatdan o'ting\n` +
          `2️⃣ Obuna sahifasida Telegram ID ni kiriting\n` +
          `3️⃣ Keyin /login buyrug'idan foydalaning\n\n` +
          `<i>Saytda ro'yxatdan o'tish uchun quyidagi tugmani bosing:</i>`;

        const keyboard = {
          inline_keyboard: [
            [{ text: '📝 Ro\'yxatdan o\'tish', web_app: { url: this._getFrontendUrl() + '/register' } }],
          ],
        };
        return this.sendMessage(chatId, msg, { parse_mode: 'HTML', reply_markup: keyboard });
      }

      // Token yaratish
      const accessToken = generateAccessToken({ userId: user._id });
      const refreshToken = generateRefreshToken({ userId: user._id });
      user.refreshToken = hashToken(refreshToken);
      user.lastLogin = new Date();
      await user.save();

      const frontendUrl = this._getFrontendUrl();
      const loginLink = `${frontendUrl}/auth/telegram-login?token=${accessToken}`;

      const msg =
        `✅ <b>Muvaffaqiyat!</b>\n\n` +
        `👤 <b>${user.firstName || user.username}</b>, siz tizimga parolsiz kirishingiz mumkin!\n\n` +
        `🔒 Quyidagi tugmani bosing va saytga kirish avtomatik amalga oshadi.\n\n` +
        `⏰ <i>Havola 15 daqiqa amal qiladi.</i>`;

      const keyboard = {
        inline_keyboard: [
          [{ text: '🔓 Saytga kirish →', url: loginLink }],
        ],
      };
      await this.sendMessage(chatId, msg, { parse_mode: 'HTML', reply_markup: keyboard });
    } catch (error) {
      console.error('Magic login error:', error.message);
      await this.sendMessage(chatId,
        `❌ Tizimga kirishda xatolik yuz berdi. Iltimos, keyinroq urunib ko'ring.`
      );
    }
  }

  /** /help — Barcha buyruqlar */
  async _cmdHelp(chatId, firstName) {
    const msg =
      `📖 <b>Aidevix Bot Buyruqlari</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `🔹 /start — Boshlash va ID olish\n` +
      `🔹 /id — Telegram ID raqamni ko'rish\n` +
      `🔹 /login — Parolsiz saytga kirish\n` +
      `🔹 /stats — O'z statistikangiz\n` +
      `🔹 /help — Ushbu yordam\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🌐 <b>Sayt:</b> aidevix.uz\n` +
      `📢 <b>Kanal:</b> @aidevix\n` +
      `📸 <b>Instagram:</b> @aidevix\n\n` +
      `<i>Savollaringiz bo'lsa, admin @sunnatbee ga yozing.</i>`;

    await this.sendMessage(chatId, msg, { parse_mode: 'HTML' });
  }

  /** /stats — Foydalanuvchi statistikasi */
  async _cmdStats(chatId, userId, firstName) {
    try {
      const User = require('../models/User');
      const UserStats = require('../models/UserStats');

      const user = await User.findOne({
        $or: [
          { telegramUserId: String(userId) },
          { telegramChatId: String(userId) },
          { 'socialSubscriptions.telegram.telegramUserId': String(userId) },
        ],
      });

      if (!user) {
        return this.sendMessage(chatId,
          `⚠️ <b>${firstName}</b>, sizning hisobingiz platformada topilmadi.\nAvval saytda ro'yxatdan o'ting va Telegram ID ni kiriting.`,
          { parse_mode: 'HTML' }
        );
      }

      const stats = await UserStats.findOne({ userId: user._id });

      const rankEmoji = {
        AMATEUR: '🥉', CANDIDATE: '🥈', JUNIOR: '🥇',
        MIDDLE: '⭐', SENIOR: '🌟', MASTER: '💎', LEGEND: '👑',
      };

      const msg =
        `📊 <b>${user.firstName || user.username} — Statistika</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `${rankEmoji[user.rankTitle] || '🏅'} <b>Rank:</b> ${user.rankTitle || 'AMATEUR'}\n` +
        `⚡ <b>XP:</b> ${(user.xp || 0).toLocaleString()}\n` +
        `🔥 <b>Streak:</b> ${user.streak || 0} kun\n` +
        `📺 <b>Ko'rilgan videolar:</b> ${stats?.videosWatched || 0}\n` +
        `🧩 <b>Yechilgan testlar:</b> ${stats?.quizzesCompleted || 0}\n` +
        `📈 <b>Level:</b> ${stats?.level || 1}\n` +
        `🏆 <b>Badges:</b> ${stats?.badges?.length || 0} ta\n` +
        `👥 <b>Referrallar:</b> ${user.referralsCount || 0} ta\n\n` +
        `<i>Kurslarni ko'rib, XP yig'ishda davom eting! 🚀</i>`;

      await this.sendMessage(chatId, msg, { parse_mode: 'HTML' });
    } catch (error) {
      console.error('Stats error:', error.message);
      await this.sendMessage(chatId, `❌ Statistikani olishda xatolik yuz berdi.`);
    }
  }

  // ═══════════════════════════ CALLBACK HANDLER ═══════════════════════════

  async _handleCallback(query) {
    const userId = query.from.id;
    const chatId = query.message?.chat?.id;
    const firstName = query.from.first_name || 'Foydalanuvchi';

    switch (query.data) {
      case 'cb_get_id':
        await this.answerCallbackQuery(query.id,
          `🆔 Sizning ID: ${userId}\n\nSaytdagi "Telegram ID" maydoniga yozing.`, true);
        break;
      case 'cb_magic_login':
        await this.answerCallbackQuery(query.id, '🔐 Tizimga kirilmoqda...', false);
        if (chatId) await this._cmdLogin(chatId, userId, firstName);
        break;
      default:
        await this.answerCallbackQuery(query.id, 'Noma\'lum buyruq', false);
    }
  }

  // ═══════════════════════════ ADMIN BILDIRISHNOMALAR ═══════════════════════════

  /**
   * Adminlarga xabar yuborish (yangi to'lov, ro'yxatdan o'tish va h.k.)
   * @param {string} message - HTML formatdagi xabar
   */
  async notifyAdmins(message) {
    try {
      const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
      if (!adminChatId) return;
      await this.sendMessage(adminChatId, message, { parse_mode: 'HTML' });
    } catch (error) {
      console.error('Admin notification error:', error.message);
    }
  }

  /** Yangi ro'yxatdan o'tish xabari */
  async notifyNewRegistration(user) {
    const msg =
      `👤 <b>YANGI RO'YXATDAN O'TISH</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `📛 <b>Ism:</b> ${user.firstName || '—'} ${user.lastName || ''}\n` +
      `👤 <b>Username:</b> @${user.username}\n` +
      `📧 <b>Email:</b> ${user.email}\n` +
      `🔗 <b>Referral:</b> ${user.referredBy ? '✅ Ha' : '❌ Yo\'q'}\n` +
      `📅 <b>Sana:</b> ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}\n\n` +
      `#yangi_foydalanuvchi`;
    await this.notifyAdmins(msg);
  }

  /** Yangi to'lov xabari */
  async notifyNewPayment(payment, user, course) {
    const providerEmoji = payment.provider === 'payme' ? '💳' : '📱';
    const msg =
      `${providerEmoji} <b>YANGI TO'LOV!</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `👤 <b>Kim:</b> ${user.firstName || user.username}\n` +
      `📚 <b>Kurs:</b> ${course.title}\n` +
      `💰 <b>Summa:</b> ${payment.amount.toLocaleString()} so'm\n` +
      `🏦 <b>Tizim:</b> ${payment.provider.toUpperCase()}\n` +
      `📅 <b>Sana:</b> ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}\n\n` +
      `#tolov #${payment.provider}`;
    await this.notifyAdmins(msg);
  }

  /** Yangi obuna tasdiqlash xabari */
  async notifySubscriptionVerified(user, platform) {
    const emoji = platform === 'telegram' ? '✈️' : '📸';
    const msg =
      `${emoji} <b>OBUNA TASDIQLANDI</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `👤 <b>Kim:</b> ${user.firstName || user.username}\n` +
      `📱 <b>Platform:</b> ${platform.toUpperCase()}\n` +
      `📅 <b>Sana:</b> ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}\n\n` +
      `#obuna #${platform}`;
    await this.notifyAdmins(msg);
  }

  // ═══════════════════════════ SERTIFIKAT YUBORISH ═══════════════════════════

  /**
   * Foydalanuvchiga sertifikat haqida Telegram orqali xabar yuborish
   * @param {string} telegramUserId - Telegram user ID
   * @param {object} cert - Certificate object
   */
  async sendCertificateNotification(telegramUserId, cert) {
    if (!telegramUserId) return;
    try {
      const msg =
        `🎓 <b>TABRIKLAYMIZ!</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `🏆 Siz <b>"${cert.courseName}"</b> kursini muvaffaqiyatli tugatdingiz!\n\n` +
        `📜 <b>Sertifikat kodi:</b> <code>${cert.certificateCode}</code>\n` +
        `👤 <b>Ism:</b> ${cert.recipientName}\n` +
        `📅 <b>Sana:</b> ${new Date(cert.issuedAt).toLocaleDateString('uz-UZ')}\n\n` +
        `<i>Sertifikatingizni saytdan yuklab olishingiz mumkin.</i>`;

      const keyboard = {
        inline_keyboard: [
          [{ text: '📥 Sertifikatni yuklab olish', web_app: { url: `${this._getFrontendUrl()}/profile` } }],
          [{ text: '🔗 Sertifikatni tekshirish', url: `${this._getFrontendUrl()}/certificates/verify/${cert.certificateCode}` }],
        ],
      };
      await this.sendMessage(telegramUserId, msg, { parse_mode: 'HTML', reply_markup: keyboard });
    } catch (error) {
      console.error('Certificate notification error:', error.message);
    }
  }

  // ═══════════════════════════ HAFTALIK TOP POST ═══════════════════════════

  /**
   * Haftalik TOP o'quvchilarni kanalga post qilish
   * Har yakshanba soat 20:00 da chaqiriladi (cron orqali)
   */
  async postWeeklyLeaderboard() {
    try {
      const channelUsername = process.env.TELEGRAM_CHANNEL_USERNAME;
      if (!channelUsername) return;

      const UserStats = require('../models/UserStats');
      const top = await UserStats.find({ weeklyXp: { $gt: 0 } })
        .sort({ weeklyXp: -1 })
        .limit(10)
        .populate('userId', 'username firstName')
        .lean();

      if (top.length === 0) return;

      const medals = ['🥇', '🥈', '🥉'];
      let leaderboard = '';
      for (let i = 0; i < top.length; i++) {
        const u = top[i];
        const name = u.userId?.firstName || u.userId?.username || 'Anonim';
        const medal = medals[i] || `${i + 1}.`;
        leaderboard += `${medal} <b>${name}</b> — ${u.weeklyXp.toLocaleString()} XP\n`;
      }

      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - 7);

      const msg =
        `🏆 <b>HAFTALIK TOP O'QUVCHILAR</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📅 ${weekStart.toLocaleDateString('uz-UZ')} — ${now.toLocaleDateString('uz-UZ')}\n\n` +
        `${leaderboard}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `🚀 <b>Aidevix</b> platformasida bepul kurslarni o'rganing va reytingda yuqoriga chiqing!\n\n` +
        `🔗 <b>aidevix.uz</b> | @aidevix_bot\n\n` +
        `#haftalik_reyting #aidevix #top`;

      await this.sendMessage(`@${channelUsername}`, msg, { parse_mode: 'HTML' });
      console.log('✅ Haftalik TOP kanalga yuborildi');
    } catch (error) {
      console.error('Weekly leaderboard error:', error.message);
    }
  }

  // ═══════════════════════════ YORDAMCHI METODLAR ═══════════════════════════

  _getFrontendUrl() {
    const urls = (process.env.FRONTEND_URL || '').split(',').map(u => u.trim());
    return urls.find(u => u.startsWith('https://')) || 'https://aidevix.uz';
  }

  async sendMessage(chatId, text, options = {}) {
    try {
      await axios.post(`${this.apiUrl}/sendMessage`, {
        chat_id: chatId,
        text,
        ...options,
      });
    } catch (error) {
      console.error('Send message error:', error.message);
    }
  }

  async answerCallbackQuery(callbackQueryId, text, showAlert = false) {
    try {
      await axios.post(`${this.apiUrl}/answerCallbackQuery`, {
        callback_query_id: callbackQueryId,
        text,
        show_alert: showAlert,
      });
    } catch (error) {
      console.error('Answer callback error:', error.message);
    }
  }

  async sendDocument(chatId, fileUrl, caption = '') {
    try {
      await axios.post(`${this.apiUrl}/sendDocument`, {
        chat_id: chatId,
        document: fileUrl,
        caption,
        parse_mode: 'HTML',
      });
    } catch (error) {
      console.error('Send document error:', error.message);
    }
  }
}

// ═══════════════════════════ HAFTALIK CRON ═══════════════════════════

function startWeeklyCron(bot) {
  // Har soatda tekshiramiz, Yakshanba 20:00 (Toshkent vaqti) bo'lsa post qilamiz
  setInterval(async () => {
    const now = new Date();
    // UTC+5 (Toshkent) uchun offset
    const tashkentHour = (now.getUTCHours() + 5) % 24;
    const dayOfWeek = now.getUTCDay(); // 0 = Yakshanba

    // Yakshanba, soat 20:00-20:59 (Toshkent vaqtida)
    if (dayOfWeek === 0 && tashkentHour === 20) {
      await bot.postWeeklyLeaderboard();
    }
  }, 60 * 60 * 1000); // Har 1 soatda tekshirish
}

// ═══════════════════════════ INIT ═══════════════════════════

const initTelegramBot = () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn('⚠️ TELEGRAM_BOT_TOKEN topilmadi. Telegram bot ishga tushmaydi.');
    return;
  }

  const bot = new AidevixBot(token);
  botInstance = bot;
  bot.startPolling().catch(err => console.error('Bot polling startup error:', err));
  startWeeklyCron(bot);
};

/**
 * Bot instansiyasini olish (boshqa kontrollerlardan foydalanish uchun)
 * @returns {AidevixBot|null}
 */
const getBot = () => botInstance;

module.exports = { initTelegramBot, getBot };
