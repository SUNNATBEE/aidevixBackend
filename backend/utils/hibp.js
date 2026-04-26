/**
 * HaveIBeenPwned — Pwned Passwords k-anonymity check.
 *
 * Sends only the first 5 chars of the SHA-1 hash; never the full password.
 * Reference: https://haveibeenpwned.com/API/v3#PwnedPasswords
 *
 * Soft-fails on network error (we never block registration if HIBP is down).
 * NIST SP 800-63B §5.1.1.2 & OWASP ASVS V2.1.7.
 */
const crypto = require('crypto');
const https = require('https');

const HIBP_HOST = 'api.pwnedpasswords.com';
const HIBP_TIMEOUT_MS = 2500;
// If breach count >= this threshold, we reject. Many guides use any breach >=1; we set 1
// because even a single appearance means the password is in a public corpus.
const BREACH_THRESHOLD = 1;

const sha1Hex = (value) =>
  crypto.createHash('sha1').update(String(value)).digest('hex').toUpperCase();

const fetchRange = (prefix) =>
  new Promise((resolve, reject) => {
    const req = https.request(
      {
        host: HIBP_HOST,
        path: `/range/${prefix}`,
        method: 'GET',
        headers: {
          'User-Agent': 'Aidevix-Auth/1.0',
          'Add-Padding': 'true', // length-padding to defeat traffic analysis
        },
        timeout: HIBP_TIMEOUT_MS,
      },
      (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HIBP HTTP ${res.statusCode}`));
        }
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => resolve(data));
      }
    );
    req.on('timeout', () => req.destroy(new Error('HIBP timeout')));
    req.on('error', reject);
    req.end();
  });

/**
 * @returns {Promise<{ pwned: boolean, count: number, checked: boolean }>}
 *   - `pwned` = true only when count >= BREACH_THRESHOLD
 *   - `checked` = false if HIBP couldn't be reached (network/timeout) — caller decides
 */
const checkPasswordPwned = async (plaintext) => {
  if (!plaintext || typeof plaintext !== 'string') {
    return { pwned: false, count: 0, checked: false };
  }
  if (process.env.HIBP_ENABLED === 'false') {
    return { pwned: false, count: 0, checked: false };
  }

  try {
    const hash = sha1Hex(plaintext);
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);
    const body = await fetchRange(prefix);

    // Each line: "SUFFIX:COUNT\r\n"
    const lines = body.split('\n');
    for (const line of lines) {
      const [s, c] = line.trim().split(':');
      if (!s) continue;
      if (s.toUpperCase() === suffix) {
        const count = parseInt(c, 10) || 0;
        return { pwned: count >= BREACH_THRESHOLD, count, checked: true };
      }
    }
    return { pwned: false, count: 0, checked: true };
  } catch (err) {
    // Soft-fail: do NOT block user if HIBP is unreachable.
    return { pwned: false, count: 0, checked: false, error: err.message };
  }
};

module.exports = { checkPasswordPwned };
