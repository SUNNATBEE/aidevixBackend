const User = require('../models/User');
const UserStats = require('../models/UserStats');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken, 
  generateResetToken, 
  verifyResetToken 
} = require('../utils/jwt');
const validator = require('validator');
const { sendWelcomeEmail, sendResetCodeEmail } = require('../utils/emailService');
const {
  attachAuthCookies,
  clearAuthCookies,
  hashToken,
  parseCookies,
  REFRESH_COOKIE_NAME,
} = require('../utils/authSecurity');

const calculateRank = (xp) => {
  if (xp >= 50000) return 'LEGEND';
  if (xp >= 20000) return 'MASTER';
  if (xp >= 10000) return 'SENIOR';
  if (xp >= 5000) return 'MIDDLE';
  if (xp >= 2000) return 'JUNIOR';
  if (xp >= 500) return 'CANDIDATE';
  return 'AMATEUR';
};

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
const normalizeUsername = (username) => String(username || '').trim().toLowerCase();

const sanitizeUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  firstName: user.firstName,
  lastName: user.lastName,
  avatar: user.avatar || null,
  xp: user.xp || 0,
  streak: user.streak || 0,
  rankTitle: user.rankTitle,
  referralCode: user.referralCode || null,
  referralsCount: user.referralsCount || 0,
  lastClaimedDaily: user.lastClaimedDaily || null,
});

// @desc    Register new user
const crypto = require('crypto');

const register = asyncHandler(async (req, res, next) => {
  const { username, email, password, firstName, lastName, referralCode } = req.body;
  const normalizedEmail = normalizeEmail(email);
  const normalizedUsername = normalizeUsername(username);

  if (!normalizedUsername || !normalizedEmail || !password) {
    return next(new ErrorResponse('Please provide username, email, and password', 400));
  }

  if (!validator.isEmail(normalizedEmail)) {
    return next(new ErrorResponse('Please provide a valid email address', 400));
  }

  // Strict password rules
  if (!passwordRegex.test(password)) {
    return next(new ErrorResponse('Password must be at least 8 chars with upper, lower, digit and special char', 400));
  }

  const existingUser = await User.findOne({
    $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
  });
  if (existingUser) {
    return next(new ErrorResponse('Email or username already exists', 400));
  }

  // Check and process Referral Code
  let referredBy = null;
  let startingXp = 0;
  if (referralCode) {
    const referrer = await User.findOne({ referralCode });
    if (referrer) {
      referredBy = referrer._id;
      startingXp = 500; // Bonus for joining via referral
      
      // Award the referrer directly here
      referrer.xp = (referrer.xp || 0) + 1000;
      referrer.rankTitle = calculateRank(referrer.xp);
      referrer.referralsCount = (referrer.referralsCount || 0) + 1;
      await referrer.save();
    }
  }

  const newReferralCode = normalizedUsername.substring(0, 4).toUpperCase() + crypto.randomBytes(2).toString('hex').toUpperCase();

  const user = await User.create({
    username: normalizedUsername,
    email: normalizedEmail,
    password,
    firstName,
    lastName,
    referralCode: newReferralCode,
    referredBy,
    xp: startingXp,
    rankTitle: calculateRank(startingXp)
  });

  const accessToken = generateAccessToken({ userId: user._id });
  const refreshToken = generateRefreshToken({ userId: user._id });

  user.refreshToken = hashToken(refreshToken);
  await user.save();
  attachAuthCookies(res, accessToken, refreshToken);

  // Background
  UserStats.create({ userId: user._id }).catch(() => {});
  sendWelcomeEmail(user.email, user.username).catch(() => {});

  // Telegram admin bildirishnoma
  try {
    const { getBot } = require('../utils/telegramBot');
    const bot = getBot();
    if (bot) bot.notifyNewRegistration(user);
  } catch (_) {}

  res.status(201).json({
    success: true,
    data: {
      user: sanitizeUser(user),
    },
  });
});

// @desc    Login
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  // Find user by email
  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  if (!user.isActive) {
    return next(new ErrorResponse('Account deactivated', 403));
  }

  const accessToken = generateAccessToken({ userId: user._id });
  const refreshToken = generateRefreshToken({ userId: user._id });

  user.refreshToken = hashToken(refreshToken);
  user.lastLogin = Date.now();
  await user.save();
  attachAuthCookies(res, accessToken, refreshToken);

  res.json({
    success: true,
    data: {
      user: sanitizeUser(user),
    },
  });
});

// @desc    Refresh Token
const refresh = asyncHandler(async (req, res, next) => {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[REFRESH_COOKIE_NAME];

  if (!token) return next(new ErrorResponse('No refresh token provided', 400));

  const decoded = verifyRefreshToken(token);
  if (!decoded) return next(new ErrorResponse('Invalid or expired refresh token', 401));

  const user = await User.findById(decoded.userId).select('+refreshToken');
  if (!user || user.refreshToken !== hashToken(token)) {
    return next(new ErrorResponse('Refresh token invalid', 401));
  }

  const accessToken = generateAccessToken({ userId: user._id });
  const newRefreshToken = generateRefreshToken({ userId: user._id });

  user.refreshToken = hashToken(newRefreshToken);
  await user.save();
  attachAuthCookies(res, accessToken, newRefreshToken);

  res.json({
    success: true,
    data: {
      user: sanitizeUser(user),
    },
  });
});

// @desc    Logout
const logout = asyncHandler(async (req, res, next) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  }
  clearAuthCookies(res);
  res.json({ success: true, message: 'Logged out' });
});

// @desc    Get Me
const getMe = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.user._id);
  
  if (!user.referralCode) {
    const crypto = require('crypto');
    const newReferralCode = user.username.substring(0, 4).toUpperCase() + crypto.randomBytes(2).toString('hex').toUpperCase();
    user.referralCode = newReferralCode;
    await user.save();
  }
  
  res.json({ success: true, data: sanitizeUser(user) });
});

// @desc    Get Referral Stats and Leaderboard
const getReferralStats = asyncHandler(async (req, res, next) => {
  const currentUserId = req.user._id;

  // Personal invited friends
  const myFriends = await User.find({ referredBy: currentUserId })
    .select('username firstName lastName createdAt xp rankTitle avatar')
    .sort('-createdAt')
    .limit(50);

  // Top overall platform referrers
  const topReferrers = await User.find({ referralsCount: { $gt: 0 } })
    .select('username firstName lastName xp rankTitle referralsCount avatar')
    .sort('-referralsCount')
    .limit(3);

  // Recalculate my total referral XP correctly to ensure UI reflects correctly
  const totalEarnedXp = (req.user.referralsCount || 0) * 1000;

  res.json({
    success: true,
    data: {
      totalFriends: req.user.referralsCount || 0,
      totalEarnedXp,
      myFriends,
      topReferrers
    }
  });
});

// @desc    Claim Daily Reward
const claimDailyReward = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
  const now = new Date()

  // 24 soat o'tganini tekshirish
  if (user.lastClaimedDaily) {
    const lastClaim = new Date(user.lastClaimedDaily)
    const diffMs = now.getTime() - lastClaim.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)

    if (diffHours < 24) {
      const waitHours = Math.ceil(24 - diffHours)
      return next(new ErrorResponse(`Bugun mukofot olib bo'ldingiz. Iltimos, yana ${waitHours} soatdan keyin urunib ko'ring.`, 400))
    }
  }

  user.xp = (user.xp || 0) + 50
  user.streak = (user.streak || 0) + 1
  user.lastClaimedDaily = now
  user.rankTitle = calculateRank(user.xp)
  await user.save()

  res.json({ 
    success: true, 
    message: 'Kunlik mukofot qabul qilindi (+50 XP)', 
    xp: user.xp, 
    streak: user.streak,
    lastClaimedDaily: user.lastClaimedDaily
  })
})

// @desc    Forgot Password
const forgotPassword = asyncHandler(async (req, res, next) => {
  const normalizedEmail = normalizeEmail(req.body?.email);
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    return res.json({ success: true, message: 'If the account exists, a reset code has been sent' });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetPasswordCode = hashToken(code);
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendResetCodeEmail(user.email, user.username, code);

  res.json({ success: true, message: 'If the account exists, a reset code has been sent' });
});

// @desc    Verify Code
const verifyCode = asyncHandler(async (req, res, next) => {
  const { email, code } = req.body;
  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ 
    email: normalizedEmail,
    resetPasswordCode: hashToken(code),
    resetPasswordExpire: { $gt: Date.now() } 
  });

  if (!user) return next(new ErrorResponse('Invalid or expired code', 400));

  const resetToken = generateResetToken({ email: user.email });
  res.json({ success: true, data: { resetToken } });
});

// @desc    Reset Password
const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, resetToken, newPassword } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!passwordRegex.test(newPassword)) {
    return next(new ErrorResponse('Password must be at least 8 chars with upper, lower, digit and special char', 400));
  }

  const decoded = verifyResetToken(resetToken);
  if (!decoded || decoded.email !== normalizedEmail) {
    return next(new ErrorResponse('Invalid reset token', 400));
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) return next(new ErrorResponse('User not found', 404));

  user.password = newPassword;
  user.resetPasswordCode = null;
  user.resetPasswordExpire = null;
  user.refreshToken = null;
  await user.save();
  clearAuthCookies(res);

  res.json({ success: true, message: 'Password updated' });
});

module.exports = {
  register,
  login,
  refreshToken: refresh,
  logout,
  getMe,
  getReferralStats,
  claimDailyReward,
  forgotPassword,
  verifyCode,
  resetPassword,
};
