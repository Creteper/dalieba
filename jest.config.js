module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/app/test/**/*.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
}; 