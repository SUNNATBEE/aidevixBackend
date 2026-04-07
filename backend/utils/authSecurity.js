const crypto = require('crypto');

const ACCESS_COOKIE_NAME = 'aidevix_access';
const REFRESH_COOKIE_NAME = 'aidevix_refresh';

const hashToken = (value) =>
  crypto.createHash('sha256').update(String(value)).digest('hex');

const parseCookies = (cookieHeader = '') =>
  cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((acc, part) => {
      const separatorIndex = part.indexOf('=');
      if (separatorIndex === -1) return acc;

      const key = part.slice(0, separatorIndex).trim();
      const value = decodeURIComponent(part.slice(separatorIndex + 1).trim());
      acc[key] = value;
      return acc;
    }, {});

const getCookieBaseOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  path: '/',
});

const serializeCookie = (name, value, options = {}) => {
  const normalized = {
    ...getCookieBaseOptions(),
    ...options,
  };

  const parts = [`${name}=${encodeURIComponent(value)}`];

  if (normalized.maxAge !== undefined) parts.push(`Max-Age=${normalized.maxAge}`);
  if (normalized.domain) parts.push(`Domain=${normalized.domain}`);
  if (normalized.path) parts.push(`Path=${normalized.path}`);
  if (normalized.expires) parts.push(`Expires=${normalized.expires.toUTCString()}`);
  if (normalized.httpOnly) parts.push('HttpOnly');
  if (normalized.secure) parts.push('Secure');
  if (normalized.sameSite) parts.push(`SameSite=${normalized.sameSite}`);

  return parts.join('; ');
};

const attachAuthCookies = (res, accessToken, refreshToken) => {
  const cookies = [
    serializeCookie(ACCESS_COOKIE_NAME, accessToken, { maxAge: 15 * 60 }),
    serializeCookie(REFRESH_COOKIE_NAME, refreshToken, { maxAge: 7 * 24 * 60 * 60 }),
  ];

  res.setHeader('Set-Cookie', cookies);
};

const clearAuthCookies = (res) => {
  const expired = new Date(0);
  const cookies = [
    serializeCookie(ACCESS_COOKIE_NAME, '', { expires: expired, maxAge: 0 }),
    serializeCookie(REFRESH_COOKIE_NAME, '', { expires: expired, maxAge: 0 }),
  ];

  res.setHeader('Set-Cookie', cookies);
};

module.exports = {
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  attachAuthCookies,
  clearAuthCookies,
  hashToken,
  parseCookies,
};
