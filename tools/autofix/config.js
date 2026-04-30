const fs = require('fs');
const path = require('path');

const DEFAULT_CONFIG = {
  watch: {
    paths: ['backend', 'frontend/src'],
    ignored: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/.autofix/**'],
    extensions: ['js', 'ts', 'tsx', 'jsx'],
    debounceMs: 1500,
  },
  checks: {
    backendSyntax: true,
    frontendTypecheck: true,
    frontendLint: false,
  },
  fixer: {
    model: 'claude-sonnet-4-6',
    maxIterations: 3,
    timeoutMs: 180000,
  },
  budget: {
    dailyTokenLimit: 500000,
    abortOnLimit: true,
  },
  git: {
    autoStashBeforeFix: true,
    autoCommitOnFix: false,
    commitPrefix: 'autofix:',
  },
  notify: {
    telegram: false,
    onErrorOnly: true,
  },
  concurrency: {
    lockTimeoutMs: 600000,
  },
};

function deepMerge(target, source) {
  const out = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      out[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      out[key] = source[key];
    }
  }
  return out;
}

function load() {
  const configPath = path.join(process.cwd(), 'autofix.config.json');
  if (!fs.existsSync(configPath)) return DEFAULT_CONFIG;
  try {
    const user = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return deepMerge(DEFAULT_CONFIG, user);
  } catch (err) {
    console.error('autofix.config.json parse error:', err.message);
    return DEFAULT_CONFIG;
  }
}

module.exports = { load, DEFAULT_CONFIG };
