const DEFAULT_ACCESS_SECRET = 'your-access-token-secret-change-in-production';
const DEFAULT_REFRESH_SECRET = 'your-refresh-token-secret-change-in-production';

if (process.env.NODE_ENV === 'production') {
  if (!process.env.ACCESS_TOKEN_SECRET || process.env.ACCESS_TOKEN_SECRET === DEFAULT_ACCESS_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET must be set in production');
  }
  if (!process.env.REFRESH_TOKEN_SECRET || process.env.REFRESH_TOKEN_SECRET === DEFAULT_REFRESH_SECRET) {
    throw new Error('REFRESH_TOKEN_SECRET must be set in production');
  }
}

module.exports = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || DEFAULT_ACCESS_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || DEFAULT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRE: process.env.ACCESS_TOKEN_EXPIRE || '15m',
  REFRESH_TOKEN_EXPIRE: process.env.REFRESH_TOKEN_EXPIRE || '7d',
};
