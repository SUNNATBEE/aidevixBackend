const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');
const { ACCESS_COOKIE_NAME, parseCookies } = require('../utils/authSecurity');
const securityLogger = require('../utils/securityLogger');

const authDebug = (...args) => {
  if (process.env.AUTH_DEBUG === 'true') {
    console.log('[AUTH_DEBUG]', ...args);
  }
};

const unauthorized = (res, message) =>
  res.status(401).json({ success: false, message });

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const cookies = parseCookies(req.headers.cookie);
    const bearerToken =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : null;
    const token = cookies[ACCESS_COOKIE_NAME] || bearerToken;

    if (!token) {
      return unauthorized(res, 'No token provided. Authorization denied.');
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      authDebug('authenticate:access_verify_failed', {
        hasCookieToken: Boolean(cookies[ACCESS_COOKIE_NAME]),
        hasBearerToken: Boolean(bearerToken),
      });
      return unauthorized(res, 'Invalid or expired token.');
    }

    // password/refreshToken already have `select: false` in schema.
    // Keep selection simple to reliably include tokenVersion.
    const user = await User.findById(decoded.userId).select('+tokenVersion');

    if (!user) {
      return unauthorized(res, 'User not found or inactive.');
    }

    if (!user.isActive) {
      securityLogger.suspicious(req, 'inactive_user_access', { userId: String(user._id) });
      return unauthorized(res, 'User not found or inactive.');
    }

    if (typeof decoded.tv === 'number' && decoded.tv !== (user.tokenVersion || 0)) {
      authDebug('authenticate:token_version_mismatch', {
        userId: String(user._id),
        decodedTv: decoded.tv,
        dbTv: user.tokenVersion || 0,
      });
      securityLogger.tokenVersionMismatch(req, user._id);
      return unauthorized(res, 'Session expired. Please login again.');
    }

    req.user = user;
    next();
  } catch (error) {
    return unauthorized(res, 'Authentication failed.');
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  if (req.user) {
    securityLogger.suspicious(req, 'admin_access_denied', { userId: String(req.user._id) });
  }
  return res.status(403).json({
    success: false,
    message: 'Admin access required.',
  });
};

module.exports = {
  authenticate,
  requireAdmin,
};
