const { spawn } = require('child_process');
const logger = require('./logger');

function buildPrompt(errors) {
  const sections = errors.map((e, i) => {
    return `### Xato ${i + 1} — ${e.type}\nFayl: \`${e.file}\`\n\n\`\`\`\n${e.output}\n\`\`\``;
  });

  return `Quyidagi xatolarni fix qil. Qoidalar:
- Faqat sanab o'tilgan fayllarni o'zgartir.
- Boshqa fayllarni qo'zg'atma.
- Tushuntirish yozma — to'g'ridan-to'g'ri fix qil.
- Mavjud kod uslubini saqla.
- Xato sababini chuqur tahlil qil, faqat symptom emas.

${sections.join('\n\n')}

Fix tayyor bo'lgach qisqa xulosa: qaysi fayl, qanday o'zgarish.`;
}

function quote(s) {
  return '"' + String(s).replace(/"/g, '\\"') + '"';
}

function runClaude(prompt, model, timeoutMs) {
  return new Promise((resolve) => {
    const fullCmd = `claude -p --model ${model} --permission-mode acceptEdits ${quote(prompt)}`;
    const child = spawn(fullCmd, {
      cwd: process.cwd(),
      shell: true,
      windowsHide: true,
    });

    let stdout = '';
    let stderr = '';
    let killed = false;

    const timer = setTimeout(() => {
      killed = true;
      child.kill();
    }, timeoutMs);

    child.stdout.on('data', (d) => {
      const text = d.toString();
      stdout += text;
      process.stdout.write(text);
    });
    child.stderr.on('data', (d) => {
      stderr += d.toString();
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({
        ok: !killed && code === 0,
        timedOut: killed,
        stdout,
        stderr,
        code,
      });
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({ ok: false, error: err.message, stdout, stderr, code: -1 });
    });
  });
}

async function fix(errors, config) {
  if (errors.length === 0) return { ok: true, skipped: true };

  const prompt = buildPrompt(errors);
  logger.info(`Claude CLI chaqirilmoqda — ${errors.length} ta xato`, {
    model: config.fixer.model,
    files: errors.map((e) => e.file),
  });

  const start = Date.now();
  const result = await runClaude(prompt, config.fixer.model, config.fixer.timeoutMs);
  const elapsedMs = Date.now() - start;

  if (result.timedOut) {
    logger.error('Claude CLI timeout', { elapsedMs });
    return { ok: false, reason: 'timeout', elapsedMs };
  }

  if (!result.ok) {
    logger.error('Claude CLI xatolik', {
      code: result.code,
      stderr: result.stderr.slice(0, 500),
    });
    return { ok: false, reason: 'cli-error', stderr: result.stderr };
  }

  logger.success(`Claude CLI tugadi (${(elapsedMs / 1000).toFixed(1)}s)`);
  return { ok: true, elapsedMs, output: result.stdout };
}

module.exports = { fix, buildPrompt };
