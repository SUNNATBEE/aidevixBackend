const User = require('../models/User');
const UserStats = require('../models/UserStats');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, generateResetToken, verifyResetToken } = require('../utils/jwt');
const validator = require('validator');
const { sendWelcomeEmail, sendResetCodeEmail } = require('../utils/emailService');
const crypto = require('crypto');
// Register new user
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email, and password.',
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.',
      });
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain uppercase, lowercase, number, and special character.',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists.',
      });
    }

    // Create new user
    const user = await User.create({
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      password,
      firstName: req.body.firstName || null,
      lastName: req.body.lastName || null,
    });

    // Generate tokens
    const accessToken = generateAccessToken({ userId: user._id });
    const refreshToken = generateRefreshToken({ userId: user._id });

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // UserStats yaratish (leaderboard/ranking uchun)
    UserStats.create({ userId: user._id }).catch((err) => {
      console.error('UserStats yaratishda xato:', err.message);
    });

    // Welcome email yuborish (background'da, xato bo'lsa ham davom etadi)
    sendWelcomeEmail(user.email, user.username).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          subscriptions: user.socialSubscriptions,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('❌ REGISTER ERROR:', error.message);
    console.error('❌ REGISTER STACK:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error registering user.',
      ...(process.env.NODE_ENV !== 'production' && { debug: error.message }),
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    // Find user with password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated.',
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken({ userId: user._id });
    const refreshToken = generateRefreshToken({ userId: user._id });

    // Save refresh token and update last login
    user.refreshToken = refreshToken;
    user.lastLogin = Date.now();
    await user.save();

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          subscriptions: user.socialSubscriptions,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in.',
    });
  }
};

// Refresh access token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required.',
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token.',
      });
    }

    // Find user and verify refresh token matches
    const user = await User.findById(decoded.userId).select('+refreshToken');

    if (!user || user.refreshToken !== token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token.',
      });
    }

    // Generate new tokens (ROTATION)
    const accessToken = generateAccessToken({ userId: user._id });
    const newRefreshToken = generateRefreshToken({ userId: user._id });

    // Save new refresh token
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      success: true,
      message: 'Token refreshed successfully.',
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error refreshing token.',
    });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging out.',
    });
  }
};

// Get current user
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          jobTitle: user.jobTitle,
          position: user.position,
          subscriptions: user.socialSubscriptions,
          role: user.role,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user data.',
    });
  }
};

// ════════════════════════════════════════════════════════════════
// FORGOT PASSWORD - Step 1: Send Code
// ════════════════════════════════════════════════════════════════
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email kiritilishi shart' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Bu email bilan foydalanuvchi topilmadi' });
    }

    // Generate 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save to user (hashed is better, but code is short-lived)
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send email
    await sendResetCodeEmail(user.email, user.username, resetCode);

    res.json({
      success: true,
      message: 'Tiklash kodi emailingizga yuborildi',
    });
  } catch (error) {
    console.error('FORGOT_PASSWORD_ERROR:', error);
    res.status(500).json({ success: false, message: 'Serverda xatolik yuz berdi' });
  }
};

// ════════════════════════════════════════════════════════════════
// VERIFY CODE - Step 2: Check Code
// ════════════════════════════════════════════════════════════════
const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Email va kod kiritilishi shart' });
    }

    const user = await User.findOne({ 
      email, 
      resetPasswordCode: code,
      resetPasswordExpire: { $gt: Date.now() } 
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Kod noto\'g\'ri yoki muddati o\'tgan' });
    }

    // Generate a secure reset token to be used for the next step
    const resetToken = generateResetToken({ email: user.email });

    res.json({
      success: true,
      message: 'Kod tasdiqlandi',
      data: {
        resetToken,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Serverda xatolik yuz berdi' });
  }
};

// ════════════════════════════════════════════════════════════════
// RESET PASSWORD - Step 3: Change Password
// ════════════════════════════════════════════════════════════════
const resetPassword = async (req, res) => {
  try {
    const { email, code, resetToken, newPassword } = req.body;
    
    if (!newPassword) {
      return res.status(400).json({ success: false, message: 'Yangi parolni kiriting' });
    }

    // Verify reset token if provided (Senior path)
    if (resetToken) {
      const decoded = verifyResetToken(resetToken);
      if (!decoded || decoded.email !== email) {
        return res.status(400).json({ success: false, message: 'Parolni tiklash tokeni yaroqsiz' });
      }
    } else if (code) {
      // Fallback to code if token is not there (legacy path)
      const userWithCode = await User.findOne({ 
        email, 
        resetPasswordCode: code,
        resetPasswordExpire: { $gt: Date.now() } 
      });
      if (!userWithCode) {
        return res.status(400).json({ success: false, message: 'Tasdiqlash kodi xato yoki muddati o\'tgan' });
      }
    } else {
      return res.status(400).json({ success: false, message: 'Tasdiqlash kodi yoki tokeni shart' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });
    }

    // Set new password
    user.password = newPassword;
    user.resetPasswordCode = null;
    user.resetPasswordExpire = null;
    await user.save();

    res.json({
      success: true,
      message: 'Parol muvaffaqiyatli yangilandi. Endi yangi parol bilan kirishingiz mumkin.',
    });
  } catch (error) {
    console.error('RESET_PASSWORD_ERROR:', error);
    res.status(500).json({ success: false, message: 'Serverda xatolik yuz berdi' });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  forgotPassword,
  verifyCode,
  resetPassword,
};
