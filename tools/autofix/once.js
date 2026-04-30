const config = require('./config').load();
const logger = require('./logger');
const detector = require('./detector');
const fixer = require('./fixer');
const gitSafe = require('./git-safe');
const state = require('./state');
const notifier = require('./notifier');

async function runOnce(changedFiles = null) {
  const lockOk = state.acquireLock(config.concurrency.lockTimeoutMs);
  if (!lockOk) {
    logger.warn('Boshqa autofix ishlamoqda — chiqyapman');
    return { ok: false, reason: 'locked' };
  }

  try {
    let st = state.rolloverIfNeeded(state.read());

    logger.info('AutoFix sikli boshlandi', { changedFiles: changedFiles?.length || 'all' });

    const errors = await detector.detect(config, changedFiles);

    if (errors.length === 0) {
      logger.success('Hech qanday xato yo\'q');
      st.lastRun = new Date().toISOString();
      state.write(st);
      return { ok: true, errors: 0 };
    }

    const newErrors = errors.filter((e) => !st.fixedErrorHashes.includes(e.hash));
    if (newErrors.length === 0) {
      logger.warn(`${errors.length} ta xato bor lekin barchasi avval fix qilingan — qayta urinish o'tkazib yuborildi`);
      return { ok: false, reason: 'all-cached' };
    }

    logger.warn(`${newErrors.length} ta yangi xato topildi`, {
      files: newErrors.map((e) => e.file),
      types: [...new Set(newErrors.map((e) => e.type))],
    });

    if (config.git.autoStashBeforeFix) {
      gitSafe.snapshotBeforeFix();
    }

    let iteration = 0;
    let remaining = newErrors;
    let totalFixed = 0;

    while (iteration < config.fixer.maxIterations && remaining.length > 0) {
      iteration++;
      logger.info(`Iteratsiya ${iteration}/${config.fixer.maxIterations}`);

      const fixResult = await fixer.fix(remaining, config);
      if (!fixResult.ok) {
        st.fixesFailed++;
        state.write(st);
        if (config.notify.telegram) {
          await notifier.send(`Fix muvaffaqiyatsiz: ${fixResult.reason || 'noma\'lum'}`);
        }
        return { ok: false, reason: fixResult.reason };
      }

      const recheck = await detector.detect(config, changedFiles);
      const stillBroken = recheck.filter((e) => remaining.some((r) => r.file === e.file));
      const fixed = remaining.filter((r) => !stillBroken.some((s) => s.hash === r.hash));

      totalFixed += fixed.length;
      for (const f of fixed) {
        if (!st.fixedErrorHashes.includes(f.hash)) {
          st.fixedErrorHashes.push(f.hash);
        }
      }

      if (stillBroken.length === 0) {
        logger.success(`Barcha xatolar fix qilindi (${totalFixed} ta)`);
        break;
      }

      logger.warn(`${stillBroken.length} ta xato qoldi — qayta urinish`);
      remaining = stillBroken;
    }

    st.fixesApplied += totalFixed;
    st.lastRun = new Date().toISOString();
    if (st.fixedErrorHashes.length > 200) {
      st.fixedErrorHashes = st.fixedErrorHashes.slice(-200);
    }
    state.write(st);

    if (config.git.autoCommitOnFix && totalFixed > 0) {
      gitSafe.commitFix(`${config.git.commitPrefix} ${totalFixed} ta xato fix qilindi`);
    }

    if (config.notify.telegram && (!config.notify.onErrorOnly || remaining.length > 0)) {
      await notifier.send(
        `Sikl tugadi\nFix: ${totalFixed} ta\nQolgan: ${remaining.length} ta`
      );
    }

    return { ok: remaining.length === 0, fixed: totalFixed, remaining: remaining.length };
  } catch (err) {
    logger.error('AutoFix tushib qoldi', { error: err.message, stack: err.stack });
    return { ok: false, error: err.message };
  } finally {
    state.releaseLock();
  }
}

if (require.main === module) {
  runOnce().then((res) => {
    process.exit(res.ok ? 0 : 1);
  });
}

module.exports = { runOnce };
