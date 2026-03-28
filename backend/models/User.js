const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
  },
  firstName: {
    type: String,
    default: null,
  },
  lastName: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't return password by default
  },
  refreshToken: {
    type: String,
    select: false,
  },
  socialSubscriptions: {
    instagram: {
      subscribed: {
        type: Boolean,
        default: false,
      },
      username: {
        type: String,
        default: null,
      },
      verifiedAt: {
        type: Date,
        default: null,
      },
    },
    telegram: {
      subscribed: {
        type: Boolean,
        default: false,
      },
      username: {
        type: String,
        default: null,
      },
      telegramUserId: {
        type: String,
        default: null,
      },
      verifiedAt: {
        type: Date,
        default: null,
      },
    },
  },
  // Instructor profili uchun (Course Details sahifasida ko'rsatiladi)
  jobTitle: {
    type: String,
    default: null,
    maxlength: 100,
  },
  position: {
    type: String,
    default: null,
    maxlength: 150,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  // Telegram bot bildirishnomalar uchun
  telegramUserId: {
    type: String,
    default: null,
  },
  telegramChatId: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ isActive: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if user has all required subscriptions
userSchema.methods.hasAllSubscriptions = function () {
  return this.socialSubscriptions.instagram.subscribed && 
         this.socialSubscriptions.telegram.subscribed;
};

module.exports = mongoose.model('User', userSchema);
