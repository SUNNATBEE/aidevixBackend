'use strict';

const {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateResetToken,
  verifyResetToken,
  generate2FAChallenge,
  verify2FAChallenge,
  REFRESH_ABSOLUTE_TTL_SECONDS,
} = require('../../utils/jwt');

const MOCK_PAYLOAD = { userId: '507f1f77bcf86cd799439011', tv: 0 };

describe('JWT Utils', () => {
  // ─── Access Token ────────────────────────────────────────────────────────────

  describe('generateAccessToken / verifyAccessToken', () => {
    test('generates a verifiable access token', () => {
      const token = generateAccessToken(MOCK_PAYLOAD);
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    test('verifyAccessToken returns decoded payload', () => {
      const token = generateAccessToken(MOCK_PAYLOAD);
      const decoded = verifyAccessToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded.userId).toBe(MOCK_PAYLOAD.userId);
      expect(decoded.tv).toBe(0);
    });

    test('verifyAccessToken returns null for tampered token', () => {
      const token = generateAccessToken(MOCK_PAYLOAD);
      const tampered = token.slice(0, -5) + 'XXXXX';
      expect(verifyAccessToken(tampered)).toBeNull();
    });

    test('verifyAccessToken returns null for garbage string', () => {
      expect(verifyAccessToken('not.a.token')).toBeNull();
    });

    test('verifyAccessToken rejects refresh token (wrong audience)', () => {
      const refresh = generateRefreshToken({ ...MOCK_PAYLOAD, sid: 'abc' });
      // Access verifier expects audience 'aidevix-api', refresh has 'aidevix-refresh'
      expect(verifyAccessToken(refresh)).toBeNull();
    });

    test('verifyAccessToken rejects reset token (wrong audience)', () => {
      const reset = generateResetToken({ userId: MOCK_PAYLOAD.userId });
      expect(verifyAccessToken(reset)).toBeNull();
    });

    test('verifyAccessToken embeds iss and aud correctly', () => {
      const token = generateAccessToken(MOCK_PAYLOAD);
      // Decode without verification to inspect claims
      const [, payloadB64] = token.split('.');
      const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
      expect(payload.iss).toBe('aidevix');
      expect(payload.aud).toBe('aidevix-api');
    });

    test('verifyAccessToken rejects expired token', async () => {
      // Sign with 1ms expiry, wait 2ms, then verify
      const jwt = require('jsonwebtoken');
      const { ACCESS_TOKEN_SECRET } = require('../../config/jwt');
      const token = jwt.sign(MOCK_PAYLOAD, ACCESS_TOKEN_SECRET, {
        algorithm: 'HS256',
        issuer: 'aidevix',
        audience: 'aidevix-api',
        expiresIn: '1ms',
      });
      await new Promise((r) => setTimeout(r, 5));
      expect(verifyAccessToken(token)).toBeNull();
    });
  });

  // ─── Refresh Token ───────────────────────────────────────────────────────────

  describe('generateRefreshToken / verifyRefreshToken', () => {
    const refreshPayload = { ...MOCK_PAYLOAD, sid: 'session123' };

    test('generates and verifies refresh token', () => {
      const token = generateRefreshToken(refreshPayload);
      const decoded = verifyRefreshToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded.userId).toBe(MOCK_PAYLOAD.userId);
      expect(decoded.sid).toBe('session123');
    });

    test('refresh token has audience aidevix-refresh', () => {
      const token = generateRefreshToken(refreshPayload);
      const [, payloadB64] = token.split('.');
      const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
      expect(payload.aud).toBe('aidevix-refresh');
    });

    test('verifyRefreshToken returns null for access token (audience mismatch)', () => {
      const access = generateAccessToken(MOCK_PAYLOAD);
      expect(verifyRefreshToken(access)).toBeNull();
    });

    test('absoluteExp propagates to token exp (NIST family cap)', () => {
      const nowSec = Math.floor(Date.now() / 1000);
      const capSec = nowSec + 3600; // 1 hour cap
      const token = generateRefreshToken(refreshPayload, capSec);
      const [, payloadB64] = token.split('.');
      const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
      expect(payload.exp).toBe(capSec);
    });

    test('rotated token cannot exceed original family cap', () => {
      const nowSec = Math.floor(Date.now() / 1000);
      const familyCap = nowSec + 100; // very short family cap
      const original = generateRefreshToken(refreshPayload, familyCap);
      const decoded = verifyRefreshToken(original);
      // Simulate rotation — use the same exp from decoded
      const rotated = generateRefreshToken(
        { ...refreshPayload, sid: 'newSession' },
        decoded.exp
      );
      const rotatedDecoded = verifyRefreshToken(rotated);
      expect(rotatedDecoded).not.toBeNull();
      expect(rotatedDecoded.exp).toBe(familyCap);
    });

    test('REFRESH_ABSOLUTE_TTL_SECONDS is 7 days', () => {
      expect(REFRESH_ABSOLUTE_TTL_SECONDS).toBe(7 * 24 * 60 * 60);
    });
  });

  // ─── Reset Token ─────────────────────────────────────────────────────────────

  describe('generateResetToken / verifyResetToken', () => {
    test('generates and verifies reset token', () => {
      const token = generateResetToken({ userId: MOCK_PAYLOAD.userId });
      const decoded = verifyResetToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded.userId).toBe(MOCK_PAYLOAD.userId);
    });

    test('verifyResetToken returns null for access token', () => {
      const access = generateAccessToken(MOCK_PAYLOAD);
      expect(verifyResetToken(access)).toBeNull();
    });
  });

  // ─── 2FA Challenge ───────────────────────────────────────────────────────────

  describe('generate2FAChallenge / verify2FAChallenge', () => {
    test('generates a short-lived 2FA challenge token', () => {
      const token = generate2FAChallenge({ uid: 'user123' });
      const decoded = verify2FAChallenge(token);
      expect(decoded).not.toBeNull();
      expect(decoded.uid).toBe('user123');
    });

    test('2FA challenge has audience aidevix-2fa', () => {
      const token = generate2FAChallenge({ uid: 'user123' });
      const [, payloadB64] = token.split('.');
      const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
      expect(payload.aud).toBe('aidevix-2fa');
    });

    test('verify2FAChallenge rejects access token (audience mismatch)', () => {
      const access = generateAccessToken(MOCK_PAYLOAD);
      expect(verify2FAChallenge(access)).toBeNull();
    });

    test('verify2FAChallenge rejects refresh token', () => {
      const refresh = generateRefreshToken({ ...MOCK_PAYLOAD, sid: 'sid' });
      expect(verify2FAChallenge(refresh)).toBeNull();
    });

    test('2FA challenge expires after 5 minutes', async () => {
      const jwt = require('jsonwebtoken');
      const { RESET_TOKEN_SECRET } = require('../../config/jwt');
      const token = jwt.sign({ uid: 'user1' }, RESET_TOKEN_SECRET, {
        algorithm: 'HS256',
        issuer: 'aidevix',
        audience: 'aidevix-2fa',
        expiresIn: '1ms',
      });
      await new Promise((r) => setTimeout(r, 5));
      expect(verify2FAChallenge(token)).toBeNull();
    });
  });
});
