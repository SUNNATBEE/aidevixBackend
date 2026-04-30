const https = require('https');
const logger = require('./logger');

function loadEnv() {
  try {
    require('dotenv').config({ path: 'backend/.env' });
  } catch {}
}

function send(text) {
  loadEnv();
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!token || !chatId) return Promise.resolve({ ok: false, reason: 'missing-env' });

  const body = JSON.stringify({
    chat_id: chatId,
    text: `🤖 *AutoFix*\n\n${text}`,
    parse_mode: 'Markdown',
  });

  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: 'api.telegram.org',
        path: `/bot${token}/sendMessage`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        timeout: 5000,
      },
      (res) => {
        let data = '';
        res.on('data', (d) => (data += d));
        res.on('end', () => resolve({ ok: res.statusCode === 200, status: res.statusCode }));
      }
    );
    req.on('error', (err) => {
      logger.warn('Telegram notify error', { error: err.message });
      resolve({ ok: false, error: err.message });
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false, reason: 'timeout' });
    });
    req.write(body);
    req.end();
  });
}

module.exports = { send };
