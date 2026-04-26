const jwt = require('jsonwebtoken');
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  RESET_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRE,
  REFRESH_TOKEN_EXPIRE,
} = require('../config/jwt');

const SIGN_OPTS_ACCESS = { algorithm: 'HS256', issuer: 'aidevix', audience: 'aidevix-api' };
const SIGN_OPTS_REFRESH = { algorithm: 'HS256', issuer: 'aidevix', audience: 'aidevix-refresh' };
const SIGN_OPTS_RESET = { algorithm: 'HS256', issuer: 'aidevix', audience: 'aidevix-reset' };
const SIGN_OPTS_2FA = { algorithm: 'HS256', issuer: 'aidevix', audience: 'aidevix-2fa' };

const VERIFY_OPTS_ACCESS = { algorithms: ['HS256'], issuer: 'aidevix', audience: 'aidevix-api' };
const VERIFY_OPTS_REFRESH = { algorithms: ['HS256'], issuer: 'aidevix', audience: 'aidevix-refresh' };
const VERIFY_OPTS_RESET = { algorithms: ['HS256'], issuer: 'aidevix', audience: 'aidevix-reset' };
const VERIFY_OPTS_2FA = { algorithms: ['HS256'], issuer: 'aidevix', audience: 'aidevix-2fa' };

// Absolute lifetime cap on refresh-token families (NIST 800-63B sliding-cap guidance).
// First-issued refresh sets `exp = now + REFRESH_TOKEN_EXPIRE`. Rotated refreshes copy the
// SAME `exp` (not a fresh +7d), capping the family. Once expired, user must re-login.
const REFRESH_ABSOLUTE_TTL_SECONDS = 7 * 24 * 60 * 60;

const generateAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    ...SIGN_OPTS_ACCESS,
    expiresIn: ACCESS_TOKEN_EXPIRE,
  });
};

/**
 * Generate refresh token. If `absoluteExp` is provided (epoch seconds), the token's `exp`
 * claim is forced to that value, propagating the family's hard cap across rotations.
 * Otherwise a fresh +REFRESH_TOKEN_EXPIRE is set (initial login).
 */
const generateRefreshToken = (payload, absoluteExp = null) => {
  const opts = { ...SIGN_OPTS_REFRESH };
  const finalPayload = { ...payload };
  if (absoluteExp && Number.isFinite(absoluteExp)) {
    finalPayload.exp = absoluteExp;
  } else {
    opts.expiresIn = REFRESH_TOKEN_EXPIRE;
  }
  return jwt.sign(finalPayload, REFRESH_TOKEN_SECRET, opts);
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET, VERIFY_OPTS_ACCESS);
  } catch (error) {
    return null;
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET, VERIFY_OPTS_REFRESH);
  } catch (error) {
    return null;
  }
};

const generateResetToken = (payload) => {
  return jwt.sign(payload, RESET_TOKEN_SECRET, {
    ...SIGN_OPTS_RESET,
    expiresIn: '15m',
  });
};

const verifyResetToken = (token) => {
  try {
    return jwt.verify(token, RESET_TOKEN_SECRET, VERIFY_OPTS_RESET);
  } catch (error) {
    return null;
  }
};

// Short-lived 2FA challenge — issued after password OK, exchanged for tokens with TOTP code.
// Uses RESET_TOKEN_SECRET to avoid introducing yet another env var; audience separation prevents confusion.
const generate2FAChallenge = (payload) => {
  return jwt.sign(payload, RESET_TOKEN_SECRET, {
    ...SIGN_OPTS_2FA,
    expiresIn: '5m',
  });
};

const verify2FAChallenge = (token) => {
  try {
    return jwt.verify(token, RESET_TOKEN_SECRET, VERIFY_OPTS_2FA);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  generate2FAChallenge,
  verifyAccessToken,
  verifyRefreshToken,
  verifyResetToken,
  verify2FAChallenge,
  REFRESH_ABSOLUTE_TTL_SECONDS,
};
