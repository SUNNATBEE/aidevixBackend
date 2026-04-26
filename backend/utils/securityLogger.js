const logger = require('./logger');

// Mask email for GDPR-compliant logging: user@example.com → use***@example.com
const maskEmail = (email) => {
  if (!email || typeof email !== 'string') return null;
  const atIdx = email.indexOf('@');
  if (atIdx < 0) return '***';
  const local = email.slice(0, atIdx);
  const domain = email.slice(atIdx + 1);
  const visible = Math.min(3, local.length);
  return `${local.slice(0, visible)}***@${domain}`;
};

const extractIp = (req) =>
  req?.ip ||
  req?.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
  req?.connection?.remoteAddress ||
  null;

const extractUa = (req) =>
  (req?.headers?.['user-agent'] || '').slice(0, 120) || null;

const baseContext = (req) => ({
  ip: extractIp(req),
  ua: extractUa(req),
  path: req?.originalUrl || null,
  method: req?.method || null,
});

const securityLogger = {
  loginSuccess: (req, user) =>
    logger.info('auth.login.success', {
      ...baseContext(req),
      userId: String(user._id),
      email: maskEmail(user.email),
    }),

  loginFailed: (req, reason, meta = {}) =>
    logger.warn('auth.login.failed', {
      ...baseContext(req),
      reason,
      ...meta,
    }),

  loginLocked: (req, user) =>
    logger.warn('auth.login.locked', {
      ...baseContext(req),
      userId: String(user._id),
      email: maskEmail(user.email),
      lockUntil: user.lockUntil,
      attempts: user.failedLoginAttempts,
    }),

  registerSuccess: (req, user) =>
    logger.info('auth.register.success', {
      ...baseContext(req),
      userId: String(user._id),
      email: maskEmail(user.email),
    }),

  logout: (req, userId) =>
    logger.info('auth.logout', {
      ...baseContext(req),
      userId: userId ? String(userId) : null,
    }),

  passwordResetRequested: (req, email, found) =>
    logger.info('auth.password.reset.requested', {
      ...baseContext(req),
      email: maskEmail(email),
      userFound: found,
    }),

  passwordResetCompleted: (req, user) =>
    logger.warn('auth.password.reset.completed', {
      ...baseContext(req),
      userId: String(user._id),
      email: maskEmail(user.email),
    }),

  passwordChanged: (req, user) =>
    logger.warn('auth.password.changed', {
      ...baseContext(req),
      userId: String(user._id),
      email: maskEmail(user.email),
    }),

  refreshTokenReuse: (req, userId) =>
    logger.error('auth.refresh.reuse_detected', {
      ...baseContext(req),
      userId: userId ? String(userId) : null,
      severity: 'critical',
    }),

  refreshTokenInvalid: (req, reason) =>
    logger.warn('auth.refresh.invalid', {
      ...baseContext(req),
      reason,
    }),

  tokenVersionMismatch: (req, userId) =>
    logger.warn('auth.token.version_mismatch', {
      ...baseContext(req),
      userId: userId ? String(userId) : null,
    }),

  emailVerificationFailed: (req, userId, reason) =>
    logger.warn('auth.email.verify.failed', {
      ...baseContext(req),
      userId: userId ? String(userId) : null,
      reason,
    }),

  emailVerificationSucceeded: (req, user) =>
    logger.info('auth.email.verify.success', {
      ...baseContext(req),
      userId: String(user._id),
      email: maskEmail(user.email),
    }),

  csrfRejected: (req) =>
    logger.warn('security.csrf.rejected', baseContext(req)),

  newDeviceLogin: (req, user, deviceHash) =>
    logger.warn('auth.login.new_device', {
      ...baseContext(req),
      userId: String(user._id),
      email: maskEmail(user.email),
      deviceHash: deviceHash ? deviceHash.slice(0, 12) : null,
    }),

  passwordReuseRejected: (req, userId) =>
    logger.warn('auth.password.reuse_rejected', {
      ...baseContext(req),
      userId: userId ? String(userId) : null,
    }),

  passwordPwned: (req, userId, count) =>
    logger.warn('auth.password.pwned_rejected', {
      ...baseContext(req),
      userId: userId ? String(userId) : null,
      breachCount: count,
    }),

  sessionRevoked: (req, userId, sessionId, by) =>
    logger.info('auth.session.revoked', {
      ...baseContext(req),
      userId: userId ? String(userId) : null,
      sessionId: sessionId ? String(sessionId) : null,
      by, // 'self' | 'admin' | 'reuse' | 'logout'
    }),

  refreshAbsoluteCapHit: (req, userId) =>
    logger.warn('auth.refresh.absolute_cap_hit', {
      ...baseContext(req),
      userId: userId ? String(userId) : null,
    }),

  accountDeleted: (req, user, by) =>
    logger.warn('auth.account.deleted', {
      ...baseContext(req),
      userId: String(user._id),
      email: maskEmail(user.email),
      by, // 'self' | 'admin'
    }),

  suspicious: (req, event, meta = {}) =>
    logger.warn(`security.suspicious.${event}`, {
      ...baseContext(req),
      ...meta,
    }),
};

module.exports = securityLogger;
