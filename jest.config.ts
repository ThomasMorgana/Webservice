export default {
  clearMocks: true,

  collectCoverage: true,
  coverageDirectory: 'coverage',

  coveragePathIgnorePatterns: ['/node_modules/', '/src/prisma/'],

  coverageProvider: 'v8',

  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  preset: 'ts-jest',
  testEnvironment: 'node',
};
