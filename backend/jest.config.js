module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  rootDir: '.',
  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    '^@/$': '<rootDir>/src',
    '^@/(.+)$': '<rootDir>/src/$1',
  },
  modulePathIgnorePatterns: ['src/typings'],
  testPathIgnorePatterns: [
    '/node_modules./',
    '<rootDir>/(coverage|dist|lib|tmp)./',
    '/dist/'
  ],
};
