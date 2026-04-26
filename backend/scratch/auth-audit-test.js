/**
 * Auth Audit — Unit Tests (no DB required)
 *
 * Run: node --test backend/scratch/auth-audit-test.js
 */
const test = require('node:test');
const assert = require('node:assert/strict');

// Force test secrets so config/jwt.js doesn't refuse to boot
process.env.NODE_ENV = 'test';
process.env.ACCESS_TOKEN_SECRET = 'a'.repeat(48);
process.env.REFRESH_TOKEN_SECRET = 'b'.repeat(48);
process.env.RESET_TOKEN_SECRET = 'c'.repeat(48);
process.env.CSRF_SECRET = 'd'.repeat(48);

const path = require('path');
const ROOT = path.join(__dirname, '..');

const {
  hashToken,
  safeEqual,
  parseCookies,
  generateCsrfToken,
  verifyCsrfToken,
  attachAuthCookies,
  clearAuthCookies,
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  CSRF_COOKIE_NAME,
} = require(path.join(ROOT, 'utils/authSecurity'));

const {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateResetToken,
  verifyResetToken,
  generate2FAChallenge,
  verify2FAChallenge,
} = require(path.join(ROOT, 'utils/jwt'));

// ─────────────────────────────────────────────────────────────────
// 1. hashToken & safeEqual
// ─────────────────────────────────────────────────────────────────
test('hashToken: deterministic SHA-256', () => {
  const a = hashToken('abc');
  const b = hashToken('abc');
  assert.equal(a, b);
  assert.equal(a.length, 64); // hex of 32 bytes
});

test('hashToken: different inputs → different hashes', () => {
  assert.notEqual(hashToken('abc'), hashToken('abd'));
});

test('safeEqual: equal strings', () => {
  assert.equal(safeEqual('abc', 'abc'), true);
});

test('safeEqual: different lengths → false (no leak)', () => {
  assert.equal(safeEqual('abc', 'abcd'), false);
});

test('safeEqual: empty inputs handled', () => {
  assert.equal(safeEqual('', ''), true);
  assert.equal(safeEqual(undefined, undefined), true);
  assert.equal(safeEqual('a', ''), false);
});

// ─────────────────────────────────────────────────────────────────
// 2. parseCookies
// ─────────────────────────────────────────────────────────────────
test('parseCookies: basic header', () => {
  const c = parseCookies('a=1; b=2; c=hello%20world');
  assert.deepEqual(c, { a: '1', b: '2', c: 'hello world' });
});

test('parseCookies: empty', () => {
  assert.deepEqual(parseCookies(''), {});
  assert.deepEqual(parseCookies(undefined), {});
});

test('parseCookies: malformed parts skipped', () => {
  const c = parseCookies('a=1; broken; b=2');
  assert.deepEqual(c, { a: '1', b: '2' });
});

test('parseCookies: cookie value with = signs preserved', () => {
  const c = parseCookies('jwt=eyJ.abc=.xyz');
  assert.equal(c.jwt, 'eyJ.abc=.xyz');
});

// ─────────────────────────────────────────────────────────────────
// 3. CSRF token (generate / verify, HMAC integrity)
// ─────────────────────────────────────────────────────────────────
test('CSRF: generate then verify', () => {
  const t = generateCsrfToken();
  assert.match(t, /^[a-f0-9]+\.[a-f0-9]+$/);
  assert.equal(verifyCsrfToken(t), true);
});

test('CSRF: tampered signature rejected', () => {
  const t = generateCsrfToken();
  const [random, sig] = t.split('.');
  const tampered = `${random}.${sig.slice(0, -1)}0`;
  assert.equal(verifyCsrfToken(tampered), false);
});

test('CSRF: tampered random portion rejected', () => {
  const t = generateCsrfToken();
  const [random, sig] = t.split('.');
  const tampered = `${random.slice(0, -1)}0.${sig}`;
  assert.equal(verifyCsrfToken(tampered), false);
});

test('CSRF: malformed → false (no throw)', () => {
  assert.equal(verifyCsrfToken(''), false);
  assert.equal(verifyCsrfToken(null), false);
  assert.equal(verifyCsrfToken('no_dot'), false);
  assert.equal(verifyCsrfToken('a.b.c'), false);
});

// ─────────────────────────────────────────────────────────────────
// 4. JWT lifecycle — issuer/audience separation
// ─────────────────────────────────────────────────────────────────
test('Access token roundtrip', () => {
  const token = generateAccessToken({ userId: 'u1', tv: 0 });
  const decoded = verifyAccessToken(token);
  assert.ok(decoded);
  assert.equal(decoded.userId, 'u1');
  assert.equal(decoded.tv, 0);
  assert.equal(decoded.iss, 'aidevix');
  assert.equal(decoded.aud, 'aidevix-api');
});

test('Refresh token cannot be verified as Access (audience separation)', () => {
  const refresh = generateRefreshToken({ userId: 'u1', tv: 0 });
  // Verifying refresh token via access verify should fail (different audience)
  assert.equal(verifyAccessToken(refresh), null);
});

test('Reset token cannot be verified as Access', () => {
  const reset = generateResetToken({ uid: 'u1', email: 'a@b.c' });
  assert.equal(verifyAccessToken(reset), null);
});

test('2FA challenge cannot be verified as Reset (audience differ)', () => {
  const challenge = generate2FAChallenge({ uid: 'u1' });
  assert.equal(verifyResetToken(challenge), null);
  // But its own verify works
  const decoded = verify2FAChallenge(challenge);
  assert.ok(decoded);
  assert.equal(decoded.uid, 'u1');
});

test('Tampered token rejected', () => {
  const token = generateAccessToken({ userId: 'u1' });
  const tampered = token.slice(0, -2) + 'XX';
  assert.equal(verifyAccessToken(tampered), null);
});

test('JWT alg=none attack rejected (algorithms whitelist)', () => {
  const jwt = require('jsonwebtoken');
  // Build a token signed with 'none' (or empty); should not verify.
  const noneToken = jwt.sign({ userId: 'attacker' }, '', {
    algorithm: 'none',
    issuer: 'aidevix',
    audience: 'aidevix-api',
  });
  assert.equal(verifyAccessToken(noneToken), null);
});

test('JWT signed with wrong secret rejected', () => {
  const jwt = require('jsonwebtoken');
  const fake = jwt.sign({ userId: 'x' }, 'wrong-secret-32chars-long-AAAAAAAA', {
    algorithm: 'HS256',
    issuer: 'aidevix',
    audience: 'aidevix-api',
    expiresIn: '15m',
  });
  assert.equal(verifyAccessToken(fake), null);
});

// ─────────────────────────────────────────────────────────────────
// 5. Cookie hardening — flags must be set
// ─────────────────────────────────────────────────────────────────
const collectCookies = () => {
  const headers = {};
  const res = {
    setHeader(name, value) { headers[name] = value; },
  };
  attachAuthCookies(res, 'access-token-XYZ', 'refresh-token-ABC');
  return headers['Set-Cookie'];
};

test('attachAuthCookies: sets all 3 cookies', () => {
  const cookies = collectCookies();
  assert.ok(Array.isArray(cookies));
  assert.equal(cookies.length, 3);
  const names = cookies.map((c) => c.split('=')[0]);
  assert.ok(names.includes(ACCESS_COOKIE_NAME));
  assert.ok(names.includes(REFRESH_COOKIE_NAME));
  assert.ok(names.includes(CSRF_COOKIE_NAME));
});

test('Access & Refresh cookies are HttpOnly', () => {
  const cookies = collectCookies();
  const access = cookies.find((c) => c.startsWith(ACCESS_COOKIE_NAME + '='));
  const refresh = cookies.find((c) => c.startsWith(REFRESH_COOKIE_NAME + '='));
  assert.match(access, /HttpOnly/);
  assert.match(refresh, /HttpOnly/);
});

test('CSRF cookie is NOT HttpOnly (must be JS-readable)', () => {
  const cookies = collectCookies();
  const csrf = cookies.find((c) => c.startsWith(CSRF_COOKIE_NAME + '='));
  assert.ok(!/HttpOnly/.test(csrf));
});

test('Production: cookies are Secure + SameSite=None', () => {
  const oldEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  const cookies = collectCookies();
  const access = cookies.find((c) => c.startsWith(ACCESS_COOKIE_NAME + '='));
  assert.match(access, /Secure/);
  assert.match(access, /SameSite=None/);
  process.env.NODE_ENV = oldEnv;
});

test('Dev: cookies use SameSite=Lax (not None)', () => {
  const oldEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'test';
  const cookies = collectCookies();
  const access = cookies.find((c) => c.startsWith(ACCESS_COOKIE_NAME + '='));
  assert.match(access, /SameSite=Lax/);
  process.env.NODE_ENV = oldEnv;
});

test('Access cookie Max-Age = 15 min (900s)', () => {
  const cookies = collectCookies();
  const access = cookies.find((c) => c.startsWith(ACCESS_COOKIE_NAME + '='));
  assert.match(access, /Max-Age=900\b/);
});

test('Refresh cookie Max-Age = 7 days', () => {
  const cookies = collectCookies();
  const refresh = cookies.find((c) => c.startsWith(REFRESH_COOKIE_NAME + '='));
  assert.match(refresh, /Max-Age=604800\b/);
});

test('clearAuthCookies wipes all 3 cookies', () => {
  const headers = {};
  const res = { setHeader(name, value) { headers[name] = value; } };
  clearAuthCookies(res);
  const cookies = headers['Set-Cookie'];
  assert.equal(cookies.length, 3);
  cookies.forEach((c) => {
    assert.match(c, /Max-Age=0/);
    assert.match(c, /Expires=Thu, 01 Jan 1970/);
  });
});

// ─────────────────────────────────────────────────────────────────
// 6. Password regex (matches authController)
// ─────────────────────────────────────────────────────────────────
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,128}$/;

test('Password: valid strong passwords', () => {
  assert.ok(passwordRegex.test('Aa1!aaaa'));
  assert.ok(passwordRegex.test('LongerPass123!@#'));
  assert.ok(passwordRegex.test('Mix3d!Pass'));
});

test('Password: invalid — missing classes', () => {
  assert.equal(passwordRegex.test('alllowerc1!'), false); // no upper
  assert.equal(passwordRegex.test('ALLUPPER1!'), false); // no lower
  assert.equal(passwordRegex.test('NoDigits!'), false);
  assert.equal(passwordRegex.test('NoSpec1al'), false); // no special
  assert.equal(passwordRegex.test('Aa1!short'), true); // exactly 9, OK
  assert.equal(passwordRegex.test('Aa1!aaa'), false); // 7 chars
});

test('Password: rejects whitespace-only "special"', () => {
  // \s is excluded from special class via [^\w\s]
  assert.equal(passwordRegex.test('Aa1 aaaaa'), false);
});

test('Password: max length 128', () => {
  const long = 'A1!' + 'a'.repeat(125); // 128 chars
  assert.ok(passwordRegex.test(long));
  const tooLong = 'A1!' + 'a'.repeat(126);
  assert.equal(passwordRegex.test(tooLong), false);
});

// ─────────────────────────────────────────────────────────────────
// 7. Username regex
// ─────────────────────────────────────────────────────────────────
const usernameRegex = /^[a-z0-9._-]{3,50}$/;

test('Username: valid cases', () => {
  assert.ok(usernameRegex.test('user123'));
  assert.ok(usernameRegex.test('a.b-c_d'));
  assert.ok(usernameRegex.test('abc'));
});

test('Username: rejects uppercase, space, special', () => {
  assert.equal(usernameRegex.test('UserName'), false);
  assert.equal(usernameRegex.test('user name'), false);
  assert.equal(usernameRegex.test('user@x'), false);
  assert.equal(usernameRegex.test('ab'), false); // too short
  assert.equal(usernameRegex.test('a'.repeat(51)), false);
});

// ─────────────────────────────────────────────────────────────────
// 8. CSRF protection — middleware behavior simulation
// ─────────────────────────────────────────────────────────────────
const csrfMiddleware = require(path.join(ROOT, 'middleware/csrfProtection'));

const runMw = (req) =>
  new Promise((resolve) => {
    const res = {
      statusCode: 200,
      _body: null,
      status(code) { this.statusCode = code; return this; },
      json(body) { this._body = body; resolve({ res: this, called: false }); },
    };
    csrfMiddleware(req, res, () => resolve({ res, called: true }));
  });

test('CSRF: GET passes through', async () => {
  const r = await runMw({ method: 'GET', path: '/api/x', headers: { cookie: '' } });
  assert.equal(r.called, true);
});

test('CSRF: POST without auth cookie passes (no session)', async () => {
  const r = await runMw({ method: 'POST', path: '/api/x', headers: { cookie: '' } });
  assert.equal(r.called, true);
});

test('CSRF: POST with auth cookie — missing CSRF rejected', async () => {
  const r = await runMw({
    method: 'POST',
    path: '/api/x',
    headers: { cookie: `${ACCESS_COOKIE_NAME}=fake-access` },
  });
  assert.equal(r.called, false);
  assert.equal(r.res.statusCode, 403);
});

test('CSRF: POST with valid double-submit passes', async () => {
  const csrf = generateCsrfToken();
  const r = await runMw({
    method: 'POST',
    path: '/api/x',
    headers: {
      cookie: `${ACCESS_COOKIE_NAME}=fake; ${CSRF_COOKIE_NAME}=${csrf}`,
      'x-csrf-token': csrf,
    },
  });
  assert.equal(r.called, true);
});

test('CSRF: POST with mismatched header/cookie rejected', async () => {
  const csrf1 = generateCsrfToken();
  const csrf2 = generateCsrfToken();
  const r = await runMw({
    method: 'POST',
    path: '/api/x',
    headers: {
      cookie: `${ACCESS_COOKIE_NAME}=fake; ${CSRF_COOKIE_NAME}=${csrf1}`,
      'x-csrf-token': csrf2,
    },
  });
  assert.equal(r.called, false);
  assert.equal(r.res.statusCode, 403);
});

test('CSRF: POST with forged CSRF (bad signature) rejected', async () => {
  const fake = 'aabbccdd.deadbeef'; // valid format but bad HMAC
  const r = await runMw({
    method: 'POST',
    path: '/api/x',
    headers: {
      cookie: `${ACCESS_COOKIE_NAME}=fake; ${CSRF_COOKIE_NAME}=${fake}`,
      'x-csrf-token': fake,
    },
  });
  assert.equal(r.called, false);
  assert.equal(r.res.statusCode, 403);
});

test('CSRF: exempt path /api/auth/login bypasses', async () => {
  const r = await runMw({
    method: 'POST',
    path: '/api/auth/login',
    headers: { cookie: `${ACCESS_COOKIE_NAME}=any` },
  });
  assert.equal(r.called, true);
});

test('CSRF: exempt path /api/auth/refresh-token bypasses', async () => {
  const r = await runMw({
    method: 'POST',
    path: '/api/auth/refresh-token',
    headers: { cookie: `${ACCESS_COOKIE_NAME}=any` },
  });
  assert.equal(r.called, true);
});

// ─────────────────────────────────────────────────────────────────
// 9. Password history — reuse rejection
// ─────────────────────────────────────────────────────────────────
const bcrypt = require('bcryptjs');
const { isPasswordReused, trimHistory, HISTORY_SIZE } =
  require(path.join(ROOT, 'utils/passwordHistory'));

test('passwordHistory: empty history → not reused', async () => {
  assert.equal(await isPasswordReused('any', []), false);
});

test('passwordHistory: matches old hash → reused=true', async () => {
  const hash = await bcrypt.hash('OldPass1!aaa', 4);
  assert.equal(await isPasswordReused('OldPass1!aaa', [hash]), true);
});

test('passwordHistory: different password → reused=false', async () => {
  const hash = await bcrypt.hash('OldPass1!aaa', 4);
  assert.equal(await isPasswordReused('NewPass1!aaa', [hash]), false);
});

test('passwordHistory: malformed hash entry skipped, not thrown', async () => {
  const hash = await bcrypt.hash('OldPass1!aaa', 4);
  assert.equal(
    await isPasswordReused('OldPass1!aaa', ['not-a-bcrypt-hash', hash]),
    true
  );
});

test('passwordHistory: trim caps at HISTORY_SIZE', () => {
  const big = Array.from({ length: 20 }, (_, i) => `h${i}`);
  assert.equal(trimHistory(big).length, HISTORY_SIZE);
});

// ─────────────────────────────────────────────────────────────────
// 10. Device fingerprint
// ─────────────────────────────────────────────────────────────────
const {
  buildDeviceHash,
  truncateIp,
  buildFromReq,
} = require(path.join(ROOT, 'utils/deviceFingerprint'));

test('deviceFingerprint: same UA + same /24 IP → same hash', () => {
  const a = buildDeviceHash('Mozilla/5.0', '203.0.113.10');
  const b = buildDeviceHash('Mozilla/5.0', '203.0.113.250');
  assert.equal(a, b);
});

test('deviceFingerprint: different /24 → different hash', () => {
  const a = buildDeviceHash('Mozilla/5.0', '203.0.113.10');
  const b = buildDeviceHash('Mozilla/5.0', '203.0.114.10');
  assert.notEqual(a, b);
});

test('deviceFingerprint: different UA → different hash', () => {
  const a = buildDeviceHash('Chrome', '203.0.113.10');
  const b = buildDeviceHash('Firefox', '203.0.113.10');
  assert.notEqual(a, b);
});

test('truncateIp: IPv4 zeros last octet', () => {
  assert.equal(truncateIp('1.2.3.4'), '1.2.3.0');
});

test('truncateIp: IPv6 takes /48', () => {
  assert.equal(
    truncateIp('2001:db8:1234:5678:9abc:def0:1234:5678'),
    '2001:db8:1234'
  );
});

test('buildFromReq: extracts UA + IP from req shape', () => {
  const req = {
    ip: '203.0.113.5',
    headers: { 'user-agent': 'TestAgent' },
  };
  const h = buildFromReq(req);
  assert.equal(h, buildDeviceHash('TestAgent', '203.0.113.5'));
});

// ─────────────────────────────────────────────────────────────────
// 11. Step-up reauth token
// ─────────────────────────────────────────────────────────────────
const { issueReauthToken, verifyReauthToken } =
  require(path.join(ROOT, 'middleware/stepUp'));

test('reauth: roundtrip', () => {
  const t = issueReauthToken('user-123');
  const decoded = verifyReauthToken(t);
  assert.ok(decoded);
  assert.equal(decoded.uid, 'user-123');
  assert.equal(decoded.aud, 'aidevix-reauth');
});

test('reauth: cannot be verified as access token (audience separation)', () => {
  const t = issueReauthToken('user-123');
  assert.equal(verifyAccessToken(t), null);
});

test('reauth: tampered → null', () => {
  const t = issueReauthToken('user-123');
  assert.equal(verifyReauthToken(t.slice(0, -2) + 'XX'), null);
});

// ─────────────────────────────────────────────────────────────────
// 12. Refresh token absolute lifetime cap
// ─────────────────────────────────────────────────────────────────
const { generateRefreshToken: genRefresh, verifyRefreshToken: verRefresh } =
  require(path.join(ROOT, 'utils/jwt'));

test('refresh: absoluteExp clamps the exp claim', () => {
  const fixedExp = Math.floor(Date.now() / 1000) + 60; // 60s from now
  const token = genRefresh({ userId: 'u1', tv: 0, sid: 's1' }, fixedExp);
  const decoded = verRefresh(token);
  assert.ok(decoded);
  assert.equal(decoded.exp, fixedExp);
  assert.equal(decoded.sid, 's1');
});

test('refresh: rotation does not extend exp', () => {
  const fixedExp = Math.floor(Date.now() / 1000) + 60;
  const t1 = genRefresh({ userId: 'u1', tv: 0, sid: 's1' }, fixedExp);
  // Simulate rotation: pass same absoluteExp
  const t2 = genRefresh({ userId: 'u1', tv: 0, sid: 's1' }, fixedExp);
  assert.equal(verRefresh(t1).exp, verRefresh(t2).exp);
});

test('refresh: expired absoluteExp → verify returns null', () => {
  const pastExp = Math.floor(Date.now() / 1000) - 10;
  const token = genRefresh({ userId: 'u1', tv: 0, sid: 's1' }, pastExp);
  assert.equal(verRefresh(token), null);
});

// ─────────────────────────────────────────────────────────────────
// 13. HIBP utility (network-skipped, just shape contract)
// ─────────────────────────────────────────────────────────────────
const { checkPasswordPwned } = require(path.join(ROOT, 'utils/hibp'));

test('HIBP: empty input → not pwned, not checked', async () => {
  const r = await checkPasswordPwned('');
  assert.equal(r.pwned, false);
  assert.equal(r.checked, false);
});

test('HIBP: HIBP_ENABLED=false short-circuits', async () => {
  const old = process.env.HIBP_ENABLED;
  process.env.HIBP_ENABLED = 'false';
  const r = await checkPasswordPwned('Password123!');
  assert.equal(r.checked, false);
  assert.equal(r.pwned, false);
  process.env.HIBP_ENABLED = old;
});

// ─────────────────────────────────────────────────────────────────
// 14. CAPTCHA utility (no-provider noop path)
// ─────────────────────────────────────────────────────────────────
const { verifyCaptcha, isEnabled: captchaEnabled } =
  require(path.join(ROOT, 'utils/captcha'));

test('captcha: disabled (no env) → ok=true', async () => {
  // Module-level env vars captured at require time. Since none set, isEnabled=false.
  assert.equal(captchaEnabled(), false);
  const r = await verifyCaptcha('any-token', '1.2.3.4');
  assert.equal(r.ok, true);
  assert.equal(r.reason, 'captcha_disabled');
});
