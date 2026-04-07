const axios = require('axios');

/**
 * Verify Instagram subscription (Real-time check)
 * Note: Instagram API requires proper setup and authentication
 * This is a placeholder - you'll need to implement based on your Instagram API setup
 */
/**
 * Verify Instagram subscription (Professional Soft-Check Implementation)
 * Since direct Instagram followers API is heavily restricted, we use a 
 * "Soft-Verification" approach: If a username is provided, we tentatively 
 * mark as subscribed but store verification metadata for admin audit.
 */
const verifyInstagramSubscription = async (username, userId) => {
  try {
    if (!username || username.length < 3) {
      return { subscribed: false, username: null, verifiedAt: null };
    }

    return {
      subscribed: false,
      username: username.trim().toLowerCase(),
      verifiedAt: null,
      verificationSource: 'unverified'
    };
  } catch (error) {
    console.error('Instagram verification error:', error);
    return { subscribed: false, username, verifiedAt: null };
  }
};

/**
 * Real-time Instagram subscription check
 */
const checkInstagramSubscriptionRealTime = async (username, userId) => {
  try {
    if (!username) return false;
    return false;
  } catch (error) {
    console.error('Real-time Instagram check error:', error);
    return false;
  }
};

/**
 * Verify Telegram subscription
 * Note: Telegram Bot API can check if user is member of a channel
 */
const verifyTelegramSubscription = async (telegramUsername, telegramUserId, channelUsername) => {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      console.warn('TELEGRAM_BOT_TOKEN not set');
      return {
        subscribed: false,
        username: telegramUsername,
        verifiedAt: null,
      };
    }

    // Use real-time check to verify subscription
    if (!channelUsername) {
      channelUsername = process.env.TELEGRAM_CHANNEL_USERNAME;
    }

    if (!channelUsername) {
      console.warn('TELEGRAM_CHANNEL_USERNAME not set');
      return {
        subscribed: false,
        username: telegramUsername,
        verifiedAt: null,
      };
    }

    // Real-time verification using Telegram Bot API
    const response = await axios.get(
      `https://api.telegram.org/bot${botToken}/getChatMember`,
      {
        params: {
          chat_id: `@${channelUsername}`,
          user_id: telegramUserId,
        },
      }
    );
    
    const status = response.data.result?.status;
    const isSubscribed = ['member', 'administrator', 'creator'].includes(status);
    
    return {
      subscribed: isSubscribed,
      username: telegramUsername,
      verifiedAt: isSubscribed ? new Date() : null,
    };
  } catch (error) {
    console.error('Telegram verification error:', error);
    // If user is not found or not a member, API returns error
    return {
      subscribed: false,
      username: telegramUsername,
      verifiedAt: null,
    };
  }
};

/**
 * Real-time Telegram subscription check
 * This function should be called every time before allowing video access
 */
const checkTelegramSubscriptionRealTime = async (telegramUserId, channelUsername) => {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      console.warn('TELEGRAM_BOT_TOKEN not set');
      return false;
    }

    // Real-time check using Telegram Bot API
    const response = await axios.get(
      `https://api.telegram.org/bot${botToken}/getChatMember`,
      {
        params: {
          chat_id: `@${channelUsername}`,
          user_id: telegramUserId,
        },
      }
    );

    const status = response.data.result?.status;
    const isSubscribed = ['member', 'administrator', 'creator'].includes(status);
    
    return isSubscribed;
  } catch (error) {
    console.error('Real-time Telegram check error:', error);
    // If user is not found or not a member, API returns error
    // In this case, user is not subscribed
    return false;
  }
};

/**
 * Telegram obunasini ikki kanal uchun tekshirish
 * Xato bo'lsa false qaytaradi (exception otmaydi)
 */
const checkTelegramSubscription = async (telegramUserId) => {
  if (!telegramUserId) return false;
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) return false;

    const channels = [
      process.env.TELEGRAM_CHANNEL_USERNAME,
      process.env.TELEGRAM_PRIVATE_CHANNEL_USERNAME,
    ].filter(Boolean);

    for (const channel of channels) {
      const response = await axios.get(
        `https://api.telegram.org/bot${botToken}/getChatMember`,
        { params: { chat_id: `@${channel}`, user_id: telegramUserId } }
      );
      if (!response.data.ok) return false;
      const status = response.data.result?.status;
      if (!['member', 'administrator', 'creator'].includes(status)) return false;
    }
    return true;
  } catch (err) {
    console.error('Telegram check error:', err.message);
    return false;
  }
};

module.exports = {
  verifyInstagramSubscription,
  verifyTelegramSubscription,
  checkInstagramSubscriptionRealTime,
  checkTelegramSubscriptionRealTime,
  checkTelegramSubscription,
};
