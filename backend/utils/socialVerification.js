const axios = require('axios');

// ─── Telegram Bot API bilan ishlash uchun yordamchi ───────────────────────────

const VALID_MEMBER_STATUSES = ['member', 'administrator', 'creator'];

/**
 * Telegram Bot API orqali foydalanuvchi kanalda a'zo ekanligini tekshiradi.
 * @param {string} botToken
 * @param {string} chatId   — "@username" yoki numeric "-100..."
 * @param {string|number} userId
 * @returns {Promise<{isMember: boolean, status: string|null}>}
 */
const getChatMemberStatus = async (botToken, chatId, userId) => {
  const { data } = await axios.get(
    `https://api.telegram.org/bot${botToken}/getChatMember`,
    {
      params: { chat_id: chatId, user_id: userId },
      timeout: 10000,
    }
  );

  const status = data.result?.status || null;
  return {
    isMember: VALID_MEMBER_STATUSES.includes(status),
    status,
  };
};

// ─── Instagram ────────────────────────────────────────────────────────────────

/**
 * Instagram obunasini soft-verify qilish.
 * Instagram API cheklovlari sababli haqiqiy tekshiruv imkonsiz —
 * username berilsa, tasdiqlanadi va admin audit uchun metadata saqlanadi.
 */
const verifyInstagramSubscription = async (username, userId) => {
  if (!username || username.trim().length < 3) {
    return { subscribed: false, username: null, verifiedAt: null };
  }

  return {
    subscribed: true,
    username: username.trim().toLowerCase(),
    verifiedAt: new Date(),
    verificationSource: 'soft_check',
  };
};

/**
 * Instagram real-time tekshiruvi (soft-check — har doim true).
 */
const checkInstagramSubscriptionRealTime = async (username) => {
  return !!username;
};

// ─── Telegram ─────────────────────────────────────────────────────────────────

/**
 * Telegram obunasini birinchi marta verify qilish (bitta kanal).
 * Foydalanuvchi ro'yxatdan o'tganda yoki verify-telegram endpoint chaqirilganda.
 */
const verifyTelegramSubscription = async (telegramUsername, telegramUserId, channelUsername) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.warn('[TG Verify] TELEGRAM_BOT_TOKEN sozlanmagan');
    return { subscribed: false, username: telegramUsername, verifiedAt: null };
  }

  const channel = channelUsername || process.env.TELEGRAM_CHANNEL_USERNAME;
  if (!channel) {
    console.warn('[TG Verify] TELEGRAM_CHANNEL_USERNAME sozlanmagan');
    return { subscribed: false, username: telegramUsername, verifiedAt: null };
  }

  try {
    const chatId = /^-?\d+$/.test(channel) ? channel : `@${channel}`;
    const { isMember } = await getChatMemberStatus(botToken, chatId, telegramUserId);

    return {
      subscribed: isMember,
      username: telegramUsername,
      verifiedAt: isMember ? new Date() : null,
    };
  } catch (error) {
    console.error('[TG Verify] Xatolik:', error.message);
    return { subscribed: false, username: telegramUsername, verifiedAt: null };
  }
};

/**
 * Real-time Telegram subscription check (bitta kanal, boolean).
 * Video access oldidan chaqiriladi.
 */
const checkTelegramSubscriptionRealTime = async (telegramUserId, channelUsername) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return false;

  try {
    const chatId = /^-?\d+$/.test(channelUsername) ? channelUsername : `@${channelUsername}`;
    const { isMember } = await getChatMemberStatus(botToken, chatId, telegramUserId);
    return isMember;
  } catch {
    return false;
  }
};

/**
 * Telegram obunasini public kanal uchun real-time tekshirish.
 *
 * API xato va "not subscribed" ni aniq farqlaydi:
 *   checked = true  → API javob berdi, natija ishonchli
 *   checked = false → API xato (network/timeout), DB fallback kerak
 *
 * @param {string|number} telegramUserId
 * @returns {Promise<{subscribed: boolean, checked: boolean}>}
 */
const checkTelegramSubscription = async (telegramUserId) => {
  if (!telegramUserId) return { subscribed: false, checked: false };

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.warn('[TG Check] TELEGRAM_BOT_TOKEN sozlanmagan');
    return { subscribed: false, checked: false };
  }

  const channel = process.env.TELEGRAM_CHANNEL_USERNAME;
  if (!channel) {
    console.warn('[TG Check] TELEGRAM_CHANNEL_USERNAME sozlanmagan');
    return { subscribed: false, checked: false };
  }

  try {
    const chatId = /^-?\d+$/.test(channel) ? channel : `@${channel}`;
    const { isMember, status } = await getChatMemberStatus(botToken, chatId, telegramUserId);

    if (!isMember) {
      console.log(`[TG Check] User ${telegramUserId} — status: ${status} (not subscribed)`);
    }

    return { subscribed: isMember, checked: true };
  } catch (err) {
    // 400 = user not found / kicked — aniq not subscribed
    if (err.response?.status === 400) {
      console.log(`[TG Check] User ${telegramUserId} — API 400 (not found in channel)`);
      return { subscribed: false, checked: true };
    }

    // Network / timeout — ishonchli emas, DB fallback ishlatiladi
    console.error('[TG Check] API xatolik:', err.message);
    return { subscribed: false, checked: false };
  }
};

// ─── Exports ──────────────────────────────────────────────────────────────────

module.exports = {
  verifyInstagramSubscription,
  verifyTelegramSubscription,
  checkInstagramSubscriptionRealTime,
  checkTelegramSubscriptionRealTime,
  checkTelegramSubscription,
};
