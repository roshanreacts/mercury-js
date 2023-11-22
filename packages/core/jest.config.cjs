// This file is used by Jest to configure the test environment.
module.exports = {
  preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
  testMatch: ['**/__test__/**/*.spec.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/__test__/'],
  coverageReporters: ['text', 'lcov'],
  coverageDirectory: 'coverage',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  watchPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    '/.git/',
    'globalConfig.json',
  ],
};
