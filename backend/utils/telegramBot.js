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
          params: { offset: this.offset, timeout: 30, allowed_updates: JSON.stringify(['message', 'callback_query', 'my_chat_member']) },
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

      const [cmd, ...args] = text.split(' ');
      switch (cmd) {
        case '/id': await this.sendMessage(chatId, `🆔 Sizning Telegram ID: <code>${userId}</code>`, { parse_mode: 'HTML' }); break;
        case '/login': await this._cmdLogin(chatId, userId, firstName); break;
        case '/stats': await this._cmdStats(chatId, userId, firstName); break;
        case '/referral': await this._cmdReferral(chatId, userId, firstName); break;
        case '/postnews': await this._cmdPostNews(chatId, userId); break;
        case '/channels': await this._cmdChannels(chatId, userId); break;
        case '/settopic':    await this._cmdSetTopic(chatId, userId, args); break;
        case '/settype':     await this._cmdSetType(chatId, userId, args); break;
        case '/setschedule': await this._cmdSetSchedule(chatId, userId, args); break;
        case '/help': await this._cmdHelp(chatId, firstName); break;
      }
    }

    // Bot kanal/guruhga admin qilingan yoki o'chirilgan
    if (update.my_chat_member) {
      await this._handleMyChatMember(update.my_chat_member);
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

  // ═══════════════════════════ CHANNEL AUTO-REGISTER ═══════════════════════════

  async _handleMyChatMember(update) {
    const { chat, new_chat_member } = update;
    const BotChannel = require('../models/BotChannel');
    const adminId = (process.env.TELEGRAM_ADMIN_CHAT_ID || '697727022').trim();

    const chatId   = String(chat.id);
    const username = chat.username ? `@${chat.username}` : null;
    const title    = chat.title || chat.username || 'Nomsiz';
    const type     = chat.type; // channel, supergroup, group

    const status = new_chat_member?.status;

    if (status === 'administrator') {
      // Bot admin qilindi → ro'yxatga qo'shish
      await BotChannel.findOneAndUpdate(
        { chatId },
        { chatId, username, title, type, isActive: true },
        { upsert: true, new: true }
      );
      console.log(`[Bot] Yangi kanal qo'shildi: ${title} (${chatId})`);

      // Adminga xabar
      await this.sendMessage(adminId,
        `✅ <b>Yangi kanal ro'yxatga qo'shildi!</b>\n\n` +
        `📢 <b>${title}</b>\n` +
        `🆔 ID: <code>${chatId}</code>\n` +
        `🔗 Username: ${username || 'Yo\'q (private)'}\n` +
        `📁 Turi: ${type}\n\n` +
        `Endi bu kanalga ham yangiliklar va challengelar yuboriladi.`,
        { parse_mode: 'HTML' }
      );
    } else if (['kicked', 'left', 'restricted'].includes(status)) {
      // Bot o'chirildi → deactivate
      await BotChannel.findOneAndUpdate({ chatId }, { isActive: false });
      console.log(`[Bot] Kanal o'chirildi: ${title} (${chatId})`);

      await this.sendMessage(adminId,
        `⚠️ <b>Kanal ro'yxatdan chiqdi</b>\n\n` +
        `📢 <b>${title}</b> (${chatId})\n` +
        `Sabab: Bot adminlikdan olib tashlandi.`,
        { parse_mode: 'HTML' }
      );
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

    const { tgChannelLink, igLink } = this._getLinks();
    const keyboard = {
      inline_keyboard: [
        [{ text: '🚀 Akademiyaga kirish', web_app: { url: frontendUrl } }],
        [{ text: '📊 Statistikam', callback_data: 'cb_get_stats' }, { text: '👥 Taklifnomalar', callback_data: 'cb_get_referral' }],
        [{ text: '📢 AI Kanal', url: tgChannelLink }, { text: '📸 Instagram', url: igLink }],
        [{ text: '🔐 Shaxsiy kabinet', callback_data: 'cb_magic_login' }],
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

  /** /channels — Admin: barcha ro'yxatdagi kanallar */
  async _cmdChannels(chatId, userId) {
    const adminId = (process.env.TELEGRAM_ADMIN_CHAT_ID || '697727022').trim();
    if (String(userId) !== adminId) return;

    try {
      const BotChannel = require('../models/BotChannel');
      const channels = await BotChannel.find().sort({ addedAt: -1 });

      if (channels.length === 0) {
        return this.sendMessage(chatId, '📭 Hali hech qanday kanal ro\'yxatda yo\'q.', { parse_mode: 'HTML' });
      }

      const list = channels.map((c, i) => {
        const status    = c.isActive ? '✅' : '❌';
        const topics    = (c.topics || ['all']).join(', ');
        const postTypes = (c.postTypes || ['all']).join(', ');
        const hours     = (c.scheduleHours?.length > 0 ? c.scheduleHours : [10, 16, 20]).map(h => `${h}:00`).join(', ');
        return `${i + 1}. ${status} <b>${c.title}</b>\n` +
               `   ID: <code>${c.chatId}</code> | ${c.username || 'private'} | ${c.type}\n` +
               `   📰 Mavzu: <code>${topics}</code> | 🎯 Post: <code>${postTypes}</code>\n` +
               `   🕐 Jadval: <code>${hours}</code> (Toshkent)`;
      }).join('\n\n');

      const active = channels.filter(c => c.isActive).length;
      await this.sendMessage(chatId,
        `📡 <b>Bot Kanallari Ro'yxati</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `Jami: ${channels.length} | Faol: ${active}\n\n` +
        list,
        { parse_mode: 'HTML' }
      );
    } catch (e) {
      this.sendMessage(chatId, '❌ Xatolik: ' + e.message);
    }
  }

  /**
   * /settopic [chatId|@username] [topics]
   * Mavzularni o'rnatish: claude,codex,cursor,general,all
   * Misol: /settopic @mychannel claude,cursor
   */
  async _cmdSetTopic(chatId, userId, args) {
    const adminId = (process.env.TELEGRAM_ADMIN_CHAT_ID || '697727022').trim();
    if (String(userId) !== adminId) return;

    if (args.length < 2) {
      return this.sendMessage(chatId,
        `⚠️ <b>Foydalanish:</b>\n` +
        `<code>/settopic [chatId yoki @username] [mavzular]</code>\n\n` +
        `<b>Mavzular:</b> claude, codex, cursor, general, all\n\n` +
        `<b>Misol:</b>\n` +
        `<code>/settopic @mychannel claude,cursor</code>\n` +
        `<code>/settopic -1001234567 all</code>`,
        { parse_mode: 'HTML' }
      );
    }

    const [targetId, topicsStr] = args;
    const VALID_TOPICS = ['claude', 'codex', 'cursor', 'general', 'all'];
    const topics = topicsStr.split(',').map(t => t.trim().toLowerCase()).filter(t => VALID_TOPICS.includes(t));

    if (topics.length === 0) {
      return this.sendMessage(chatId,
        `❌ Noto'g'ri mavzular: <code>${topicsStr}</code>\n` +
        `Ruxsat etilgan: claude, codex, cursor, general, all`,
        { parse_mode: 'HTML' }
      );
    }

    try {
      const BotChannel = require('../models/BotChannel');
      const channel = await BotChannel.findOneAndUpdate(
        { $or: [{ chatId: targetId }, { username: targetId }, { username: targetId.startsWith('@') ? targetId : `@${targetId}` }] },
        { topics },
        { new: true }
      );

      if (!channel) {
        return this.sendMessage(chatId,
          `❌ Kanal topilmadi: <code>${targetId}</code>\n` +
          `Avval botni admin qiling va /channels buyrug'ini tekshiring.`,
          { parse_mode: 'HTML' }
        );
      }

      await this.sendMessage(chatId,
        `✅ <b>${channel.title}</b> mavzulari yangilandi!\n\n` +
        `📰 Yangi mavzular: <code>${topics.join(', ')}</code>\n` +
        `🆔 ID: <code>${channel.chatId}</code>`,
        { parse_mode: 'HTML' }
      );
    } catch (e) {
      this.sendMessage(chatId, '❌ Xatolik: ' + e.message);
    }
  }

  /**
   * /settype [chatId|@username] [types]
   * Post turlarini o'rnatish: news,challenges,all
   * Misol: /settype @mychannel news
   */
  async _cmdSetType(chatId, userId, args) {
    const adminId = (process.env.TELEGRAM_ADMIN_CHAT_ID || '697727022').trim();
    if (String(userId) !== adminId) return;

    if (args.length < 2) {
      return this.sendMessage(chatId,
        `⚠️ <b>Foydalanish:</b>\n` +
        `<code>/settype [chatId yoki @username] [turlar]</code>\n\n` +
        `<b>Turlar:</b> news, challenges, all\n\n` +
        `<b>Misol:</b>\n` +
        `<code>/settype @mychannel news</code>\n` +
        `<code>/settype -1001234567 news,challenges</code>`,
        { parse_mode: 'HTML' }
      );
    }

    const [targetId, typesStr] = args;
    const VALID_TYPES = ['news', 'challenges', 'all'];
    const postTypes = typesStr.split(',').map(t => t.trim().toLowerCase()).filter(t => VALID_TYPES.includes(t));

    if (postTypes.length === 0) {
      return this.sendMessage(chatId,
        `❌ Noto'g'ri turlar: <code>${typesStr}</code>\n` +
        `Ruxsat etilgan: news, challenges, all`,
        { parse_mode: 'HTML' }
      );
    }

    try {
      const BotChannel = require('../models/BotChannel');
      const channel = await BotChannel.findOneAndUpdate(
        { $or: [{ chatId: targetId }, { username: targetId }, { username: targetId.startsWith('@') ? targetId : `@${targetId}` }] },
        { postTypes },
        { new: true }
      );

      if (!channel) {
        return this.sendMessage(chatId,
          `❌ Kanal topilmadi: <code>${targetId}</code>\n` +
          `Avval botni admin qiling va /channels buyrug'ini tekshiring.`,
          { parse_mode: 'HTML' }
        );
      }

      await this.sendMessage(chatId,
        `✅ <b>${channel.title}</b> post turlari yangilandi!\n\n` +
        `🎯 Yangi turlar: <code>${postTypes.join(', ')}</code>\n` +
        `🆔 ID: <code>${channel.chatId}</code>`,
        { parse_mode: 'HTML' }
      );
    } catch (e) {
      this.sendMessage(chatId, '❌ Xatolik: ' + e.message);
    }
  }

  /**
   * /setschedule [chatId|@username] [soatlar]
   * News yuborish vaqtini (Toshkent) o'rnatish
   * Misol: /setschedule @mychannel 9,18      → kuniga 2 marta
   *        /setschedule @mychannel 10,16,20  → kuniga 3 marta (default)
   *        /setschedule @mychannel 12        → kuniga 1 marta
   */
  async _cmdSetSchedule(chatId, userId, args) {
    const adminId = (process.env.TELEGRAM_ADMIN_CHAT_ID || '697727022').trim();
    if (String(userId) !== adminId) return;

    if (args.length < 2) {
      return this.sendMessage(chatId,
        `⚠️ <b>Foydalanish:</b>\n` +
        `<code>/setschedule [chatId yoki @username] [soatlar]</code>\n\n` +
        `<b>Soatlar:</b> Toshkent vaqti (0-23), vergul bilan ajrating\n` +
        `<b>Limit:</b> 1 dan 6 tagacha soat\n\n` +
        `<b>Misollar:</b>\n` +
        `<code>/setschedule @mychannel 10,16,20</code>  → 3 marta/kun\n` +
        `<code>/setschedule @mychannel 9,18</code>       → 2 marta/kun\n` +
        `<code>/setschedule @mychannel 12</code>         → 1 marta/kun`,
        { parse_mode: 'HTML' }
      );
    }

    const [targetId, hoursStr] = args;
    const parsed = hoursStr.split(',').map(h => parseInt(h.trim(), 10));
    const scheduleHours = [...new Set(parsed)].filter(h => Number.isInteger(h) && h >= 0 && h <= 23).sort((a, b) => a - b);

    if (scheduleHours.length === 0) {
      return this.sendMessage(chatId,
        `❌ Noto'g'ri soatlar: <code>${hoursStr}</code>\n` +
        `Misol: <code>10,16,20</code>`,
        { parse_mode: 'HTML' }
      );
    }

    if (scheduleHours.length > 6) {
      return this.sendMessage(chatId, `❌ Maksimal 6 ta soat belgilash mumkin.`, { parse_mode: 'HTML' });
    }

    try {
      const BotChannel = require('../models/BotChannel');
      const channel = await BotChannel.findOneAndUpdate(
        {
          $or: [
            { chatId: targetId },
            { username: targetId },
            { username: targetId.startsWith('@') ? targetId : `@${targetId}` },
          ],
        },
        { scheduleHours },
        { new: true }
      );

      if (!channel) {
        return this.sendMessage(chatId,
          `❌ Kanal topilmadi: <code>${targetId}</code>\n` +
          `Avval botni admin qiling va /channels buyrug'ini tekshiring.`,
          { parse_mode: 'HTML' }
        );
      }

      const formatted = scheduleHours.map(h => `${h}:00`).join(', ');
      await this.sendMessage(chatId,
        `✅ <b>${channel.title}</b> jadvali yangilandi!\n\n` +
        `🕐 Yangi jadval: <code>${formatted}</code> (Toshkent)\n` +
        `📅 Kuniga: <b>${scheduleHours.length} ta</b> post\n` +
        `🆔 ID: <code>${channel.chatId}</code>`,
        { parse_mode: 'HTML' }
      );
    } catch (e) {
      this.sendMessage(chatId, '❌ Xatolik: ' + e.message);
    }
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
      `👑 <b>Admin buyruqlari:</b>\n` +
      `🔹 /postnews — Yangilik yuborish\n` +
      `🔹 /channels — Kanallar ro'yxati\n` +
      `🔹 /settopic [@kanal] [mavzular] — Mavzu sozlash\n` +
      `   claude | codex | cursor | general | all\n` +
      `🔹 /settype [@kanal] [turlar] — Post turi sozlash\n` +
      `   news | challenges | all\n` +
      `🔹 /setschedule [@kanal] [soatlar] — Jadval sozlash\n` +
      `   Misol: 10,16,20 (3 marta) | 9,18 (2 marta) | 12 (1 marta)\n\n` +
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

  _getLinks() {
    const tgChannel     = process.env.TELEGRAM_CHANNEL_USERNAME || 'aidevix';
    const tgChannelLink = `https://t.me/${tgChannel.replace('@', '')}`;
    const igLink        = process.env.INSTAGRAM_URL || 'https://instagram.com/aidevix.uz';
    const siteLink      = process.env.SITE_URL || 'https://aidevix.uz';
    return { tgChannel: tgChannel.replace('@', ''), tgChannelLink, igLink, siteLink };
  }

  async sendCertificateNotification(chatId, cert) {
    const { tgChannel, tgChannelLink, siteLink } = this._getLinks();

    // Foydalanuvchiga shaxsiy xabar
    const userMsg =
      `🎓 <b>Tabriklaymiz!</b>\n\n` +
      `Siz <b>"${cert.courseName}"</b> kursini yakunladingiz!\n` +
      `Sertifikat kodi: <code>${cert.certificateCode}</code>\n\n` +
      `📢 Kanalimizga obuna bo'lib yangiliklar oling: <a href="${tgChannelLink}">@${tgChannel}</a>`;
    await this.sendMessage(chatId, userMsg, { parse_mode: 'HTML' });

    // Barcha faol kanallarga e'lon
    try {
      const BotChannel = require('../models/BotChannel');
      const dbChannels = await BotChannel.find({ isActive: true });
      const extraChannels = dbChannels.map(c => c.chatId);
      const mainCh = process.env.TELEGRAM_CHANNEL_USERNAME;
      if (mainCh) {
        const mainId = mainCh.startsWith('@') ? mainCh : `@${mainCh}`;
        if (!extraChannels.includes(mainId)) extraChannels.unshift(mainId);
      }

      const { igLink } = this._getLinks();
      const cMsg =
        `🎉 <b>Yangi bitiruvchi!</b>\n\n` +
        `O'quvchimiz <b>${cert.recipientName}</b>\n` +
        `"${cert.courseName}" kursini muvaffaqiyatli tamomladi! 🏆\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `<b>Aidevix</b> — AI & Dasturlash O'quv Platformasi 🇺🇿\n\n` +
        `📢 Kanal: <a href="${tgChannelLink}">@${tgChannel}</a>\n` +
        `📸 Instagram: <a href="${igLink}">@aidevix.uz</a>\n` +
        `🌐 Sayt: <a href="${siteLink}">aidevix.uz</a>`;

      const keyboard = {
        inline_keyboard: [
          [{ text: '🎓 Men ham o\'qimoqchiman!', url: siteLink }],
          [
            { text: '📢 Kanalga obuna', url: tgChannelLink },
            { text: '📸 Instagram', url: igLink },
          ],
        ],
      };

      for (const chId of extraChannels) {
        try { await this.sendMessage(chId, cMsg, { parse_mode: 'HTML', reply_markup: keyboard }); } catch {}
      }
    } catch {}
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
