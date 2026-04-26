/**
 * Device fingerprint — coarse, privacy-respecting identifier for "is this a known device?".
 *
 * SHA-256 of (UA + IP-prefix). IP truncated to /24 (IPv4) or /48 (IPv6) so the user roaming
 * on the same WiFi/carrier doesn't repeatedly trigger "new device" alerts, while still being
 * coarse enough that a clean attacker IP triggers an alert.
 */
const crypto = require('crypto');

const truncateIp = (ip) => {
  if (!ip) return '0.0.0.0';
  // IPv6 (contains :)
  if (ip.includes(':')) {
    const parts = ip.split(':').filter(Boolean);
    return parts.slice(0, 3).join(':'); // /48
  }
  // IPv4
  const parts = ip.split('.');
  if (parts.length !== 4) return ip;
  return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
};

const buildDeviceHash = (ua = '', ip = '') => {
  const canonicalUa = String(ua).slice(0, 200).toLowerCase().trim();
  const canonicalIp = truncateIp(String(ip).trim());
  return crypto
    .createHash('sha256')
    .update(`${canonicalUa}|${canonicalIp}`)
    .digest('hex');
};

const extractIp = (req) =>
  req?.ip ||
  req?.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
  req?.connection?.remoteAddress ||
  null;

const extractUa = (req) => req?.headers?.['user-agent'] || '';

const buildFromReq = (req) => buildDeviceHash(extractUa(req), extractIp(req));

module.exports = { buildDeviceHash, buildFromReq, truncateIp, extractIp, extractUa };
