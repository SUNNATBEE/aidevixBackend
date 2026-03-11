const User = require('../models/User');
const { verifyInstagramSubscription, verifyTelegramSubscription } = require('../utils/socialVerification');

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

module.exports = {
  verifyInstagram,
  verifyTelegram,
  getSubscriptionStatus,
};
