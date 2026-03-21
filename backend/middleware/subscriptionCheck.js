const User = require('../models/User');
const { performSubscriptionCheck } = require('../utils/checkSubscriptions');

/**
 * Middleware to check if user has subscribed to required social media platforms
 * This performs a real-time check to ensure user is currently subscribed
 */
const checkSubscriptions = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const { instagramSubscribed, telegramSubscribed, changed } = await performSubscriptionCheck(user);

    if (changed) {
      await user.save();
    }

    if (!instagramSubscribed || !telegramSubscribed) {
      const missingSubscriptions = [];
      if (!instagramSubscribed) missingSubscriptions.push('Instagram');
      if (!telegramSubscribed) missingSubscriptions.push('Telegram');

      return res.status(403).json({
        success: false,
        message: `Siz obuna bekor qildingiz. Video ko'ra olmaysiz. Iltimos, ${missingSubscriptions.join(' va ')} ga qayta obuna bo'ling.`,
        subscriptions: {
          instagram: instagramSubscribed,
          telegram: telegramSubscribed,
        },
        missingSubscriptions,
      });
    }

    // Update req.user with latest subscription status
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking subscriptions.',
    });
  }
};

module.exports = {
  checkSubscriptions,
};
