const DEFAULT_ACCESS_SECRET = 'your-access-token-secret-change-in-production';
const DEFAULT_REFRESH_SECRET = 'your-refresh-token-secret-change-in-production';
const DEFAULT_RESET_SECRET = 'your-reset-token-secret-change-in-production';

if (process.env.NODE_ENV === 'production') {
  if (!process.env.ACCESS_TOKEN_SECRET || process.env.ACCESS_TOKEN_SECRET === DEFAULT_ACCESS_SECRET) {
    console.warn('⚠️ ACCESS_TOKEN_SECRET should be set in production!');
  }
  if (!process.env.REFRESH_TOKEN_SECRET || process.env.REFRESH_TOKEN_SECRET === DEFAULT_REFRESH_SECRET) {
    console.warn('⚠️ REFRESH_TOKEN_SECRET should be set in production!');
  }
  if (!process.env.RESET_TOKEN_SECRET || process.env.RESET_TOKEN_SECRET === DEFAULT_RESET_SECRET) {
    console.warn('⚠️ RESET_TOKEN_SECRET should be set in production!');
  }
}

module.exports = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || DEFAULT_ACCESS_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || DEFAULT_REFRESH_SECRET,
  RESET_TOKEN_SECRET: process.env.RESET_TOKEN_SECRET || DEFAULT_RESET_SECRET,
  ACCESS_TOKEN_EXPIRE: process.env.ACCESS_TOKEN_EXPIRE || '15m',
  REFRESH_TOKEN_EXPIRE: process.env.REFRESH_TOKEN_EXPIRE || '7d',
};
