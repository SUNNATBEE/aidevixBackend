/**
 * Password history — prevents reuse of recent passwords.
 * OWASP ASVS V2.1.10.
 *
 * History stores the last N bcrypt hashes (default 5). New password is checked
 * against each via bcrypt.compare; reuse is rejected before hashing.
 *
 * Pre-save hook in User.js pushes the OLD hash to the front when password changes.
 */
const bcrypt = require('bcryptjs');

const HISTORY_SIZE = 5;

/**
 * @param {string} candidatePlain  new plaintext password
 * @param {string[]} history       array of bcrypt hashes (newest first)
 * @returns {Promise<boolean>} true if reuse detected
 */
const isPasswordReused = async (candidatePlain, history = []) => {
  if (!candidatePlain || !Array.isArray(history) || history.length === 0) {
    return false;
  }
  for (const oldHash of history) {
    if (!oldHash) continue;
    try {
      // eslint-disable-next-line no-await-in-loop
      const match = await bcrypt.compare(candidatePlain, oldHash);
      if (match) return true;
    } catch {
      // ignore malformed hash entries — never block on storage corruption
    }
  }
  return false;
};

const trimHistory = (history) =>
  Array.isArray(history) ? history.slice(0, HISTORY_SIZE) : [];

module.exports = { isPasswordReused, trimHistory, HISTORY_SIZE };
