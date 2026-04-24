const User = require('../models/User');

/**
 * Promptlar matnini ko'rish — faqat kirgan va Telegram kanal obunasi tasdiqlangan foydalanuvchilar.
 * Oldindan `authenticate` ishlatilishi kerak.
 */
const requireTelegramForPromptsRead = async (req, res, next) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        code: 'AUTH_REQUIRED',
        message: 'Promptlarni ko\'rish uchun tizimga kiring.',
      });
    }

    if (req.user.role === 'admin') {
      return next();
    }

    const user = await User.findById(req.user._id).select('socialSubscriptions role');
    const telegramOk = !!user?.socialSubscriptions?.telegram?.subscribed;

    if (!telegramOk) {
      return res.status(403).json({
        success: false,
        code: 'TELEGRAM_CHANNEL_REQUIRED',
        isSubscriptionError: true,
        message: 'Promptlarni ko\'rish uchun Telegram kanaliga obuna bo\'ling va obunani tasdiqlang.',
        subscriptions: {
          telegram: false,
        },
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Server xatosi' });
  }
};

module.exports = requireTelegramForPromptsRead;
