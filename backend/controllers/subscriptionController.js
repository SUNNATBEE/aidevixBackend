const User = require('../models/User');
const { verifyInstagramSubscription, verifyTelegramSubscription, checkTelegramSubscription } = require('../utils/socialVerification');
// Verify Instagram subscription
const verifyInstagram = async (req, res) => {
  try {
    const { username } = req.body;
    const userId = req.user._id;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Instagram username is required.',
      });
    }

    // Verify subscription
    const verification = await verifyInstagramSubscription(username, userId);

    // Update user's Instagram subscription status
    const user = await User.findById(userId);
    user.socialSubscriptions.instagram = {
      subscribed: verification.subscribed,
      username: verification.username,
      verifiedAt: verification.verifiedAt,
    };
    await user.save();

    res.json({
      success: true,
      message: verification.subscribed 
        ? 'Instagram subscription verified successfully.' 
        : 'Instagram subscription verification failed.',
      data: {
        subscription: user.socialSubscriptions.instagram,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying Instagram subscription.',
      error: error.message,
    });
  }
};

// Verify Telegram subscription
const verifyTelegram = async (req, res) => {
  try {
    const { username, telegramUserId } = req.body;
    const userId = req.user._id;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Telegram username is required.',
      });
    }

    if (!telegramUserId) {
      return res.status(400).json({
        success: false,
        message: 'Telegram User ID is required for real-time verification.',
      });
    }

    // Get channel username from environment or request
    const channelUsername = process.env.TELEGRAM_CHANNEL_USERNAME || req.body.channelUsername;

    // Verify subscription
    const verification = await verifyTelegramSubscription(username, telegramUserId, channelUsername);

    // Update user's Telegram subscription status
    const user = await User.findById(userId);
    user.socialSubscriptions.telegram = {
      subscribed: verification.subscribed,
      username: verification.username,
      telegramUserId: telegramUserId,
      verifiedAt: verification.verifiedAt,
    };
    await user.save();

    res.json({
      success: true,
      message: verification.subscribed 
        ? 'Telegram subscription verified successfully.' 
        : 'Telegram subscription verification failed.',
      data: {
        subscription: user.socialSubscriptions.telegram,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying Telegram subscription.',
      error: error.message,
    });
  }
};

// Get subscription status
const getSubscriptionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      data: {
        subscriptions: user.socialSubscriptions,
        hasAllSubscriptions: user.hasAllSubscriptions(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription status.',
      error: error.message,
    });
  }
};

// Telegram ID saqlash
const setTelegramId = async (req, res) => {
  try {
    const { telegramUserId } = req.body;
    if (!telegramUserId) return res.status(400).json({ success: false, message: 'Telegram ID kiritilmadi' });
    await User.findByIdAndUpdate(req.user._id, { telegramUserId: String(telegramUserId) });
    res.json({ success: true, message: 'Telegram ID saqlandi' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
};

// Real-time obuna holati
const getRealtimeStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const telegramId = user.telegramUserId || user.socialSubscriptions?.telegram?.telegramUserId;
    const telegramOk = await checkTelegramSubscription(telegramId);
    const instagramOk = user.socialSubscriptions?.instagram?.subscribed || false;
    res.json({
      success: true,
      data: {
        telegram: telegramOk,
        instagram: instagramOk,
        telegramUserId: telegramId || null,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
};

module.exports = {
  verifyInstagram,
  verifyTelegram,
  getSubscriptionStatus,
  setTelegramId,
  getRealtimeStatus,
};
