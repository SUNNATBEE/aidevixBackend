const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(process.cwd(), '.autofix', 'logs');

function ensureDir() {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function logFile() {
  const date = new Date().toISOString().slice(0, 10);
  return path.join(LOG_DIR, `${date}.log`);
}

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

const LEVEL_COLORS = {
  debug: COLORS.gray,
  info: COLORS.cyan,
  warn: COLORS.yellow,
  error: COLORS.red,
  success: COLORS.green,
};

function write(level, message, meta = {}) {
  ensureDir();
  const ts = new Date().toISOString();
  const entry = { ts, level, message, ...meta };

  fs.appendFileSync(logFile(), JSON.stringify(entry) + '\n');

  const color = LEVEL_COLORS[level] || COLORS.reset;
  const tag = `[${level.toUpperCase()}]`.padEnd(9);
  const time = ts.slice(11, 19);
  console.log(`${COLORS.gray}${time}${COLORS.reset} ${color}${tag}${COLORS.reset} ${message}`);
}

module.exports = {
  debug: (m, x) => write('debug', m, x),
  info: (m, x) => write('info', m, x),
  warn: (m, x) => write('warn', m, x),
  error: (m, x) => write('error', m, x),
  success: (m, x) => write('success', m, x),
  raw: (text) => {
    ensureDir();
    fs.appendFileSync(logFile(), text + '\n');
    console.log(text);
  },
};
