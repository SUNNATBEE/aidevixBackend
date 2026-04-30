const fs = require('fs');
const path = require('path');
const state = require('./state');

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  gray: '\x1b[90m',
};

function readTodayLogs() {
  const date = new Date().toISOString().slice(0, 10);
  const logFile = path.join(process.cwd(), '.autofix', 'logs', `${date}.log`);
  if (!fs.existsSync(logFile)) return [];
  return fs
    .readFileSync(logFile, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      try { return JSON.parse(line); } catch { return null; }
    })
    .filter(Boolean);
}

function summarize() {
  const st = state.rolloverIfNeeded(state.read());
  const logs = readTodayLogs();

  const counts = { info: 0, warn: 0, error: 0, success: 0, debug: 0 };
  for (const e of logs) counts[e.level] = (counts[e.level] || 0) + 1;

  console.log('');
  console.log(`${C.bold}${C.cyan}═══ AutoFix Hisobot — ${st.today} ═══${C.reset}`);
  console.log('');
  console.log(`  ${C.bold}Bugungi statistika${C.reset}`);
  console.log(`  ${C.green}✓ Fix qilindi:${C.reset}      ${st.fixesApplied}`);
  console.log(`  ${C.yellow}⚠ Muvaffaqiyatsiz:${C.reset}  ${st.fixesFailed}`);
  console.log(`  ${C.gray}● Token sarfi:${C.reset}      ${st.tokensUsed.toLocaleString()}`);
  console.log(`  ${C.gray}● Cache hashlar:${C.reset}    ${st.fixedErrorHashes.length}`);
  console.log(`  ${C.gray}● Oxirgi run:${C.reset}       ${st.lastRun || '-'}`);
  console.log('');
  console.log(`  ${C.bold}Log darajalari${C.reset}`);
  console.log(`  ${C.green}success:${C.reset} ${counts.success}    ${C.cyan}info:${C.reset} ${counts.info}    ${C.yellow}warn:${C.reset} ${counts.warn}    ${C.gray}error:${C.reset} ${counts.error}`);
  console.log('');
}

if (require.main === module) {
  summarize();
}

module.exports = { summarize };
