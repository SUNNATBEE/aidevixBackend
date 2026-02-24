const User = require('../models/User');
const { 
  checkInstagramSubscriptionRealTime, 
  checkTelegramSubscriptionRealTime 
} = require('../utils/socialVerification');

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

    // Real-time subscription check
    let instagramSubscribed = false;
    let telegramSubscribed = false;
    let subscriptionChanged = false;

    // Check Instagram subscription in real-time
    if (user.socialSubscriptions.instagram.username) {
      instagramSubscribed = await checkInstagramSubscriptionRealTime(
        user.socialSubscriptions.instagram.username,
        user._id
      );
      
      // Update database if subscription status changed
      if (user.socialSubscriptions.instagram.subscribed !== instagramSubscribed) {
        user.socialSubscriptions.instagram.subscribed = instagramSubscribed;
        user.socialSubscriptions.instagram.verifiedAt = instagramSubscribed ? new Date() : null;
        subscriptionChanged = true;
      }
    }

    // Check Telegram subscription in real-time
    if (user.socialSubscriptions.telegram.username) {
      const channelUsername = process.env.TELEGRAM_CHANNEL_USERNAME;
      // Note: You need to store telegramUserId in user model for this to work
      // For now, we'll use username-based check if available
      const telegramUserId = user.socialSubscriptions.telegram.telegramUserId || null;
      
      if (telegramUserId && channelUsername) {
        telegramSubscribed = await checkTelegramSubscriptionRealTime(
          telegramUserId,
          channelUsername
        );
      } else {
        // Fallback: use stored subscription status if real-time check not possible
        telegramSubscribed = user.socialSubscriptions.telegram.subscribed;
      }
      
      // Update database if subscription status changed
      if (user.socialSubscriptions.telegram.subscribed !== telegramSubscribed) {
        user.socialSubscriptions.telegram.subscribed = telegramSubscribed;
        user.socialSubscriptions.telegram.verifiedAt = telegramSubscribed ? new Date() : null;
        subscriptionChanged = true;
      }
    } else {
      telegramSubscribed = user.socialSubscriptions.telegram.subscribed;
    }

    // Save changes if subscription status changed
    if (subscriptionChanged) {
      await user.save();
    }

    // Check if user has all required subscriptions
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
      error: error.message,
    });
  }
};

module.exports = {
  checkSubscriptions,
};
