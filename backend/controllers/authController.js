const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator');

const User = require('../models/User');
const UserStats = require('../models/UserStats');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateResetToken,
  verifyResetToken,
} = require('../utils/jwt');
const {
  sendWelcomeEmail,
  sendResetCodeEmail,
  sendEmailVerificationCode,
} = require('../utils/emailService');
const {
  attachAuthCookies,
  clearAuthCookies,
  hashToken,
  safeEqual,
  parseCookies,
  REFRESH_COOKIE_NAME,
} = require('../utils/authSecurity');
const securityLogger = require('../utils/securityLogger');

const calculateRank = (xp) => {
  if (xp >= 50000) return 'LEGEND';
  if (xp >= 20000) return 'MASTER';
  if (xp >= 10000) return 'SENIOR';
  if (xp >= 5000) return 'MIDDLE';
  if (xp >= 2000) return 'JUNIOR';
  if (xp >= 500) return 'CANDIDATE';
  return 'AMATEUR';
};

// Require 8+ chars, upper, lower, digit, special — any printable special char
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,128}$/;

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
const normalizeUsername = (username) => String(username || '').trim().toLowerCase();

// Precomputed dummy hash to keep bcrypt.compare time constant across "user not found" vs "wrong password".
// Hash of a random value; attacker can never match this.
const DUMMY_HASH = '$2a$12$CwTycUXWue0Thq9StjUM0uJ8.eSB6iMGwVlvlJwE3D1aLM2vkChTm';

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
  emailVerified: user.emailVerified ?? true,
});

const issueTokens = async (user) => {
  const payload = { userId: user._id, tv: user.tokenVersion || 0 };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  user.refreshToken = hashToken(refreshToken);
  user.lastLogin = Date.now();
  await user.save({ validateModifiedOnly: true });
  return { accessToken, refreshToken };
};

// @desc    Register new user
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

  if (!passwordRegex.test(password)) {
    return next(new ErrorResponse('Password must be 8–128 chars with upper, lower, digit and special char', 400));
  }

  if (normalizedUsername.length < 3 || normalizedUsername.length > 50) {
    return next(new ErrorResponse('Username must be 3–50 characters', 400));
  }

  const existingUser = await User.findOne({
    $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
  });
  if (existingUser) {
    return next(new ErrorResponse('Email or username already exists', 400));
  }

  let referredBy = null;
  let startingXp = 0;
  if (referralCode) {
    const referrer = await User.findOne({ referralCode: String(referralCode).trim() });
    if (referrer && String(referrer._id) !== String(req.user?._id)) {
      referredBy = referrer._id;
      startingXp = 500;

      referrer.xp = (referrer.xp || 0) + 1000;
      referrer.rankTitle = calculateRank(referrer.xp);
      referrer.referralsCount = (referrer.referralsCount || 0) + 1;
      await referrer.save({ validateModifiedOnly: true });

      const referrerStats = await UserStats.findOne({ userId: referrer._id });
      if (referrerStats) {
        referrerStats.xp = (referrerStats.xp || 0) + 1000;
        referrerStats.weeklyXp = (referrerStats.weeklyXp || 0) + 1000;
        referrerStats.level = referrerStats.calculateLevel();
        await referrerStats.save();
      }
    }
  }

  const newReferralCode =
    normalizedUsername.substring(0, 4).toUpperCase() +
    crypto.randomBytes(2).toString('hex').toUpperCase();

  const user = await User.create({
    username: normalizedUsername,
    email: normalizedEmail,
    password,
    firstName,
    lastName,
    referralCode: newReferralCode,
    referredBy,
    xp: startingXp,
    rankTitle: calculateRank(startingXp),
  });

  const { accessToken, refreshToken } = await issueTokens(user);
  attachAuthCookies(res, accessToken, refreshToken);

  securityLogger.registerSuccess(req, user);

  // Background tasks
  UserStats.create({ userId: user._id, xp: user.xp, weeklyXp: user.xp }).catch(() => {});

  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
  User.findByIdAndUpdate(user._id, {
    emailVerificationCode: hashToken(verifyCode),
    emailVerificationExpire: new Date(Date.now() + 15 * 60 * 1000),
    emailVerificationAttempts: 0,
  }).exec();
  sendEmailVerificationCode(user.email, user.username, verifyCode).catch((err) =>
    securityLogger.suspicious(req, 'email_verify_send_failed', { userId: String(user._id), error: err.message })
  );
  sendWelcomeEmail(user.email, user.username).catch(() => {});

  try {
    const { getBot } = require('../utils/telegramBot');
    const bot = getBot();
    if (bot) bot.notifyNewRegistration(user);
  } catch (_) {}

  res.status(201).json({
    success: true,
    data: { user: sanitizeUser(user) },
  });
});

// @desc    Login
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  const user = await User.findOne({ email: normalizedEmail }).select(
    '+password +failedLoginAttempts +lockUntil +tokenVersion'
  );

  // Dummy compare to keep timing uniform when user is not found
  if (!user) {
    await bcrypt.compare(password, DUMMY_HASH).catch(() => false);
    securityLogger.loginFailed(req, 'user_not_found', { email: normalizedEmail });
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  if (user.isLocked()) {
    securityLogger.loginLocked(req, user);
    const retryAfterMs = user.lockUntil.getTime() - Date.now();
    const retryMin = Math.max(1, Math.ceil(retryAfterMs / 60000));
    return next(
      new ErrorResponse(`Hisob vaqtincha bloklangan. ${retryMin} daqiqadan so'ng urinib ko'ring.`, 423)
    );
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    await user.registerFailedLogin();
    securityLogger.loginFailed(req, 'wrong_password', {
      userId: String(user._id),
      attempts: user.failedLoginAttempts,
    });
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  if (!user.isActive) {
    securityLogger.loginFailed(req, 'account_inactive', { userId: String(user._id) });
    return next(new ErrorResponse('Account deactivated', 403));
  }

  await user.resetLoginAttempts();

  const { accessToken, refreshToken } = await issueTokens(user);
  attachAuthCookies(res, accessToken, refreshToken);

  securityLogger.loginSuccess(req, user);

  res.json({
    success: true,
    data: { user: sanitizeUser(user) },
  });
});

// @desc    Refresh Token
const refresh = asyncHandler(async (req, res, next) => {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[REFRESH_COOKIE_NAME];

  if (!token) {
    securityLogger.refreshTokenInvalid(req, 'no_token');
    return next(new ErrorResponse('No refresh token provided', 400));
  }

  const decoded = verifyRefreshToken(token);
  if (!decoded) {
    securityLogger.refreshTokenInvalid(req, 'invalid_or_expired');
    return next(new ErrorResponse('Invalid or expired refresh token', 401));
  }

  const user = await User.findById(decoded.userId).select('+refreshToken +tokenVersion');
  if (!user) {
    securityLogger.refreshTokenInvalid(req, 'user_missing');
    return next(new ErrorResponse('Refresh token invalid', 401));
  }

  // Token version gate — password change / force-logout invalidates all outstanding tokens
  if (typeof decoded.tv === 'number' && decoded.tv !== (user.tokenVersion || 0)) {
    securityLogger.tokenVersionMismatch(req, user._id);
    clearAuthCookies(res);
    return next(new ErrorResponse('Session expired. Please login again.', 401));
  }

  const incomingHash = hashToken(token);
  const storedHash = user.refreshToken || '';

  if (!storedHash || !safeEqual(storedHash, incomingHash)) {
    // Reuse detected OR token never issued — invalidate entire family
    securityLogger.refreshTokenReuse(req, user._id);
    user.refreshToken = null;
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save({ validateModifiedOnly: true });
    clearAuthCookies(res);
    return next(new ErrorResponse('Refresh token compromised. Please login again.', 401));
  }

  if (!user.isActive) {
    clearAuthCookies(res);
    return next(new ErrorResponse('Account deactivated', 403));
  }

  const { accessToken, refreshToken: newRefreshToken } = await issueTokens(user);
  attachAuthCookies(res, accessToken, newRefreshToken);

  res.json({
    success: true,
    data: { user: sanitizeUser(user) },
  });
});

// @desc    Logout
const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, {
      refreshToken: null,
      $inc: { tokenVersion: 1 },
    });
    securityLogger.logout(req, req.user._id);
  }
  clearAuthCookies(res);
  res.json({ success: true, message: 'Logged out' });
});

// @desc    Get Me
const getMe = asyncHandler(async (req, res) => {
  let user = await User.findById(req.user._id);

  if (!user.referralCode) {
    const newReferralCode =
      user.username.substring(0, 4).toUpperCase() +
      crypto.randomBytes(2).toString('hex').toUpperCase();
    user = await User.findByIdAndUpdate(
      user._id,
      { referralCode: newReferralCode },
      { new: true }
    );
  }

  res.json({ success: true, data: sanitizeUser(user) });
});

// @desc    Get Referral Stats and Leaderboard
const getReferralStats = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;

  const myFriends = await User.find({ referredBy: currentUserId })
    .select('username firstName lastName createdAt xp rankTitle avatar')
    .sort('-createdAt')
    .limit(50);

  const topReferrers = await User.find({ referralsCount: { $gt: 0 } })
    .select('username firstName lastName xp rankTitle referralsCount avatar')
    .sort('-referralsCount')
    .limit(3);

  const totalEarnedXp = (req.user.referralsCount || 0) * 1000;

  res.json({
    success: true,
    data: {
      totalFriends: req.user.referralsCount || 0,
      totalEarnedXp,
      myFriends,
      topReferrers,
    },
  });
});

// @desc    Claim Daily Reward
const claimDailyReward = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const now = new Date();

  if (user.lastClaimedDaily) {
    const lastClaim = new Date(user.lastClaimedDaily);
    const todayUTC = now.toISOString().slice(0, 10);
    const lastClaimUTC = lastClaim.toISOString().slice(0, 10);

    if (todayUTC === lastClaimUTC) {
      return next(new ErrorResponse('Bugun mukofot allaqachon olingan. Ertaga qayta urunib ko\'ring.', 400));
    }
  }

  user.xp = (user.xp || 0) + 50;
  user.lastClaimedDaily = now;
  user.rankTitle = calculateRank(user.xp);

  let stats = await UserStats.findOne({ userId: user._id });
  if (!stats) {
    stats = await UserStats.create({ userId: user._id });
  }
  stats.xp += 50;
  stats.weeklyXp = (stats.weeklyXp || 0) + 50;
  stats.level = stats.calculateLevel();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (stats.lastActivityDate) {
    const last = new Date(stats.lastActivityDate);
    last.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      stats.streak += 1;
    } else if (diffDays > 1) {
      stats.streak = 1;
    }
  } else {
    stats.streak = 1;
  }
  stats.lastActivityDate = new Date();
  await stats.save();

  user.streak = stats.streak;
  await user.save({ validateModifiedOnly: true });

  res.json({
    success: true,
    message: 'Kunlik mukofot qabul qilindi (+50 XP)',
    xp: user.xp,
    streak: user.streak,
    lastClaimedDaily: user.lastClaimedDaily,
  });
});

// @desc    Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
  const normalizedEmail = normalizeEmail(req.body?.email);
  const user = await User.findOne({ email: normalizedEmail });

  // Respond uniformly to prevent email enumeration
  const genericResponse = {
    success: true,
    message: 'If the account exists, a reset code has been sent',
  };

  if (!user) {
    securityLogger.passwordResetRequested(req, normalizedEmail, false);
    return res.json(genericResponse);
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetPasswordCode = hashToken(code);
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  user.resetPasswordAttempts = 0;
  await user.save({ validateModifiedOnly: true });

  try {
    await sendResetCodeEmail(user.email, user.username, code);
  } catch (err) {
    securityLogger.suspicious(req, 'reset_email_send_failed', {
      userId: String(user._id),
      error: err.message,
    });
  }

  securityLogger.passwordResetRequested(req, normalizedEmail, true);
  res.json(genericResponse);
});

// @desc    Verify Reset Code
const verifyCode = asyncHandler(async (req, res, next) => {
  const { email, code } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !code) {
    return next(new ErrorResponse('Email va kod majburiy', 400));
  }

  const user = await User.findOne({ email: normalizedEmail }).select(
    '+resetPasswordCode +resetPasswordExpire +resetPasswordAttempts'
  );

  if (!user || !user.resetPasswordCode || !user.resetPasswordExpire) {
    return next(new ErrorResponse('Invalid or expired code', 400));
  }

  if (user.resetPasswordExpire.getTime() < Date.now()) {
    return next(new ErrorResponse('Invalid or expired code', 400));
  }

  if ((user.resetPasswordAttempts || 0) >= 5) {
    user.resetPasswordCode = null;
    user.resetPasswordExpire = null;
    user.resetPasswordAttempts = 0;
    await user.save({ validateModifiedOnly: true });
    return next(new ErrorResponse('Juda ko\'p noto\'g\'ri urinish. Yangi kod so\'rang.', 400));
  }

  if (!safeEqual(user.resetPasswordCode, hashToken(code))) {
    user.resetPasswordAttempts = (user.resetPasswordAttempts || 0) + 1;
    await user.save({ validateModifiedOnly: true });
    return next(new ErrorResponse('Invalid or expired code', 400));
  }

  const resetToken = generateResetToken({ email: user.email, uid: String(user._id) });
  res.json({ success: true, data: { resetToken } });
});

// @desc    Reset Password
const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, resetToken, newPassword } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !resetToken || !newPassword) {
    return next(new ErrorResponse('Majburiy maydonlar to\'ldirilmadi', 400));
  }

  if (!passwordRegex.test(newPassword)) {
    return next(new ErrorResponse('Password must be 8–128 chars with upper, lower, digit and special char', 400));
  }

  const decoded = verifyResetToken(resetToken);
  if (!decoded || decoded.email !== normalizedEmail) {
    return next(new ErrorResponse('Invalid reset token', 400));
  }

  const user = await User.findOne({ email: normalizedEmail }).select(
    '+resetPasswordCode +resetPasswordExpire'
  );
  if (!user) return next(new ErrorResponse('User not found', 404));

  user.password = newPassword;
  user.resetPasswordCode = null;
  user.resetPasswordExpire = null;
  user.resetPasswordAttempts = 0;
  user.refreshToken = null;
  // tokenVersion and passwordChangedAt bump in pre-save hook automatically
  await user.save();
  clearAuthCookies(res);

  securityLogger.passwordResetCompleted(req, user);
  res.json({ success: true, message: 'Password updated. Please login again on all devices.' });
});

// @desc    Change password (authenticated)
const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new ErrorResponse('Joriy va yangi parol majburiy', 400));
  }

  if (currentPassword === newPassword) {
    return next(new ErrorResponse('Yangi parol eski paroldan farq qilishi kerak', 400));
  }

  if (!passwordRegex.test(newPassword)) {
    return next(new ErrorResponse('Password must be 8–128 chars with upper, lower, digit and special char', 400));
  }

  const user = await User.findById(req.user._id).select('+password');
  if (!user) return next(new ErrorResponse('User not found', 404));

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    securityLogger.loginFailed(req, 'change_password_wrong_current', {
      userId: String(user._id),
    });
    return next(new ErrorResponse('Joriy parol noto\'g\'ri', 400));
  }

  user.password = newPassword;
  user.refreshToken = null;
  await user.save();
  clearAuthCookies(res);

  securityLogger.passwordChanged(req, user);
  res.json({
    success: true,
    message: 'Parol muvaffaqiyatli yangilandi. Iltimos, qayta kiring.',
  });
});

// @desc    Verify email
const verifyEmail = asyncHandler(async (req, res, next) => {
  const { code } = req.body;
  if (!code) return next(new ErrorResponse('Kod kiritilmadi', 400));

  const user = await User.findById(req.user._id).select(
    '+emailVerificationCode +emailVerificationExpire +emailVerificationAttempts'
  );

  if (!user || !user.emailVerificationCode || !user.emailVerificationExpire) {
    securityLogger.emailVerificationFailed(req, req.user._id, 'no_active_code');
    return next(new ErrorResponse('Kod noto\'g\'ri yoki muddati o\'tgan', 400));
  }

  if (user.emailVerificationExpire.getTime() < Date.now()) {
    securityLogger.emailVerificationFailed(req, user._id, 'expired');
    return next(new ErrorResponse('Kod noto\'g\'ri yoki muddati o\'tgan', 400));
  }

  if ((user.emailVerificationAttempts || 0) >= 5) {
    user.emailVerificationCode = null;
    user.emailVerificationExpire = null;
    user.emailVerificationAttempts = 0;
    await user.save({ validateModifiedOnly: true });
    securityLogger.emailVerificationFailed(req, user._id, 'too_many_attempts');
    return next(new ErrorResponse('Juda ko\'p noto\'g\'ri urinish. Yangi kod so\'rang.', 400));
  }

  if (!safeEqual(user.emailVerificationCode, hashToken(code))) {
    user.emailVerificationAttempts = (user.emailVerificationAttempts || 0) + 1;
    await user.save({ validateModifiedOnly: true });
    securityLogger.emailVerificationFailed(req, user._id, 'wrong_code');
    return next(new ErrorResponse('Kod noto\'g\'ri yoki muddati o\'tgan', 400));
  }

  user.emailVerified = true;
  user.emailVerificationCode = null;
  user.emailVerificationExpire = null;
  user.emailVerificationAttempts = 0;
  await user.save({ validateModifiedOnly: true });

  securityLogger.emailVerificationSucceeded(req, user);
  res.json({ success: true, message: 'Email muvaffaqiyatli tasdiqlandi' });
});

// @desc    Resend email verification code
const resendVerification = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new ErrorResponse('User not found', 404));

  if (user.emailVerified) {
    return next(new ErrorResponse('Email allaqachon tasdiqlangan', 400));
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  user.emailVerificationCode = hashToken(code);
  user.emailVerificationExpire = new Date(Date.now() + 15 * 60 * 1000);
  user.emailVerificationAttempts = 0;
  await user.save({ validateModifiedOnly: true });

  sendEmailVerificationCode(user.email, user.username, code).catch((err) =>
    securityLogger.suspicious(req, 'email_verify_send_failed', {
      userId: String(user._id),
      error: err.message,
    })
  );

  res.json({ success: true, message: 'Tasdiqlash kodi yuborildi' });
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
  changePassword,
  verifyEmail,
  resendVerification,
};
