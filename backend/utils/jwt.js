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

const VERIFY_OPTS_ACCESS = { algorithms: ['HS256'], issuer: 'aidevix', audience: 'aidevix-api' };
const VERIFY_OPTS_REFRESH = { algorithms: ['HS256'], issuer: 'aidevix', audience: 'aidevix-refresh' };
const VERIFY_OPTS_RESET = { algorithms: ['HS256'], issuer: 'aidevix', audience: 'aidevix-reset' };

const generateAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    ...SIGN_OPTS_ACCESS,
    expiresIn: ACCESS_TOKEN_EXPIRE,
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    ...SIGN_OPTS_REFRESH,
    expiresIn: REFRESH_TOKEN_EXPIRE,
  });
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

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyResetToken,
};
