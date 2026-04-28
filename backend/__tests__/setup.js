// Test environment setup — runs before each test file, before Jest framework installs.
// Only process.env setup here (jest.fn() not available at this stage).

process.env.NODE_ENV = 'test';
process.env.ACCESS_TOKEN_SECRET  = 'test-access-secret-that-is-at-least-32-characters-long';
process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret-that-is-at-least-32-characters-long';
process.env.RESET_TOKEN_SECRET   = 'test-reset-secret-that-is-at-least-32-characters-long!!';
process.env.CSRF_SECRET          = 'test-csrf-secret-that-is-at-least-32-characters-long!!!';
process.env.ACCESS_TOKEN_EXPIRE  = '15m';
process.env.REFRESH_TOKEN_EXPIRE = '7d';

// Disable external services during tests
process.env.HIBP_ENABLED                  = 'false';
process.env.CAPTCHA_PROVIDER              = '';
process.env.CAPTCHA_SECRET                = '';
process.env.NEWS_ENABLED                  = 'false';
process.env.CHALLENGE_SCHEDULER_ENABLED   = 'false';
process.env.TELEGRAM_BOT_TOKEN            = '';
process.env.TELEGRAM_CHANNEL_USERNAME     = 'testchannel';
process.env.TELEGRAM_ADMIN_CHAT_ID        = '123456';
process.env.FRONTEND_URL                  = 'http://localhost:3000';
