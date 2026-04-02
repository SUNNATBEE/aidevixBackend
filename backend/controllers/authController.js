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

// @desc    Register new user
const register = asyncHandler(async (req, res, next) => {
  const { username, email, password, firstName, lastName } = req.body;

  if (!username || !email || !password) {
    return next(new ErrorResponse('Please provide username, email, and password', 400));
  }

  if (!validator.isEmail(email)) {
    return next(new ErrorResponse('Please provide a valid email address', 400));
  }

  // Strict password rules
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return next(new ErrorResponse('Password must be at least 8 chars with upper, lower, digit and special char', 400));
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return next(new ErrorResponse('Email or username already exists', 400));
  }

  const user = await User.create({
    username: username.trim().toLowerCase(),
    email: email.trim().toLowerCase(),
    password,
    firstName,
    lastName,
  });

  const accessToken = generateAccessToken({ userId: user._id });
  const refreshToken = generateRefreshToken({ userId: user._id });

  user.refreshToken = refreshToken;
  await user.save();

  // Background
  UserStats.create({ userId: user._id }).catch(() => {});
  sendWelcomeEmail(user.email, user.username).catch(() => {});

  res.status(201).json({
    success: true,
    data: {
      user: { _id: user._id, username: user.username, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    },
  });
});

// @desc    Login
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  // Find user by email
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  if (!user.isActive) {
    return next(new ErrorResponse('Account deactivated', 403));
  }

  const accessToken = generateAccessToken({ userId: user._id });
  const refreshToken = generateRefreshToken({ userId: user._id });

  user.refreshToken = refreshToken;
  user.lastLogin = Date.now();
  await user.save();

  res.json({
    success: true,
    data: {
      user: { _id: user._id, username: user.username, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    },
  });
});

// @desc    Refresh Token
const refresh = asyncHandler(async (req, res, next) => {
  const { refreshToken: token } = req.body;

  if (!token) return next(new ErrorResponse('No refresh token provided', 400));

  const decoded = verifyRefreshToken(token);
  if (!decoded) return next(new ErrorResponse('Invalid or expired refresh token', 401));

  const user = await User.findById(decoded.userId).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    return next(new ErrorResponse('Refresh token invalid', 401));
  }

  const accessToken = generateAccessToken({ userId: user._id });
  const newRefreshToken = generateRefreshToken({ userId: user._id });

  user.refreshToken = newRefreshToken;
  await user.save();

  res.json({
    success: true,
    data: {
      accessToken,
      refreshToken: newRefreshToken,
    },
  });
});

// @desc    Logout
const logout = asyncHandler(async (req, res, next) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  }
  res.json({ success: true, message: 'Logged out' });
});

// @desc    Get Me
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).lean();
  res.json({ success: true, data: user });
});

// @desc    Forgot Password
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return next(new ErrorResponse('Email not found', 404));

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetPasswordCode = code;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendResetCodeEmail(user.email, user.username, code);

  res.json({ success: true, message: 'Reset code sent' });
});

// @desc    Verify Code
const verifyCode = asyncHandler(async (req, res, next) => {
  const { email, code } = req.body;
  const user = await User.findOne({ 
    email, 
    resetPasswordCode: code,
    resetPasswordExpire: { $gt: Date.now() } 
  });

  if (!user) return next(new ErrorResponse('Invalid or expired code', 400));

  const resetToken = generateResetToken({ email: user.email });
  res.json({ success: true, data: { resetToken } });
});

// @desc    Reset Password
const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, resetToken, newPassword } = req.body;

  const decoded = verifyResetToken(resetToken);
  if (!decoded || decoded.email !== email) {
    return next(new ErrorResponse('Invalid reset token', 400));
  }

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorResponse('User not found', 404));

  user.password = newPassword;
  user.resetPasswordCode = null;
  user.resetPasswordExpire = null;
  await user.save();

  res.json({ success: true, message: 'Password updated' });
});

module.exports = {
  register,
  login,
  refreshToken: refresh, // Renamed internally but exported as refreshToken
  logout,
  getMe,
  forgotPassword,
  verifyCode,
  resetPassword,
};
