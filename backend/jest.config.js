module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  setupFiles: ['<rootDir>/__tests__/setup.js'],
  testTimeout: 15000,
  verbose: true,
  // setInterval in subscriptionCache.js keeps the process alive — force exit cleanly
  forceExit: true,
  collectCoverageFrom: [
    'controllers/authController.js',
    'middleware/auth.js',
    'utils/jwt.js',
    'utils/authSecurity.js',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
};
