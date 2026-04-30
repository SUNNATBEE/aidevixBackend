const { execSync } = require('child_process');
const logger = require('./logger');

function git(cmd) {
  try {
    return execSync(`git ${cmd}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (err) {
    return null;
  }
}

function isClean() {
  const status = git('status --porcelain');
  return status === '';
}

function hasChanges() {
  const status = git('status --porcelain');
  return status && status.length > 0;
}

function snapshotBeforeFix() {
  if (isClean()) return { snapshotted: false, reason: 'no-changes' };
  const stashName = `autofix-snapshot-${Date.now()}`;
  const result = git(`stash push -u -m "${stashName}"`);
  if (result === null) return { snapshotted: false, reason: 'stash-failed' };
  logger.info('Git snapshot olindi (stash)', { stashName });
  return { snapshotted: true, stashName };
}

function commitFix(message) {
  if (!hasChanges()) return { committed: false, reason: 'no-changes' };
  git('add -A');
  const result = git(`commit -m "${message.replace(/"/g, '\\"')}"`);
  if (result === null) return { committed: false, reason: 'commit-failed' };
  logger.success('Auto-commit yaratildi', { message });
  return { committed: true };
}

function getChangedFiles() {
  const output = git('status --porcelain');
  if (!output) return [];
  return output
    .split('\n')
    .map((line) => line.slice(3).trim().replace(/\\/g, '/'))
    .filter(Boolean);
}

module.exports = { isClean, hasChanges, snapshotBeforeFix, commitFix, getChangedFiles };
