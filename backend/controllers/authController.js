const User = require('../models/User');
const UserStats = require('../models/UserStats');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, generateResetToken, verifyResetToken } = require('../utils/jwt');
const validator = require('validator');
const { sendWelcomeEmail, sendResetCodeEmail } = require('../utils/emailService');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return next(new ErrorResponse('Please provide username, email, and password', 400));
  }

  if (!validator.isEmail(email)) {
    return next(new ErrorResponse('Please provide a valid email address', 400));
  }

  // Password complexity check
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return next(new ErrorResponse('Password must be at least 8 chars with upper, lower, number and special char', 400));
  }

  // Check unique fields
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return next(new ErrorResponse('Email or username already registered', 400));
  }

  // Create user
  const user = await User.create({
    username: username.trim().toLowerCase(),
    email: email.trim().toLowerCase(),
    password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  // Tokens
  const accessToken = generateAccessToken({ userId: user._id });
  const refreshToken = generateRefreshToken({ userId: user._id });

  user.refreshToken = refreshToken;
  await user.save();

  // Background tasks
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

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  if (!user.isActive) {
    return next(new ErrorResponse('Your account is deactivated', 403));
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

// @desc    Logout / clear refresh token
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

  res.json({ success: true, message: 'Logged out successfully' });
});

// @desc    Get me
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, data: user });
});

// @desc    Forgot Password - Issue Reset Code
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse('User not found with this email', 404));
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetPasswordCode = resetCode;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendResetCodeEmail(user.email, user.username, resetCode);

  res.json({ success: true, message: 'Reset code sent to your email' });
});

// @desc    Verify Code - Exchange for Reset Token
const verifyCode = asyncHandler(async (req, res, next) => {
  const { email, code } = req.body;
  const user = await User.findOne({ 
    email, 
    resetPasswordCode: code,
    resetPasswordExpire: { $gt: Date.now() } 
  });

  if (!user) {
    return next(new ErrorResponse('Invalid or expired code', 400));
  }

  const resetToken = generateResetToken({ email: user.email });
  res.json({ success: true, data: { resetToken } });
});

// @desc    Reset Password
const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, resetToken, newPassword } = req.body;

  const decoded = verifyResetToken(resetToken);
  if (!decoded || decoded.email !== email) {
    return next(new ErrorResponse('Invalid or unauthorized reset token', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new ErrorResponse('User not found', 404));

  user.password = newPassword;
  user.resetPasswordCode = null;
  user.resetPasswordExpire = null;
  await user.save();

  res.json({ success: true, message: 'Password reset successfully' });
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  verifyCode,
  resetPassword,
};
