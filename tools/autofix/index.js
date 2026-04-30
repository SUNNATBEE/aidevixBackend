const path = require('path');
const chokidar = require('chokidar');
const config = require('./config').load();
const logger = require('./logger');
const { runOnce } = require('./once');

let pending = new Set();
let timer = null;
let running = false;

function schedule(file) {
  pending.add(file);
  if (timer) clearTimeout(timer);
  timer = setTimeout(flush, config.watch.debounceMs);
}

async function flush() {
  if (running) {
    logger.debug('Hozir ishlamoqda — keyinroq qayta urinaman');
    timer = setTimeout(flush, config.watch.debounceMs);
    return;
  }
  if (pending.size === 0) return;
  const files = [...pending];
  pending.clear();
  running = true;

  logger.info(`Fayl o'zgardi (${files.length} ta) — autofix ishga tushmoqda`);
  try {
    await runOnce(files);
  } catch (err) {
    logger.error('Watcher run xatolik', { error: err.message });
  } finally {
    running = false;
  }
}

function start() {
  const exts = config.watch.extensions.map((e) => `**/*.${e}`);
  const patterns = [];
  for (const dir of config.watch.paths) {
    for (const ext of exts) {
      patterns.push(path.join(dir, ext).replace(/\\/g, '/'));
    }
  }

  logger.success('AutoFix watcher ishga tushdi');
  logger.info('Kuzatilayotgan papkalar', { paths: config.watch.paths });
  logger.info('Model', { model: config.fixer.model });
  console.log('');
  console.log('  Fayl saqlaganingizda avtomatik tekshirib fix qilinadi');
  console.log('  To\'xtatish: Ctrl+C');
  console.log('');

  const watcher = chokidar.watch(patterns, {
    ignored: config.watch.ignored,
    ignoreInitial: true,
    persistent: true,
    awaitWriteFinish: { stabilityThreshold: 300, pollInterval: 100 },
  });

  watcher.on('change', (file) => {
    const rel = path.relative(process.cwd(), file).replace(/\\/g, '/');
    logger.debug(`Saqlandi: ${rel}`);
    schedule(rel);
  });

  watcher.on('add', (file) => {
    const rel = path.relative(process.cwd(), file).replace(/\\/g, '/');
    logger.debug(`Qo'shildi: ${rel}`);
    schedule(rel);
  });

  watcher.on('error', (err) => {
    logger.error('Watcher error', { error: err.message });
  });

  process.on('SIGINT', () => {
    logger.info('Watcher to\'xtamoqda...');
    watcher.close().then(() => process.exit(0));
  });
}

if (require.main === module) {
  start();
}

module.exports = { start };
