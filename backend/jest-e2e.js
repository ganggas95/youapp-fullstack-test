module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    '^@/$': '<rootDir>/src',
    '^@/(.+)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
