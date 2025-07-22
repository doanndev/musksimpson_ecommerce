module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/__tests__/**/*.(spec|test).ts'],
  moduleNameMapper: {
    '^~/libs/(.*)$': '<rootDir>/src/libs/$1',
  },
};
