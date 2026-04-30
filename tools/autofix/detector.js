const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

function quote(s) {
  if (!/[\s"']/.test(s)) return s;
  return '"' + s.replace(/"/g, '\\"') + '"';
}

function exec(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    const fullCmd = [cmd, ...args.map(quote)].join(' ');
    const child = spawn(fullCmd, {
      cwd: opts.cwd || process.cwd(),
      shell: true,
      windowsHide: true,
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => (stdout += d.toString()));
    child.stderr.on('data', (d) => (stderr += d.toString()));
    child.on('close', (code) => {
      resolve({ code, stdout, stderr, output: (stdout + stderr).trim() });
    });
    child.on('error', (err) => {
      resolve({ code: -1, stdout: '', stderr: err.message, output: err.message });
    });
  });
}

function hashError(text) {
  return crypto.createHash('sha1').update(text).digest('hex').slice(0, 12);
}

async function checkBackendFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const res = await exec('node', ['--check', filePath]);
  if (res.code === 0) return null;
  return {
    type: 'backend-syntax',
    file: filePath,
    output: res.output,
    hash: hashError(`backend:${filePath}:${res.output}`),
  };
}

async function checkFrontendTypes() {
  const res = await exec('npx', ['tsc', '--noEmit'], {
    cwd: path.join(process.cwd(), 'frontend'),
  });
  if (res.code === 0) return [];
  const lines = res.output.split('\n').filter((l) => l.includes('error TS'));
  if (lines.length === 0) return [];
  const fileMap = new Map();
  for (const line of lines) {
    const match = line.match(/^([^(]+)\(/);
    const file = match ? match[1].trim() : 'unknown';
    if (!fileMap.has(file)) fileMap.set(file, []);
    fileMap.get(file).push(line);
  }
  const errors = [];
  for (const [file, errs] of fileMap) {
    const text = errs.join('\n');
    errors.push({
      type: 'frontend-typecheck',
      file: path.join('frontend', file),
      output: text,
      hash: hashError(`tsc:${file}:${text}`),
    });
  }
  return errors;
}

async function detect(config, changedFiles = null) {
  const errors = [];

  if (config.checks.backendSyntax) {
    const targets = changedFiles
      ? changedFiles.filter((f) => f.startsWith('backend') && f.endsWith('.js'))
      : await collectBackendFiles();

    for (const file of targets) {
      const err = await checkBackendFile(file);
      if (err) errors.push(err);
    }
  }

  if (config.checks.frontendTypecheck) {
    const tsErrors = await checkFrontendTypes();
    errors.push(...tsErrors);
  }

  return errors;
}

async function collectBackendFiles() {
  const dirs = ['backend', 'backend/controllers', 'backend/middleware', 'backend/utils', 'backend/models', 'backend/routes', 'backend/config'];
  const files = [];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith('.js')) files.push(path.join(dir, f).replace(/\\/g, '/'));
    }
  }
  return files;
}

module.exports = { detect, checkBackendFile, checkFrontendTypes };
