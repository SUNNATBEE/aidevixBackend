/**
 * CAPTCHA verifier — supports Cloudflare Turnstile (preferred) and hCaptcha.
 * Provider chosen by env var. If unset → noop pass-through (dev / opt-in).
 *
 * Front-end submits the token via header `X-Captcha-Token` or body `captchaToken`.
 * Middleware (`captchaCheck.js`) reads it; this util just talks to the provider.
 */
const https = require('https');

const PROVIDER = (process.env.CAPTCHA_PROVIDER || '').toLowerCase(); // 'turnstile' | 'hcaptcha' | ''
const SECRET = process.env.CAPTCHA_SECRET || '';

const ENDPOINTS = {
  turnstile: { host: 'challenges.cloudflare.com', path: '/turnstile/v0/siteverify' },
  hcaptcha: { host: 'hcaptcha.com', path: '/siteverify' },
};

const isEnabled = () =>
  Boolean(PROVIDER) && Boolean(SECRET) && ENDPOINTS[PROVIDER];

const postForm = (host, path, body) =>
  new Promise((resolve, reject) => {
    const data = new URLSearchParams(body).toString();
    const req = https.request(
      {
        host,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(data),
        },
        timeout: 5000,
      },
      (res) => {
        let chunks = '';
        res.setEncoding('utf8');
        res.on('data', (c) => { chunks += c; });
        res.on('end', () => {
          try { resolve(JSON.parse(chunks)); }
          catch (e) { reject(e); }
        });
      }
    );
    req.on('timeout', () => req.destroy(new Error('captcha timeout')));
    req.on('error', reject);
    req.write(data);
    req.end();
  });

/**
 * @returns {Promise<{ ok: boolean, reason?: string, provider?: string }>}
 */
const verifyCaptcha = async (token, remoteIp) => {
  if (!isEnabled()) {
    return { ok: true, reason: 'captcha_disabled' };
  }
  if (!token || typeof token !== 'string') {
    return { ok: false, reason: 'no_token', provider: PROVIDER };
  }

  const { host, path } = ENDPOINTS[PROVIDER];
  try {
    const response = await postForm(host, path, {
      secret: SECRET,
      response: token,
      ...(remoteIp ? { remoteip: remoteIp } : {}),
    });
    if (response && response.success === true) {
      return { ok: true, provider: PROVIDER };
    }
    return {
      ok: false,
      reason: 'verify_failed',
      provider: PROVIDER,
      errors: response?.['error-codes'] || [],
    };
  } catch (err) {
    // Soft-fail in production? Hard-fail to keep gate honest.
    return { ok: false, reason: 'network_error', provider: PROVIDER, error: err.message };
  }
};

module.exports = { verifyCaptcha, isEnabled };
