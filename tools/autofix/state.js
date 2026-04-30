const fs = require('fs');
const path = require('path');

const STATE_DIR = path.join(process.cwd(), '.autofix');
const STATE_FILE = path.join(STATE_DIR, 'state.json');
const LOCK_FILE = path.join(STATE_DIR, 'lock');

function ensure() {
  fs.mkdirSync(STATE_DIR, { recursive: true });
}

function read() {
  ensure();
  if (!fs.existsSync(STATE_FILE)) return defaultState();
  try {
    const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    return { ...defaultState(), ...data };
  } catch {
    return defaultState();
  }
}

function write(state) {
  ensure();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function defaultState() {
  return {
    today: today(),
    tokensUsed: 0,
    fixesApplied: 0,
    fixesFailed: 0,
    lastRun: null,
    fixedErrorHashes: [],
  };
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function rolloverIfNeeded(state) {
  if (state.today !== today()) {
    return defaultState();
  }
  return state;
}

function acquireLock(timeoutMs) {
  ensure();
  if (fs.existsSync(LOCK_FILE)) {
    const stat = fs.statSync(LOCK_FILE);
    const age = Date.now() - stat.mtimeMs;
    if (age < timeoutMs) return false;
    fs.unlinkSync(LOCK_FILE);
  }
  fs.writeFileSync(LOCK_FILE, String(process.pid));
  return true;
}

function releaseLock() {
  try {
    if (fs.existsSync(LOCK_FILE)) fs.unlinkSync(LOCK_FILE);
  } catch {}
}

module.exports = {
  read,
  write,
  rolloverIfNeeded,
  acquireLock,
  releaseLock,
};
