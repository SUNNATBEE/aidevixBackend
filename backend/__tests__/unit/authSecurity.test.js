'use strict';

const {
  hashToken,
  safeEqual,
  parseCookies,
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  CSRF_COOKIE_NAME,
} = require('../../utils/authSecurity');

describe('authSecurity utilities', () => {
  // ─── hashToken ───────────────────────────────────────────────────────────────

  describe('hashToken', () => {
    test('returns a 64-char hex string (SHA-256)', () => {
      const h = hashToken('secret');
      expect(typeof h).toBe('string');
      expect(h).toHaveLength(64);
      expect(/^[0-9a-f]+$/.test(h)).toBe(true);
    });

    test('same input → same hash (deterministic)', () => {
      expect(hashToken('abc')).toBe(hashToken('abc'));
    });

    test('different inputs → different hashes', () => {
      expect(hashToken('abc')).not.toBe(hashToken('abd'));
    });

    test('coerces non-string to string', () => {
      expect(() => hashToken(12345)).not.toThrow();
      expect(hashToken(12345)).toBe(hashToken('12345'));
    });
  });

  // ─── safeEqual ───────────────────────────────────────────────────────────────

  describe('safeEqual', () => {
    test('returns true for identical strings', () => {
      expect(safeEqual('abc', 'abc')).toBe(true);
    });

    test('returns false for different strings of same length', () => {
      expect(safeEqual('abc', 'abd')).toBe(false);
    });

    test('returns false for different length strings', () => {
      expect(safeEqual('abc', 'abcd')).toBe(false);
    });

    test('returns true when both are empty strings (equal)', () => {
      // Node.js crypto.timingSafeEqual handles zero-length buffers correctly
      expect(safeEqual('', '')).toBe(true);
    });

    test('handles undefined/null gracefully (no throw)', () => {
      expect(() => safeEqual(undefined, 'abc')).not.toThrow();
      expect(() => safeEqual(null, 'abc')).not.toThrow();
      expect(() => safeEqual('abc', null)).not.toThrow();
    });
  });

  // ─── parseCookies ─────────────────────────────────────────────────────────────

  describe('parseCookies', () => {
    test('parses a single cookie', () => {
      const result = parseCookies('name=value');
      expect(result).toEqual({ name: 'value' });
    });

    test('parses multiple cookies', () => {
      const result = parseCookies('a=1; b=2; c=3');
      expect(result).toEqual({ a: '1', b: '2', c: '3' });
    });

    test('returns empty object for empty string', () => {
      expect(parseCookies('')).toEqual({});
    });

    test('returns empty object for undefined', () => {
      expect(parseCookies(undefined)).toEqual({});
    });

    test('URL-decodes cookie values', () => {
      const result = parseCookies('token=hello%20world');
      expect(result.token).toBe('hello world');
    });

    test('handles cookie value containing = sign', () => {
      // JWT tokens contain = padding
      const jwtLike = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0In0.abc=';
      const result = parseCookies(`aidevix_access=${jwtLike}`);
      // Should capture everything after the first = as the value
      expect(result['aidevix_access']).toBe(jwtLike);
    });

    test('trims whitespace around cookie names', () => {
      const result = parseCookies('  name  =value');
      expect(result['name']).toBe('value');
    });

    test('ignores malformed entries without =', () => {
      const result = parseCookies('bad; good=ok');
      expect(result['good']).toBe('ok');
      expect(result['bad']).toBeUndefined();
    });
  });

  // ─── Cookie name constants ────────────────────────────────────────────────────

  describe('cookie name constants', () => {
    test('ACCESS_COOKIE_NAME is defined and non-empty', () => {
      expect(typeof ACCESS_COOKIE_NAME).toBe('string');
      expect(ACCESS_COOKIE_NAME.length).toBeGreaterThan(0);
    });

    test('REFRESH_COOKIE_NAME is distinct from ACCESS_COOKIE_NAME', () => {
      expect(REFRESH_COOKIE_NAME).not.toBe(ACCESS_COOKIE_NAME);
    });

    test('CSRF_COOKIE_NAME is distinct from both auth cookies', () => {
      expect(CSRF_COOKIE_NAME).not.toBe(ACCESS_COOKIE_NAME);
      expect(CSRF_COOKIE_NAME).not.toBe(REFRESH_COOKIE_NAME);
    });
  });
});
