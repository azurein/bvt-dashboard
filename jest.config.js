const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './'
});

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transformIgnorePatterns: [
    '/node_modules/(?!axios)',
    '^.+\\.module\\.(css|sass|scss)$'
  ],

  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/__tests__/**',

    // Generated files (built files)
    '!<rootDir>/.next/**',
    '!<rootDir>/.vercel/**',
    '!<rootDir>/public/**',
    '!<rootDir>/next.config.js',

    // Jest files
    '!<rootDir>/coverage/**',
    '!<rootDir>/jest.config.js',
    '!<rootDir>/jest.setup.js',

    // Config files
    '!<rootDir>/postcss.config.js',
    '!<rootDir>/tailwind.config.js',
    '!<rootDir>/middleware.ts'
  ]
};

module.exports = createJestConfig(customJestConfig);
